import { ButtonComponent } from "../buttons/ButtonComponent";
import NextOnIcon from "../../assets/icons/icon_next_primary.svg";
import NextOffIcon from "../../assets/icons/icon_next_seconday.svg";
import PrevOnIcon from "../../assets/icons/icon_prev_primary.svg";
import PrevOffIcon from "../../assets/icons/icon_prev_secondary.svg";
import { FavoriteButtonComponent } from "../buttons/FavoriteButtonComponent";

export function CardComponent({
  title,
  content,
  mainButtonText,
  mainButtonIcon,
  mainButtonAction,
  onPrev,
  onNext,
}) {
  return (
    <div className="relative w-full sm:w-4/6 md:w-3/5 lg:max-w-5xl xl:max-w-5xl min-h-[18rem] p-6 bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-white flex flex-col justify-between text-center">
      {/* --- BOTÓN FAVORITO ---  ejemploooo */}
      <FavoriteButtonComponent apiUrl="http://localhost:8000" itemId={123} />

      {/* --- CONTENIDO CENTRAL --- */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h5 className="mb-5 text-lg sm:text-2xl font-bold tracking-tight text-primary text-center">
          {title}
        </h5>
        {content && (
          <p className="mb-2 font-normal text-gray-700 dark:text-gray-400 break-words text-sm sm:text-base text-center">
            {content}
          </p>
        )}
      </div>

      {/* --- BOTONES INFERIORES --- */}
      <div className="flex justify-around mt-2 border-t border-gray-200 pt-3">
        <button className="group transition" onClick={onPrev}>
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

        {mainButtonText && mainButtonIcon && (
          <div className="group transition">
            <ButtonComponent
              text={mainButtonText}
              icon={mainButtonIcon}
              onClick={mainButtonAction}
            />
          </div>
        )}

        <button className="group transition" onClick={onNext}>
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
