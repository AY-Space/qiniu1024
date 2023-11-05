import { VideoGrid } from "~/app/_components/video-tab-panel";
import { api } from "~/trpc/react";

export const LikeTabPanel = ({ userId }: { userId: string }) => {
  const { data: videos } = api.video.userId.useQuery({ userId });
  console.log(videos);
  return <VideoGrid videos={videos ?? []} />;
};
