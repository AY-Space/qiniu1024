import { type Video } from "@prisma/client";
import { db } from "~/server/db";

export const getVideos = async (
  ids: string[],
  userId: string,
): Promise<Video[]> => {
  return await db.video.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      tags: true,
      author: true,
      likes: {
        where: {
          userId: userId,
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
          collections: true,
        },
      },
    },
  });
};
