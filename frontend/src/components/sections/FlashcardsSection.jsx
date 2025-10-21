import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardComponent } from "../cards/CardComponent";
import { Eye } from "lucide-react";
import SectionHeader from "./HeaderSection";

export function FlashcardsSection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subtopic, topic } = location.state || {};
  const flashcards = subtopic?.flashcards || [];
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const currentFlashcard = flashcards[currentIndex];

  if (!currentFlashcard) return <p>No hay flashcards disponibles.</p>;

  return (
    <div className="min-h-screen">
      <div>
        <SectionHeader
          topic={topic?.topic_title}
          subtopic={subtopic?.subtopic_title}
          onBack={() => navigate(`/subMain/${topic?.topic_code}`)}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start pt-4">
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
