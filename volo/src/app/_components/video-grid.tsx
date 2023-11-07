"use client";
import { Grid, Typography } from "@mui/joy";
import { type VideoPublic } from "~/types";
import { VideoCard } from "./video-card";

export const VideoGrid = ({ videos: videos }: { videos: VideoPublic[] }) => {
  return videos.length > 0 ? (
    <Grid
      container
      columns={{
        xs: 2,
        sm: 3,
        md: 4,
      }}
    >
      {videos.map((e) => (
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
  ) : (
    <Typography textAlign="center">无数据</Typography>
  );
};
