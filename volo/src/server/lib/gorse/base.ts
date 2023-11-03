import { TagType } from "@prisma/client";
import axios_ from "axios";
import { env } from "~/env.mjs";
import { type TagReference } from "~/types";

export enum FeedbackType {
  READALL = "read_all",
  LIKED = "liked",
  COLLECTED = "collected",
  SHARED = "shared",
  READ = "read",
  LESS = "less",
}

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

export interface Cursor {
  limit: number;
  offset: number;
}

const minPageSize = 5;
const maxPageSize = 20;

const setPageSize = (limit: number): number => {
  if (limit < minPageSize) {
    return minPageSize;
  }
  if (limit > maxPageSize) {
    return maxPageSize;
  }
  return limit;
};

const format = (cursor: Cursor): string => {
  return `n=${setPageSize(cursor.limit)}&offset=${cursor.offset}`;
};

const axios = axios_.create({
  baseURL: env.GORSE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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
  feedbackType: FeedbackType,
): Feedback => ({
  FeedbackType: feedbackType,
  ItemId: itemId,
  Timestamp: new Date(),
  UserId: userId,
});

export const insertVideo = async (videoId: string, tags: TagReference[]) => {
  await axios.post("/item", newItem(videoId, tags));
};

export const insertUser = async (userId: string, tags: TagReference[]) => {
  await axios.post("/user", newUser(userId, tags));
};

export const insertFeedback = async (
  userId: string,
  videoId: string,
  feedbackType: FeedbackType,
) => {
  await axios.post("/feedback", newFeedback(userId, videoId, feedbackType));
};

// categoryId: null -> all catgories
export const getRecommends = async (
  cursor: Cursor,
  userId: string,
  categoryId?: string,
): Promise<string[]> => {
  const response = await axios.get<string[]>(
    `/recommend/${userId}/${categoryId ?? ""}?${format(cursor)}`,
  );
  return response.data;
};

// categoryId: null -> all catgories
export const getLatests = async (
  cursor: Cursor,
  userId?: string,
  categoryId?: string,
): Promise<{ Id: string; Score: number }[]> => {
  const userQuery = userId ? `user-id=${userId}` : "";
  const response = await axios.get<{ Id: string; Score: number }[]>(
    `/latest/${categoryId ?? ""}?${format(cursor)}&${userQuery}`,
  );
  return response.data;
};

// categoryId: null -> all catgories
export const getPopulars = async (
  cursor: Cursor,
  userId?: string,
  categoryId?: string,
): Promise<{ Id: string; Score: number }[]> => {
  const userQuery = userId ? `user-id=${userId}` : "";
  const response = await axios.get<{ Id: string; Score: number }[]>(
    `/popular/${categoryId ?? ""}?${format(cursor)}&${userQuery}`,
  );
  return response.data;
};

export const getItemNeighbors = async (
  itemId: string,
  cursor: Cursor,
  categoryId?: string,
): Promise<{ Id: string; Score: number }[]> => {
  const response = await axios.get<{ Id: string; Score: number }[]>(
    `/item/${itemId}/neighbors/${categoryId ?? ""}?${format(cursor)}`,
  );
  return response.data;
};

export const getUserNeighbors = async (
  userId: string,
  cursor: Cursor,
): Promise<{ Id: string; Score: number }[]> => {
  const response = await axios.get<{ Id: string; Score: number }[]>(
    `/user/${userId}/neighbors?${format(cursor)}`,
  );
  return response.data;
};
