"use client";
import { IconButton, Stack, Typography, Snackbar, Divider } from "@mui/joy";
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
  state,
}: {
  videoId: string;
  likes: number;
  comments: number;
  state: "active" | "mounted";
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [shared, setShared] = useState(false);

  const { data: likedAndCollected } = api.video.likedAndCollected.useQuery(
    {
      videoId,
    },
    {
      enabled: state === "active",
    },
  );
  const utils = api.useUtils();
  const like = api.video.like.useMutation({
    onSuccess: async () => {
      await utils.video.likedAndCollected.invalidate({ videoId });
    },
  });

  return (
    <Stack
      alignItems="center"
      sx={(theme) => ({
        [theme.breakpoints.down("sm")]: {
          right: 18,
          position: "absolute",
        },
      })}
    >
      <Stack
        spacing={0.5}
        divider={<Divider />}
        borderRadius={8}
        sx={(theme) => ({
          [theme.breakpoints.down("sm")]: {
            bgcolor: "#0007",
          },
        })}
      >
        <Stack alignItems="center" p={1}>
          <IconButton
            size="lg"
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
          <IconButton size="lg" onClick={() => setShowComments(true)}>
            <CommentIcon />
          </IconButton>
          <Typography>{comments}</Typography>
          {state === "active" && (
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
            color={likedAndCollected?.collected ? "primary" : "neutral"}
            onClick={() => setShowCollection(true)}
          >
            <StarIcon />
          </IconButton>
          <Typography>收藏</Typography>
          {state === "active" && (
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
            onClick={async () => {
              const text = `康康我在 Volo 发现了什么好东西！\n链接：${document.location.origin}/video/${videoId}`;
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
