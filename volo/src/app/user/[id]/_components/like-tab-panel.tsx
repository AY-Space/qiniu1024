import { Alert, CircularProgress, Stack, Typography } from "@mui/joy";
import { VideoGrid } from "~/app/_components/video-grid";
import { api } from "~/trpc/react";

export const LikeTabPanel = ({ userId }: { userId: string }) => {
  const {
    data: videos,
    error,
    isLoading,
  } = api.video.likeByUserId.useQuery({ userId });

  return (
    <Stack>
      {error && <Alert color="danger">加载失败</Alert>}
      {isLoading && (
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      )}
      {videos != undefined && videos.length > 0 ? (
        <VideoGrid videos={videos} />
      ) : (
        isLoading && <Typography textAlign="center">无数据</Typography>
      )}
    </Stack>
  );
};
