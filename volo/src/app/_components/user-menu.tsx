"use client";
import {
  Avatar,
  Divider,
  Dropdown,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
} from "@mui/joy";
import Link from "next/link";
import { History, Home, Logout, Upload, Videocam } from "@mui/icons-material";
import { api } from "~/trpc/react";
import { signOut } from "next-auth/react";

export const UserMenu = () => {
  const { data: user } = api.user.currentUser.useQuery();

  return (
    <Dropdown>
      <MenuButton
        slots={{
          root: Avatar,
        }}
        slotProps={{
          root: {
            src: user?.avatarUrl ?? undefined,
            variant: "outlined",
          },
        }}
      />
      <Menu>
        {user?.name && <MenuItem color="primary">{user.name}</MenuItem>}
        <MenuItem>{user?.email}</MenuItem>
        <Divider />
        <Link href="/video">
          <MenuItem>
            <ListItemDecorator>
              <Videocam />
            </ListItemDecorator>
            视频首页
          </MenuItem>
        </Link>
        <Link href="/user">
          <MenuItem>
            <ListItemDecorator>
              <Home />
            </ListItemDecorator>
            个人主页
          </MenuItem>
        </Link>
        <Link href={`/history`}>
          <MenuItem>
            <ListItemDecorator>
              <History />
            </ListItemDecorator>
            历史记录
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
        <MenuItem
          color="danger"
          onClick={async () => {
            await signOut({ redirect: false });
            location.reload();
          }}
        >
          <ListItemDecorator>
            <Logout />
          </ListItemDecorator>
          退出登录
        </MenuItem>
      </Menu>
    </Dropdown>
  );
};
