"use client";

import { Flex } from "~/app/_components/flex";
import { type VideoDetailedPublic } from "~/types";
import { VideoOverlay } from "./video-overlay";
import { VideoActions } from "./video-actions";
import { VideoPlayer } from "./video-player";

export interface VideoWithOverlayProps {
  video: VideoDetailedPublic;
  state: "active" | "mounted" | "unmounted";
  currentUserId?: string;
  muted: boolean;
  setMuted: (muted: boolean) => void;
}

export const VideoWithOverlay = ({
  video,
  state,
  muted,
  setMuted,
}: VideoWithOverlayProps) => {
  return (
    <Flex
      id={`volo-video-${video.id}`}
      justifyContent="center"
      alignItems="center"
      sx={(theme) => ({
        minHeight: "calc(100vh - var(--volo-app-bar-height))",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        position: "relative",
        width: "100%",
        pb: 1,
        [theme.breakpoints.up("sm")]: {
          p: 2,
        },
      })}
      spacing={2}
    >
      {(state === "active" || state === "mounted") && (
        <>
          <VideoPlayer
            active={state === "active"}
            src={video.url}
            loop
            overlay={<VideoOverlay video={video} />}
            muted={muted}
            setMuted={setMuted}
            videoId={video.id}
          />
          <VideoActions videoId={video.id} state={state} />
        </>
      )}
    </Flex>
  );
};
