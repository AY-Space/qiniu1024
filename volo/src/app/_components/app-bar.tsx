"use client";

import {
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Input,
  Modal,
  ModalDialog,
  Sheet,
  Typography,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import { Flex } from "./flex";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { NavigationDrawer } from "./navigation-drawer";
import Link from "next/link";
import { api } from "~/trpc/react";
import { VideoGrid } from "./video-tab-panel";
import { UserMenu } from "./user-menu";

export interface AppBarProps {
  loggedIn: boolean;
}

export function AppBar({ loggedIn }: AppBarProps) {
  const [showNavigationDrawer, setShowNavigationDrawer] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  const [text, setText] = useState("");

  return (
    <Sheet
      sx={{
        px: 2,
        height: "var(--volo-app-bar-height)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <NavigationDrawer
        open={showNavigationDrawer}
        onClose={() => setShowNavigationDrawer(false)}
      />

      <Grid
        container
        sx={{
          flex: 1,
          "& > *": {
            height: "100%",
            display: "flex",
            alignItems: "center",
          },
          height: "100%",
        }}
        columns={3}
      >
        <Grid xs={1}>
          <Flex spacing={1} alignItems="center" height="100%">
            <IconButton onClick={() => setShowNavigationDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Link href="/">
              <Typography
                level="body-lg"
                sx={(theme) => ({
                  [theme.breakpoints.down("sm")]: {
                    display: "none",
                  },
                })}
              >
                Volo
              </Typography>
            </Link>
          </Flex>
        </Grid>
        <Grid xs={1}>
          <IconButton
            variant="outlined"
            sx={{
              borderRadius: "xl",
              width: "100%",
            }}
            size="lg"
            value={text}
            onClick={() => {
              setShowSearchDialog(true);
            }}
          >
            <SearchIcon />
            <Typography>搜索</Typography>
          </IconButton>
        </Grid>
        <Grid xs={1}>
          <Flex
            justifyContent="flex-end"
            alignItems="center"
            spacing={1}
            flex={1}
          >
            {loggedIn ? (
              <UserMenu />
            ) : (
              <Link href="/signin">
                <Button>登录</Button>
              </Link>
            )}
          </Flex>
        </Grid>
      </Grid>
      <Divider
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
      <SearchDialog
        open={showSearchDialog}
        onClose={() => setShowSearchDialog(false)}
      />
    </Sheet>
  );
}

function SearchDialog({
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
          {videos != undefined && videos.length > 0 ? (
            <VideoGrid videos={videos} />
          ) : (
            <Typography textAlign="center">无数据</Typography>
          )}
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}
