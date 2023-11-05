import { type PrismaClient } from "@prisma/client";
import { type VideoDetailedPublic } from "~/types";
import { getVideos } from "../db/video";
import { getLatests, getPopulars, getRecommends, type Page } from "./base";

// categoryId: null -> all catgories
export const getLatest = async (
  prisma: PrismaClient,
  page: Page,
  userId?: string,
  categoryId?: string,
): Promise<VideoDetailedPublic[]> => {
  return await getVideos(
    prisma,
    (await getLatests(page, userId, categoryId)).map((v) => v.Id),
    userId,
  );
};

// categoryId: null -> all catgories
export const getPopular = async (
  prisma: PrismaClient,
  page: Page,
  userId?: string,
  categoryId?: string,
): Promise<VideoDetailedPublic[]> => {
  return await getVideos(
    prisma,
    (await getPopulars(page, userId, categoryId)).map((v) => v.Id),
    userId,
  );
};

// categoryId: null -> all catgories
export const getRecommend = async (
  prisma: PrismaClient,
  page: Page,
  userId: string,
  categoryId?: string,
): Promise<VideoDetailedPublic[]> => {
  return await getVideos(
    prisma,
    await getRecommends(page, userId, categoryId),
    userId,
  );
};
