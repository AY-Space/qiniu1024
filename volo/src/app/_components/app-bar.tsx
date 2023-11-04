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
import { type Session } from "next-auth";

export interface AppBarProps {
  currentUser?: Session["user"];
}

export function AppBar({ currentUser }: AppBarProps) {
  const [navigationDrawer, setNavigationDrawer] = useState(false);

  return (
    <Sheet
      sx={{
        px: 2,
        height: "var(--volo-app-bar-height)",
        display: "flex",
        alignItems: "center",
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
          <Flex justifyContent="flex-end" alignItems="center" spacing={1}>
            {currentUser ? (
              <Dropdown>
                <MenuButton
                  slots={{
                    root: Avatar,
                  }}
                  slotProps={{
                    root: {
                      src: currentUser.avatarUrl ?? undefined,
                      variant: "outlined",
                    },
                  }}
                />
                <Menu>
                  {currentUser.name && (
                    <ListItem color="primary">{currentUser.name}</ListItem>
                  )}
                  <ListItem>{currentUser.email}</ListItem>
                  <Divider />
                  <MenuItem>
                    <Link href={`/user/${currentUser.id}`}>个人主页</Link>
                  </MenuItem>
                  <MenuItem color="danger">
                    <Link href="/api/auth/signout">退出登录</Link>
                  </MenuItem>
                </Menu>
              </Dropdown>
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
