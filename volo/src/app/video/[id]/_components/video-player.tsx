"use client";

import { IconButton, IconButtonProps, Stack, Typography } from "@mui/joy";
import { type User, type Video } from "@prisma/client";
import { getBilibiliImageUrl } from "~/app/utils";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import { useState } from "react";
import { Flex } from "~/app/_components/flex";

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
      <Stack
        spacing={2}
        sx={{
          color: "white",
        }}
      >
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
  video: Omit<Video, "authorId"> & {
    author: Pick<User, "id" | "name" | "avatarUrl">;
    comments: number;
    likes: number;
  };
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
        height: "calc(100vh - var(--volo-app-bar-height))",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        position: "relative",
        maxWidth: "100%",
        px: 2,
      }}
      spacing={2}
    >
      <Stack
        sx={{
          borderRadius: "lg",
          overflow: "hidden",
        }}
      >
        <img alt="video cover" src={getBilibiliImageUrl(video.coverUrl)} />
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
