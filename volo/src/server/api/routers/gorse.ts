import { TagType } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  deleteFeedback,
  deleteUser,
  deleteVideo,
  insertFeedback,
  insertUser,
  insertVideo,
  updateUser,
  updateVideo,
} from "~/server/lib/gorse/base";
import {
  getLatest,
  getPopular,
  getRecommend,
} from "~/server/lib/gorse/recommend";
import { GorseFeedback, type VideoDetailedPublic } from "~/types";

const FeedbackTypeZ = z.nativeEnum(GorseFeedback);
const TagTypeZ = z.nativeEnum(TagType);
const RecommendationZ = z.enum(["recommendation", "popular", "latest"]);

export type Recommendation = z.infer<typeof RecommendationZ>;

const TagRef = z.object({
  id: z.string(),
  type: TagTypeZ,
});

export const gorseRouter = createTRPCRouter({
  recommendation: publicProcedure
    .input(
      z.object({
        limit: z.number().min(5).max(20),
        cursor: z.number().optional(),
        category: z.string().optional(),
        recommendationType: RecommendationZ,
      }),
    )
    .query(
      async ({
        ctx,
        input: { limit, cursor = 0, category, recommendationType },
      }): Promise<{
        nextCursor?: number;
        videos: VideoDetailedPublic[];
      }> => {
        const fn = (() => {
          if (recommendationType === "recommendation") {
            if (ctx.session) {
              return getRecommend;
            } else {
              throw new Error("Invalid recommendation type");
            }
          } else if (recommendationType === "popular") {
            return getPopular;
          } else {
            return getLatest;
          }
        })();

        let categoryId: string | undefined;
        if (category) {
          const categoryDb = await ctx.db.tag.findUnique({
            where: { name: category },
          });
          if (!categoryDb) {
            throw new Error("Invalid category");
          }
          categoryId = categoryDb.id;
        }

        const videos = await fn(
          ctx.db,
          {
            limit,
            cursor,
          },
          // Typescript is not smart enough to infer that when
          // recommendationType === "recommendation", ctx.session is not null
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          ctx.session?.userId!,
          categoryId,
        );
        return {
          nextCursor: videos.length < limit ? undefined : cursor + limit,
          videos,
        };
      },
    ),

  insertFeedback: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        feedback: FeedbackTypeZ,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await insertFeedback(ctx.session.userId, input.itemId, input.feedback);
    }),

  deleteFeedback: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        feedback: FeedbackTypeZ,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await deleteFeedback(ctx.session.userId, input.itemId, input.feedback);
    }),

  insertVideo: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        tags: z.array(TagRef),
      }),
    )
    .mutation(async ({ input }) => {
      await insertVideo(input.itemId, input.tags);
    }),

  deleteVideo: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ input }) => {
      await deleteVideo(input.itemId);
    }),

  // updateVideo: the new TagReferences will cover the old ones
  updateVideo: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        tags: z.array(TagRef),
      }),
    )
    .mutation(async ({ input }) => {
      await updateVideo(input.itemId, input.tags);
    }),

  insertUser: protectedProcedure
    .input(
      z.object({
        tags: z.array(TagRef),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await insertUser(ctx.session.userId, input.tags);
    }),

  // deleteUser: 只有在注销账号的时候才能调用
  deleteUser: protectedProcedure.mutation(async ({ ctx }) => {
    await deleteUser(ctx.session.userId);
  }),

  // updateUser: the new TagReferences will cover the old ones
  updateUser: protectedProcedure
    .input(
      z.object({
        tags: z.array(TagRef),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await updateUser(ctx.session.userId, input.tags);
    }),
});
