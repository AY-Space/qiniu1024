"use client";
import {
  Box,
  Stack,
  Typography,
  CircularProgress,
  Divider,
  Button,
  Textarea,
  Snackbar,
} from "@mui/joy";
import { api } from "~/trpc/react";
import { useState } from "react";
import { Flex } from "~/app/_components/flex";
import SendIcon from "@mui/icons-material/Send";

export const CommentForm = ({ videoId }: { videoId: string }) => {
  const [text, setText] = useState("");
  const utils = api.useUtils();
  const [sentComment, setSentComment] = useState(false);
  const [error, setError] = useState(false);

  const postComment = api.video.postComment.useMutation({
    onSuccess: async () => {
      await utils.video.comments.invalidate({ videoId });
      setSentComment(true);
      setText("");
    },
    onError: () => setError(true),
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
