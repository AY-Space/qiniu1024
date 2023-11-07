"use client";

import { Button, Snackbar } from "@mui/joy";
import { useState } from "react";
import { api } from "~/trpc/react";

export function FollowButton({ followUserId }: { followUserId: string }) {
  const { data: followed } = api.user.hasFollowed.useQuery({
    userId: followUserId,
  });
  const utils = api.useUtils();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const follow = api.user.follow.useMutation({
    onSuccess: async () => {
      setSuccess(true);
      await utils.user.hasFollowed.invalidate({ userId: followUserId });
    },
    onError: () => setError(true),
  });

  return (
    <>
      <Button
        size="sm"
        variant="soft"
        onClick={() => {
          followed != undefined &&
            follow.mutate({
              userId: followUserId,
              follow: !followed,
            });
        }}
      >
        {followed ? "已关注" : "关注"}
      </Button>
      <Snackbar
        variant="solid"
        color="success"
        autoHideDuration={1600}
        open={success}
        onClose={() => setSuccess(false)}
      >
        操作成功
      </Snackbar>
      <Snackbar
        variant="solid"
        color="danger"
        autoHideDuration={1600}
        open={error}
        onClose={() => setError(false)}
      >
        操作失败
      </Snackbar>
    </>
  );
}
