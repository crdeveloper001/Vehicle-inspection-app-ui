import { Box } from "@mui/material";

export default function Layout({ children }: any) {
  return (
    <Box display="flex">
      {children}
    </Box>
  );
}