import perfil1 from "../assets/pictures/perfil1.png";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import LogoutButton from "./LogoutComponent";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SidebarInitComponent({ navigation = [] }) {
  const { user } = useAuth();
  return (
    <aside className="w-80 flex flex-col bg-white border-r">
      {/* Logo */}
      <div className="flex h-32 items-center justify-center border-b">
        <img
          src={perfil1}
          alt="Avatar"
          className="h-24 w-24 border-2 rounded-full"
        />
      </div>
      {/* User profile */}
      <div className="border-t px-2 py-6 flex flex-col items-center text-center space-y-2">
        <p className="text-sm font-medium text-gray-700">
          Bienveid@ {user?.username}
        </p>
        <LogoutButton />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-3">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={classNames(
              item.current
                ? "bg-primary/10 text-primary"
                : "text-primary hover:text-primary-medium hover:bg-primary/5",
              "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            )}>
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
