"use client";
import {
  ModalDialog,
  Modal,
  Button,
  DialogContent,
  DialogTitle,
  DialogActions,
  Input,
  Snackbar,
} from "@mui/joy";
import { useState } from "react";
import { api } from "~/trpc/react";

export function CreateCollectionModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [error, setError] = useState(false);

  const createCollection = api.collection.create.useMutation({
    onSuccess: async () => {
      await utils.collection.myCollections.invalidate();
      setName("");
      onClose();
    },
    onError: () => setError(true),
  });

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <ModalDialog>
          <DialogTitle>创建收藏夹</DialogTitle>
          <DialogContent
            sx={{
              pt: 2,
            }}
          >
            <Input
              size="lg"
              placeholder="请输入收藏夹名"
              onChange={(event) => setName(event.target.value)}
              value={name}
              error={createCollection.isError}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color="success"
              onClick={() => {
                createCollection.mutate({ name });
              }}
            >
              确认
            </Button>
            <Button variant="plain" color="neutral" onClick={onClose}>
              取消
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      <Snackbar
        variant="solid"
        color="danger"
        autoHideDuration={1600}
        open={error}
        onClose={() => setError(false)}
      >
        创建失败
      </Snackbar>
    </>
  );
}
