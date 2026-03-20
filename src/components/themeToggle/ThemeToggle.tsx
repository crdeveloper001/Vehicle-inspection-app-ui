import { useContext } from "react";
import { IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { ColorModeContext } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { toggleColorMode } = useContext(ColorModeContext);

  return (
    <IconButton onClick={toggleColorMode} color="inherit">
      <DarkModeIcon />
      {/* puedes cambiar dinámicamente si quieres */}
    </IconButton>
  );
}