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
  Stack,
  Textarea,
  Typography,
  styled,
} from "@mui/joy";
import { Upload, VideoFile } from "@mui/icons-material";
import { Flex } from "../_components/flex";

const VisuallyHiddenInput = styled("input")`
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

export default function UploadTest() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file ?? null);
  };

  const getVideoUploadParameters =
    api.video.createVideoUploadParameters.useMutation();

  const onUploadClick = async () => {
    if (selectedFile) {
      const { key, token } = await getVideoUploadParameters.mutateAsync();
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
  console.log(selectedFile);
  return (
    <Container sx={{ py: 1 }}>
      <Stack gap={1}>
        <Card>
          <Stack gap={1}>
            <Stack direction="row" alignItems="center">
              <VideoFile sx={{ fontSize: 36 }} />
              <Stack display="flex" width="100%" gap={1}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>{selectedFile?.name ?? "未选择文件"}</Typography>
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
                      startDecorator={<Upload></Upload>}
                    >
                      请选择文件
                      <VisuallyHiddenInput
                        type="file"
                        onChange={onFileChange}
                      />
                    </Button>
                    <Button
                      onClick={onUploadClick}
                      disabled={
                        selectedFile === null ||
                        progress !== null ||
                        getVideoUploadParameters.isLoading
                      }
                    >
                      确认上传
                    </Button>
                    <Button onClick={() => setSelectedFile(null)}>
                      取消选择
                    </Button>
                  </Flex>
                </Stack>
                <LinearProgress
                  determinate={getVideoUploadParameters.isSuccess}
                  value={progress ?? 0}
                />
              </Stack>
            </Stack>
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
              <Input />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>简介</FormLabel>
              <Textarea minRows={2} />
            </FormControl>
            <FormControl
              sx={(theme) => ({
                [`${theme.breakpoints.down("sm")}`]: {
                  gridColumn: "1/-1",
                },
              })}
            >
              <FormLabel>分类</FormLabel>
              <Autocomplete options={["Option 1", "Option 2"]} />
            </FormControl>
            <FormControl
              sx={(theme) => ({
                [`${theme.breakpoints.down("sm")}`]: {
                  gridColumn: "1/-1",
                },
              })}
            >
              <FormLabel>标签</FormLabel>
              <Autocomplete
                multiple
                options={["Option 1", "Option 2"]}
                sx={(theme) => ({
                  [`${theme.breakpoints.down("sm")}`]: {
                    gridRow: "1/-1",
                  },
                })}
              />
            </FormControl>
            <CardActions sx={{ gridColumn: "1/-1" }}>
              <Button variant="solid" color="success">
                立即投稿
              </Button>
            </CardActions>
          </CardContent>
        </Card>

        {/* <Card>
          <CardActions>
            <Button variant="soft" size="sm">
              存草稿
            </Button>
            <Button variant="solid" size="sm">
              立即投稿
            </Button>
          </CardActions>
        </Card> */}
      </Stack>
    </Container>
  );
}
