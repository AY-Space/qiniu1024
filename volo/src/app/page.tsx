import { db } from "~/server/db";
import { CommentComponent } from "./_components/comment_component";
import { Container, Stack } from "@mui/joy";

export default async function Home() {
  const comments = await db.comment.findMany({
    select: {
      id: true,
      text: true,
      imgUrl: true,
      likes: true,
      dislikes: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    where: { imgUrl: { not: null } },
  });
  return (
    <Container>
      <Stack spacing={4}>
        {comments.map((comment) => (
          <CommentComponent comment={comment} key={comment.id} />
        ))}
      </Stack>
    </Container>
  );
}
