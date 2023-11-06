import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { createUploadParameters } from "~/server/lib/util/kodo";
import { type VideoPublic, type CommentPublic } from "~/types";

export const videoRouter = createTRPCRouter({
  createVideoUploadParameters: publicProcedure.mutation(() => {
    return createUploadParameters("video");
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
      if (like) {
        await ctx.db.like.create({
          data: {
            userId: ctx.session.userId,
            videoId,
          },
        });
      } else {
        await ctx.db.like.delete({
          where: {
            userId_videoId: {
              userId: ctx.session.userId,
              videoId,
            },
          },
        });
      }
    }),

  likedAndCollected: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { videoId } }) => {
      const liked = await ctx.db.like.findUnique({
        where: {
          userId_videoId: {
            userId: ctx.session.userId,
            videoId,
          },
        },
      });
      const collected = await ctx.db.collection.findMany({
        where: {
          videos: {
            some: {
              id: videoId,
            },
          },
        },
        select: {
          id: true,
        },
      });
      return {
        liked: !!liked,
        collected: collected.length > 0,
      };
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

  userId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input: { userId } }): Promise<VideoPublic[]> => {
      return await ctx.db.video.findMany({
        where: {
          likes: {
            some: {
              userId: { equals: userId },
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
        description: z.string().max(1000),
        coverFileKey: z.string(),
        videoFileKey: z.string(),
        tags: z.array(z.string().min(1)),
        category: z.string().min(1),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          title,
          description,
          coverFileKey,
          videoFileKey,
          category,
          tags,
        },
      }) => {
        const coverUrl = `${env.STATIC_FILES_BASE_URL}/${coverFileKey}`;
        const videoUrl = `${env.STATIC_FILES_BASE_URL}/${videoFileKey}`;
        const video = await ctx.db.video.create({
          data: {
            title,
            description,
            coverUrl,
            url: videoUrl,
            authorId: ctx.session.userId,
            tags: {
              connectOrCreate: tags.map((tag) => ({
                where: {
                  name: tag,
                },
                create: {
                  name: tag,
                  type: "Tag",
                },
              })),
              connect: {
                name: category,
              },
            },
          },
          select: {
            id: true,
          },
        });
        return video.id;
      },
    ),
});
