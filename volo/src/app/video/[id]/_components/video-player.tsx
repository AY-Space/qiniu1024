"use client";

import {
  DialogTitle,
  Drawer,
  IconButton,
  IconButtonProps,
  ModalClose,
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
import { VideoJS } from "./video-js";
import { VideoPublic } from "~/types";
import { CommentDrawer } from "~/app/_components/comment-drawer";

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

export interface VideoPlayerProps {
  video: VideoPublic;
  active: boolean;
}

export const VideoPlayer = ({ video, active }: VideoPlayerProps) => {
  const [showComments, setShowComments] = useState(false);

  const toggleDrawer =
    (inOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setShowComments(inOpen);
    };

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
        comments={video.comments}
        likes={video.likes}
        dislikes={video.dislikes}
        videoId={video.id}
        onComment={() => setShowComments(true)}
        variant="side"
      />
      <CommentDrawer
        videoId={video.id}
        open={showComments}
        onClose={() => setShowComments(false)}
      />
    </Flex>
  );
};
