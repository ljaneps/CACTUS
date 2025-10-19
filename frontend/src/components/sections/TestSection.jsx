import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardTestComponent } from "../cards/CardTestComponent";
import SectionHeader from "./HeaderSection";

export function TestSection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subtopic, topic } = location.state || {};
  const flashcards = subtopic?.flashcards || [];

  // ✅ Aplanar todas las preguntas de las flashcards
  const allQuestions = flashcards.flatMap((fc) => fc.questions || []);

  // ✅ Estado para manejar qué pregunta se muestra
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = allQuestions[currentIndex];

  // ✅ Mapeamos las opciones para el Card
  const options =
    currentQuestion?.options?.map((opt) => ({
      value: opt.letter,
      label: `${opt.letter}. ${opt.option}`,
      explanation: opt.explanation,
      isCorrect: opt.letter === currentQuestion.option_correct_letter,
    })) || [];

  // ✅ Handlers
  const handleOptionChange = (value) => {
    console.log("Seleccionaste:", value);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, allQuestions.length - 1));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ENCABEZADO */}
      <div>
        <SectionHeader
          topic={topic?.topic_title}
          subtopic={subtopic?.subtopic_title}
          onBack={() => navigate(`/subMain/${topic?.topic_code}`)}
        />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col items-center justify-start pt-0">
        {currentQuestion ? (
          <CardTestComponent
            key={currentQuestion.id || currentQuestion.question} // 🔑 CLAVE ÚNICA
            title={currentQuestion.question}
            options={options}
            onOptionChange={handleOptionChange}
            onPrev={handlePrev}
            onNext={handleNext}
            mainButtonText="Ver respuesta"
          />
        ) : (
          <p>No hay preguntas disponibles.</p>
        )}
      </div>
    </div>
  );
}
