export const getBilibiliImageUrl = (srcUrl: string) =>
  `http://localhost:3080/bilibili-image?${new URLSearchParams({
    url: srcUrl.replace("http://", "https://"),
  }).toString()}`;
