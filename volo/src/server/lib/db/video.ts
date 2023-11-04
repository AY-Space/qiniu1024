import { type PrismaClient } from "@prisma/client";
import { type VideoDetailedPublic } from "~/types";

export const getVideos = async (
  prisma: PrismaClient,
  ids: string[],
  userId?: string,
): Promise<VideoDetailedPublic[]> => {
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
        tags: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    })
  ).map(({ _count, likes, ...rest }) => {
    const currentUser =
      userId !== undefined ? { liked: likes.length > 0 } : null;
    return {
      ..._count,
      ...rest,
      currentUser,
    };
  });
};
