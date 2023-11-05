import { TagType } from "@prisma/client";
import axios_ from "axios";
import { env } from "~/env.mjs";
import { type GorseFeedback, type TagReference } from "~/types";

const axios = axios_.create({
  baseURL: env.GORSE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

interface Feedback {
  FeedbackType: string;
  ItemId: string;
  Timestamp: Date;
  UserId: string;
}

interface Item {
  Categories: string[];
  IsHidden: boolean;
  ItemId: string;
  Labels: string[];
  Timestamp: Date;
}

interface User {
  Labels: string[];
  UserId: string;
}

export interface Page {
  limit: number;
  cursor?: number;
}

const format = (page: Page): string => {
  return `n=${page.limit}` + page.cursor ? `&offset=${page.cursor}` : "";
};

const newItem = (itemId: string, tags: TagReference[]): Item => ({
  Categories: tags
    .filter((tag) => tag.type === TagType.Category)
    .map((tag) => tag.id),
  IsHidden: false,
  ItemId: itemId,
  Labels: tags.filter((tag) => tag.type === TagType.Tag).map((tag) => tag.id),
  Timestamp: new Date(),
});

const newUser = (userId: string, tags: TagReference[]): User => ({
  Labels: tags.filter((tag) => tag.type === TagType.Tag).map((tag) => tag.id),
  UserId: userId,
});

const newFeedback = (
  userId: string,
  itemId: string,
  feedbackType: GorseFeedback,
): Feedback => ({
  FeedbackType: feedbackType,
  ItemId: itemId,
  Timestamp: new Date(),
  UserId: userId,
});

export const insertVideo = async (videoId: string, tags: TagReference[]) => {
  await axios.post("/item", newItem(videoId, tags));
};

export const insertVideos = async (
  videos: { videoId: string; tags: TagReference[] }[],
) => {
  console.log(videos.length);
  await axios.post(
    "/items",
    videos.map(({ videoId, tags }) => newItem(videoId, tags)),
  );
};

export const deleteVideo = async (videoId: string) => {
  await axios.delete(`/item/${videoId}`);
};

// updateVideo: the new TagReferences will cover the old ones
export const updateVideo = async (videoId: string, tags: TagReference[]) => {
  await axios.patch(`/item/${videoId}`, newItem(videoId, tags));
};

export const insertUser = async (userId: string, tags: TagReference[]) => {
  await axios.post("/user", newUser(userId, tags));
};

export const insertUsers = async (
  users: { userId: string; tags: TagReference[] }[],
) => {
  await axios.post(
    "/users",
    users.map(({ userId, tags }) => newUser(userId, tags)),
  );
};

export const deleteUser = async (userId: string) => {
  await axios.delete(`/user/${userId}`);
};

// updateUser: the new TagReferences will cover the old ones
export const updateUser = async (userId: string, tags: TagReference[]) => {
  await axios.patch(`/user/${userId}`, newUser(userId, tags));
};

export const insertFeedback = async (
  userId: string,
  videoId: string,
  feedbackType: GorseFeedback,
) => {
  await axios.put("/feedback", newFeedback(userId, videoId, feedbackType));
};

export const deleteFeedback = async (
  userId: string,
  videoId: string,
  feedbackType: GorseFeedback,
) => {
  await axios.delete(`/feedback/${feedbackType}/${userId}/${videoId}`);
};

// categoryId: null -> all catgories
export const getRecommends = async (
  page: Page,
  userId: string,
  categoryId?: string,
): Promise<string[]> => {
  const response = await axios.get<string[]>(
    `/recommend/${userId}/${categoryId ?? ""}?${format(page)}`,
  );
  return response.data;
};

// categoryId: null -> all catgories
export const getLatests = async (
  page: Page,
  userId?: string,
  categoryId?: string,
): Promise<{ Id: string; Score: number }[]> => {
  const userQuery = userId ? `user-id=${userId}` : "";
  const response = await axios.get<{ Id: string; Score: number }[]>(
    `/latest/${categoryId ?? ""}?${format(page)}&${userQuery}`,
  );
  return response.data;
};

// categoryId: null -> all catgories
export const getPopulars = async (
  page: Page,
  userId?: string,
  categoryId?: string,
): Promise<{ Id: string; Score: number }[]> => {
  const userQuery = userId ? `user-id=${userId}` : "";
  const response = await axios.get<{ Id: string; Score: number }[]>(
    `/popular/${categoryId ?? ""}?${format(page)}&${userQuery}`,
  );
  return response.data;
};

export const getItemNeighbors = async (
  page: Page,
  itemId: string,
  categoryId?: string,
): Promise<{ Id: string; Score: number }[]> => {
  const response = await axios.get<{ Id: string; Score: number }[]>(
    `/item/${itemId}/neighbors/${categoryId ?? ""}?${format(page)}`,
  );
  return response.data;
};

export const getUserNeighbors = async (
  userId: string,
  page: Page,
): Promise<{ Id: string; Score: number }[]> => {
  const response = await axios.get<{ Id: string; Score: number }[]>(
    `/user/${userId}/neighbors?${format(page)}`,
  );
  return response.data;
};
