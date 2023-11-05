"use client";

import { Sheet } from "@mui/joy";
import { useEffect, useMemo, useRef, useState } from "react";
import { VideoWithOverlay } from "./video-with-overlay";
import { api } from "~/trpc/react";

// VideoContainer Component
export function VideoContainer() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>(null!);

  const { data, fetchNextPage } =
    api.videoRecommender.recommend.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const mountedVideos = useMemo(
    () => data?.pages.flatMap((page) => page.videos) ?? [],
    [data],
  );

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
    <Sheet
      ref={containerRef}
      sx={{
        scrollSnapType: "y mandatory",
        alignItems: "center",
        overflowY: "scroll",
        // Hide scrollbar
        "::-webkit-scrollbar": {
          display: "none",
        },
        display: "flex",
        flexDirection: "column",
      }}
      data-joy-color-scheme="dark"
    >
      {mountedVideos.map((video) => (
        <VideoWithOverlay
          key={video.id}
          video={video}
          active={video.id === activeVideoId}
        />
      ))}
    </Sheet>
  );
}
