import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { createUploadParameters } from "~/server/lib/util/kodo";

export const videoRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return [];
  }),
  recommend: publicProcedure
    .input(
      z.object({
        tag: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ ctx, input: { tag } }) => {
      await ctx.db.video.findMany(
        tag
          ? {
              where: {
                tags: {
                  some: {
                    id: {
                      in: tag,
                    },
                  },
                },
              },
            }
          : undefined,
      );
      return [];
    }),

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
          score: 0,
        },
      });
    }),

  getVideoUploadParameters: publicProcedure.mutation(({ ctx }) => {
    console.log("UploadToken");
    return createUploadParameters();
  }),
});
