import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
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
});
