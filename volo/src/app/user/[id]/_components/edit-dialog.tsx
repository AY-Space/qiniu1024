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
import { useState } from "react";
import { VisuallyHiddenInput } from "~/app/upload/page";
import { CropDialog } from "./crop-dialog";

export function EditDialog({
  user,
  open,
  onClose,
}: {
  user: UserDetailedPublic;
  open: boolean;
  onClose: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file ?? null);
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
                  user.avatarUrl
                    ? getBilibiliImageUrl(user.avatarUrl)
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
        <CropDialog
          open={selectedFile !== null}
          onClose={() => setSelectedFile(null)}
        />
      </ModalDialog>
    </Modal>
  );
}
