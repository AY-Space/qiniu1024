import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { findUserPublic } from "~/server/lib/db/user";
import { type UserPublic } from "~/types";

export const userRouter = createTRPCRouter({
  info: protectedProcedure.query(async ({ ctx }): Promise<UserPublic> => {
    const user = await findUserPublic(ctx.db, ctx.session.userId);
    return user!; // session exists, the user exists!
  }),
});
