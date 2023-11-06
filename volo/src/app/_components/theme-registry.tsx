"use client";

import {
  CssBaseline,
  CssVarsProvider,
  extendTheme,
  getInitColorSchemeScript,
} from "@mui/joy";
import NextAppDirEmotionCacheProvider from "./emotion-cache";

const tailwindPink = {
  50: "#fdf2f8",
  100: "#fce7f3",
  200: "#fbcfe8",
  300: "#f9a8d4",
  400: "#f472b6",
  500: "#ec4899",
  600: "#db2777",
  700: "#be185d",
  800: "#9d174d",
  900: "#831843",
};

const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: tailwindPink,
      },
    },
    light: {
      palette: {
        primary: tailwindPink,
      },
    },
  },
});

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
