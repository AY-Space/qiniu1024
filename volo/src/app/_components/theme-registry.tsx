"use client";

import {
  CssBaseline,
  CssVarsProvider,
  extendTheme,
  getInitColorSchemeScript,
} from "@mui/joy";
import NextAppDirEmotionCacheProvider from "./emotion-cache";

const theme = extendTheme({});

export const ThemeRegistry = ({ children }: { children: React.ReactNode }) => {
  return (
    // https://mui.com/material-ui/guides/next-js-app-router/
    <NextAppDirEmotionCacheProvider options={{ key: "joy" }}>
      <CssVarsProvider theme={theme} defaultMode="system">
        {getInitColorSchemeScript()}

        <CssBaseline />
        {children}
      </CssVarsProvider>
    </NextAppDirEmotionCacheProvider>
  );
};
