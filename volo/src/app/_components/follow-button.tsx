"use client";

import { Button } from "@mui/joy";
import { api } from "~/trpc/react";

export function FollowButton({ followUserId }: { followUserId: string }) {
  return (
    <Button
      size="sm"
      variant="soft"
      sx={{
        opacity: 0.6,
      }}
    >
      关注
    </Button>
  );
}
