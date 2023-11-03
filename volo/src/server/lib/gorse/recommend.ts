import { type PrismaClient } from "@prisma/client";
import { type VideoDetailedPublic } from "~/types";
import { getVideos } from "../db/video";
import { getLatests, getPopulars, getRecommends, type Cursor } from "./base";

// categoryId: null -> all catgories
export const getLatest = async (
  prisma: PrismaClient,
  cursor: Cursor,
  userId?: string,
  categoryId?: string,
): Promise<VideoDetailedPublic[]> => {
  return await getVideos(
    prisma,
    (await getLatests(cursor, userId, categoryId)).map((v) => v.Id),
    userId,
  );
};

// categoryId: null -> all catgories
export const getPopular = async (
  prisma: PrismaClient,
  cursor: Cursor,
  userId?: string,
  categoryId?: string,
): Promise<VideoDetailedPublic[]> => {
  return await getVideos(
    prisma,
    (await getPopulars(cursor, userId, categoryId)).map((v) => v.Id),
    userId,
  );
};

// categoryId: null -> all catgories
export const getRecommend = async (
  prisma: PrismaClient,
  cursor: Cursor,
  userId: string,
  categoryId?: string,
): Promise<VideoDetailedPublic[]> => {
  return await getVideos(
    prisma,
    await getRecommends(cursor, userId, categoryId),
    userId,
  );
};
