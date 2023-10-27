import { Container } from "@mui/joy";
import { UserHome } from "./_components/user-home";
import { db } from "~/server/db";

export default async function User({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const user = await db.user.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      bio: true,
      bannerUrl: true,
      videos: {
        select: {
          id: true,
          title: true,
          coverUrl: true,
          views: true,
        },
      },

      _count: {
        select: {
          followers: true,
          followings: true,
        },
      },
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const { _count, videos, ...rest } = user;

  return (
    <Container>
      <UserHome
        user={{
          ...rest,
          ..._count,
        }}
        uploadedVideos={videos}
      />
    </Container>
  );
}
