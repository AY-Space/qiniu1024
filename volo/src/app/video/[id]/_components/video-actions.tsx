"use client";
import { IconButton, type IconButtonProps, Stack, Typography } from "@mui/joy";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";
import { CommentDrawer } from "./comment-drawer";
import { VideoCollectionModal } from "./video-collection-modal";
import { api } from "~/trpc/react";

export const VideoActions = ({
  videoId,
  likes,
  comments,
  variant,
  active,
}: {
  videoId: string;
  likes: number;
  comments: number;
  variant: "side" | "overlay";
  active: boolean;
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const { data: likedAndCollected } = api.video.likedAndCollected.useQuery({
    videoId,
  });
  const utils = api.useUtils();
  const like = api.video.like.useMutation({
    onSuccess: async () => {
      await utils.video.likedAndCollected.invalidate({ videoId });
    },
  });

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
          <IconButton
            size="lg"
            variant={buttonVariant}
            color={likedAndCollected?.liked ? "primary" : "neutral"}
            onClick={() => {
              like.mutate({ videoId, like: !likedAndCollected?.liked });
            }}
          >
            <ThumbUpIcon />
          </IconButton>
          <Typography>{likes}</Typography>
        </Stack>
        <Stack alignItems="center">
          <IconButton
            size="lg"
            variant={buttonVariant}
            onClick={() => setShowComments(true)}
          >
            <CommentIcon />
          </IconButton>
          <Typography>{comments}</Typography>
          {active && (
            <CommentDrawer
              onClose={() => setShowComments(false)}
              open={showComments}
              videoId={videoId}
            />
          )}
        </Stack>
        <Stack alignItems="center">
          <IconButton
            size="lg"
            variant={buttonVariant}
            color={likedAndCollected?.collected ? "primary" : "neutral"}
            onClick={() => setShowCollection(true)}
          >
            <StarIcon />
          </IconButton>
          <Typography>收藏</Typography>
          {active && (
            <VideoCollectionModal
              open={showCollection}
              onClose={() => setShowCollection(false)}
              videoId={videoId}
            />
          )}
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
