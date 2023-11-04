import { Stack } from "@mui/joy";
import { db } from "~/server/db";
import { VideoContainer } from "./_components/video-container";

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
        tags: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      take: 50,
    })
  ).map(({ _count, ...rest }) => ({
    ..._count,
    ...rest,
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
