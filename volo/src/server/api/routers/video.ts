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
    .query(async ({ input: { videoId } }): Promise<CommentPublic[]> => {
      return await db.comment.findMany({
        where: {
          videoId,
        },
        select: {
          id: true,
          text: true,
          createdAt: true,
          likes: true,
          dislikes: true,
          imgUrl: true,
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });
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
