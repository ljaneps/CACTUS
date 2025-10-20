import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardTestComponent } from "../cards/CardTestComponent";
import SectionHeader from "./HeaderSection";

export function TestSection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subtopic, topic } = location.state || {};
  const flashcards = subtopic?.flashcards || [];

  const allQuestions = flashcards.flatMap((fc) => fc.questions || []);


  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]); 
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = allQuestions[currentIndex];


  const options =
    currentQuestion?.options?.map((opt) => ({
      value: opt.letter,
      label: `${opt.letter}. ${opt.option}`,
      explanation: opt.explanation,
      isCorrect: opt.letter === currentQuestion.option_correct_letter,
    })) || [];


  const handleOptionChange = (value) => {
    const isCorrect = value === currentQuestion.option_correct_letter;

    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        question: currentQuestion.question,
        selected: value,
        isCorrect,
      };
      return updated;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };


  const total = answers.length;
  const correct = answers.filter((a) => a?.isCorrect).length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = percentage >= 70; // Por ejemplo, 70% es aprobado

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
      <div className="flex-1 flex flex-col items-center justify-start pt-0">
        {showResult ? (
          <div className="flex flex-col items-center mt-10">
            <h2 className="text-2xl font-bold mb-4">🎯 Resultado del Test</h2>
            <p className="text-lg mb-2">
              Aciertos: {correct} / {total}
            </p>
            <p
              className={`text-xl font-semibold ${
                passed ? "text-green-600" : "text-red-600"
              }`}>
              {percentage}% — {passed ? "✅ Aprobado" : "❌ Suspendido"}
            </p>

            <button
              onClick={() => navigate(`/subMain/${topic?.topic_code}`)}
              className="mt-6 px-6 py-2 bg-primary-light text-white rounded-md hover:bg-primary-medium">
              Volver al subtema
            </button>
          </div>
        ) : currentQuestion ? (
          <CardTestComponent
            key={currentQuestion.id || currentQuestion.question}
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
