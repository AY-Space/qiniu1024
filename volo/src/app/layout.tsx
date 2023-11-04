import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { Stack } from "@mui/joy";
import { ThemeRegistry } from "./_components/theme-registry";
import { AppBar } from "./_components/app-bar";
import { getServerAuthSession } from "~/server/auth";
import { NextSessionProvider } from "./_components/next-session-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Volo | 短视频平台",
  description: "Volo | 短视频平台",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider headers={headers()}>
          <ThemeRegistry>
            <NextSessionProvider session={session}>
              <Stack>
                <AppBar currentUserId={session?.userId} />
                <Stack>{children}</Stack>
              </Stack>
            </NextSessionProvider>
          </ThemeRegistry>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
