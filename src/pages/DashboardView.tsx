import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/Sidebar/SideBar";
import ThemeToggle from "../components/themeToggle/ThemeToggle";
//iconos
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

//themes config
import { useTheme } from "@mui/material/styles";



export default function Dashboard() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  // 🔥 MOCK DATA (luego viene del backend)
  const logs = [
    { id: 1, client: "Juan García", car: "Toyota Corolla", status: "Creado", date: "2026-03-19" },
    { id: 2, client: "María López", car: "Honda Civic", status: "Enviado", date: "2026-03-18" },
    { id: 3, client: "Carlos Rodríguez", car: "Nissan X-Trail", status: "Creado", date: "2026-03-17" },
    { id: 4, client: "Ana Martínez", car: "Ford Mustang", status: "Enviado", date: "2026-03-16" },
    { id: 5, client: "Pedro Sánchez", car: "Chevrolet Malibu", status: "Creado", date: "2026-03-15" },
    { id: 6, client: "Laura Fernández", car: "BMW 3 Series", status: "Enviado", date: "2026-03-14" },
    { id: 7, client: "Miguel Hernández", car: "Mercedes C-Class", status: "Creado", date: "2026-03-13" },
    { id: 8, client: "Isabel Castro", car: "Volkswagen Jetta", status: "Enviado", date: "2026-03-12" },
    { id: 9, client: "Diego Moreno", car: "Mazda CX-5", status: "Creado", date: "2026-03-11" },
    { id: 10, client: "Rosa Jiménez", car: "Audi A4", status: "Enviado", date: "2026-03-10" },
    { id: 11, client: "Fernando Ruiz", car: "Subaru Outback", status: "Creado", date: "2026-03-09" },
    { id: 12, client: "Carmen Díaz", car: "Hyundai Elantra", status: "Enviado", date: "2026-03-08" },
    { id: 13, client: "Javier Torres", car: "Kia Sportage", status: "Creado", date: "2026-03-07" },
    { id: 14, client: "Patricia Gómez", car: "Tesla Model 3", status: "Enviado", date: "2026-03-06" },
    { id: 15, client: "Andrés Vega", car: "Lexus RX", status: "Creado", date: "2026-03-05" },
    { id: 16, client: "Elena Blanco", car: "Jeep Wrangler", status: "Enviado", date: "2026-03-04" },
    { id: 17, client: "Raúl Ortiz", car: "Dodge Charger", status: "Creado", date: "2026-03-03" },
    { id: 18, client: "Sofía Cruz", car: "Chrysler 300", status: "Enviado", date: "2026-03-02" },
    { id: 19, client: "Ricardo Navarro", car: "Buick Enclave", status: "Creado", date: "2026-03-01" },
  ];

  const modules = [
    { title: "Crear Nuevo Reporte de Inspección", icon: <DescriptionIcon /> },
    { title: "Crear Cliente Nuevo al Sistema", icon: <PeopleIcon /> },
    { title: "Historial de Reportes Actuales", icon: <AssessmentIcon /> },
    { title: "Configuración de reportes de inspeccion", icon: <SettingsIcon /> },
    { title: "Solicitar Asistencia al Administrador del Sistema", icon: <AccessTimeIcon /> },
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
              Dashboard
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

          {/* 🔹 MODULE CARDS */}
          <Grid container spacing={2} mb={3}>
            {modules.map((mod, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    border: `1px solid ${theme.palette.divider}`, // 👈 CLAVE
                    borderRadius: 2,
                    transition: "0.2s",

                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                      transform: "translateY(-2px)", // 👈 efecto PRO
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    {mod.icon}

                    <Typography>{mod.title}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* 🔹 LOGS / REPORTES */}
          <Typography variant="h6" mb={2} mt={6}>
            Últimos reportes
          </Typography>

          <Box
            sx={{
              maxHeight: "400px",
              overflowY: "auto",
              pr: 1,
            }}
          >
            {logs.map((log) => {
              const isSent = log.status === "Enviado";

              return (
                <Paper
                  key={log.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",

                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                  }}
                >
                  <Typography>{log.client}</Typography>
                  <Typography sx={{ justifyContent: "flex-start" }}>{log.car}</Typography>

                  <Box display="flex" alignItems="center" gap={1}>
                    {isSent ? (
                      <CheckCircleIcon sx={{ color: "lightgreen" }} />
                    ) : (
                      <AccessTimeIcon sx={{ color: "orange" }} />
                    )}
                    <Typography>{log.status}</Typography>
                  </Box>

                  <Typography>{log.date}</Typography>

                  <Button variant="contained" size="small">
                    View Report
                  </Button>
                </Paper>
              );
            })}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}