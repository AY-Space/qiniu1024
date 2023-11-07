import "dotenv/config";
import shell from "shelljs";
import { db } from "~/server/db";
import {
  insertUsers as gorseInsertUsers,
  insertVideos as gorseInsertVideos,
} from "~/server/lib/gorse/base";
import {
  insertUser as esInsertUser,
  insertUsers as esInsertUsers,
  insertVideo as esInsertVideo,
  insertVideos as esInsertVideos,
} from "../src/server/lib/search/elasticsearch";

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const pgInit = async (): Promise<boolean> => {
  if ((await db.video.count()) > 0) {
    console.log("pg data already init");
    return false;
  }

  shell.exec(
    "psql postgresql://volo:volo@db:5432/postgres?sslmode=disable -f init.sql'",
  );
  return true;
};

const gorseInit = async () => {
  const users = await db.user.findMany({
    select: {
      id: true,
      tags: {
        select: {
          id: true,
          type: true,
        },
      },
    },
  });
  if (!users) {
    console.error("load user error");
    return;
  }

  for (let i = 0; i < users.length; i += 100) {
    await gorseInsertUsers(
      users.map((user) => ({
        userId: user.id,
        tags: user.tags,
      })),
    );
    await sleep(10);
  }

  const videos = await db.video.findMany({
    select: {
      id: true,
      createdAt: true,
      tags: {
        select: {
          id: true,
          type: true,
          name: true,
        },
      },
    },
  });
  if (!videos) {
    console.error("load video error");
    return;
  }

  for (let i = 0; i < videos.length; i += 100) {
    await gorseInsertVideos(
      videos.slice(i, i + 100).map((video) => ({
        videoId: video.id,
        tags: video.tags,
        createdAt: video.createdAt,
      })),
    );
    await sleep(10);
  }
};

const esInit = async () => {
  const videos = await db.video
    .findMany({
      select: {
        id: true,
        title: true,
        description: true,
        tags: { select: { name: true } },
      },
    })
    .then((videos) =>
      videos.map((v) => ({
        id: v.id,
        title: v.title,
        description: v.description,
        tags: v.tags.map((t) => t.name),
      })),
    );

  const video = videos.shift();
  if (!video) {
    console.log("video is null");
    return;
  }
  await esInsertVideo(video); // should insert one first to create index
  await esInsertVideos(videos);

  const users = await db.user
    .findMany({
      select: {
        id: true,
        name: true,
      },
    })
    .then((users) =>
      users.map((u) => ({
        id: u.id,
        name: u.name ?? "",
      })),
    );

  const user = users.shift();
  if (!user) {
    console.log("user is null");
    return;
  }
  await esInsertUser(user); // should insert one first to create index
  await esInsertUsers(users.slice(0, 100));
};

const main = async () => {
  const needInit = await pgInit();
  if (!needInit) {
    console.log("pg data already init");
    return;
  }
  console.log("pg data init done");

  await gorseInit();
  console.log("gorse data init done");

  await esInit();
  console.log("es data init done");
};

void main();
