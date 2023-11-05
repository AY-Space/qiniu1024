import { type PrismaClient } from "@prisma/client";
import { type VideoDetailedPublic } from "~/types";

export const getVideos = async (
  prisma: PrismaClient,
  ids: string[],
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
        tags: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    })
  ).map(({ _count, ...rest }) => {
    return {
      ..._count,
      ...rest,
    };
  });
};
