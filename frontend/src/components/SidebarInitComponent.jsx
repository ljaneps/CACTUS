import perfil1 from "../assets/pictures/perfil1.png";
import AddIcon from "../assets/icons/icon_add_primary.svg";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

const navigation = [
  { name: "Crear nuevo tema", icon: AddIcon, current: false, href: "/create-topic" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SidebarInitComponent() {
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
      <div className="border-t p-4 flex items-center justify-center space-x-3">
        <div>
          <p className="text-sm font-medium text-gray-700">
            Bienveid@ {user?.username}
          </p>
        </div>
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
            <img
              src={item.icon}
              alt=""
              className={classNames(
                item.current
                  ? "text-primary"
                  : "text-primary group-hover:text-primary-medium",
                "mr-3 h-6 w-6 flex-shrink-0 transition-colors duration-200"
              )}
            />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
