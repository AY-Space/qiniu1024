import { hash } from "bcrypt";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { searchUser } from "~/server/lib/search/elasticsearch";
import { createUploadParameters } from "~/server/lib/util/kodo";
import { type UserPublic } from "~/types";
import * as es from "~/server/lib/search/elasticsearch";
import * as gorse from "~/server/lib/gorse/base";

export const userRouter = createTRPCRouter({
  currentUser: protectedProcedure.query(
    async ({
      ctx,
    }): Promise<
      UserPublic & {
        email: string;
      }
    > => {
      const { userId } = ctx.session;
      const user = await ctx.db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
  ),

  uploadAvatar: protectedProcedure.mutation(() => {
    return createUploadParameters("avatar");
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        bio: z.string(),
        avatarFileKey: z.string().min(1).nullish(),
      }),
    )
    .mutation(async ({ input: { name, bio, avatarFileKey }, ctx }) => {
      const { userId } = ctx.session;
      const avatarUrl =
        avatarFileKey && `${env.QINIU_BASE_URL}/${avatarFileKey}`;
      await ctx.db.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
          bio,
          avatarUrl,
        },
      });
    }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(100),
      }),
    )
    .query(async ({ input: { query }, ctx }): Promise<UserPublic[]> => {
      const userIds = await searchUser(query, {
        limit: 10,
      });
      const users = await ctx.db.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      });
      return users;
    }),

  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(32),
        email: z.string().email().min(1).max(64),
        password: z.string().min(1).max(32),
        bio: z.string(),
        avatarFileKey: z.string().min(1).optional(),
      }),
    )
    .mutation(
      async ({ input: { name, email, password, bio, avatarFileKey }, ctx }) => {
        const avatarUrl =
          avatarFileKey && `${env.QINIU_BASE_URL}/${avatarFileKey}`;
        const user = await ctx.db.user.create({
          data: {
            name,
            email,
            password: await hash(password, 10),
            bio,
            avatarUrl,
          },
          select: {
            id: true,
          },
        });
        await es.insertUser({
          id: user.id,
          name,
        });
        await gorse.insertUser(user.id, []);
      },
    ),

  follow: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        follow: z.boolean(),
      }),
    )
    .mutation(async ({ input: { userId, follow }, ctx }) => {
      if (follow) {
        await ctx.db.follow.create({
          data: {
            followerId: ctx.session.userId,
            followingId: userId,
          },
        });
      } else {
        await ctx.db.follow.delete({
          where: {
            followingId_followerId: {
              followerId: ctx.session.userId,
              followingId: userId,
            },
          },
        });
      }
    }),

  hasFollowed: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input: { userId }, ctx }) => {
      const relation = await ctx.db.follow.findUnique({
        where: {
          followingId_followerId: {
            followerId: ctx.session.userId,
            followingId: userId,
          },
        },
      });
      return !!relation;
    }),
});
