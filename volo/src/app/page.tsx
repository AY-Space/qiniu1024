import { db } from "~/server/db";
import CommentComponent from "./_components/comment";

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
  });
  return comments.map((comment) => {
    <CommentComponent comment={comment} />;
  });
}
