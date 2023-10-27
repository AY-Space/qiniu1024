import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import {
  Avatar,
  Box,
  IconButton,
  Input,
  Sheet,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/joy";
import { ThemeRegistry } from "./_components/theme-registry";
import SearchIcon from "@mui/icons-material/Search";
import { Flex } from "./_components/flex";
import MenuIcon from "@mui/icons-material/Menu";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

function NavigationRail() {
  return (
    <Sheet
      sx={{
        px: 2,
        py: 2,
      }}
    >
      <Stack spacing={2}>
        <IconButton size="lg" color="primary">
          <Stack alignItems="center" sx={{ p: 1 }} spacing={1}>
            <SvgIcon>
              <SearchIcon />
            </SvgIcon>
            <Typography
              level="body-sm"
              sx={{
                color: "inherit",
              }}
            >
              搜索
            </Typography>
          </Stack>
        </IconButton>
      </Stack>
    </Sheet>
  );
}

function AppBar() {
  return (
    <Sheet
      sx={{
        px: 2,
        height: 60,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Flex
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Flex spacing={1} alignItems="center">
          <IconButton>
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider headers={headers()}>
          <ThemeRegistry>
            <Stack
              sx={{
                height: "100vh",
              }}
            >
              <AppBar />
              <Flex
                sx={{
                  flex: 1,
                  overflow: "hidden",
                }}
              >
                <NavigationRail />
                <Box
                  sx={{
                    flex: 1,
                  }}
                >
                  {children}
                </Box>
              </Flex>
            </Stack>
          </ThemeRegistry>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
