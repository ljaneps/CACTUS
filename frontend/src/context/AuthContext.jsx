"use client";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const fetchFullUser = async (token, email) => {
    try {
      const resp = await fetch(
        `http://127.0.0.1:8000/users/by-email/${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (resp.ok) {
        const fullUser = await resp.json();
        return fullUser;
      } else {
        console.warn(
          "⚠️ No se pudo obtener usuario completo, status:",
          resp.status
        );
        return null;
      }
    } catch (err) {
      console.error("Error al obtener usuario completo:", err);
      return null;
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token || token === "undefined" || token.split(".").length !== 3) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);

        const fullUser = decoded.email
          ? await fetchFullUser(token, decoded.email)
          : null;

        setUser({
          username: fullUser?.username ?? decoded.sub ?? decoded.username,
          email: decoded.email ?? null,
          ...fullUser,
        });
      } catch (err) {
        console.error("Error al decodificar token:", err);
      }
    };
    initializeUser();
  }, []);

  const login = async (decoded, data) => {
    const token = data.access_token;
    try {
      localStorage.setItem("access_token", token);
      localStorage.setItem("refresh_token", data.refresh);
      setIsAuthenticated(true);

      const fullUser = decoded.email
        ? await fetchFullUser(token, decoded.email)
        : null;

      setUser({
        username: fullUser?.username ?? decoded.sub ?? decoded.username,
        email: decoded.email ?? null,
        ...fullUser,
      });
    } catch (err) {
      console.error("Error en login:", err);
      setUser({
        username: decoded.sub ?? decoded.username,
        email: decoded.email ?? null,
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
