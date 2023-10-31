import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { getFollowerList, getFollowingList } from "~/server/lib/db/user";

const followerList = protectedProcedure.query(({ ctx }) => {
  return getFollowerList(ctx.db, ctx.session.user.id);
});

const followingList = protectedProcedure.query(({ ctx }) => {
  return getFollowingList(ctx.db, ctx.session.user.id);
});

export const userInfoRouter = createTRPCRouter({
  // get follower/following list
  followerList: followerList,
  followingList: followingList,
});
