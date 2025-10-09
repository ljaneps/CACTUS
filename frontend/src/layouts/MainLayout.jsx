import { useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import SidebarComponent from "../components/SidebarComponent";
import { Menu, X } from "lucide-react"; // iconos modernos

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header recibe el callback */}
      <HeaderComponent onOpenSidebar={() => setSidebarOpen(true)} />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex flex-1 relative">
        {/* SIDEBAR MODO ESCRITORIO */}
        <aside className="hidden lg:flex w-72 flex-col border-r bg-white">
          <SidebarComponent />
        </aside>

        {/* SIDEBAR MODO MÓVIL */}
        {sidebarOpen && (
          <>
            {/* Fondo semitransparente */}
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSidebarOpen(false)}></div>

            {/* Sidebar deslizante */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-600 hover:text-gray-900">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <SidebarComponent />
            </div>
          </>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
