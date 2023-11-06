export const getBilibiliImageUrl = (srcUrl: string) => {
  if (!srcUrl.includes("hdslb.com")) {
    return srcUrl;
  }
  return `http://localhost:3080/bilibili-image?${new URLSearchParams({
    url: srcUrl.replace("http://", "https://"),
  }).toString()}`;
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

export const coverImageToCenter = async (
  src: string,
  width: number,
  height: number,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create an Image object
    const image = new Image();
    image.onload = () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      // Get the context of the canvas
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Unable to get canvas context");
        return;
      }

      // Calculate the scale and position to cover the canvas
      const scale = Math.max(
        canvas.width / image.width,
        canvas.height / image.height,
      );
      const offsetX = (canvas.width - image.width * scale) / 2;
      const offsetY = (canvas.height - image.height * scale) / 2;

      // Clear the canvas and draw the image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        offsetX,
        offsetY,
        image.width * scale,
        image.height * scale,
      );

      // Convert the canvas to a data URL and resolve the promise
      const dataUrl = canvas.toDataURL();
      resolve(dataUrl);
    };
    image.onerror = (error) => {
      reject("Image loading error: " + String(error));
    };

    // Set crossOrigin to anonymous to prevent CORS-related issues
    image.crossOrigin = "anonymous";
    image.src = src;
  });
};
