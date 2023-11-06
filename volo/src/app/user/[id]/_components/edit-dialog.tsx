"use client";
import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Stack,
  Textarea,
} from "@mui/joy";
import { getBilibiliImageUrl } from "~/app/utils";
import { type UserDetailedPublic } from "~/types";
import { Upload } from "@mui/icons-material";
import { useRef, useState } from "react";
import { VisuallyHiddenInput } from "~/app/upload/page";
import Cropper from "cropperjs";

export function EditDialog({
  user,
  open,
  onClose,
}: {
  user: UserDetailedPublic;
  open: boolean;
  onClose: () => void;
}) {
  const [imageSrc, setImageSrc] = useState<string>();
  const [croppedImg, setCroppedImg] = useState<string>();
  const imageElement = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper>();
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      console.log("选择了");
      console.log(imageSrc, croppedImg, user.avatarUrl);

      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setImageSrc(e.target?.result as string);
        if (imageElement.current) {
          cropperRef.current = new Cropper(imageElement.current, {
            aspectRatio: 1,
            zoomable: false,
            scalable: false,
            crop: () => {
              const canvas = cropperRef.current?.getCroppedCanvas({
                maxWidth: 512,
                maxHeight: 512,
              });
              setCroppedImg(canvas?.toDataURL("image/png"));
            },
          });
        }
      };
      fileReader.readAsDataURL(event.target.files[0]!);
    }
  };

  const uploadImage = () => {
    // This function should handle the actual upload process
    // For this example, it just logs the cropped image data URL to the console
    if (croppedImg) {
      console.log("Uploading", croppedImg);
      // TODO: Upload logic here
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>修改信息</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack>
            <Stack alignItems="center" gap={1}>
              <Avatar
                src={
                  croppedImg ?? imageSrc ?? user.avatarUrl
                    ? getBilibiliImageUrl(user.avatarUrl!)
                    : undefined
                }
                sx={{
                  "&": {
                    "--Avatar-size": "72px",
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
              <Input />
            </FormControl>
            <FormControl>
              <FormLabel>简介</FormLabel>
              <Textarea minRows={2} />
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>确认</Button>
          <Button variant="plain" onClick={onClose}>
            取消
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
