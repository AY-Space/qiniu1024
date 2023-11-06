"use client";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog,
} from "@mui/joy";
import { useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";

export function CropDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [crop, setCrop] = useState<Crop>();
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>裁剪图片</DialogTitle>
        <Divider />
        <DialogContent>
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)}></ReactCrop>
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
