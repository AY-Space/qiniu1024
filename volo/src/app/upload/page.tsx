"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { upload } from "qiniu-js";
import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Input,
  LinearProgress,
  Snackbar,
  Stack,
  Textarea,
  Typography,
  styled,
} from "@mui/joy";
import { Upload, VideoFile } from "@mui/icons-material";
import { Flex } from "../_components/flex";
import { useRouter } from "next/navigation";

export const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState(false);

  const [progress, setProgress] = useState<number | null>(null);
  const create = api.video.create.useMutation();
  const [videoInfo, setVideoInfo] = useState<
    Parameters<typeof create.mutate>[0]
  >({
    title: "",
    description: "",
    coverFileKey: "",
    category: "",
    tags: [],
    videoFileKey: "",
  });

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file ?? null);
  };

  const createVideoUploadParameters =
    api.video.createVideoUploadParameters.useMutation();

  const categories = api.tag.categories.useQuery();
  const tags = api.tag.tags.useQuery();

  const router = useRouter();

  const onUploadClick = async () => {
    if (selectedFile) {
      const { key, token } = await createVideoUploadParameters.mutateAsync();
      setProgress(0);
      upload(selectedFile, key, token, {}, {}).subscribe({
        next: (res) => {
          setProgress(res.total.percent);
        },
        error: () => {
          setError(true);
        },
        complete: () => {
          setProgress(100);
          setUploaded(true);

          setVideoInfo((prev) => ({
            ...prev,
            videoFileKey: key,
          }));
        },
      });
    }
  };

  const onSubmit = async () => {
    const newVideoId = await create.mutateAsync(videoInfo);
    router.push(`/video/${newVideoId}`);
  };

  return (
    <Container sx={{ py: 1 }}>
      <Stack gap={1}>
        <Card>
          <Stack display="flex" width="100%" spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <VideoFile />
              <Typography
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flex: 1,
                }}
              >
                {selectedFile?.name ?? "未选择文件"}
              </Typography>
              <Flex
                gap={1}
                direction={{
                  xs: "column",
                  sm: "row",
                }}
              >
                <Button
                  component="label"
                  role={undefined}
                  tabIndex={-1}
                  variant="outlined"
                  color="neutral"
                  startDecorator={<Upload />}
                  sx={{
                    whiteSpace: "nowrap",
                  }}
                >
                  请选择文件
                  <VisuallyHiddenInput
                    type="file"
                    accept="video/*"
                    onChange={onFileChange}
                    disabled={
                      progress !== null || createVideoUploadParameters.isLoading
                    }
                  />
                </Button>
                <Button
                  onClick={onUploadClick}
                  disabled={
                    selectedFile === null ||
                    progress !== null ||
                    createVideoUploadParameters.isLoading
                  }
                >
                  确认上传
                </Button>
              </Flex>
            </Stack>
            <LinearProgress
              determinate={createVideoUploadParameters.isSuccess}
              value={progress ?? 0}
            />
          </Stack>
        </Card>
        <Card>
          <Typography level="title-lg">视频信息</Typography>
          <Divider inset="none" />
          <CardContent
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(80px, 1fr))",
              gap: 1.5,
            }}
          >
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>标题</FormLabel>
              <Input
                value={videoInfo.title}
                onChange={(e) =>
                  setVideoInfo((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>简介</FormLabel>
              <Textarea
                minRows={2}
                value={videoInfo.description}
                onChange={(e) =>
                  setVideoInfo((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl
              sx={(theme) => ({
                [theme.breakpoints.down("sm")]: {
                  gridColumn: "1/-1",
                },
              })}
            >
              <FormLabel>分类</FormLabel>
              <Autocomplete
                options={categories.data ?? []}
                error={categories.isError}
                loading={categories.isLoading}
                onChange={(_, value) => {
                  setVideoInfo((prev) => ({
                    ...prev,
                    category: value ?? "",
                  }));
                }}
                freeSolo
              />
            </FormControl>
            <FormControl
              sx={(theme) => ({
                [theme.breakpoints.down("sm")]: {
                  gridColumn: "1/-1",
                },
              })}
            >
              <FormLabel>标签</FormLabel>
              <Autocomplete
                multiple
                sx={(theme) => ({
                  [theme.breakpoints.down("sm")]: {
                    gridColumn: "1/-1",
                  },
                })}
                options={tags.data ?? []}
                error={tags.isError}
                loading={tags.isLoading}
                onChange={(_, value) => {
                  setVideoInfo((prev) => ({
                    ...prev,
                    tags: value,
                  }));
                }}
                freeSolo
              />
            </FormControl>
            <CardActions sx={{ gridColumn: "1/-1" }}>
              <Button
                variant="solid"
                disabled={
                  videoInfo.videoFileKey === "" ||
                  videoInfo.title === "" ||
                  videoInfo.category === "" ||
                  videoInfo.tags.length === 0
                }
                onClick={onSubmit}
              >
                立即投稿
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </Stack>
      <Snackbar
        variant="solid"
        color="success"
        autoHideDuration={1600}
        open={uploaded}
        onClose={() => setUploaded(false)}
      >
        已上传
      </Snackbar>
      <Snackbar
        variant="solid"
        color="warning"
        autoHideDuration={1600}
        open={error}
        onClose={() => setError(false)}
      >
        上传失败
      </Snackbar>
    </Container>
  );
}
