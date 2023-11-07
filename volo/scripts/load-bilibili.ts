// import { TagType } from "@prisma/client";
// import "dotenv/config";
// import { db } from "~/server/db";
// import { env } from "~/env.mjs";

// import { db } from "~/server/db";

// import usersJson from "./users.json";
// import videoJson from "./videos.json";
// import tagsJson from "./tags.json";
// import videoTagJson from "./video_tags.json";
// import commentJson from "./comments.json";
// import raw_video_tags from "spider/video_tags.json";

// const updateCategories = async () => {
//   const categories = [
//     "番剧",
//     "电影",
//     "国创",
//     "电视剧",
//     "综艺",
//     "纪录片",
//     "动画",
//     "游戏",
//     "鬼畜",
//     "音乐",
//     "舞蹈",
//     "影视",
//     "娱乐",
//     "知识",
//     "科技",
//     "资讯",
//     "美食",
//     "生活",
//     "汽车",
//     "时尚",
//     "运动",
//     "动物圈",
//     "VLOG",
//     "搞笑",
//     "单机游戏",
//     "虚拟UP主",
//     "公益",
//     "公开课",
//     "专栏",
//     "直播",
//     "活动",
//     "课堂",
//     "社区中心",
//     "新歌热榜",
//   ];
//   await db.tag.updateMany({
//     where: {
//       name: {
//         in: categories,
//       },
//     },
//     data: {
//       type: TagType.Category,
//     },
//   });
// };

const main = async () => {
  // await updateCategories();
  // await db.video.update({
  //   where: {
  //     id: "BV1Wj411d72A",
  //   },
  //   data: {
  //     tags: {
  //       connect: [
  //         {
  //           id: "1",
  //         },
  //         {
  //           id: "2",
  //         },
  //       ],
  //     },
  //   },
  // });
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
  // for (const e of raw_video_tags) {
  //   if (e.bvid === "BV1Wj411d72A") continue;
  //   await db.video.update({
  //     where: {
  //       id: e.bvid,
  //     },
  //     data: {
  //       tags: {
  //         connect: e.tags
  //           .map((t) => ({ id: t.tag_id.toString() }))
  //           .filter((t) => t.id != "0"),
  //       },
  //     },
  //   });
  // }
};

void main();
