"use client";
import { TabPanel } from "@mui/joy";
import { VideoGrid } from "~/app/_components/video-tab-panel";
import { type VideoPublic } from "~/types";

export const VideoTabPanel = ({
  uploadedVideos,
  value,
}: {
  uploadedVideos: VideoPublic[];
  value: number;
}) => {
  return (
    <TabPanel value={value}>
      <VideoGrid uploadedVideos={uploadedVideos} />
    </TabPanel>
  );
};
