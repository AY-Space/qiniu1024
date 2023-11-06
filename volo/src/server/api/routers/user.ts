import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createUploadParameters } from "~/server/lib/util/kodo";
import { type UserPublic } from "~/types";

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
        avatarFileKey && `${env.STATIC_FILES_BASE_URL}/${avatarFileKey}`;
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
});
