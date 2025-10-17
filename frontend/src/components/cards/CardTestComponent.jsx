import { Check, X, ArrowBigRight, ArrowBigLeft, CheckCheck } from "lucide-react";
import { useState } from "react";
import { ButtonComponent } from "../buttons/ButtonComponent";
import { FavoriteButtonComponent } from "../buttons/FavoriteButtonComponent";

export function CardTestComponent({
  title,
  options,
  onOptionChange,
  onPrev,
  onNext,
  mainButtonText = "Ver respuesta",
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div
      className="relative w-full sm:w-4/6 md:w-3/5 lg:max-w-5xl xl:max-w-5xl min-h-[26rem] 
                 p-6 bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col justify-between text-center">
      {/* --- BOTÓN FAVORITO --- */}
      <FavoriteButtonComponent apiUrl="http://localhost:8000" itemId={123} />

      {/* --- CONTENEDOR CON ROTACIÓN --- */}
      <div className="relative flex-1 flex flex-col items-center justify-center perspective">
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}>
          {/* --- CARA FRONTAL: PREGUNTA --- */}
          <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center">
            <h5 className="text-lg font-bold text-gray-900 mb-4">{title}</h5>

            <fieldset className="mt-2 space-y-3 w-full px-6">
              {options.map((option, index) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name={`options-${title}`} // 👈 grupo único por tarjeta
                    id={`option-${index}-${title}`}
                    value={option.value}
                    className="peer hidden"
                    onChange={() => onOptionChange?.(option.value)}
                  />
                  <label
                    htmlFor={`option-${index}-${title}`}
                    className="flex items-center justify-between w-full rounded-md px-4 py-2 cursor-pointer 
                   bg-gray-100 hover:bg-gray-300 
                   peer-checked:bg-emerald-600 peer-checked:text-white transition-colors duration-200">
                    <span className="text-sm font-medium text-gray-900 peer-checked:text-white">
                      {option.label}
                    </span>
                  </label>
                </div>
              ))}
            </fieldset>
          </div>

          {/* --- CARA TRASERA: RESPUESTAS --- */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center">
            <h5 className="text-lg font-bold text-gray-900 mb-4">Respuestas</h5>
            <div className="space-y-3 w-full px-6">
              {options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center bg-gray-100 rounded-md px-4 py-2 text-left">
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
          </div>
        </div>
      </div>

      {/* --- CONTROLES INFERIORES --- */}
      <div className="flex justify-between items-center mt-4 px-4 border-t border-gray-200 pt-3">
        <button
          onClick={onPrev}
          className="text-emerald-900 hover:text-primary-medium"
          title="Guardar nueva flashcard">
          <ArrowBigLeft size={24} />
        </button>

        <ButtonComponent
          text={isFlipped ? "Volver a pregunta" : mainButtonText}
          icon={CheckCheck}
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
