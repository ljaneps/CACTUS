import DeleteOnIcon from "../../assets/icons/icon_delete_primary.svg";
import DeleteOffIcon from "../../assets/icons/icon_delete-secondary.svg";

export function CardMainTopicComponent() {
  return (
    <div className="w-96 h-72 bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col justify-between overflow-hidden">
      {/* CABECERA CON FONDO DIFERENTE */}
      <a href="#">
        <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-4 text-center">
          <h5 className="text-lg font-bold tracking-tight">
            Noteworthy technology and 2025 entre 2021
          </h5>
        </div>
      </a>

      {/* CONTENIDO DEL CARD */}
      <div className="p-6 flex-1">
        <p className="mb-2 font-normal text-gray-700 dark:text-gray-400 text-justify">
          Here are the biggest enterprise technology acquisitions of 2021 so
          far, in reverse chronological order.
        </p>
      </div>

      {/* --- BOTONES INFERIORES --- */}
      <div className="flex justify-end mt-2 border-t border-gray-200 pt-3 pb-3 pr-3 gap-4">
        {/* Botón 1 */}
        <button>
          <img
            src={DeleteOnIcon}
            alt="Study"
            className="w-8 h-8 group-hover:hidden"
          />
          <img
            src={DeleteOffIcon}
            alt="Study hover"
            className="w-8 h-8 hidden group-hover:block"
          />
        </button>
      </div>
    </div>
  );
}
