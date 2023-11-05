"use client";
import { TabPanel } from "@mui/joy";
import { VideoGrid } from "~/app/_components/video-tab-panel";
import { type VideoPublic } from "~/types";

export const VideoTabPanel = ({
  videos,
  value,
}: {
  videos: VideoPublic[];
  value: number;
}) => {
  return (
    <TabPanel value={value}>
      <VideoGrid videos={videos} />
    </TabPanel>
  );
};
