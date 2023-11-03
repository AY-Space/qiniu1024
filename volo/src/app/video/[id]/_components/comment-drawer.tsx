"use client";
// CommentComponent.joy

import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  ModalClose,
  Stack,
  Typography,
  Alert,
  CircularProgress,
  Container,
  DialogTitle,
  Divider,
} from "@mui/joy";
import Image from "next/image";
import { getBilibiliImageUrl } from "../../../utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import { type CommentPublic } from "../../../../types";
import { api } from "~/trpc/react";

const Comment = ({ comment }: { comment: CommentPublic }) => {
  return (
    <Stack direction="row" gap={1} paddingY={2}>
      {comment.author.avatarUrl && (
        <Avatar src={getBilibiliImageUrl(comment.author.avatarUrl)} />
      )}
      <Stack spacing={1}>
        <Stack>
          <Typography level="title-lg">{comment.author.name}</Typography>
          <Typography level="body-xs">
            {dayjs(comment.createdAt).fromNow()}
          </Typography>
        </Stack>
        <Typography>{comment.text}</Typography>
        {comment.imgUrl && (
          <Box width={160} height={160} position={"relative"}>
            <Image
              src={getBilibiliImageUrl(comment.imgUrl)}
              alt={comment.imgUrl}
              fill
              style={{ objectFit: "cover" }}
            />
          </Box>
        )}
        <Stack direction="row" spacing={1}>
          <IconButton size="sm" style={{ gap: 2 }}>
            <ThumbUp />
            <Typography>{comment.likes}</Typography>
          </IconButton>
          <IconButton size="sm" style={{ gap: 2 }}>
            <ThumbDown />
            <Typography>{comment.dislikes}</Typography>
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

const CommentList = ({ videoId }: { videoId: string }) => {
  const { data, error, isLoading } = api.video.comments.useQuery({ videoId });
  return (
    <Stack>
      {error && <Alert color="danger">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {data?.map((comment) => <Comment comment={comment} key={comment.id} />)}
    </Stack>
  );
};

export interface CommentDrawerProps {
  videoId: string;
  open: boolean;
  onClose: () => void;
}
export const CommentDrawer = ({
  videoId,
  open,
  onClose,
}: CommentDrawerProps) => {
  return (
    <Drawer open={open} onClose={onClose} anchor="right">
      <DialogTitle>评论</DialogTitle>
      <ModalClose />
      <Container>
        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        <CommentList videoId={videoId} />
      </Container>
    </Drawer>
  );
};
