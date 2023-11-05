"use client";
import {
  IconButton,
  type IconButtonProps,
  Stack,
  Typography,
  Alert,
  Snackbar,
} from "@mui/joy";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";
import { CommentDrawer } from "./comment-drawer";
import { VideoCollectionModal } from "./video-collection-modal";
import { api } from "~/trpc/react";
import { CloseRounded } from "@mui/icons-material";

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
  const [shared, setShared] = useState(false);

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
          <IconButton
            size="lg"
            variant={buttonVariant}
            onClick={async () => {
              const text = `康康我在 Volo 发现了什么好东西！\n链接：${document.URL}`;
              await navigator.clipboard.writeText(text);
              setShared(true);
            }}
          >
            <ShareIcon />
          </IconButton>
          <Typography>分享</Typography>
        </Stack>
      </Stack>
      <Snackbar
        variant="solid"
        color="success"
        autoHideDuration={1600}
        open={shared}
        onClose={() => setShared(false)}
      >
        分享信息已复制至剪切板
      </Snackbar>
    </Stack>
  );
};
