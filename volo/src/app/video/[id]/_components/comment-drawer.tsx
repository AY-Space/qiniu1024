"use client";

import {
  Drawer,
  ModalClose,
  Stack,
  DialogTitle,
  Divider,
  Sheet,
} from "@mui/joy";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { CommentList } from "./comment-list";
import { CommentForm } from "./comment-form";

export interface CommentDrawerProps {
  videoId: string;
  open: boolean;
  onClose: () => void;
}

export const CommentDrawer = ({
  videoId,
  open,
  onClose,
}: CommentDrawerProps) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      slotProps={{
        content: {
          sx: {
            width: 420,
            maxWidth: "90vw",
          },
        },
      }}
    >
      {open && (
        <Stack
          sx={{
            height: "100vh",
          }}
        >
          <Stack>
            <ModalClose />

            <DialogTitle
              sx={{
                p: 1.5,
              }}
            >
              评论
            </DialogTitle>
            <Divider />
          </Stack>
          <Stack
            sx={{
              p: 2,
              flex: 1,
              overflowY: "auto",
            }}
          >
            <CommentList videoId={videoId} />
          </Stack>
          <Sheet>
            <CommentForm videoId={videoId} />
          </Sheet>
        </Stack>
      )}
    </Drawer>
  );
};
