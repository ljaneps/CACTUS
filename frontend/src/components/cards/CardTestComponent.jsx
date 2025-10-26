import {
  Check,
  X,
  ArrowBigRight,
  ArrowBigLeft,
  CheckCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ButtonComponent } from "../buttons/ButtonComponent";
import { FavoriteButtonComponent } from "../buttons/FavoriteButtonComponent";

export function CardTestComponent({
  title,
  options,
  onOptionChange,
  onCheckAnswer,
  onPrev,
  onNext,
  mainButtonText = "Ver respuesta",
  currentIndex,
  viewedQuestions,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    if (viewedQuestions?.includes(currentIndex)) {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
      setSelectedOption(null);
    }
  }, [currentIndex, viewedQuestions]);

  useEffect(() => {
    const correctOption = options.find((opt) => opt.isCorrect)?.value || null;
    setIsCorrect(correctOption);
  }, [options]);

  const handleOptionChange = (value) => {
    if (!isFlipped) {
      setSelectedOption(value);
      onOptionChange?.(value);
    }
  };

  const handleShowAnswer = () => {
    if (!selectedOption) return;

    const userIsCorrect = selectedOption === isCorrect;

    onCheckAnswer?.(currentIndex, userIsCorrect, selectedOption);

    setIsFlipped(true);
  };

  const handlePrevClick = () => {
    onPrev?.();
    setIsFlipped(true);
  };

  const handleNextClick = () => {
    onNext?.();
    setIsFlipped(false);
    setSelectedOption(null);
  };

  return (
    <div className="relative w-full sm:w-4/6 md:w-3/5 lg:max-w-5xl xl:max-w-5xl min-h-[26rem] p-6 bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col justify-between text-center">
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
                    name={`options-${title}`}
                    id={`option-${index}-${title}`}
                    value={option.value}
                    className="peer hidden"
                    checked={selectedOption === option.value}
                    onChange={() => handleOptionChange(option.value)}
                    disabled={isFlipped}
                  />
                  <label
                    htmlFor={`option-${index}-${title}`}
                    className={`flex items-center justify-between w-full rounded-md px-4 py-2 transition-colors duration-200 ${
                      isFlipped
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none"
                        : "bg-gray-100 hover:bg-gray-300 peer-checked:bg-primary-light peer-checked:text-white cursor-pointer"
                    }`}>
                    <span
                      className={`text-sm font-medium ${
                        isFlipped
                          ? "text-gray-500"
                          : "text-gray-900 peer-checked:text-white"
                      }`}>
                      {option.label}
                    </span>
                  </label>
                </div>
              ))}
            </fieldset>
          </div>

          {/* --- CARA TRASERA: RESPUESTA --- */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center">
            <h5 className="text-lg font-bold text-gray-900 mb-4">{title}</h5>

            <div className="space-y-3 w-full px-6">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`rounded-md px-4 py-2 text-left ${
                    option.isCorrect
                      ? "bg-green-100 border border-green-300"
                      : "bg-gray-100"
                  }`}>
                  <div className="flex items-center">
                    {option.isCorrect ? (
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                    ) : (
                      <X className="w-5 h-5 text-red-500 mr-2" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        option.isCorrect ? "text-green-800" : "text-gray-900"
                      }`}>
                      {option.label}
                    </span>
                  </div>

                  {option.isCorrect && option.explanation && (
                    <p className="mt-2 ml-7 text-base text-gray-700 italic leading-snug">
                      💡 {option.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTROLES INFERIORES --- */}
      <div className="flex justify-between items-center mt-4 px-4 border-t border-gray-200 pt-3">
        <button
          onClick={handlePrevClick}
          disabled={!isFlipped}
          className={`${
            isFlipped
              ? "text-emerald-900 hover:text-primary-medium"
              : "text-white"
          }`}
          title="Anterior pregunta">
          <ArrowBigLeft size={24} />
        </button>

        {/* Solo mostrar "Ver respuesta" en la cara frontal */}
        {!isFlipped && (
          <ButtonComponent
            text={mainButtonText}
            icon={CheckCheck}
            onClick={handleShowAnswer}
            disabled={!selectedOption}
            variant="primary"
          />
        )}

        <button
          onClick={handleNextClick}
          disabled={!isFlipped}
          className={`${
            isFlipped
              ? "text-emerald-900 hover:text-primary-medium"
              : "text-white"
          }`}
          title="Siguiente pregunta">
          <ArrowBigRight size={24} />
        </button>
      </div>
    </div>
  );
}
