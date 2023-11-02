"use client";
// CommentComponent.joy

import { Avatar, Box, Button, IconButton, Stack, Typography } from "@mui/joy";
import Image from "next/image";
import { type Comment, type User } from "@prisma/client";
import { getBilibiliImageUrl } from "../utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import { CommentPublic } from "../../types";

export function CommentComponent({ comment }: { comment: CommentPublic }) {
  return (
    <Stack direction="row" gap={1}>
      {comment.author.avatarUrl && (
        <Avatar src={getBilibiliImageUrl(comment.author.avatarUrl)} />
      )}
      <Stack spacing={1}>
        <Stack>
          <Typography level="title-sm">{comment.author.name}</Typography>
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
}
