import { type Theme, useTheme } from "@mui/joy";
import { useMediaQuery } from "usehooks-ts";

export const getBilibiliImageUrl = (srcUrl: string) =>
  `http://localhost:3080/bilibili-image?${new URLSearchParams({
    url: srcUrl.replace("http://", "https://"),
  }).toString()}`;

export const useBreakpointUp = (
  breakpoint: Theme["breakpoints"]["keys"][number],
) => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up(breakpoint));
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
