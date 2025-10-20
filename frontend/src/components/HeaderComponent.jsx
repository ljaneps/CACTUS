import { Menu } from "lucide-react";
import logo from "../assets/pictures/logo.png";

export default function HeaderComponent({ onOpenSidebar }) {
  return (
    <header className="bg-gradient-to-r from-primary bg-secondary to-primary-light shadow text-white">
      <div className="mx-auto max-w-7x2 px-4 sm:px-6 lg:px-16">
        <div className="flex h-20 items-center justify-between">
          {/* Izquierda: logo + botón móvil */}
          <div className="flex items-center gap-2">
            {/* Botón hamburguesa SOLO visible en móvil */}
            <button
              onClick={onOpenSidebar}
              className="lg:hidden p-2 rounded hover:bg-primary/80 transition">
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-shrink-0">
              <img src={logo} alt="Cactus APP" className="h-14 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
