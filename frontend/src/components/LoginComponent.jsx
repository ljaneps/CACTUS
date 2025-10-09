import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginComponent({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Error en el login");
      const data = await response.json();

      setMessage("✅ Login exitoso");
      localStorage.setItem("token", data.access_token);
      if (onLogin) onLogin(data.access_token);
    } catch (err) {
      setMessage("❌ Credenciales incorrectas o error de conexión", err);
    }
  };

  return (
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-primary">
          Sign in to your account
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} class="space-y-6">
          <div>
            <label
              for="email"
              class="block text-sm/6 font-medium text-gray-900">
              Email or username
            </label>
            <div class="mt-2">
              <input
                id="email"
                type="email"
                name="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                autocomplete="email"
                class="block w-full border-2 border-gray-300 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
              {/* <div class="text-sm">
                <a
                  href="#"
                  class="font-semibold text-primary-light hover:text-indigo-300">
                  Forgot password?
                </a>
              </div> */}
            </div>
            <div class="mt-2">
              <input
                id="password"
                type="password"
                name="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                autocomplete="current-password"
                class="block w-full border-2 border-gray-300 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-primary-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
              Sign in
            </button>
          </div>
        </form>

        <button
          type="button"
          onClick={() => navigate("/register")}
          class="mt-6 flex w-full justify-center hover:text-primary-medium px-3 py-1.5 text-sm/6 font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30">
          ← Create account
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default LoginComponent;
