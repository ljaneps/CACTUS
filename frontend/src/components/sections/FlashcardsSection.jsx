import { useState } from "react";
import { useLocation } from "react-router-dom";
import { CardComponent } from "../cards/CardComponent";
import { Eye } from "lucide-react";

export function FlashcardsSection() {
  const location = useLocation();
  const { subtopic, header } = location.state || {};
  const flashcards = subtopic?.flashcards || [];

  // Estado para controlar qué flashcard se muestra
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navegar entre flashcards
  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Flashcard actual
  const currentFlashcard = flashcards[currentIndex];

  if (!currentFlashcard) return <p>No hay flashcards disponibles.</p>;

  return (
    <div className="min-h-screen">
      {/* ENCABEZADO */}
      <div className="p-16 flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-emerald-900 uppercase">
          {header} &gt; {subtopic?.subtopic_title || "SUBTEMA"}
        </h1>
      </div>

      {/* CONTENIDO PRINCIPAL (centrado) */}
      <div className="flex-1 flex flex-col items-center justify-start pt-8">
        <CardComponent
          title={currentFlashcard.sentence}
          content={currentFlashcard.explanation}
          mainButtonText="Reverso"
          mainButtonIcon={Eye}
          mainButtonAction={() =>
            console.log("Ver detalles de", subtopic.subtopic_title)
          }
          onPrev={handlePrev}
          onNext={handleNext}
        />

        <div className="mt-2 text-sm text-gray-500">
          {currentIndex + 1} / {flashcards.length}
        </div>
      </div>
    </div>
  );
}
