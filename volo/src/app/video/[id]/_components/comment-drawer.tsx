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
  Sheet,
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
import { Flex } from "~/app/_components/flex";

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
            <Flex spacing={0.5} alignItems="center" px={0.5}>
              <ThumbUp />
              <Typography>{comment.likes}</Typography>
            </Flex>
          </IconButton>
          <IconButton size="sm">
            <Flex spacing={0.5} alignItems="center" px={0.5}>
              <ThumbDown />
              <Typography>{comment.dislikes}</Typography>
            </Flex>
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

const NewCommentForm = () => {
  const [text, setText] = useState("");
  return (
    <Stack>
      <Divider />
      <Stack spacing={1} p={1}>
        <Typography level="title-lg">你的评论</Typography>
        <Textarea
          placeholder="呐，现在何感想？"
          onChange={(event) => setText(event.target.value)}
          variant="soft"
          endDecorator={
            <>
              <Box flex={1} />
              <Flex alignItems="center" spacing={1}>
                <Typography level="body-xs">{text.length} 字</Typography>
                <Button>发送</Button>
              </Flex>
            </>
          }
        />
      </Stack>
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
      <Stack
        sx={{
          height: "100vh",
        }}
      >
        <Stack>
          <ModalClose />

          <DialogTitle
            sx={{
              p: 1.5,
            }}
          >
            评论
          </DialogTitle>
          <Divider />
        </Stack>
        <Stack
          sx={{
            px: 2,
            flex: 1,
            overflowY: "auto",
          }}
        >
          <CommentList videoId={videoId} />
        </Stack>
        <Sheet>
          <NewCommentForm />
        </Sheet>
      </Stack>
    </Drawer>
  );
};
