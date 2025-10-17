import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonComponent } from "./buttons/ButtonComponent";
import { ArrowRight } from "lucide-react";

function CreateAccountComponent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) throw new Error("Error al crear cuenta");

      setMessage("✅ Cuenta creada exitosamente. Redirigiendo...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage("❌ No se pudo crear la cuenta. Revisa los datos.", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-16 flex flex-col items-center bg-white p-20 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-emerald-800 mb-6">Crear cuenta</h2>

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
      />

      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
      />

      <ButtonComponent
        text="Crear cuenta"
        icon={ArrowRight}
        disabled={loading}
        fullWidth
        primary>
        {loading ? "Loading..." : "Crear cuenta"}
      </ButtonComponent>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="mt-4 text-emerald-700 text-sm hover:underline">
        ← Iniciar sesión
      </button>

      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </form>
  );
}

export default CreateAccountComponent;
