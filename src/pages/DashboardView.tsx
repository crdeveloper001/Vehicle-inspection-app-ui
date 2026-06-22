
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/Sidebar/SideBar";
import ThemeToggle from "../components/themeToggle/ThemeToggle";
//iconos
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

//themes config
import { useTheme } from "@mui/material/styles";

export default function Dashboard() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const modules = [
    { title: "Crear Nuevo Reporte de Inspección", icon: <DescriptionIcon />,action: "create_report" },
    { title: "Crear Cliente Nuevo al Sistema", icon: <PeopleIcon />,action: "create_client" },
    { title: "Historial de Reportes Actuales", icon: <AssessmentIcon />,action: "view_reports" },
    { title: "Configuración de reportes de inspeccion", icon: <SettingsIcon />,action: "configure_reports" },
    { title: "Solicitar Asistencia al Administrador del Sistema", icon: <AccessTimeIcon />,action: "request_assistance" },
  ];

  return (

    <Box display="flex"
      sx={{
        flex: 1,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",

      }}>
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <Box
        sx={{
          flex: 1,
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          p: 2,
        }}
      >
        {/* TOP MOBILE */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          {/* IZQUIERDA */}
          <Box display="flex" alignItems="center">
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuIcon sx={{ color: theme.palette.text.primary }} />
            </IconButton>

            <Typography color={theme.palette.text.primary} ml={1}>
              Home
            </Typography>
          </Box>

          {/* DERECHA */}
          <ThemeToggle />
        </Box>

        {/* MAIN WINDOW */}
        <Paper
          sx={{
            minHeight: "80vh",
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            p: 3,
            border: `1px solid ${theme.palette.divider}`, // 👈 CLAVE
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" color={theme.palette.text.secondary} mb={2}>
            Acciones rápidas
          </Typography>

          {/* 🔹 MODULE OPTIONS LIST */}
          <Box display="flex" flexDirection="column" gap={2} mb={3}>
            {modules.map((mod, i) => (
              <Button
                key={i}
                fullWidth
                variant="outlined"
                startIcon={mod.icon}
                onClick={() => {
                  switch (mod.action) {
                    case "create_report":
                      window.location.href = "/reports"; // Redirige a la página de creación de reportes
                      break;
                    case "create_client":
                      window.location.href = "/clients"; // Redirige a la página de creación de clientes
                      break;
                    case "view_reports":
                      window.location.href = "/reports"; // Redirige a la página de reportes
                      break;
                    case "configure_reports":
                      window.location.href = "/config"; // Redirige a la página de configuración
                      break;
                    case "request_assistance":
                      alert("Contacto: crdeveloper506@gmail.com");
                      break;
                  }
                }}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.divider,
                  borderRadius: 2,
                  p: 2,
                  alignItems: "center",
                  transition: "0.2s",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    transform: "translateY(-2px)",
                    borderColor: theme.palette.text.primary,
                  },
                }}
              >
                <Typography>{mod.title}</Typography>
              </Button>
            ))}
          </Box>

        </Paper>
      </Box>
    </Box>
  );
}