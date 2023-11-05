import { Stack } from "@mui/joy";
import { db } from "~/server/db";
import { VideoContainer } from "./_components/video-container";

export default function Video({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  return (
    <Stack
      sx={{
        height: "calc(100vh - var(--volo-app-bar-height))",
        overflow: "hidden",
      }}
    >
      <VideoContainer />
    </Stack>
  );
}
