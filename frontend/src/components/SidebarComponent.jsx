import perfil1 from "../assets/pictures/perfil1.png";
import BoxAltoIcon from "../assets/icons/icon_box_alto.svg";
import BoxBajoIcon from "../assets/icons/icon_box_bajo.svg";
import BoxMedioIcon from "../assets/icons/icon_box_medio.svg";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import { FlagTriangleLeft, CalendarClock, Star } from "lucide-react";

const navigation = [{ name: "Favoritos", icon: Star, current: false }];

const getColorClass = (c) =>
  c === "bajo"
    ? "bg-primary-medium"
    : c === "medio"
    ? "bg-primary-light"
    : "bg-primary";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SidebarComponent() {
  const { user, selectedTopic } = useSidebar();

  const progreso = [
    {
      title: "Tarea 1",
      icon: BoxBajoIcon,
      porcentaje: selectedTopic?.low_percent,
      color: "bajo",
    },
    {
      title: "Tarea 2",
      icon: BoxMedioIcon,
      porcentaje: selectedTopic?.intermediate_percent,
      color: "medio",
    },
    {
      title: "Tarea 3",
      icon: BoxAltoIcon,
      porcentaje: selectedTopic?.high_percent,
      color: "alto",
    },
  ];

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
      <div className="border-t px-2 py-6 flex items-center justify-center space-x-3">
        <div>
          <p className="text-sm font-medium text-gray-700">
            Bienveid@ {user?.username}
          </p>
        </div>
        {selectedTopic && (
          <p className="text-xs text-gray-500">{selectedTopic.name}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-3">
        {navigation.map((item) => (
          <a
            key={item.name}
            href="#"
            className={classNames(
              item.current
                ? "bg-primary/10 text-primary"
                : "text-primary hover:text-primary-medium hover:bg-primary/5",
              "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            )}>
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </a>
        ))}

        {/* Objetivo */}
        <div className="mt-6">
          <a className="group flex items-center px-2 py-4">
            <CalendarClock className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Objetivo
            </h3>
          </a>

          <div className="mt-1 space-y-1" role="group">
            <span className="ml-14 text-primary-light font-medium">
              {selectedTopic?.date_ini} - {selectedTopic?.date_goal}
            </span>
          </div>
        </div>

        {/* Progreso */}
        <div className="mt-6">
          <a className="group flex items-center px-2 py-4">
            <FlagTriangleLeft className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Progreso
            </h3>
          </a>
          <div className="mt-1 space-y-1" role="group">
            {progreso.map((item) => (
              <a
                key={item.title}
                className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-indigo-600">
                <img
                  src={item.icon}
                  alt=""
                  className={classNames(
                    item.current
                      ? "text-indigo-600"
                      : "text-gray-400 group-hover:text-indigo-600",
                    "mr-3 h-10 w-10 flex-shrink-0"
                  )}
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">
                      {item.porcentaje}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div
                      className={`h-full transition-all duration-300 ${getColorClass(
                        item.color
                      )}`}
                      style={{ width: `${item.porcentaje}%` }}></div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}
