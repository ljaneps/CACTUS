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
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-primary">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900">
              Email or username
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="block w-full border-2 border-gray-300 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="block w-full border-2 border-gray-300 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-sm"
              />
            </div>
          </div>

          <div>
            <ButtonComponent
              text="Sign in"
              icon={ArrowRight}
              disabled={loading}
              fullWidth
              primary>
              {loading ? "Loading..." : "Sign in"}
            </ButtonComponent>
          </div>
        </form>

        <button
          type="button"
          onClick={() => navigate("/register")}
          className="mt-6 flex w-full justify-center hover:text-primary-medium px-3 py-1.5 text-sm font-semibold text-primary">
          ← Create account
        </button>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
}
