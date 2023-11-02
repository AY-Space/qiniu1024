import { Stack } from "@mui/joy";
import { useEffect, useRef } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

/**
 * Video.js options
 *
 * https://videojs.com/guides/options/
 */
export interface VideoJSOptions {
  controls: boolean;
  sources: {
    src: string;
    /**
     * The MIME type of the media resource.
     */
    type: string;
  }[];
  loop: boolean;
  fluid: boolean;
  fill: boolean;
}

export interface VideoJSProps {
  options: VideoJSOptions;
  playing: boolean;
  onReady?: (player: Player) => void;
}

export const VideoJS = ({ options, onReady, playing }: VideoJSProps) => {
  const videoRef = useRef<HTMLDivElement>(null!);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = videojs(videoElement, options, () => {
        onReady && onReady(player);
      });
      player.autoplay(playing);
      playerRef.current = player;
    } else {
      const player = playerRef.current;

      player.src(options.sources);
      if (playing) {
        void player.play();
      } else {
        void player.pause();
      }
    }
  }, [onReady, options, videoRef, playing]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <Stack
      ref={videoRef}
      data-vjs-player
      sx={{
        height: "100%",
      }}
    />
  );
};
