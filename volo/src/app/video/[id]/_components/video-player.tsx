"use client";

import { IconButton, IconButtonProps, Stack, Typography } from "@mui/joy";
import { getBilibiliImageUrl } from "~/app/utils";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import { useState } from "react";
import { Flex } from "~/app/_components/flex";
import { VideoJS } from "./video-js";
import { VideoPublic } from "~/types";

const VideoControls = ({
  videoId,
  likes,
  dislikes,
  comments,
  variant,
  onLike,
  onDislike,
  onComment,
}: {
  videoId: string;
  likes: number;
  dislikes: number;
  comments: number;
  variant: "side" | "overlay";
  onLike: () => void;
  onDislike: () => void;
  onComment: () => void;
}) => {
  const buttonVariant: IconButtonProps["variant"] =
    variant === "overlay" ? "plain" : "soft";
  return (
    <Stack
      alignItems="center"
      sx={{
        position: variant === "overlay" ? "absolute" : "relative",
      }}
    >
      <Stack spacing={2}>
        <Stack alignItems="center">
          <IconButton size="lg" variant={buttonVariant}>
            <ThumbUpIcon />
          </IconButton>
          <span>{likes}</span>
        </Stack>
        <Stack alignItems="center">
          <IconButton size="lg" variant={buttonVariant}>
            <ThumbDownIcon />
          </IconButton>
          <Typography>{dislikes}</Typography>
        </Stack>
        <Stack alignItems="center">
          <IconButton size="lg" variant={buttonVariant}>
            <CommentIcon />
          </IconButton>
          <Typography>{comments}</Typography>
        </Stack>

        <Stack alignItems="center">
          <IconButton size="lg" variant={buttonVariant}>
            <ShareIcon />
          </IconButton>
          <Typography>分享</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export interface VideoPlayerProps {
  video: VideoPublic;
  active: boolean;
}

export const VideoPlayer = ({ video, active }: VideoPlayerProps) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <Flex
      id={`volo-video-${video.id}`}
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "calc(100vh - var(--volo-app-bar-height))",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        position: "relative",
        width: "100%",
        p: 2,
      }}
      spacing={2}
    >
      <Stack
        sx={{
          borderRadius: "lg",
          overflow: "hidden",
          height: "100%",
        }}
        flex={1}
      >
        {/* <img alt="video cover" src={getBilibiliImageUrl(video.coverUrl)} /> */}
        <VideoJS
          options={{
            sources: [
              {
                src: video.url,
                type: "video/mp4",
              },
            ],
            controls: true,
            loop: true,
            fluid: false,
            fill: true,
          }}
          playing={active}
        />
      </Stack>
      <VideoControls
        comments={0}
        likes={0}
        dislikes={0}
        videoId={video.id}
        variant="side"
      />
    </Flex>
  );
};
