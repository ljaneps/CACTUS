import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardTestComponent } from "../cards/CardTestComponent";
import SectionHeader from "./HeaderSection";
import { sortOptions } from "../../utils/utils.js";
import { useAuth } from "../../context/AuthContext";

export function TestSection() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { subtopic, topic } = location.state || {};
  const flashcards = subtopic?.flashcards || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [viewedQuestions, setViewedQuestions] = useState([]);

  const allQuestions = useMemo(
    () => flashcards.flatMap((fc) => fc.questions || []),
    [flashcards]
  );

  const currentQuestion = allQuestions[currentIndex];

  const [userQuestions, setUserQuestions] = useState([]);

  useEffect(() => {
    if (allQuestions.length === 0 || !user?.username) return;

    const questions_codes_list = allQuestions.map((q) => q.question_code);

    fetch(`http://localhost:8000/users/questions/${user.username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic_question_codes: questions_codes_list }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("User questions:", data);
        setUserQuestions(data);
      })
      .catch((err) => console.error("Error fetching user questions:", err));
  }, [user?.username, allQuestions.length]);

  const processUserQuestions = () => {
    const updatedQuestions = allQuestions.map((q, index) => {
      const answer = answers[index];
      const existing = userQuestions.find(
        (uq) => uq.question_code === q.question_code
      );

      const wasCorrect = answer?.isCorrect;
      let level = 1;
      let streak = 0;
      let last_result = wasCorrect ? "correct" : "wrong";

      if (!existing) {
        // Primera vez que se responde
        streak = wasCorrect ? 1 : 0;
        level = 1;
      } else {
        // Ya existía: actualizar progreso
        streak = wasCorrect
          ? existing.streak + 1
          : Math.max(existing.streak - 1, 0);

        // Reglas Leithner (puedes ajustarlas)
        if (streak <= 2) level = 1;
        else if (streak === 3) level = 2;
        else if (streak >= 4) level = 3;
      }

      return {
        username: user.username,
        topic_code: topic.topic_code,
        question_code: q.question_code,
        level,
        streak,
        last_result,
        favourite: existing?.favourite || false,
      };
    });

    // Enviar al backend
    fetch("http://localhost:8000/users/add-or-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_questions: updatedQuestions }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("User questions updated:", data);
      })
      .catch((err) => console.error("Error updating questions:", err));
  };

  //Ordenamos las opciones
  const options = currentQuestion?.options?.map((opt) => ({
    value: opt.letter,
    label: `${opt.letter}. ${opt.option}`,
    explanation: opt.explanation,
    isCorrect: opt.letter === currentQuestion.option_correct_letter,
  }))
    ? sortOptions(
        currentQuestion.options.map((opt) => ({
          value: opt.letter,
          label: `${opt.letter}. ${opt.option}`,
          explanation: opt.explanation,
          isCorrect: opt.letter === currentQuestion.option_correct_letter,
        }))
      )
    : [];

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
    setViewedQuestions((prev) => [...new Set([...prev, currentIndex])]);
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      processUserQuestions();
      setShowResult(true);
    }
  };

  const total = answers.length;
  const correct = answers.filter((a) => a?.isCorrect).length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = percentage >= 70;

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
            viewedQuestions={viewedQuestions}
            currentIndex={currentIndex}
            mainButtonText="Ver respuesta"
          />
        ) : (
          <p>No hay preguntas disponibles.</p>
        )}
      </div>
    </div>
  );
}
