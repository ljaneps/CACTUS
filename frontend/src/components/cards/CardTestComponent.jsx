import FavOnIcon from "../../assets/icons/icon_fav_primary.svg";
import FavOffIcon from "../../assets/icons/icon_fav_secondary.svg";
import { ButtonComponent } from "../buttons/ButtonComponent";
import { ArrowRight } from "lucide-react";
import NextOnIcon from "../../assets/icons/icon_next_primary.svg";
import NextOffIcon from "../../assets/icons/icon_next_seconday.svg";
import PrevOnIcon from "../../assets/icons/icon_prev_primary.svg";
import PrevOffIcon from "../../assets/icons/icon_prev_secondary.svg";

export function CardTestComponent({ options }) {
  return (
    <div
      className="relative w-full sm:w-4/6 md:w-3/5 lg:max-w-5xl xl:max-w-5xl min-h-[18rem] p-6 
                bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-white 
                flex flex-col text-center">
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
      <fieldset className="mt-2 space-y-4">
        <legend className="sr-only">Countries</legend>

        {options.map((option, index) => (
          <div key={option.value} className="flex items-center">
            {/* Radio oculto */}
            <input
              type="radio"
              name="countries"
              id={`option-${index}`}
              value={option.value}
              defaultChecked={option.defaultChecked}
              className="peer hidden"
            />

            {/* Label estilizado como “card” */}
            <label
              htmlFor={`option-${index}`}
              className="flex items-center justify-between w-full rounded-md px-4 py-2 cursor-pointer 
              bg-gray-100 hover:bg-gray-300 
              peer-checked:bg-primary-light  transition-colors duration-200">
              <span className="text-sm font-medium text-gray-900 peer-checked:text-white transition-colors duration-200">
                {option.label}
              </span>
            </label>
          </div>
        ))}
      </fieldset>

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
