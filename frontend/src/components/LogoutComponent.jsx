import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ButtonComponent } from "./buttons/ButtonComponent";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    router.push("/"); // o redirige a /login si prefieres
  };

  return <ButtonComponent onClick={handleLogout}>Cerrar sesión</ButtonComponent>;
}
