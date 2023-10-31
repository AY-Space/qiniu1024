import "dotenv/config";

// import { db } from "~/server/db";

// import usersJson from "./users.json";
// import videoJson from "./videos.json";
// import tagsJson from "./tags.json";
// import videoTagJson from "./video_tags.json";
// import commentJson from "./comments.json";

const main = async () => {
  // for (const user of usersJson) {
  //   console.log(user.id);
  //   await db.user.upsert({
  //     where: { id: user.id },
  //     create: { ...user },
  //     update: {},
  //   });
  // }
  // for (const video of videoJson) {
  //   console.log(video.id);
  //   if (video.id === "BV1Wj411d72A") continue;
  //   await db.video.upsert({
  //     where: { id: video.id },
  //     create: { ...video, createdAt: new Date(video.createdAt * 1000) },
  //     update: {},
  //   });
  // }
  // for (const tag of tagsJson) {
  //   console.log(tag.id);
  //   await db.tag.upsert({
  //     where: { id: tag.id },
  //     create: { ...tag, createdAt: new Date(tag.createdAt * 1000) },
  //     update: {},
  //   });
  // }
  // for (const videoTag of videoTagJson) {
  //   console.log(videoTag);
  //   if (videoTag.videoId === "BV1Wj411d72A") continue;
  //   await db.videoTag.upsert({
  //     where: {
  //       videoId_tagId: {
  //         tagId: videoTag.tagId,
  //         videoId: videoTag.videoId,
  //       },
  //     },
  //     create: {
  //       ...videoTag,
  //       createdAt: new Date(videoTag.createdAt * 1000),
  //       score: BigInt(0),
  //     },
  //     update: {},
  //   });
  // }
  // for (const e of commentJson) {
  //   console.log(e);
  //   const { imgs, user, ...rest } = {
  //     ...e,
  //     imgUrl: e.imgs.at(0)?.img_src,
  //     createdAt: new Date(e.createdAt * 1000),
  //   };
  //   await db.user.upsert({
  //     where: { id: user.id },
  //     create: { ...user },
  //     update: {},
  //   });
  //   if (rest.videoId === "BV1Wj411d72A") continue;
  //   await db.comment.upsert({
  //     where: { id: e.id },
  //     create: rest,
  //     update: {},
  //   });
  // }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
