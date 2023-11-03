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
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import { useState } from "react";
import { Flex } from "~/app/_components/flex";
import { type VideoDetailedPublic } from "~/types";
import VideoPlayer from "./video-player";
import { CommentDrawer } from "~/app/video/[id]/_components/comment-drawer";

const VideoControls = ({
  videoId,
  likes,
  comments,
  variant,
  onLike,
  onComment,
}: {
  videoId: string;
  likes: number;
  comments: number;
  variant: "side" | "overlay";
  onLike: () => void;
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

const VideoOverlay = ({ video }: { video: VideoDetailedPublic }) => {
  return (
    <Stack spacing={2} p={2}>
      <Flex spacing={2} alignItems="center">
        <Avatar
          src={
            video.author.avatarUrl !== null
              ? getBilibiliImageUrl(video.author.avatarUrl)
              : undefined
          }
        />
        <Stack>
          <Typography level="title-md">{video.author.name}</Typography>
          <Typography level="body-xs">
            {video.createdAt.toLocaleDateString()}
          </Typography>
        </Stack>
      </Flex>
      <Typography level="title-md">{video.title}</Typography>
      <Typography level="body-md">{video.description}</Typography>
    </Stack>
  );
};

export interface VideoWithOverlayProps {
  video: VideoDetailedPublic;
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
      <VideoPlayer
        playing={active}
        src={video.url}
        loop
        overlay={<VideoOverlay video={video} />}
      />
      <VideoControls
        comments={video.comments}
        likes={video.likes}
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
