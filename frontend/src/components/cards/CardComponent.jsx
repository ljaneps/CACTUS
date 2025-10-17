import { FavoriteButtonComponent } from "../buttons/FavoriteButtonComponent";
import { ButtonComponent } from "../buttons/ButtonComponent";
import { useState } from "react";
import { ArrowBigRight, ArrowBigLeft } from "lucide-react";

export function CardComponent({
  title,
  content,
  mainButtonText,
  mainButtonIcon,
  mainButtonAction,
  onPrev,
  onNext,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="relative w-full sm:w-4/6 md:w-3/5 lg:max-w-5xl xl:max-w-5xl min-h-[18rem] p-6 bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-white flex flex-col justify-between text-center">
      {/* --- BOTÓN FAVORITO --- */}
      <FavoriteButtonComponent apiUrl="http://localhost:8000" itemId={123} />

      {/* --- CONTENEDOR ROTACIÓN --- */}
      <div className="relative flex-1 flex flex-col items-center justify-center perspective">
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}>
          {/* --- CARA FRONTAL --- */}
          <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center">
            <h5 className="mb-5 text-lg sm:text-2xl font-bold tracking-tight text-primary text-center">
              {title}
            </h5>
            <p className="mb-2 font-normal text-gray-700 dark:text-gray-400 break-words text-sm sm:text-base text-center">
              {/* Opcional: preview breve */}
            </p>
          </div>

          {/* --- CARA TRASERA --- */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center">
            <p className="mb-2 font-normal text-gray-900 dark:text-gray-900 break-words text-sm sm:text-base text-center">
              {content}
            </p>
          </div>
        </div>
      </div>

      {/* --- CONTROLES INFERIORES CON BOTÓN MAIN --- */}
      <div className="flex justify-between items-center mt-3 px-4">
        <button
          onClick={onPrev}
          className="text-emerald-900 hover:text-primary-medium"
          title="Guardar nueva flashcard">
          <ArrowBigLeft size={24} />
        </button>

        {/* Botón principal alineado al centro */}
        <ButtonComponent
          text={isFlipped ? "Anverso" : mainButtonText}
          icon={mainButtonIcon}
          onClick={handleFlip}
          variant={isFlipped ? "secondary" : "primary"}
        />

        <button
          onClick={onNext}
          className="text-emerald-900 hover:text-primary-medium"
          title="Guardar nueva flashcard">
          <ArrowBigRight size={24} />
        </button>
      </div>
    </div>
  );
}
