"use client";
import {
  Avatar,
  CircularProgress,
  DialogContent,
  Divider,
  Grid,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import { api } from "~/trpc/react";
import { VideoGrid } from "./video-grid";
import { useState } from "react";
import Link from "next/link";
import { Flex } from "./flex";

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [text, setText] = useState("");

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          width: "800px",
          maxWidth: "95vw",
        }}
      >
        <Flex spacing={2} alignItems="center">
          <Input
            fullWidth
            placeholder="请输入关键词"
            startDecorator={<SearchIcon />}
            onChange={(e) => setText(e.target.value)}
          />
          <ModalClose
            sx={{
              position: "static",
            }}
          />
        </Flex>

        <Divider />
        <DialogContent>
          <Tabs defaultValue={0}>
            <TabList>
              <Tab>搜索视频</Tab>
              <Tab>搜索用户</Tab>
            </TabList>
            <TabPanel value={0}>
              <SearchVideoPanel text={text} />
            </TabPanel>
            <TabPanel value={1}>
              <SearchUserPanel text={text} />
            </TabPanel>
          </Tabs>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}

const SearchVideoPanel = ({ text }: { text: string }) => {
  const { data: videos, isLoading } = api.video.search.useQuery(
    { query: text },
    { enabled: text.length > 0 },
  );

  return (
    <Stack sx={{ alignItems: "center" }}>
      {isLoading && text.length > 0 && <CircularProgress />}
      {videos != undefined && text ? (
        <VideoGrid videos={videos} />
      ) : (
        (!isLoading || !text) && (
          <Typography textAlign="center">无数据</Typography>
        )
      )}
    </Stack>
  );
};

const SearchUserPanel = ({ text }: { text: string }) => {
  const { data: users, isLoading } = api.user.search.useQuery(
    { query: text },
    { enabled: text.length > 0 },
  );

  return (
    <Stack>
      {isLoading && text.length > 0 && <CircularProgress />}
      {users != undefined && text ? (
        <Grid
          container
          columns={{
            xs: 3,
            sm: 4,
            md: 5,
          }}
          columnSpacing={1}
          rowSpacing={2}
        >
          {users.map((user) => (
            <Grid key={user.id} xs={1}>
              <Link href={`user/${user.id}`}>
                <Stack sx={{ alignItems: "center" }} spacing={1}>
                  <Avatar src={user.avatarUrl ?? undefined} size="lg" />
                  <Typography textAlign="center" level="title-sm">
                    {user.name}
                  </Typography>
                </Stack>
              </Link>
            </Grid>
          ))}
        </Grid>
      ) : (
        (!isLoading || !text) && (
          <Typography textAlign="center">无数据</Typography>
        )
      )}
    </Stack>
  );
};
