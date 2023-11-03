import { type PrismaClient } from "@prisma/client";
import { type VideoPublic } from "~/types";

export const getVideos = async (
  prisma: PrismaClient,
  ids: string[],
  userId?: string,
): Promise<VideoPublic[]> => {
  return (
    await prisma.video.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        id: true,
        title: true,
        coverUrl: true,
        views: true,
        createdAt: true,
        description: true,
        url: true,
        likes: {
          where: {
            userId: userId,
          },
          select: {
            userId: true,
          },
        },
      },
    })
  ).map(({ _count, likes, ...rest }) => ({
    ..._count,
    ...rest,
    isLiked: likes.length > 0,
    dislikes: 0,
  }));
};
