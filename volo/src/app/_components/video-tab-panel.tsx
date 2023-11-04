"use client";
import { Grid } from "@mui/joy";
import { type VideoPublic } from "~/types";
import { VideoCard } from "./video-card";

export const VideoGrid = ({
  uploadedVideos,
}: {
  uploadedVideos: VideoPublic[];
}) => {
  return (
    <Grid
      container
      columns={{
        xs: 2,
        sm: 3,
        md: 4,
      }}
    >
      {uploadedVideos.map((e) => (
        <Grid
          key={e.id}
          xs={1}
          sx={{
            p: 1,
          }}
        >
          <VideoCard video={e} />
        </Grid>
      ))}
    </Grid>
  );
};
