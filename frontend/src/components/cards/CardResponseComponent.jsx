import NextOnIcon from "../../assets/icons/icon_next_primary.svg";
import NextOffIcon from "../../assets/icons/icon_next_seconday.svg";
import PrevOnIcon from "../../assets/icons/icon_prev_primary.svg";
import PrevOffIcon from "../../assets/icons/icon_prev_secondary.svg";
import { ButtonComponent } from "../buttons/ButtonComponent";
import { ArrowLeft } from "lucide-react";
import FavOnIcon from "../../assets/icons/icon_fav_primary.svg";
import FavOffIcon from "../../assets/icons/icon_fav_secondary.svg";

export function CardResponseComponent() {
  return (
    <div className="relative w-full sm:w-4/6 md:w-3/5 lg:max-w-5xl xl:max-w-5xl min-h-[18rem] p-6 bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-white flex flex-col justify-between text-center">
      {/* --- BOTÓN FAVORITO EN ESQUINA SUPERIOR DERECHA --- */}
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

      {/* --- CONTENIDO CENTRAL --- */}
      <div className="items-center justify-center">
        <h5 className="mb-5 text-lg font-bold tracking-tight text-gray-900 dark:text-primary text-center">
          Noteworthy technology 2021
        </h5>

        <p className="mb-2 font-normal text-gray-700 dark:text-gray-400 break-words text-sm sm:text-base text-center">
          Here are the biggest enterprise technology acquisitions of 2021 so
          far, in reverse chronological order.Here are the biggest enterprise
          technology acquisitions of 2021 so far, in reverse chronological
          order.Here are the biggest enterprise technology acquisitions of 2021
          so far, in reverse chronological order.Here are the biggest enterprise
          technology acquisitions of 2021 so far, in reverse chronological
          order.Here are the biggest enterprise technology acquisitions of 2021
          so far, in reverse chronological order.
        </p>
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
          <ButtonComponent text="Back" icon={ArrowLeft} />
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
