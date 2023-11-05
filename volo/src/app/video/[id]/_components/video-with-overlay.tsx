"use client";

import { Flex } from "~/app/_components/flex";
import { type VideoDetailedPublic } from "~/types";
import VideoPlayer from "./video-player";
import { VideoOverlay } from "./video-overlay";
import { VideoActions } from "./video-actions";

export interface VideoWithOverlayProps {
  video: VideoDetailedPublic;
  state: "active" | "mounted" | "unmounted";
  currentUserId?: string;
}

export const VideoWithOverlay = ({ video, state }: VideoWithOverlayProps) => {
  return (
    <Flex
      id={`volo-video-${video.id}`}
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "calc(100vh - var(--volo-app-bar-height))",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        position: "relative",
        width: "100%",
        p: 2,
      }}
      spacing={2}
    >
      {(state === "active" || state === "mounted") && (
        <>
          <VideoPlayer
            playing={state === "active"}
            src={video.url}
            loop
            overlay={<VideoOverlay video={video} />}
          />
          <VideoActions
            comments={video.comments}
            likes={video.likes}
            videoId={video.id}
            active={state === "active"}
            variant="side"
          />
        </>
      )}
    </Flex>
  );
};
