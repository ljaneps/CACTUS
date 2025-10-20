import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  X,
  Plus,
  BookOpen,
  Home,
  Star,
} from "lucide-react";
import HeaderComponent from "../components/HeaderComponent";
import SidebarInitComponent from "../components/SidebarInitComponent";

export default function TopicLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const path = location.pathname;

  let navigation = [];

  if (path.includes("/main")) {
    navigation = [
      { name: "Crear nuevo tema", icon: Plus, href: "/create-topic" },
      { name: "Otros temas", icon: BookOpen, href: "/free-topics" },
    ];
  } else {
    navigation = [
      { name: "Home", icon: Home, href: "/main" },
      { name: "Favoritos ", icon: Star, href: "/main" },
    ];
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <HeaderComponent onOpenSidebar={() => setSidebarOpen(true)} />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex flex-1 relative">
        {/* SIDEBAR MODO ESCRITORIO */}
        <aside className="hidden lg:flex w-80 flex-col border-r bg-white">
          <SidebarInitComponent navigation={navigation} />
        </aside>

        {/* SIDEBAR MODO MÓVIL */}
        {sidebarOpen && (
          <>
            {/* Fondo semitransparente */}
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSidebarOpen(false)}></div>

            {/* Sidebar deslizante */}
            <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-600 hover:text-gray-900">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <SidebarInitComponent navigation={navigation} />
            </div>
          </>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
