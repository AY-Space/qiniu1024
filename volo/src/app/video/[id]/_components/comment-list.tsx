"use client";
import { Stack, Alert, CircularProgress, Snackbar } from "@mui/joy";
import { api } from "~/trpc/react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { CommentComponent } from "./comment-component";

export const CommentList = ({ videoId }: { videoId: string }) => {
  const { data, error, isLoading } = api.video.comments.useQuery({ videoId });
  const { data: session } = useSession();
  const utils = api.useUtils();

  const [actionError, setActionError] = useState(false);
  const deleteComment = api.video.deleteComment.useMutation({
    onSuccess: async () => {
      await utils.video.comments.invalidate({ videoId });
    },
    onError: () => setActionError(true),
  });

  const mutationOptions = {
    onSuccess: async () => {
      await utils.video.comments.invalidate({ videoId });
    },
    onError: () => setActionError(true),
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
        <CommentComponent
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
      <Snackbar
        variant="solid"
        color="danger"
        autoHideDuration={1600}
        open={actionError}
        onClose={() => setActionError(false)}
      >
        操作失败
      </Snackbar>
    </Stack>
  );
};
