"use client";
import {
  Alert,
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Input,
  LinearProgress,
  Modal,
  ModalDialog,
  Stack,
  Textarea,
} from "@mui/joy";
import { getBilibiliImageUrl } from "~/app/utils";
import { type UserDetailedPublic } from "~/types";
import { Upload } from "@mui/icons-material";
import { useState } from "react";
import { VisuallyHiddenInput } from "~/app/upload/page";
import { api } from "~/trpc/react";
import { upload } from "qiniu-js";
import { useRouter } from "next/navigation";

const cropImageToCenterSquare = (
  src: string,
  size: number,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create an Image object
    const image = new Image();
    image.onload = () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      // Get the context of the canvas
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Unable to get canvas context");
        return;
      }

      // Calculate the coordinates to draw the central square
      const minDimension = Math.min(image.width, image.height);
      const offsetX = (image.width - minDimension) / 2;
      const offsetY = (image.height - minDimension) / 2;

      // Draw the central square of the image onto the canvas
      ctx.drawImage(
        image,
        offsetX,
        offsetY,
        minDimension,
        minDimension,
        0,
        0,
        size,
        size,
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

const dataURLtoFile = (dataurl: string, filename: string): File => {
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

export function EditDialog({
  user,
  open,
  onClose,
}: {
  user: UserDetailedPublic;
  open: boolean;
  onClose: () => void;
}) {
  const [croppedImg, setCroppedImg] = useState<string>();
  const router = useRouter();
  const utils = api.useUtils();

  const uploadAvatar = api.user.uploadAvatar.useMutation();
  const updateUser = api.user.update.useMutation({
    onSuccess: () => {
      void utils.user.currentUser.invalidate();
      router.refresh();
    },
  });

  const [userInfo, setUserInfo] = useState({
    name: user.name ?? "",
    bio: user.bio ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error>();

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const imageSrc = e.target?.result;
        if (typeof imageSrc !== "string") {
          return;
        }
        const croppedImg = await cropImageToCenterSquare(imageSrc, 256);
        setCroppedImg(croppedImg);
      };
      fileReader.readAsDataURL(event.target.files[0]!);
    }
  };

  const onSubmit = async () => {
    try {
      setUploading(true);
      setError(undefined);
      let avatarFileKey: string | undefined;
      if (croppedImg) {
        const { key, token } = await uploadAvatar.mutateAsync();
        const file = dataURLtoFile(croppedImg, key);
        await new Promise((resolve, reject) =>
          upload(file, key, token, {}, {}).subscribe({
            complete: () => {
              resolve(undefined);
            },
            error: (error) => {
              reject(error);
            },
          }),
        );
        avatarFileKey = key;
      }
      await updateUser.mutateAsync({ ...userInfo, avatarFileKey });
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>修改信息</DialogTitle>
        <Divider />
        <DialogContent>
          {uploading && (
            <LinearProgress
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
              }}
            />
          )}
          <Stack spacing={1}>
            <Stack alignItems="center" gap={1}>
              <Avatar
                src={
                  croppedImg ??
                  (user.avatarUrl
                    ? getBilibiliImageUrl(user.avatarUrl)
                    : undefined)
                }
                sx={{
                  "&": {
                    "--Avatar-size": "128px",
                  },
                }}
              />
              <Button
                component="label"
                role={undefined}
                tabIndex={-1}
                variant="outlined"
                color="neutral"
                startDecorator={<Upload />}
              >
                选择头像
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                />
              </Button>
            </Stack>
            <FormControl>
              <FormLabel>名称</FormLabel>
              <Input
                value={userInfo.name}
                onChange={(event) =>
                  setUserInfo({ ...userInfo, name: event.target.value })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>简介</FormLabel>
              <Textarea
                minRows={2}
                value={userInfo.bio}
                onChange={(event) =>
                  setUserInfo({ ...userInfo, bio: event.target.value })
                }
              />
            </FormControl>
            {error && <Alert color="danger">{error.message}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onSubmit}>确认</Button>
          <Button variant="plain" onClick={onClose}>
            取消
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
