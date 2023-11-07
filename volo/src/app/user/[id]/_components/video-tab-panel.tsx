"use client";
import { Typography } from "@mui/joy";
import { VideoGrid } from "~/app/_components/video-grid";
import { type VideoPublic } from "~/types";

export const VideoTabPanel = ({ videos }: { videos: VideoPublic[] }) => {
  return videos.length > 0 ? (
    <VideoGrid videos={videos} />
  ) : (
    <Typography textAlign="center">无数据</Typography>
  );
};
