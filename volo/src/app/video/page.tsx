import { Stack } from "@mui/joy";
import { VideoContainer } from "./[id]/_components/video-container";

const Video = () => {
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
};

export default Video;
