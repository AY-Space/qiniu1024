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
import {
  coverImageToCenter,
  getBilibiliImageUrl,
  readFileInputEventAsDataURL,
} from "~/app/utils";
import { type UserDetailedPublic } from "~/types";
import { Upload } from "@mui/icons-material";
import { useState } from "react";
import { VisuallyHiddenInput } from "~/app/upload/page";
import { api } from "~/trpc/react";
import { upload } from "qiniu-js";
import { useRouter } from "next/navigation";

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

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageSrc = await readFileInputEventAsDataURL(event);
    const croppedImg = await coverImageToCenter(imageSrc, 256, 256);
    setCroppedImg(croppedImg);
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
