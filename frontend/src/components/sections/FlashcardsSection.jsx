import { useState } from "react";
import { useLocation } from "react-router-dom";
import { CardComponent } from "../cards/CardComponent";
import { Eye } from "lucide-react";

export function FlashcardsSection() {
  const location = useLocation();
  const { subtopic } = location.state || {};
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
    <div className="flex flex-col items-center justify-start min-h-[80vh] pt-32">
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
  );
}
