import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const commentRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
        operation: z.enum(["connect", "disconnect"]),
      }),
    )
    .mutation(
      async ({ input: { commentId, operation }, ctx: { db, session } }) => {
        await db.comment.update({
          where: {
            id: commentId,
          },
          data: {
            likedUsers: {
              [operation]: {
                id: session.userId,
              },
            },

            ...(operation === "connect" && {
              dislikedUsers: {
                disconnect: {
                  id: session.userId,
                },
              },
            }),
          },
        });
      },
    ),

  dislike: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
        operation: z.enum(["connect", "disconnect"]),
      }),
    )
    .mutation(
      async ({ input: { commentId, operation }, ctx: { db, session } }) => {
        await db.comment.update({
          where: {
            id: commentId,
          },
          data: {
            dislikedUsers: {
              [operation]: {
                id: session.userId,
              },
            },
            ...(operation === "connect" && {
              likedUsers: {
                disconnect: {
                  id: session.userId,
                },
              },
            }),
          },
        });
      },
    ),
});
