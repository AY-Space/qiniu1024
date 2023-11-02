import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { createUploadParameters } from "~/server/lib/util/kodo";
import { db } from "~/server/db";
import { type CommentPublic } from "~/types";

export const videoRouter = createTRPCRouter({
  createVideoUploadParameters: publicProcedure.mutation(({ ctx }) => {
    return createUploadParameters();
  }),

  comments: publicProcedure
    .input(
      z.object({
        videoId: z.string(),
      }),
    )
    .query(async ({ input: { videoId }, ctx }): Promise<CommentPublic[]> => {
      const currentUserId = ctx.session?.user.id;
      const comments = await db.comment.findMany({
        select: {
          id: true,
          text: true,
          createdAt: true,
          imgUrl: true,
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              likedUsers: {
                where: {
                  id: currentUserId,
                },
              },
              dislikedUsers: {
                where: {
                  id: currentUserId,
                },
              },
            },
          },
        },
        where: {
          videoId,
        },
      });
      return comments.map(
        ({ _count: { likedUsers, dislikedUsers }, ...comment }) => ({
          ...comment,
          currentUser: {
            liked: likedUsers > 0,
            disliked: dislikedUsers > 0,
          },
        }),
      );
    }),

  like: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
        like: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input: { videoId, like } }) => {
      await ctx.db.video.update({
        where: {
          id: videoId,
        },
        data: {
          likes: {
            [like ? "connect" : "disconnect"]: {
              userId_videoId: {
                userId: ctx.session.user.id,
                videoId,
              },
            },
          },
        },
      });
    }),
});
