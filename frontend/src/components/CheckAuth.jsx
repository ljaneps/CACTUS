"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function CheckAuth({ children, requireAuth = false }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (requireAuth && !token) {
      navigate("/login");
      return;
    }

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Error al decodificar token:", err);
        if (requireAuth) navigate("/login");
      }
    }

    setLoading(false);
  }, [requireAuth, navigate]);

  if (loading) return <div>Cargando...</div>;

  // ✅ Renderiza directamente los children, manteniendo contexto estable
  return <>{children}</>;
}
