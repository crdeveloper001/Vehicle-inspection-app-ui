import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "dark"
        ? {
            background: {
              default: "#111827",
              paper: "#000000",
            },
          }
        : {
            background: {
              default: "#f5f5f5",
              paper: "#ffffff",
            },
          }),
    },
  });