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

export const readFileInputEventAsDataURL = (
  event: React.ChangeEvent<HTMLInputElement>,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const file = event.target.files?.[0];
    if (!file) {
      reject("No file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result !== "string") {
        reject("Unable to read file");
        return;
      }
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

export const dataURLtoFile = (dataurl: string, filename: string): File => {
  // Split the data URL at the comma to get the base64 encoded data
  const arr = dataurl.split(",");
  if (arr.length !== 2) {
    throw new Error("Invalid data URL");
  }
  // Match the content type from the Data URL
  const mime = arr[0]!.match(/:(.*?);/)?.[1];
  // Decode the base64 data
  const bstr = atob(arr[1]!);
  let n = bstr.length;
  // Create a Uint8Array with the size of the decoded data
  const u8arr = new Uint8Array(n);

  // Populate the array with the decoded data
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  // Create a blob from the Uint8Array
  const blob = new Blob([u8arr], { type: mime });
  // Return a new File object
  return new File([blob], filename, { type: mime });
};
