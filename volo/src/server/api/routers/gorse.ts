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

const Cursor = z.object({
  limit: z.number(),
  offset: z.number(),
});

const Query = z.object({
  cursor: Cursor,
  categoryId: z.string().nullable(),
});

const FeedbackTypeZ = z.nativeEnum(GorseFeedback);
const TagTypeZ = z.nativeEnum(TagType);

const TagRef = z.object({
  id: z.string(),
  type: TagTypeZ,
});

export const gorseRouter = createTRPCRouter({
  recommend: protectedProcedure
    .input(Query)
    .query(async ({ ctx, input }): Promise<VideoDetailedPublic[]> => {
      return await getRecommend(
        ctx.db,
        input.cursor,
        ctx.session.user.id,
        input.categoryId ?? undefined,
      );
    }),

  popular: publicProcedure
    .input(Query)
    .query(async ({ ctx, input }): Promise<VideoDetailedPublic[]> => {
      return await getPopular(
        ctx.db,
        input.cursor,
        ctx.session?.user.id,
        input.categoryId ?? undefined,
      );
    }),
  latest: publicProcedure
    .input(Query)
    .query(async ({ ctx, input }): Promise<VideoDetailedPublic[]> => {
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

  deleteFeedback: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        feedback: FeedbackTypeZ,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await deleteFeedback(ctx.session.user.id, input.itemId, input.feedback);
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
      await insertUser(ctx.session.user.id, input.tags);
    }),

  // deleteUser: 只有在注销账号的时候才能调用
  deleteUser: protectedProcedure.mutation(async ({ ctx }) => {
    await deleteUser(ctx.session.user.id);
  }),

  // updateUser: the new TagReferences will cover the old ones
  updateUser: protectedProcedure
    .input(
      z.object({
        tags: z.array(TagRef),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await updateUser(ctx.session.user.id, input.tags);
    }),
});
