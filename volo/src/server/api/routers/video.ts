import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { createUploadParameters } from "~/server/lib/util/kodo";
import { type CommentPublic } from "~/types";

export const videoRouter = createTRPCRouter({
  createVideoUploadParameters: publicProcedure.mutation(() => {
    return createUploadParameters();
  }),

  comments: publicProcedure
    .input(
      z.object({
        videoId: z.string(),
      }),
    )
    .query(async ({ input: { videoId }, ctx }): Promise<CommentPublic[]> => {
      const currentUserId = ctx.session?.userId;
      const comments = await ctx.db.comment.findMany({
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
              likedUsers: true, // Count of all likes
              dislikedUsers: true, // Count of all dislikes
            },
          },
          likedUsers: {
            where: {
              id: currentUserId,
            },
            select: {
              id: true,
            },
          },
          dislikedUsers: {
            where: {
              id: currentUserId,
            },
            select: {
              id: true,
            },
          },
        },
        where: {
          videoId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return comments.map(
        ({ likedUsers, dislikedUsers, _count, ...comment }) => {
          const currentUser =
            currentUserId !== undefined
              ? {
                  liked: likedUsers.length > 0,
                  disliked: dislikedUsers.length > 0,
                }
              : null;
          return {
            ...comment,
            currentUser,
            likes: _count.likedUsers,
            dislikes: _count.dislikedUsers,
          };
        },
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
                userId: ctx.session.userId,
                videoId,
              },
            },
          },
        },
      });
    }),

  postComment: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
        text: z.string().min(1).max(1000),
        imgUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input: { videoId, text, imgUrl } }) => {
      await ctx.db.comment.create({
        data: {
          text,
          imgUrl,
          videoId,
          authorId: ctx.session.userId,
        },
      });
    }),

  deleteComment: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { commentId } }) => {
      await ctx.db.comment.delete({
        where: {
          id: commentId,
          authorId: ctx.session.userId,
        },
      });
    }),
});
