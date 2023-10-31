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
  const videos = await db.video.findMany();
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
