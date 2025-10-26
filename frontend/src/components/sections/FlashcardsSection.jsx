import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardComponent } from "../cards/CardComponent";
import { Eye } from "lucide-react";
import SectionHeader from "./HeaderSection";

export function FlashcardsSection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subtopic, topic } = location.state || {};
  const [flashcards, setFlashcards] = useState(subtopic?.flashcards || []);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);


  // useEffect(() => {
  //   const fetchFlashcards = async () => {
  //     if (!subtopic?.subtopic_code) return;

  //     if (!subtopic.flashcards || subtopic.flashcards.length === 0) {
  //       try {
  //         setLoading(true);
  //         const response = await fetch(
  //           "http://localhost:8000/topics/generar-flashcards",
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //               Authorization: `Bearer ${localStorage.getItem("token")}`,
  //             },
  //             body: JSON.stringify({
  //               subtopic_code: subtopic.subtopic_code,
  //               subtopic_title:
  //                 subtopic.subtopic_title + " sobre " + topic.topic_title,
  //             }),
  //           }
  //         );

  //         if (!response.ok) {
  //           throw new Error("Error al generar las flashcards");
  //         }

  //         const data = await response.json();
  //         setFlashcards(data.flashcards);
  //       } catch (error) {
  //         console.error("Error generando flashcards:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   fetchFlashcards();
  // }, [subtopic, topic]);

  // // Mostrar cargando
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <p className="text-gray-500">Generando flashcards...</p>
  //     </div>
  //   );
  // }

  // Mostrar mensaje si no hay flashcards
  if (!flashcards.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">No hay flashcards disponibles.</p>
      </div>
    );
  }

  // Navegación entre tarjetas
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
