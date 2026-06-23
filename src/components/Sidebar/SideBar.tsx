import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Drawer,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

// ICONOS
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../../assets/logo-removebg-preview.png";
//themes config
import { useTheme } from "@mui/material/styles";
import { AccountCircle, Group, Home } from "@mui/icons-material";

export default function Sidebar({ mobileOpen, setMobileOpen }: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const menu = [
    { name: "Mi Perfil", path: "/profile", icon: <AccountCircle /> },
    { name: "Inicio", path: "/dashboard", icon: <Home /> },
    { name: "Clientes", path: "/clients", icon: <Group /> },
    { name: "Reportes", path: "/reports", icon: <DescriptionIcon /> },
    { name: "Cotizaciones", path: "/quotes", icon: <SettingsIcon /> },
    { name: "Logs del sistema", path: "/logs", icon: <ListAltIcon /> },
    { name: "Salir", path: "/", icon: <LogoutIcon /> },
  ];

  const content = (

    <Box
      sx={{
        width: 220,
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRight: `1px solid ${theme.palette.divider}`, 
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="App Logo"
          sx={{ width: 120, height: "auto", backgroundColor: "transparent" }}
        />
      </Box>

      <List>
        {menu.map((item, i) => (
          <ListItemButton
            key={i}
            selected={location.pathname === item.path}
            onClick={() => {
              if (item.name === "Log Out") {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
              }
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`, // 👈 vuelve el separador
              height: 65,
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: 3,

              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },

              "&.Mui-selected": {
                backgroundColor: theme.palette.action.selected,
                borderLeft: `4px solid ${theme.palette.primary.main}`, // 👈 PRO
              },
            }}
          >
            <Box sx={{ color: "#94a3b8" }}>{item.icon}</Box>

            <ListItemText
              primary={item.name}
              primaryTypographyProps={{ fontSize: 14 }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Desktop */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        {content}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {content}
      </Drawer>
    </>
  );
}