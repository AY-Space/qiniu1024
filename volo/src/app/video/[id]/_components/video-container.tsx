"use client";

import { Stack } from "@mui/joy";
import { useEffect, useRef, useState } from "react";

// VideoDemo Component
const VideoDemo = ({
  active = false,
  videoId,
}: {
  active?: boolean;
  videoId: number;
}) => {
  return (
    <Stack
      id={`video-${videoId}`}
      justifyContent="center"
      sx={{
        height: "calc(100vh - var(--volo-app-bar-height))",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        backgroundColor: "primary.900",
      }}
    >
      <div className="flex flex-col justify-center bg-slate-800 align-middle">
        <img
          src="https://via.placeholder.com/360x640"
          className={`border-4 ${
            active ? "border-red-500" : "border-slate-500"
          }`}
        />
      </div>
    </Stack>
  );
};

const videos = Array.from({ length: 100 }, (_, i) => i + 1); // static array of videos [1, 2, ..., 100]

// VideoContainer Component
export function VideoContainer() {
  const [mountedVideos, setMountedVideos] = useState(videos.slice(0, 100)); // initially mount the first 5 videos
  const [activeVideoId, setActiveVideoId] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>(null!);

  const bufferSize = 4;

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoId = parseInt(entry.target.id.split("-")[1]!);
          const activeIndex = videos.indexOf(videoId);
          const buffer = activeIndex + bufferSize + 1;

          if (!entry.isIntersecting) return;

          setActiveVideoId(videoId);

          if (buffer <= mountedVideos.length) return;

          // const start = Math.max(0, activeIndex - n);
          const end = Math.min(videos.length, buffer);
          setMountedVideos(videos.slice(0, end));
        });
      },
      {
        threshold: 0.6, // At least 50% should be visible
      },
    );

    // Observe the video elements
    mountedVideos.forEach((videoId) => {
      const videoElement = document.getElementById(`video-${videoId}`);
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
        height: "100%",
        scrollSnapType: "y mandatory",
        alignItems: "center",
        overflowY: "scroll",
      }}
    >
      <Stack>
        {mountedVideos.map((videoId) => (
          <VideoDemo
            key={videoId}
            videoId={videoId}
            active={videoId === activeVideoId}
          />
        ))}
      </Stack>
    </Stack>
  );
}
