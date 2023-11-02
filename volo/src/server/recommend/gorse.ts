import { TagType, type Tag } from "@prisma/client";
import axios from "axios";
import { env } from "~/env.mjs";

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

axios.defaults.baseURL = env.GORSE_URL + "/api";

const newItem = (itemId: string, tags: Tag[]): Item => ({
  Categories: tags
    .filter((tag) => tag.type === TagType.Category)
    .map((tag) => tag.id),
  IsHidden: false,
  ItemId: itemId,
  Labels: tags.filter((tag) => tag.type === TagType.Tag).map((tag) => tag.id),
  Timestamp: new Date(),
});

const newUser = (userId: string, tags: Tag[]): User => ({
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

export const insertVideo = async (id: string, tags: Tag[]) => {
  try {
    await axios.post("/item", newItem(id, tags));
  } catch (e) {
    throw e;
  }
};

export const insertUser = async (id: string, tags: Tag[]) => {
  try {
    await axios.post("/user", newUser(id, tags));
  } catch (e) {
    throw e;
  }
};

export const insertFeedback = async (
  userId: string,
  itemId: string,
  feedbackType: FeedbackType,
) => {
  try {
    await axios.post("/feedback", newFeedback(userId, itemId, feedbackType));
  } catch (e) {
    throw e;
  }
};

// categoryId: null -> all catgories
export const getRecommends = async (
  userId: string,
  cursor: Cursor,
  categoryId?: string,
): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(
      `/recommend/${userId}/${categoryId ?? ""}?${format(cursor)}`,
    );
    return response.data;
  } catch (e) {
    throw e;
  }
};

// categoryId: null -> all catgories
export const getLatests = async (
  userId: string,
  cursor: Cursor,
  categoryId?: string,
): Promise<{ Id: string; Score: number }[]> => {
  try {
    const response = await axios.get<{ Id: string; Score: number }[]>(
      `/latest/${categoryId ?? ""}?${format(cursor)}&user-id=${userId}`,
    );
    return response.data;
  } catch (e) {
    throw e;
  }
};

// categoryId: null -> all catgories
export const getPopulars = async (
  userId: string,
  cursor: Cursor,
  categoryId?: string,
): Promise<{ Id: string; Score: number }[]> => {
  try {
    const response = await axios.get<{ Id: string; Score: number }[]>(
      `/popular/${categoryId ?? ""}?${format(cursor)}&user-id=${userId}`,
    );
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const getItemNeighbors = async (
  itemId: string,
  cursor: Cursor,
  categoryId?: string,
): Promise<{ Id: string; Score: number }[]> => {
  try {
    const response = await axios.get<{ Id: string; Score: number }[]>(
      `/item/${itemId}/neighbors/${categoryId ?? ""}?${format(cursor)}`,
    );
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const getUserNeighbors = async (
  userId: string,
  cursor: Cursor,
): Promise<{ Id: string; Score: number }[]> => {
  try {
    const response = await axios.get<{ Id: string; Score: number }[]>(
      `/user/${userId}/neighbors?${format(cursor)}`,
    );
    return response.data;
  } catch (e) {
    throw e;
  }
};
