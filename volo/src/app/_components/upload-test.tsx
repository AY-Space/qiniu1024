"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { upload } from "qiniu-js";
import { Button, CircularProgress, Stack } from "@mui/joy";

export const UploadTest = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file ?? null);
  };

  const getUploadToken = api.video.getVideoUploadParameters.useMutation();

  const onUploadClick = async () => {
    if (selectedFile) {
      const { key, token } = await getUploadToken.mutateAsync();
      upload(selectedFile, key, token, {}, {}).subscribe({
        next: (res) => {
          setProgress(res.total.percent);
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          setProgress(null);

          console.log("complete");
        },
      });
    }
  };

  return (
    <Stack alignItems="center">
      <input type="file" onChange={onFileChange} />
      <Button
        onClick={onUploadClick}
        variant="solid"
        size="lg"
        endDecorator={
          progress !== null && <CircularProgress determinate value={progress} />
        }
        disabled={selectedFile === null || progress !== null}
      >
        Upload
      </Button>
    </Stack>
  );
};
