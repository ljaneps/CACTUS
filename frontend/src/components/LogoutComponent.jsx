import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/login"); // o "/" si prefieres
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-2 flex items-center text-xs text-gray-500 hover:text-red-600 transition-colors">
      <LogOut className="mr-1 h-4 w-4" />
      Cerrar sesión
    </button>
  );
}
