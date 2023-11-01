// CommentComponent.joy

import { Avatar, Stack, Typography } from "@mui/joy";
import Image from "next/image";
import { type Comment, type User } from "@prisma/client";

export default function CommentComponent({
  comment,
}: {
  comment: Comment & {
    author: Pick<User, "id" | "name" | "avatarUrl">;
  };
}) {
  console.log(comment.authorId);

  return (
    <Stack>
      <Stack flexDirection="row" alignItems="flex-start" margin={10}>
        {comment.author.avatarUrl && (
          <Avatar
            src={comment.author.avatarUrl}
            // width={50}
            // height={50}
            // borderRadius={25}
            // marginRight={10}
          />
        )}
        <Stack flex={1}>
          <Typography fontSize={16} fontWeight="bold">
            {comment.createdAt.toISOString()}
          </Typography>
          <Typography fontSize={14}>{comment.text}</Typography>
          {comment.imgUrl && (
            <Image
              src={comment.imgUrl}
              alt={comment.imgUrl}
              width={100}
              height={200}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
