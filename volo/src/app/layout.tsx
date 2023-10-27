import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { Stack } from "@mui/joy";
import { ThemeRegistry } from "./_components/theme-registry";
import { AppBar } from "./_components/app-bar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Volo",
  description: "Volo – 短视频平台",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

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
            <Stack>
              <AppBar />
              <Stack>{children}</Stack>
            </Stack>
          </ThemeRegistry>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
