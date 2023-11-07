"use client";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Typography,
  Link as JoyLink,
} from "@mui/joy";
import Image from "next/image";
import dayjs from "dayjs";
import { Delete, ThumbDown, ThumbUp } from "@mui/icons-material";
import { type CommentPublic } from "../../../../types";
import { Flex } from "~/app/_components/flex";
import Link from "next/link";

export const CommentComponent = ({
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
      {<Avatar src={comment.author.avatarUrl ?? undefined} />}
      <Stack spacing={1} flex={1}>
        <Flex alignItems="center">
          <Stack>
            <Link href={`/user/${comment.author.id}`}>
              <JoyLink
                level="title-md"
                color="neutral"
                component="span"
                sx={{
                  color: "text.primary",
                }}
              >
                {comment.author.name}
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
              src={comment.imgUrl}
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
