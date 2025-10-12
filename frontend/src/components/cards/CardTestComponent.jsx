import { ButtonComponent } from "../buttons/ButtonComponent";
import NextOnIcon from "../../assets/icons/icon_next_primary.svg";
import NextOffIcon from "../../assets/icons/icon_next_seconday.svg";
import PrevOnIcon from "../../assets/icons/icon_prev_primary.svg";
import PrevOffIcon from "../../assets/icons/icon_prev_secondary.svg";
import { Check } from "lucide-react";
import { X } from "lucide-react";
import { FavoriteButtonComponent } from "../buttons/FavoriteButtonComponent";

export function CardTestComponent({
  title,
  options,
  type = "question", // "question" | "result"
  onOptionChange, // solo para type="question"
  onPrev,
  onNext,
  mainButtonText,
  mainButtonIcon,
  mainButtonAction,
}) {
  return (
    <div
      className="relative w-full sm:w-4/6 md:w-3/5 lg:max-w-5xl xl:max-w-5xl min-h-[18rem] p-6 
                 bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-white 
                 flex flex-col text-center">
      {/* --- BOTÓN FAVORITO ---  ejemploooo */}
      <FavoriteButtonComponent apiUrl="http://localhost:8000" itemId={123} />

      {/* Título */}
      <div>
        <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-primary text-center">
          {title}
        </h5>
      </div>

      {/* Opciones */}
      {type === "question" ? (
        <fieldset className="mt-2 space-y-4">
          {options.map((option, index) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                name="options"
                id={`option-${index}`}
                value={option.value}
                defaultChecked={option.defaultChecked}
                className="peer hidden"
                onChange={() => onOptionChange?.(option.value)}
              />
              <label
                htmlFor={`option-${index}`}
                className="flex items-center justify-between w-full rounded-md px-4 py-2 cursor-pointer 
                           bg-gray-100 hover:bg-gray-300 
                           peer-checked:bg-primary-light transition-colors duration-200">
                <span className="text-sm font-medium text-gray-900 peer-checked:text-white transition-colors duration-200">
                  {option.label}
                </span>
              </label>
            </div>
          ))}
        </fieldset>
      ) : (
        <div className="mt-6 space-y-4">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-center bg-gray-100 rounded-md px-4 py-2">
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
      )}

      {/* Botones inferiores */}
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
