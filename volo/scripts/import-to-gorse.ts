import "dotenv/config";
import { db } from "~/server/db";
import {
  getRecommends,
  insertUsers,
  insertVideos,
} from "~/server/lib/gorse/base";

const loadUsers = async () => {
  const users = await db.user.findMany({
    select: {
      id: true,
      tags: {
        select: {
          id: true,
          type: true,
          name: true,
        },
      },
    },
  });
  return users;
};

const loadVideos = async () => {
  const videos = await db.video.findMany({
    select: {
      id: true,
      tags: {
        select: {
          id: true,
          type: true,
          name: true,
        },
      },
    },
  });
  return videos;
};
async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const main = async () => {
  const us = await loadUsers();
  if (!us) {
    console.error("load user error");
    return;
  }

  const vs = await loadVideos();
  if (!vs) {
    console.error("load video error");
    return;
  }

  for (let i = 0; i < us.length; i += 100) {
    await insertUsers(
      us.slice(i, i + 100).map((u) => ({
        userId: u.id,
        tags: u.tags,
      })),
    );
    await sleep(10);
  }

  for (let i = 0; i < vs.length; i += 100) {
    await insertVideos(
      vs.slice(i, i + 100).map((v) => ({
        videoId: v.id,
        tags: v.tags,
      })),
    );
    await sleep(10);
  }
};

// void main();
/*
  prisma: PrismaClient,
  cursor: Cursor,
  userId: string,
  categoryId?: string,*/

const test = async () => {
  const videos = await getRecommends(
    // db,
    {
      limit: 10,
      offset: 0,
    },
    "clojw08ht000gjnr3bx7ze9wk",
  );
  console.log(videos);
};

void test();
