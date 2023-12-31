import { Client } from "@elastic/elasticsearch";
import { env } from "~/env.mjs";
import { ESIndex, type Page } from "~/types";

const es = new Client({
  node: env.ES_URL,
});

export interface Video {
  id: string;
  title: string;
  description: string | null;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
}

export const createIndexes = async () => {
  await es.indices.create({
    index: ESIndex.VIDEO,
    body: {
      mappings: {
        properties: {
          id: { type: "keyword" },
          title: { type: "text" },
          description: { type: "text" },
          tags: { type: "keyword" },
        },
      },
    },
  });
  await es.indices.create({
    index: ESIndex.USER,
    body: {
      mappings: {
        properties: {
          id: { type: "keyword" },
          name: { type: "text" },
        },
      },
    },
  });
};

export const insertVideo = async (item: Video) => {
  const { result } = await es.index({
    index: ESIndex.VIDEO,
    id: item.id,
    document: {
      id: item.id,
      title: item.title,
      description: item.description,
      tags: item.tags,
    },
    refresh: "wait_for",
  });
  if (result != "created") {
    throw new Error("Failed to index video");
  }
};

export const insertVideos = async (items: Video[]) => {
  const body = items.flatMap((item) => [
    { index: { _index: ESIndex.VIDEO, _id: item.id } },
    {
      id: item.id,
      title: item.title,
      description: item.description,
      tags: item.tags,
    },
  ]);
  const response = await es.bulk({ refresh: "wait_for", body });
  if (!response.errors) {
    return;
  }

  throw new Error("Failed to index videos");
};

export const insertUser = async (item: User) => {
  const { result } = await es.index({
    index: ESIndex.USER,
    id: item.id,
    document: {
      id: item.id,
      name: item.name,
    },
    refresh: "wait_for",
  });
  if (result != "created") {
    throw new Error("Failed to index video");
  }
};

export const insertUsers = async (items: User[]) => {
  const body = items.flatMap((item) => [
    { index: { _index: ESIndex.USER, _id: item.id } },
    {
      id: item.id,
      name: item.name,
    },
  ]);
  const response = await es.bulk({ refresh: "wait_for", body });
  if (!response.errors) {
    return;
  }

  throw new Error("Failed to index users");
};

export const deleteItem = async (itemId: string, index: ESIndex) => {
  const { result } = await es.delete({
    index: index,
    id: itemId,
    refresh: "wait_for",
  });
  if (result != "deleted") {
    throw new Error("Failed to index video");
  }
};

const indexFileds = {
  [ESIndex.VIDEO]: ["title", "description", "tags"],
  [ESIndex.USER]: ["name"],
};

const serachItem = async (
  query: string,
  index: ESIndex,
  page: Page = { limit: 10 },
): Promise<string[]> => {
  const res = await es.search({
    index: index,
    query: {
      multi_match: {
        query: query,
        fields: indexFileds[index],
        fuzziness: "AUTO", // 使用fuzziness可以对拼写错误有一定的容忍
      },
    },
    from: page.cursor,
    size: page.limit,
    _source: false, // 不需要具体内容，只要 id
  });
  return res.hits.hits.map((hit) => hit._id);
};

export const searchVideo = async (
  query: string,
  page: Page = { limit: 10 },
): Promise<string[]> => {
  return serachItem(query, ESIndex.VIDEO, page);
};

export const searchUser = async (
  query: string,
  page: Page = { limit: 10 },
): Promise<string[]> => {
  return serachItem(query, ESIndex.USER, page);
};
