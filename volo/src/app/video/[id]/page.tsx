import { Stack } from "@mui/joy";
import { VideoContainer } from "./_components/video-container";
import { db } from "~/server/db";

export default async function Video({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const videos = (
    await db.video.findMany({
      select: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        id: true,
        title: true,
        coverUrl: true,
        views: true,
        createdAt: true,
        description: true,
        url: true,
      },
      take: 50,
    })
  ).map(({ _count, ...rest }) => ({
    ..._count,
    ...rest,
    dislikes: 0,
  }));

  return (
    <Stack
      sx={{
        height: "calc(100vh - var(--volo-app-bar-height))",
        overflow: "hidden",
      }}
    >
      <VideoContainer videos={videos} />
    </Stack>
  );
}
