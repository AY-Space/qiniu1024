"use client";
import { Grid, Stack, Typography } from "@mui/joy";
import { type VideoPublic } from "~/types";
import { VideoCard } from "./video-card";

export const VideoGrid = ({
  videos,
  actions,
}: {
  videos: VideoPublic[];
  actions?: (e: VideoPublic) => JSX.Element;
}) => {
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
            position: "relative",
          }}
        >
          <VideoCard video={e} />
          <Stack
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 1,
            }}
          >
            {actions?.(e)}
          </Stack>
        </Grid>
      ))}
    </Grid>
  ) : (
    <Typography textAlign="center">无数据</Typography>
  );
};
