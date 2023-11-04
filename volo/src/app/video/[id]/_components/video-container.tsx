"use client";

import { Stack } from "@mui/joy";
import { useEffect, useRef, useState } from "react";
import { VideoWithOverlay } from "./video-with-overlay";
import { type VideoDetailedPublic } from "~/types";

// VideoContainer Component
export function VideoContainer({ videos }: { videos: VideoDetailedPublic[] }) {
  const [mountedVideos, setMountedVideos] = useState(videos.slice(0, 10));
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>(null!);

  // const bufferSize = 4;

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoId = entry.target.id.split("-")[2];
          if (!videoId) throw new Error("videoId is null");
          // const buffer = activeIndex + bufferSize + 1;

          if (!entry.isIntersecting) return;

          setActiveVideoId(videoId);

          // if (buffer <= mountedVideos.length) return;

          // const start = Math.max(0, activeIndex - n);
          // const end = Math.min(videos.length, buffer);
          // setMountedVideos(videos.slice(0, end));
        });
      },
      {
        threshold: 0.6, // At least 50% should be visible
      },
    );

    // Observe the video elements
    mountedVideos.forEach(({ id }) => {
      const videoElement = document.getElementById(`volo-video-${id}`);
      if (videoElement) observer.current.observe(videoElement);
    });

    return () => {
      observer.current.disconnect();
    };
  }, [mountedVideos]);

  return (
    <Stack
      ref={containerRef}
      sx={{
        scrollSnapType: "y mandatory",
        alignItems: "center",
        overflowY: "scroll",
        // Hide scrollbar
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {mountedVideos.map((video) => (
        <VideoWithOverlay
          key={video.id}
          video={video}
          active={video.id === activeVideoId}
        />
      ))}
      x
    </Stack>
  );
}
