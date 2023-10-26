"use client";

import {
  CssBaseline,
  CssVarsProvider,
  extendTheme,
  getInitColorSchemeScript,
} from "@mui/joy";

const theme = extendTheme({});

export const ThemeRegistry = ({ children }: { children: React.ReactNode }) => {
  return (
    // TODO: <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
    <CssVarsProvider theme={theme} defaultMode="system">
      {getInitColorSchemeScript()}

      <CssBaseline />
      {children}
    </CssVarsProvider>
    // </NextAppDirEmotionCacheProvider>
  );
};
