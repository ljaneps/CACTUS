import FavOnIcon from "../../assets/icons/icon_fav_primary.svg";
import FavOffIcon from "../../assets/icons/icon_fav_secondary.svg";
import { Check } from "lucide-react";
import { X } from "lucide-react";
import { ButtonComponent } from "../buttons/ButtonComponent";
import { ArrowRight } from "lucide-react";
import NextOnIcon from "../../assets/icons/icon_next_primary.svg";
import NextOffIcon from "../../assets/icons/icon_next_seconday.svg";
import PrevOnIcon from "../../assets/icons/icon_prev_primary.svg";
import PrevOffIcon from "../../assets/icons/icon_prev_secondary.svg";

export function CardTestResultComponent({ options }) {
  return (
    <div
      className="relative w-full sm:w-4/6 md:w-3/5 lg:max-w-5xl xl:max-w-5xl min-h-[18rem] p-6 
                bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-white 
                flex flex-col text-center">
      {/* Botón Favorito */}
      <button className="absolute top-3 right-3 group transition">
        <img
          src={FavOnIcon}
          alt="Favorito"
          className="w-6 h-6 group-hover:hidden"
        />
        <img
          src={FavOffIcon}
          alt="Favorito"
          className="w-6 h-6 hidden group-hover:block"
        />
      </button>

      <div>
        <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-primary text-center">
          Noteworthy technology 2021
        </h5>
      </div>

      {/* Opciones */}
      <div className="mt-6 space-y-4">
        {options.map((option, index) => (
          <div
            key={option.value}
            className="flex items-center bg-gray-100 rounded-md px-4 py-2">
            {/* Icono según si es correcto o no */}
            {option.isCorrect ? (
              <Check className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <X className="w-5 h-5 text-red-500 mr-2" />
            )}
            <span className="text-sm font-medium text-gray-900">
              {option.label}
            </span>
          </div>
        ))}
      </div>

      {/* --- BOTONES INFERIORES --- */}
      <div className="flex justify-around mt-2 border-t border-gray-200 pt-3">
        {/* Botón 1 */}
        <button className="group transition">
          <img
            src={PrevOnIcon}
            alt="Ir anterior"
            className="w-8 h-8 group-hover:hidden"
          />
          <img
            src={PrevOffIcon}
            alt="Ir anterior"
            className="w-8 h-8 hidden group-hover:block"
          />
        </button>

        {/* Botón 2 */}
        <button className="group transition">
          <ButtonComponent text="Ver" icon={ArrowRight} />
        </button>

        {/* Botón 3 */}
        <button className="group transition">
          <img
            src={NextOnIcon}
            alt="Ir siguiente"
            className="w-8 h-8 group-hover:hidden"
          />
          <img
            src={NextOffIcon}
            alt="Ir siguiente"
            className="w-8 h-8 hidden group-hover:block"
          />
        </button>
      </div>
    </div>
  );
}
