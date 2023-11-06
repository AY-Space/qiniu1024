import { Stack } from "@mui/joy";
import { db } from "~/server/db";
import { VideoContainer } from "./_components/video-container";
import { notFound } from "next/navigation";
import { getVideos } from "~/server/lib/db/video";

export default async function Video({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const video = await getVideos(db, [id]);
  if (video.length === 0) {
    notFound();
  }
  return (
    <Stack
      sx={{
        height: "calc(100vh - var(--volo-app-bar-height))",
        overflow: "hidden",
      }}
    >
      <VideoContainer initialVideo={video[0]} />
    </Stack>
  );
}
