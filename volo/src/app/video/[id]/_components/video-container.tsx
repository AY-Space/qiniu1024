"use client";

import { Alert, Stack } from "@mui/joy";
import { useEffect, useMemo, useRef, useState } from "react";
import { VideoWithOverlay } from "./video-with-overlay";
import { api } from "~/trpc/react";
import { type VideoDetailedPublic } from "~/types";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "~/app/store";

export function VideoContainer({
  initialVideo: initialVideo,
}: {
  initialVideo?: VideoDetailedPublic;
}) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>(null!);
  const [muted, setMuted] = useState(false);

  const pageSize = 5;

  const [recommendationType, category] = useStore(
    useShallow((state) => [state.recommendationType, state.category]),
  );

  const { data, fetchNextPage, isLoading } =
    api.videoRecommender.recommendation.useInfiniteQuery(
      {
        recommendationType: recommendationType,
        limit: pageSize,
        category: category ?? undefined,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchInterval: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
    );

  const videos = useMemo(() => {
    const uniqueVideos = new Map<string, VideoDetailedPublic>();

    // If there is an initial video, add it first
    if (initialVideo) {
      uniqueVideos.set(initialVideo.id, initialVideo);
    }

    // Add videos from each page, ensuring they are unique by id and preserving the insertion order
    data?.pages.forEach((page) => {
      page.videos.forEach((video) => {
        if (!uniqueVideos.has(video.id)) {
          uniqueVideos.set(video.id, video);
        }
      });
    });

    // Convert the Map values back into an array, which will preserve the insertion order
    return Array.from(uniqueVideos.values());
  }, [initialVideo, data]);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const activeEntries = entries.filter((entry) => entry.isIntersecting);

        // Get the last 5 videos to compare with the active video
        const lastFiveVideos = videos.slice(-pageSize);

        // Fetch the next page if we're observing a video that is within the last five
        if (
          activeEntries.some((entry) =>
            lastFiveVideos.some(
              (video) => video.id === entry.target.id.split("-")[2],
            ),
          )
        ) {
          void fetchNextPage();
        }

        activeEntries.forEach((entry) => {
          const videoId = entry.target.id.split("-")[2];
          if (!videoId) throw new Error("videoId is null");
          setActiveVideoId(videoId);
        });
      },
      {
        threshold: 0.6, // At least 60% should be visible
      },
    );

    videos.forEach(({ id }) => {
      const videoElement = document.getElementById(`volo-video-${id}`);
      if (videoElement) observer.current.observe(videoElement);
    });

    return () => {
      observer.current.disconnect();
    };
  }, [videos, fetchNextPage]);

  // Calculate the index of the current active video
  const activeVideoIndex = videos.findIndex(({ id }) => id === activeVideoId);
  // Calculate the page of the current active video
  const activeVideoPage = Math.floor(activeVideoIndex / pageSize);

  if (videos.length === 0 && !isLoading) {
    return (
      <Stack p={2}>
        <Alert color="warning" size="lg">
          没有更多视频了
        </Alert>
      </Stack>
    );
  }

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
        backgroundColor: "black",
      }}
      data-joy-color-scheme="dark"
    >
      {videos.map((video, index) => {
        // Calculate the page of this video
        const videoPage = Math.floor(index / pageSize);
        return (
          <VideoWithOverlay
            key={video.id}
            video={video}
            state={
              videoPage < activeVideoPage
                ? "unmounted"
                : activeVideoId === video.id
                ? "active"
                : "mounted"
            }
            muted={muted}
            setMuted={setMuted}
          />
        );
      })}
    </Stack>
  );
}
