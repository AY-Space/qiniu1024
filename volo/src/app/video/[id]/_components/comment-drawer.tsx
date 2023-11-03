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
  Button,
  Textarea,
  FormControl,
  FormLabel,
} from "@mui/joy";
import Image from "next/image";
import { getBilibiliImageUrl } from "../../../utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import { type CommentPublic } from "../../../../types";
import { api } from "~/trpc/react";
import { useState } from "react";

const Comment = ({ comment }: { comment: CommentPublic }) => {
  return (
    <Stack direction="row" gap={1} paddingY={2}>
      {comment.author.avatarUrl && (
        <Avatar src={getBilibiliImageUrl(comment.author.avatarUrl)} />
      )}
      <Stack spacing={1}>
        <Stack>
          <Typography level="title-md">{comment.author.name}</Typography>
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
          <IconButton size="sm">
            <ThumbUp />
            <Typography>{comment.likes}</Typography>
          </IconButton>
          <IconButton size="sm">
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
  const [text, setText] = useState("");
  return (
    <Drawer open={open} onClose={onClose} anchor="right">
      <ModalClose />
      <Container>
        <DialogTitle sx={{ marginTop: 2 }}>评论</DialogTitle>
        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        <CommentList videoId={videoId} />
      </Container>
      <Container sx={{ marginBottom: 2 }}>
        <FormControl>
          <FormLabel>Your comment</FormLabel>
          <Textarea
            placeholder="呐，现在何感想？"
            onChange={(event) => setText(event.target.value)}
            endDecorator={
              <Box display="flex" flexDirection="column">
                <Typography level="body-xs" sx={{ ml: "auto" }}>
                  {text.length} 字
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: "var(--Textarea-paddingBlock)",
                    pt: "var(--Textarea-paddingBlock)",
                    borderTop: "1px solid",
                    borderColor: "divider",
                    flex: "auto",
                  }}
                >
                  <Button sx={{ ml: "auto" }}>发送</Button>
                </Box>
              </Box>
            }
            sx={{
              minWidth: 300,
            }}
          />
        </FormControl>
      </Container>
    </Drawer>
  );
};
