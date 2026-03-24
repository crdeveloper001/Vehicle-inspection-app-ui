import { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
      }}
    >
      <Container maxWidth="xs">
        {/* LOGO */}
        <Box textAlign="center" mb={2}>
          <img src={logo} alt="Logo" style={{ width: 110 }} />
        </Box>

        {/* CARD */}
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          {/* HEADER */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">Iniciar sesión</Typography>

            <IconButton size="small" onClick={() => setOpen(true)}>
              <InfoOutlinedIcon />
            </IconButton>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
          >
            Sistema de inspección Vehicular
          </Typography>

          {/* INPUTS */}
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            margin="normal"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* BUTTON */}
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, py: 1.2 }}
            onClick={handleLogin}
          >
            Ingresar
          </Button>
        </Paper>
      </Container>

      {/* MODAL INFO */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>¿Qué hace esta aplicación?</DialogTitle>

        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Esta aplicación permite generar informes profesionales de
            inspección vehicular de manera rápida y estructurada.
          </Typography>

          <Typography variant="body2">✔ Revisión de motor</Typography>
          <Typography variant="body2">✔ Inspección de luces</Typography>
          <Typography variant="body2">✔ Evaluación general del vehículo</Typography>
          <Typography variant="body2">✔ Generación automática de PDF</Typography>
          <Typography variant="body2">✔ Envío por WhatsApp y correo</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}