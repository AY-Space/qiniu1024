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
  Sheet,
  Snackbar,
  Stack,
  Textarea,
  Typography,
  styled,
} from "@mui/joy";
import { Upload, VideoFile } from "@mui/icons-material";
import { Flex } from "../_components/flex";
import { useRouter } from "next/navigation";
import {
  coverImageToCenter,
  dataURLtoFile,
  readFileInputEventAsDataURL,
} from "../utils";

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
  const [coverUploading, setCoverUploading] = useState(false);

  const router = useRouter();

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
  const [croppedCoverSrc, setCroppedCoverSrc] = useState<string>();

  const onVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file ?? null);
  };

  const uploadVideoFile = api.video.uploadVideoFile.useMutation();
  const uploadCoverFile = api.video.uploadCoverFile.useMutation();

  const categories = api.tag.categories.useQuery();
  const tags = api.tag.tags.useQuery();

  const onUploadClick = async () => {
    try {
      if (!selectedFile) {
        return;
      }

      const { key: videoKey, token: videoToken } =
        await uploadVideoFile.mutateAsync();
      setProgress(0);
      upload(selectedFile, videoKey, videoToken, {}, {}).subscribe({
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
            videoFileKey: videoKey,
          }));
        },
      });
    } catch {
      setError(true);
    }
  };

  const onSubmit = async () => {
    try {
      const newVideoId = await create.mutateAsync(videoInfo);
      router.push(`/video/${newVideoId}`);
    } catch {
      setError(true);
    }
  };

  const onCoverSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setCoverUploading(true);
      const dataUrl = await readFileInputEventAsDataURL(e);
      const cropped = await coverImageToCenter(dataUrl, 640, 480);
      setCroppedCoverSrc(cropped);

      const coverFile = dataURLtoFile(cropped, "cover.jpg");
      const { key: coverKey, token: coverToken } =
        await uploadCoverFile.mutateAsync();
      await new Promise((resolve, reject) => {
        upload(coverFile, coverKey, coverToken, {}, {}).subscribe({
          error: (error) => {
            reject(error);
          },
          complete: () => {
            resolve(undefined);
          },
        });
      });
      setVideoInfo((prev) => ({
        ...prev,
        coverFileKey: coverKey,
      }));
    } catch {
      setError(true);
    } finally {
      setCoverUploading(false);
    }
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
                    onChange={onVideoFileChange}
                    disabled={progress !== null || uploadVideoFile.isLoading}
                  />
                </Button>
                <Button
                  onClick={onUploadClick}
                  disabled={
                    selectedFile === null ||
                    progress !== null ||
                    uploadVideoFile.isLoading
                  }
                >
                  确认上传
                </Button>
              </Flex>
            </Stack>
            <LinearProgress
              determinate={uploadVideoFile.isSuccess}
              value={progress ?? 0}
            />
          </Stack>
        </Card>
        <Card>
          <Typography level="title-lg">视频信息</Typography>
          <Divider inset="none" />
          <CardContent>
            <Stack spacing={1.5}>
              <FormControl>
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
              <FormControl>
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
              <Stack spacing={1}>
                <FormControl>
                  <FormLabel>封面</FormLabel>
                </FormControl>
                <Stack alignItems="center" spacing={1}>
                  <Sheet
                    variant="soft"
                    sx={{
                      background: croppedCoverSrc && `url(${croppedCoverSrc})`,
                      width: 320,
                      height: 240,
                      borderRadius: "lg",
                      backgroundSize: "cover",
                    }}
                  />
                  <Button
                    component="label"
                    tabIndex={-1}
                    variant="outlined"
                    color="neutral"
                    startDecorator={<Upload />}
                    sx={{
                      whiteSpace: "nowrap",
                    }}
                    loading={coverUploading}
                  >
                    请选择文件
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={onCoverSelected}
                    />
                  </Button>
                </Stack>
              </Stack>
              <Stack
                spacing={1.5}
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                sx={{
                  width: "100%",
                  "& > *": {
                    flex: 1,
                  },
                }}
              >
                <FormControl>
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
                <FormControl>
                  <FormLabel>标签</FormLabel>
                  <Autocomplete
                    multiple
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
              </Stack>
            </Stack>
            <CardActions>
              <Button
                variant="solid"
                disabled={
                  videoInfo.videoFileKey === "" ||
                  videoInfo.title === "" ||
                  videoInfo.category === "" ||
                  videoInfo.tags.length === 0 ||
                  croppedCoverSrc === undefined
                }
                onClick={onSubmit}
                loading={create.isLoading}
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
        color="danger"
        autoHideDuration={1600}
        open={error}
        onClose={() => setError(false)}
      >
        上传失败
      </Snackbar>
    </Container>
  );
}
