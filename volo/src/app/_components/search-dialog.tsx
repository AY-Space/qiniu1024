"use client";
import {
  DialogContent,
  DialogTitle,
  Divider,
  Input,
  Modal,
  ModalDialog,
  Typography,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import { api } from "~/trpc/react";
import { VideoGrid } from "./video-grid";

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: videos } = api.video.likeByUserId.useQuery({
    userId: "clojxwar70004zah0ala3k78l",
  });

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog size="lg">
        <DialogTitle>
          <Input
            fullWidth
            size="lg"
            placeholder="请输入关键词"
            startDecorator={<SearchIcon />}
          ></Input>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {videos != undefined ? (
            <VideoGrid videos={videos} />
          ) : (
            <Typography textAlign="center">无数据</Typography>
          )}
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}
