"use client";

import { Stack, useColorScheme } from "@mui/joy";
import { useState, useEffect, useRef, type ReactNode } from "react";

interface VideoPlayerProps {
  src: string;
  playing: boolean;
  loop?: boolean;
  overlay: ReactNode;
}

const VideoPlayer = ({ src, playing, loop, overlay }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    const updateDuration = () => {
      setDuration(videoElement?.duration ?? 0);
    };

    const handleTimeUpdate = () => {
      setProgress(videoElement?.currentTime ?? 0);
    };

    if (videoElement && videoElement.readyState >= 1) {
      updateDuration();
    }

    videoElement?.addEventListener("loadedmetadata", updateDuration);
    videoElement?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoElement?.removeEventListener("loadedmetadata", updateDuration);
      videoElement?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    setIsPlaying(playing);
    if (videoRef.current) {
      if (playing) {
        videoRef.current.currentTime = 0;
        setProgress(0);
        void videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [playing]);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        void videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    setProgress(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Calculate the percentage of the video that has been played
  const playedPercentage = duration ? (progress / duration) * 100 : 0;

  const colorScheme = useColorScheme();
  const progressBarColor =
    colorScheme.colorScheme === "dark"
      ? `linear-gradient(to right, rgba(255,255,255,0.8) ${playedPercentage}%, rgba(255,255,255,0.2) ${playedPercentage}%)`
      : `linear-gradient(to right, rgba(0,0,0,0.5) ${playedPercentage}%, rgba(0,0,0,0.2) ${playedPercentage}%)`;

  const overlayGradient =
    "linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))";
  return (
    <Stack
      sx={{
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      <Stack
        flex={1}
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
      >
        <video
          ref={videoRef}
          onClick={handleVideoClick}
          className="h-full w-full rounded-lg object-contain"
          loop={loop}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Stack>
      <Stack
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: overlayGradient,
        }}
      >
        {overlay}
        <input
          type="range"
          min="0"
          max={duration || 1}
          value={progress}
          onChange={handleProgressChange}
          className="range-thumb:appearance-nonet h-1 w-full cursor-pointer appearance-none rounded-sm bg-transparent"
          style={{
            background: progressBarColor,
          }}
        />
      </Stack>
    </Stack>
  );
};

export default VideoPlayer;
