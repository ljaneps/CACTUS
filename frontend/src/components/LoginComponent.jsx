import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import { ButtonComponent } from "./buttons/ButtonComponent";
import { ArrowRight } from "lucide-react";

export default function LoginComponent() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("Enviando login:", { email, password });

      const response = await fetch("http://127.0.0.1:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Error en el login");
      const data = await response.json();

      const decoded = jwtDecode(data.access_token);
      login(decoded, data);
      setMessage("✅ Login exitoso");
      navigate("/main");
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen flex justify-center items-start pt-16 bg-gradient-to-br from-emerald-50 to-emerald-50 px-6">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white p-12 m-6 rounded-2xl shadow-lg border-2 border-gray-200">
      {/* --- Título --- */}
      <h2 className="text-3xl font-bold text-emerald-800 mb-2 text-center">
        Bienvenido de nuevo
      </h2>
      <p className="text-gray-500 text-sm text-center mb-8">
        Inicia sesión para continuar
      </p>

      {/* --- Email --- */}
      <div className="mb-6">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1">
          Correo o nombre de usuario
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 
                     focus:outline-none transition duration-150"
        />
      </div>

      {/* --- Password --- */}
      <div className="mb-8">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 
                     focus:outline-none transition duration-150"
        />
      </div>

      {/* --- Botón principal --- */}
      <ButtonComponent
        text={loading ? "Cargando..." : "Iniciar sesión"}
        icon={ArrowRight}
        disabled={loading}
        fullWidth
        primary
      />

      {/* --- Enlace a registro --- */}
      <p className="mt-6 text-center text-sm">
        ¿No tienes cuenta?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="text-emerald-700 font-medium hover:underline">
          Crear cuenta
        </button>
      </p>

      {/* --- Mensajes --- */}
      {message && (
        <p className="mt-4 text-center text-green-600 text-sm">{message}</p>
      )}
      {error && (
        <p className="mt-4 text-center text-red-600 text-sm">{error}</p>
      )}
    </form>
  </div>
);
}
