import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import {
  FirstOrCreate,
  GetFollowerList,
  GetFollowingList,
} from "~/server/lib/db/user";

const login = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      name: z.string().min(4).nullable(),
    }),
  )
  .query(({ ctx, input }) => {
    return FirstOrCreate(ctx.db, { email: input.email, name: input.name });
  });

const followerList = protectedProcedure.query(({ ctx }) => {
  return GetFollowerList(ctx.db, ctx.session.user.id);
});

const followingList = protectedProcedure.query(({ ctx }) => {
  return GetFollowingList(ctx.db, ctx.session.user.id);
});

export const userInfoRouter = createTRPCRouter({
  // only for credential login, email not exists will create a new user
  login: login,

  // get follower/following list
  followerList: followerList,
  followingList: followingList,
});
