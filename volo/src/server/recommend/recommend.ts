import { type Video } from "@prisma/client";
import { getVideos } from "../lib/db/video";
import { getLatests, getPopulars, getRecommends, type Cursor } from "./gorse";
type VideoInfo = Video & {
  likes: number;
  comments: number;
  collections: number;
  liked: boolean;
};

const formatVideo = (videos: Video[]): VideoInfo[] => {
  return [];
};

// categoryId: null -> all catgories
export const getLatest = async (
  userId: string,
  cursor: Cursor,
  categoryId?: string,
): Promise<VideoInfo[]> => {
  const videos = await getVideos(
    (await getLatests(userId, cursor, categoryId)).map((v) => v.Id),
    userId,
  );

  return formatVideo(videos);
};

// categoryId: null -> all catgories
export const getPopular = async (
  userId: string,
  cursor: Cursor,
  categoryId?: string,
): Promise<VideoInfo[]> => {
  return formatVideo(
    await getVideos(
      (await getPopulars(userId, cursor, categoryId)).map((v) => v.Id),
      userId,
    ),
  );
};

// categoryId: null -> all catgories
export const getRecommend = async (
  userId: string,
  cursor: Cursor,
  categoryId?: string,
): Promise<VideoInfo[]> => {
  return formatVideo(
    await getVideos(await getRecommends(userId, cursor, categoryId), userId),
  );
};
