import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UseAuthenticationReturn {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  login: () => Promise<void>;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const useAuthentication = (): UseAuthenticationReturn => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al iniciar sesión");
        return;
      }

      if (data.token) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError("Token ausente en la respuesta");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de red");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    loading,
    error,
    setEmail,
    setPassword,
    login,
  };
};
