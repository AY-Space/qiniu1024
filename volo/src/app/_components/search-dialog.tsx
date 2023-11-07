"use client";
import {
  Avatar,
  CircularProgress,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Input,
  Modal,
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
      <ModalDialog size="lg">
        <DialogTitle>
          <Input
            fullWidth
            size="lg"
            placeholder="请输入关键词"
            startDecorator={<SearchIcon />}
            onChange={(e) => setText(e.target.value)}
          ></Input>
        </DialogTitle>
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
      {videos != undefined ? (
        <VideoGrid videos={videos} />
      ) : (
        !isLoading && <Typography textAlign="center">无数据</Typography>
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
    <Stack sx={{ alignItems: "center" }}>
      {isLoading && text.length > 0 && <CircularProgress />}
      {users != undefined ? (
        <Grid container>
          {users.map((user) => (
            <Grid key={user.id}>
              <Link href={`user/${user.id}`}>
                <Stack sx={{ alignItems: "center" }}>
                  <Avatar
                    src={user.avatarUrl ?? undefined}
                    sx={{
                      "&": {
                        "--Avatar-size": "64px",
                      },
                    }}
                  />
                  <Typography textAlign="center">{user.name}</Typography>
                </Stack>
              </Link>
            </Grid>
          ))}
        </Grid>
      ) : (
        !isLoading && <Typography textAlign="center">无数据</Typography>
      )}
    </Stack>
  );
};
