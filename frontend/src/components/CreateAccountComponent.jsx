import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateAccountComponent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: "20px auto",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
      }}>
      <h2>Crear cuenta</h2>

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ margin: "10px 0" }}
      />

      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{ margin: "10px 0" }}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ margin: "10px 0" }}
      />

      <button type="submit" style={{ marginTop: "10px" }}>
        Create Account
      </button>

      <button
        type="button"
        onClick={() => navigate("/login")}
        style={{
          marginTop: "15px",
          background: "none",
          border: "none",
          color: "#007bff",
          textDecoration: "underline",
          cursor: "pointer",
        }}>
        ← Sign in
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default CreateAccountComponent;
