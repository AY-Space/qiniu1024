"use client";

import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Grid,
  IconButton,
  Input,
  ListItem,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  Sheet,
  Typography,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import { Flex } from "./flex";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { NavigationDrawer } from "./navigation-drawer";
import Link from "next/link";
import { Home, Logout, Upload } from "@mui/icons-material";

const UserMenu = ({ userId }: { userId: string }) => {
  // const user = api.user.(userId).data;
  const user = {};
  return (
    <Dropdown>
      <MenuButton
        slots={{
          root: Avatar,
        }}
        slotProps={{
          root: {
            src: user.avatarUrl ?? undefined,
            variant: "outlined",
          },
        }}
      />
      <Menu>
        {user.name && <MenuItem color="primary">{user.name}</MenuItem>}
        <MenuItem>{user.email}</MenuItem>
        <Divider />
        <Link href="/user">
          <MenuItem>
            <ListItemDecorator>
              <Home />
            </ListItemDecorator>
            个人主页
          </MenuItem>
        </Link>
        <Link href={`/upload`}>
          <MenuItem>
            <ListItemDecorator>
              <Upload />
            </ListItemDecorator>
            上传视频
          </MenuItem>
        </Link>
        <Link href="/api/auth/signout">
          <MenuItem color="danger">
            <ListItemDecorator>
              <Logout />
            </ListItemDecorator>
            退出登录
          </MenuItem>
        </Link>
      </Menu>
    </Dropdown>
  );
};

export interface AppBarProps {
  currentUserId?: string;
}

export function AppBar({ currentUserId }: AppBarProps) {
  const [navigationDrawer, setNavigationDrawer] = useState(false);

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
        open={navigationDrawer}
        onClose={() => setNavigationDrawer(false)}
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
        columns={{
          xs: 5,
          sm: 4,
        }}
      >
        <Grid xs={1}>
          <Flex spacing={1} alignItems="center" height="100%">
            <IconButton onClick={() => setNavigationDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Link href="/">
              <Typography
                level="body-lg"
                sx={(theme) => ({
                  [`${theme.breakpoints.down("sm")}`]: {
                    display: "none",
                  },
                })}
              >
                Volo
              </Typography>
            </Link>
          </Flex>
        </Grid>
        <Grid xs={3} sm={2}>
          <Input
            sx={{
              borderRadius: "xl",
            }}
            size="lg"
            placeholder="搜索"
            endDecorator={<SearchIcon />}
          />
        </Grid>
        <Grid xs={1}>
          <Flex
            justifyContent="flex-end"
            alignItems="center"
            spacing={1}
            flex={1}
          >
            {currentUserId ? (
              <UserMenu userId={currentUserId} />
            ) : (
              <Link href="/api/auth/signin">
                <Button>登录</Button>
              </Link>
            )}
          </Flex>
        </Grid>
      </Grid>
    </Sheet>
  );
}
