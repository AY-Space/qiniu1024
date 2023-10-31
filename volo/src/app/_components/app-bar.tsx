"use client";

import { Avatar, Grid, IconButton, Input, Sheet, Typography } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import { Flex } from "./flex";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { NavigationDrawer } from "./navigation-drawer";
import Link from "next/link";

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

      <Grid
        container
        sx={{
          flex: 1,
        }}
        columns={3}
      >
        <Grid xs={1}>
          <Flex spacing={1} alignItems="center" height="100%">
            <IconButton onClick={() => setNavigationDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Link href={"/"}>
              <Typography level="body-lg">Volo</Typography>
            </Link>
          </Flex>
        </Grid>
        <Grid xs={1}>
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
          <Flex justifyContent="flex-end">
            <button>
              <Avatar>A</Avatar>
            </button>
          </Flex>
        </Grid>
      </Grid>
    </Sheet>
  );
}
