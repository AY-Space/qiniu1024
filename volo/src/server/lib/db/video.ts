import { type PrismaClient } from "@prisma/client";

export const getVideoRecommendation = async (
  prisma: PrismaClient,
  userId: string,
  filters: {
    initalVideoId?: string;
    tags?: string[];
  } = {},
) => {
  const data = await prisma.video.findMany({});
  return data;
};
