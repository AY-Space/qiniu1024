"use client";
import { VideoGrid } from "~/app/_components/video-grid";
import { type VideoPublic } from "~/types";

export const VideoTabPanel = ({ videos }: { videos: VideoPublic[] }) => {
  return <VideoGrid videos={videos} />;
};
