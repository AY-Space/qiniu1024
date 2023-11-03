"use client";
import {
  Typography,
  ModalDialog,
  Modal,
  Button,
  DialogContent,
  Divider,
  DialogTitle,
  DialogActions,
  Input,
} from "@mui/joy";
import { type SetStateAction } from "react";

export function CreateCollectionModal({
  showCreateCollection,
  setShowCreateCollection,
}: {
  showCreateCollection: boolean;
  setShowCreateCollection: (value: SetStateAction<boolean>) => void;
}) {
  return (
    <Modal
      open={showCreateCollection}
      onClose={() => setShowCreateCollection(false)}
    >
      <ModalDialog>
        <DialogTitle>
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            创建收藏夹
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Input size="lg" placeholder="请输入收藏夹名" />
        </DialogContent>
        <DialogActions>
          <Button
            variant="solid"
            color="success"
            onClick={() => setShowCreateCollection(false)}
          >
            确认
          </Button>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => setShowCreateCollection(false)}
          >
            取消
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
