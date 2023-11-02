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
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(4),
        description: z.string().max(400),
        videoUrl: z.string().url(),
        coverUrl: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.video.create({
        data: {
          title: input.title,
          description: input.description,
          url: input.videoUrl,
          coverUrl: input.coverUrl,
          authorId: "111",
        },
      });
    }),

  getVideoUploadParameters: publicProcedure.mutation(({ ctx }) => {
    console.log("UploadToken");
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
});
