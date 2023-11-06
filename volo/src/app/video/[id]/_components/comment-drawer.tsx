"use client";

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
  DialogTitle,
  Divider,
  Button,
  Textarea,
  Sheet,
  Snackbar,
  Link as JoyLink,
} from "@mui/joy";
import Image from "next/image";
import { getBilibiliImageUrl } from "../../../utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { Delete, ThumbDown, ThumbUp } from "@mui/icons-material";
import { type CommentPublic } from "../../../../types";
import { api } from "~/trpc/react";
import { useState } from "react";
import { Flex } from "~/app/_components/flex";
import SendIcon from "@mui/icons-material/Send";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Comment = ({
  comment,
  deleteAble: deleteAble,
  onDelete,
  onLike,
  onDislike,
}: {
  comment: CommentPublic;
  deleteAble: boolean;
  onDelete: () => void;
  onLike?: () => void;
  onDislike?: () => void;
}) => {
  return (
    <Flex spacing={1}>
      {comment.author.avatarUrl && (
        <Avatar src={getBilibiliImageUrl(comment.author.avatarUrl)} />
      )}
      <Stack spacing={1} flex={1}>
        <Flex alignItems="center">
          <Stack>
            <Link href={`/user/${comment.author.id}`}>
              <JoyLink>
                <Typography level="title-md">{comment.author.name}</Typography>
              </JoyLink>
            </Link>

            <Typography level="body-xs">
              {dayjs(comment.createdAt).fromNow()}
            </Typography>
          </Stack>
          <Box flex={1} />
          {deleteAble && (
            <IconButton color="danger" size="sm" onClick={onDelete}>
              <Delete />
            </IconButton>
          )}
        </Flex>
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
        <Flex spacing={1}>
          <IconButton
            size="sm"
            color={comment.currentUser?.liked ? "primary" : "neutral"}
            onClick={onLike}
          >
            <Flex spacing={0.5} alignItems="center" px={0.5}>
              <ThumbUp />
              <Typography
                color={comment.currentUser?.liked ? "primary" : "neutral"}
              >
                {comment.likes}
              </Typography>
            </Flex>
          </IconButton>
          <IconButton
            size="sm"
            color={comment.currentUser?.disliked ? "warning" : "neutral"}
            onClick={onDislike}
          >
            <Flex spacing={0.5} alignItems="center" px={0.5}>
              <ThumbDown />
              <Typography
                color={comment.currentUser?.disliked ? "warning" : "neutral"}
              >
                {comment.dislikes}
              </Typography>
            </Flex>
          </IconButton>
        </Flex>
      </Stack>
    </Flex>
  );
};

const CommentList = ({ videoId }: { videoId: string }) => {
  const { data, error, isLoading } = api.video.comments.useQuery({ videoId });
  const { data: session } = useSession();
  const utils = api.useUtils();
  const deleteComment = api.video.deleteComment.useMutation({
    onSuccess: async () => {
      await utils.video.comments.invalidate({ videoId });
    },
  });

  const mutationOptions = {
    onSuccess: async () => {
      await utils.video.comments.invalidate({ videoId });
    },
  };
  const like = api.comment.like.useMutation(mutationOptions);
  const dislike = api.comment.dislike.useMutation(mutationOptions);

  return (
    <Stack spacing={2}>
      {error && <Alert color="danger">加载失败</Alert>}
      {isLoading && (
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      )}
      {data?.map((comment) => (
        <Comment
          onLike={() => {
            like.mutate({
              commentId: comment.id,
              operation: comment.currentUser?.liked ? "disconnect" : "connect",
            });
          }}
          onDislike={() => {
            dislike.mutate({
              commentId: comment.id,
              operation: comment.currentUser?.disliked
                ? "disconnect"
                : "connect",
            });
          }}
          deleteAble={session?.userId === comment.author.id}
          comment={comment}
          key={comment.id}
          onDelete={() => {
            deleteComment.mutate({
              commentId: comment.id,
            });
          }}
        />
      ))}
    </Stack>
  );
};

const NewCommentForm = ({ videoId }: { videoId: string }) => {
  const [text, setText] = useState("");
  const utils = api.useUtils();
  const [sentComment, setSentComment] = useState(false);
  const [error, setError] = useState(false);

  const postComment = api.video.postComment.useMutation({
    onError: () => setError(true),
    onSuccess: async () => {
      await utils.video.comments.invalidate({ videoId });
      setSentComment(true);
      setText("");
    },
  });

  return (
    <Stack>
      <Divider />
      <Stack spacing={1} p={1}>
        <Typography level="title-lg">发送评论</Typography>
        <Textarea
          placeholder="呐，现在何感想？"
          onChange={(event) => setText(event.target.value)}
          variant="soft"
          minRows={3}
          maxRows={10}
          value={text}
          endDecorator={
            <>
              <Box flex={1} />
              <Flex alignItems="center" spacing={1}>
                {text.length > 0 && (
                  <Typography level="body-xs">{text.length} 字</Typography>
                )}
                <Button
                  disabled={postComment.isLoading}
                  onClick={() => {
                    postComment.mutate({
                      videoId,
                      text,
                    });
                  }}
                  startDecorator={
                    postComment.isLoading ? <CircularProgress /> : <SendIcon />
                  }
                >
                  发送
                </Button>
              </Flex>
            </>
          }
        />
      </Stack>
      <Snackbar
        variant="solid"
        color="success"
        autoHideDuration={1600}
        open={sentComment}
        onClose={() => setSentComment(false)}
      >
        评论成功
      </Snackbar>
      <Snackbar
        variant="solid"
        color="danger"
        autoHideDuration={1600}
        open={error}
        onClose={() => setError(false)}
      >
        评论失败
      </Snackbar>
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
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      slotProps={{
        content: {
          sx: {
            width: 420,
            maxWidth: "90vw",
          },
        },
      }}
    >
      {open && (
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
              p: 2,
              flex: 1,
              overflowY: "auto",
            }}
          >
            <CommentList videoId={videoId} />
          </Stack>
          <Sheet>
            <NewCommentForm videoId={videoId} />
          </Sheet>
        </Stack>
      )}
    </Drawer>
  );
};
