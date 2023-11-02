import { type VideoPublic } from "~/types";
import { getVideos } from "../lib/db/video";
import { getLatests, getPopulars, getRecommends, type Cursor } from "./gorse";

// categoryId: null -> all catgories
export const getLatest = async (
  userId: string,
  cursor: Cursor,
  categoryId?: string,
): Promise<VideoPublic[]> => {
  return await getVideos(
    (await getLatests(userId, cursor, categoryId)).map((v) => v.Id),
    userId,
  );
};

// categoryId: null -> all catgories
export const getPopular = async (
  userId: string,
  cursor: Cursor,
  categoryId?: string,
): Promise<VideoPublic[]> => {
  return await getVideos(
    (await getPopulars(userId, cursor, categoryId)).map((v) => v.Id),
    userId,
  );
};

// categoryId: null -> all catgories
export const getRecommend = async (
  userId: string,
  cursor: Cursor,
  categoryId?: string,
): Promise<VideoPublic[]> => {
  return await getVideos(
    await getRecommends(userId, cursor, categoryId),
    userId,
  );
};
