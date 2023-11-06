"use client";

import { Pause, PlayArrow, VolumeOff, VolumeUp } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/joy";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { Flex } from "~/app/_components/flex";

interface VideoPlayerProps {
  src: string;
  active: boolean;
  loop?: boolean;
  overlay: ReactNode;
  muted: boolean;
  setMuted: (muted: boolean) => void;
}

export const VideoPlayer = ({
  src,
  active,
  loop,
  overlay,
  muted,
  setMuted,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const [playing, setPlaying] = useState<boolean>(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    const updateDuration = () => {
      setDuration(videoElement.duration ?? 0);
    };

    const handleTimeUpdate = () => {
      setProgress(videoElement.currentTime ?? 0);
    };

    if (videoElement && videoElement.readyState >= 1) {
      updateDuration();
    }

    const handlePause = () => {
      setPlaying(false);
    };

    const handlePlay = () => {
      setPlaying(true);
    };

    videoElement.addEventListener("loadedmetadata", updateDuration);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("pause", handlePause);
    videoElement.addEventListener("play", handlePlay);

    return () => {
      videoElement.removeEventListener("loadedmetadata", updateDuration);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.removeEventListener("play", handlePlay);
    };
  }, []);

  useEffect(() => {
    if (active) {
      videoRef.current.currentTime = 0;
      setProgress(0);
      void videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [active]);

  useEffect(() => {
    videoRef.current.muted = muted;
  }, [muted]);

  const handleVideoClick = async () => {
    const videoPlaying = !videoRef.current.paused;
    if (videoPlaying) {
      videoRef.current.pause();
    } else {
      await videoRef.current.play();
    }
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    videoRef.current.currentTime = newTime;
  };

  // Calculate the percentage of the video that has been played
  const playedPercentage = duration ? (progress / duration) * 100 : 0;

  const progressBarColor = `linear-gradient(to right, rgba(255,255,255,0.8) ${playedPercentage}%, rgba(255,255,255,0.2) ${playedPercentage}%)`;
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
      <Flex
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          p: {
            xs: 2,
            sm: 1,
          },
        }}
        spacing={2}
      >
        <IconButton
          onClick={() => setMuted(!muted)}
          sx={{
            "&": {
              "--Icon-color": "#fff",
            },
            opacity: 0.6,
          }}
          variant="soft"
        >
          {muted ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
        <IconButton
          onClick={handleVideoClick}
          sx={{
            "&": {
              "--Icon-color": "#fff",
            },
            opacity: 0.6,
          }}
          variant="soft"
        >
          {playing ? <Pause /> : <PlayArrow />}
        </IconButton>
      </Flex>
    </Stack>
  );
};
