"use client";

import { Stack } from "@mui/joy";
import { type Video } from "@prisma/client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getBilibiliImageUrl } from "~/app/utils";

// VideoDemo Component
const VideoDemo = ({ active, video }: { active: boolean; video: Video }) => {
  return (
    <Stack
      id={`volo-video-${video.id}`}
      justifyContent="center"
      sx={{
        height: "calc(100vh - var(--volo-app-bar-height))",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        backgroundColor: "primary.900",
      }}
    >
      <div className="flex flex-col justify-center bg-slate-800 align-middle">
        <Image
          alt="video cover"
          src={getBilibiliImageUrl(video.coverUrl)}
          width={320}
          height={200}
          className={`border-4 ${
            active ? "border-red-500" : "border-slate-500"
          }`}
        />
      </div>
      <div>{JSON.stringify(video, null, 2)}</div>
    </Stack>
  );
};

// VideoContainer Component
export function VideoContainer({ videos }: { videos: Video[] }) {
  const [mountedVideos, setMountedVideos] = useState(videos.slice(0, 10)); // initially mount the first 5 videos
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
        height: "100%",
        scrollSnapType: "y mandatory",
        alignItems: "center",
        overflowY: "scroll",
      }}
    >
      <Stack>
        {mountedVideos.map((video) => (
          <VideoDemo
            key={video.id}
            video={video}
            active={video.id === activeVideoId}
          />
        ))}
      </Stack>
    </Stack>
  );
}
