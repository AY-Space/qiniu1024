"use client";
import { Delete } from "@mui/icons-material";
import { IconButton, Snackbar, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { VideoGrid } from "~/app/_components/video-grid";
import { api } from "~/trpc/react";
import { type VideoPublic } from "~/types";

export const VideoTabPanel = ({
  videos,
  isSelf,
}: {
  videos: VideoPublic[];
  isSelf: boolean;
}) => {
  const [deleteError, setDeleteError] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const router = useRouter();

  const deleteVideo = api.video.delete.useMutation({
    onSuccess: () => {
      setDeleteSuccess(true);
      router.refresh();
    },
    onError: () => setDeleteError(true),
  });

  return (
    <>
      {videos.length > 0 ? (
        <VideoGrid
          videos={videos}
          Action={
            isSelf
              ? ({ video }) => (
                  <IconButton
                    color="danger"
                    size="sm"
                    variant="soft"
                    onClick={() => {
                      deleteVideo.mutate({ videoId: video.id });
                    }}
                  >
                    <Delete />
                  </IconButton>
                )
              : undefined
          }
        />
      ) : (
        <Typography textAlign="center">无数据</Typography>
      )}
      <Snackbar
        variant="solid"
        color="success"
        autoHideDuration={1600}
        open={deleteSuccess}
        onClose={() => setDeleteSuccess(false)}
      >
        删除成功
      </Snackbar>
      <Snackbar
        variant="solid"
        color="danger"
        autoHideDuration={1600}
        open={deleteError}
        onClose={() => setDeleteError(false)}
      >
        删除失败
      </Snackbar>
    </>
  );
};
