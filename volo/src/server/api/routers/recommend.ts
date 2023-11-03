import { TagType } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  FeedbackType,
  insertFeedback,
  insertUser,
  insertVideo,
} from "~/server/lib/gorse/base";
import {
  getLatest,
  getPopular,
  getRecommend,
} from "~/server/lib/gorse/recommend";
import { type VideoPublic } from "~/types";

const Cursor = z.object({
  limit: z.number(),
  offset: z.number(),
});

const Query = z.object({
  cursor: Cursor,
  categoryId: z.string().nullable(),
});

const FeedbackTypeZ = z.nativeEnum(FeedbackType);
const TagTypeZ = z.nativeEnum(TagType);

const TagRef = z.object({
  id: z.string(),
  type: TagTypeZ,
});

export const gorseRouter = createTRPCRouter({
  recommend: protectedProcedure
    .input(Query)
    .query(async ({ ctx, input }): Promise<VideoPublic[]> => {
      return await getRecommend(
        ctx.db,
        input.cursor,
        ctx.session.user.id,
        input.categoryId ?? undefined,
      );
    }),

  popular: publicProcedure
    .input(Query)
    .query(async ({ ctx, input }): Promise<VideoPublic[]> => {
      return await getPopular(
        ctx.db,
        input.cursor,
        ctx.session?.user.id,
        input.categoryId ?? undefined,
      );
    }),
  latest: publicProcedure
    .input(Query)
    .query(async ({ ctx, input }): Promise<VideoPublic[]> => {
      return await getLatest(
        ctx.db,
        input.cursor,
        ctx.session?.user.id,
        input.categoryId ?? undefined,
      );
    }),
  insertFeedback: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        feedback: FeedbackTypeZ,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await insertFeedback(ctx.session.user.id, input.itemId, input.feedback);
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

  insertUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        tags: z.array(TagRef),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await insertUser(ctx.session.user.id, input.tags);
    }),
});
