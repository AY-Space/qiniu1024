"use client";

import {
  Avatar,
  IconButton,
  Input,
  Sheet,
  SvgIcon,
  Typography,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import { Flex } from "./flex";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { NavigationDrawer } from "./navigation-drawer";

export function AppBar() {
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

      <Flex
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Flex spacing={1} alignItems="center">
          <IconButton onClick={() => setNavigationDrawer(true)}>
            <SvgIcon>
              <MenuIcon />
            </SvgIcon>
          </IconButton>
          <Typography level="body-lg">Volo</Typography>
        </Flex>
        <Input
          sx={{
            borderRadius: "xl",
          }}
          size="lg"
          placeholder="搜索"
          endDecorator={
            <SvgIcon>
              <SearchIcon />
            </SvgIcon>
          }
        />
        <button>
          <Avatar>A</Avatar>
        </button>
      </Flex>
    </Sheet>
  );
}
