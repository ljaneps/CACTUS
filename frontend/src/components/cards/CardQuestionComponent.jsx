import { ButtonComponent } from "../buttons/ButtonComponent";
import { ArrowRight } from "lucide-react";
import NextOnIcon from "../../assets/icons/icon_next_primary.svg";
import NextOffIcon from "../../assets/icons/icon_next_seconday.svg";
import PrevOnIcon from "../../assets/icons/icon_prev_primary.svg";
import PrevOffIcon from "../../assets/icons/icon_prev_secondary.svg";
import FavOnIcon from "../../assets/icons/icon_fav_primary.svg";
import FavOffIcon from "../../assets/icons/icon_fav_secondary.svg";

export function CardQuestionComponent() {
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
      <div className="flex-1 flex items-center justify-center">
        <h5 className="text-2xl font-bold tracking-tight text-primary">
          ¿Noteworthy technology acquisitions 2021?
        </h5>
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
