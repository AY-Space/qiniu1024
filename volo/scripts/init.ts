import "dotenv/config";
import shell from "shelljs";
import { db } from "~/server/db";
import {
  insertUsers as gorseInsertUsers,
  insertVideos as gorseInsertVideos,
} from "~/server/lib/gorse/base";
import {
  createIndexes,
  insertUsers as esInsertUsers,
  insertVideos as esInsertVideos,
} from "../src/server/lib/search/elasticsearch";

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const pgInit = async (): Promise<boolean> => {
  if ((await db.video.count()) > 0) {
    shell.echo("pg data already init");
    return false;
  }

  shell.exec(
    'psql "postgresql://volo:volo@db:5432/volo?sslmode=disable" -f prisma/data.sql',
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
    shell.echo("load user error: null| undefined users");
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
    shell.echo("load video error: null| undefined videos");
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
  await createIndexes();

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
    shell.echo("video is null");
    return;
  }

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
    shell.echo("user is null");
    return;
  }

  await esInsertVideos(videos);
  await esInsertUsers(users);
};

const main = async () => {
  try {
    const needInit = await pgInit();
    if (!needInit) {
      shell.echo("pg data already init");
      return;
    }
    shell.echo("pg data init done");

    await gorseInit();
    shell.echo("gorse data init done");

    await esInit();
    shell.echo("es data init done");
  } catch (e) {
    shell.echo(String(e));
    shell.exit(1);
  }
};

void main();
