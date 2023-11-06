import { type Theme, useTheme } from "@mui/joy";
import { useMediaQuery } from "usehooks-ts";

export const getBilibiliImageUrl = (srcUrl: string) => {
  if (!srcUrl.includes("hdslb.com")) {
    return srcUrl;
  }
  return `http://localhost:3080/bilibili-image?${new URLSearchParams({
    url: srcUrl.replace("http://", "https://"),
  }).toString()}`;
};

export const useBreakpointUp = (
  breakpoint: Theme["breakpoints"]["keys"][number],
) => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up(breakpoint));
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(num >= 10000 ? 0 : 1) + "K";
  } else {
    return num.toString();
  }
};
