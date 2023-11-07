"use client";

import { Card, Container, IconButton, List, Stack, Typography } from "@mui/joy";
import { VideoCard } from "../_components/video-card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Delete } from "@mui/icons-material";
import { Flex } from "../_components/flex";
import { api } from "~/trpc/react";
dayjs.extend(relativeTime);

export default function HistoryPage() {
  const utils = api.useUtils();
  const { data: histories } = api.video.histories.useQuery();
  const deleteHistory = api.video.deleteHistory.useMutation({
    onSuccess: () => {
      void utils.video.histories.invalidate();
    },
  });

  return (
    <Container>
      <List>
        <Stack spacing={2} mt={1} p={1}>
          {histories?.length === 0 && (
            <Typography level="body-sm" textAlign="center">
              没有视频观看记录，快去逛逛吧
            </Typography>
          )}
          {histories?.map((history) => (
            <Card key={history.video.id}>
              <Flex spacing={2} justifyContent="center" alignItems="center">
                <Typography
                  level="body-sm"
                  color="primary"
                  width={120}
                  maxWidth="15vw"
                >
                  {dayjs(history.viewedAt).fromNow()}
                </Typography>
                <Stack flex={1}>
                  <Stack maxWidth="50vw" width={240}>
                    <VideoCard video={history.video} />
                  </Stack>
                </Stack>
                <IconButton
                  onClick={() => {
                    deleteHistory.mutate({ videoId: history.video.id });
                  }}
                  color="danger"
                >
                  <Delete />
                </IconButton>
              </Flex>
            </Card>
          ))}
        </Stack>
      </List>
    </Container>
  );
}
