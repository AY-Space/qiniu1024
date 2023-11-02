"use client";

import {
  Avatar,
  IconButton,
  type IconButtonProps,
  Stack,
  Typography,
} from "@mui/joy";
import { getBilibiliImageUrl } from "~/app/utils";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import { useState } from "react";
import { Flex } from "~/app/_components/flex";
import { type VideoPublic } from "~/types";
import VideoPlayer from "./video-player";
import { CommentDrawer } from "~/app/video/[id]/_components/comment-drawer";

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
          <IconButton size="lg" variant={buttonVariant} onClick={onComment}>
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

export interface VideoWithOverlayProps {
  video: VideoPublic;
  active: boolean;
}

export const VideoWithOverlay = ({ video, active }: VideoWithOverlayProps) => {
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
          height: "100%",
        }}
        flex={1}
      >
        <VideoPlayer
          playing={active}
          src={video.url}
          loop
          details={
            <Stack spacing={2}>
              <Flex>
                <Avatar
                  src={
                    video.author.avatarUrl !== null
                      ? getBilibiliImageUrl(video.author.avatarUrl)
                      : undefined
                  }
                />
              </Flex>
            </Stack>
          }
        />
      </Stack>
      <VideoControls
        comments={video.comments}
        likes={video.likes}
        dislikes={video.dislikes}
        videoId={video.id}
        variant="side"
        onComment={() => setShowComments(true)}
      />
      <CommentDrawer
        onClose={() => setShowComments(false)}
        open={showComments}
        videoId={video.id}
      />
    </Flex>
  );
};
