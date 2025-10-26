import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpenText, Library, BookCheck } from "lucide-react";

export function CardSubTopicComponent({
  topic,
  subtopic,
  title,
  description,
  href,
}) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const hasFlashcards = subtopic?.flashcards?.length > 0;

  useEffect(() => {
    if (!hasFlashcards) {
      console.log(
        "No hay flashcards disponibles para este subtema:",
        subtopic.subtopic_title
      );
    }
  }, [hasFlashcards, subtopic]);

  const handleStudyClick = () => {
    if (!hasFlashcards) return;
    navigate(`/subMain/${topic.topic_code}/study`, {
      state: { subtopic, topic },
    });
  };

  const handleListClick = () => {
      navigate(`/subMain/${topic.topic_code}/content-detail`, {
        state: { subtopic, topic },
      });
  };

  const handleGoClick = () => {
    if (!hasFlashcards) return;
    navigate(`/subMain/${topic.topic_code}/go-test`, {
      state: { subtopic, topic },
    });
  };

  return (
    <div className="w-96 h-72 p-6 bg-gradient-to-b from-primary to-secondary border-gray-300 rounded-lg shadow-sm dark:bg-white flex flex-col justify-between">
      {/* --- CONTENIDO --- */}
      <div>
        {href ? (
          <a href={href}>
            <h5 className="mb-5 text-lg font-bold tracking-tight text-white text-center hover:text-white transition-colors">
              {title}
            </h5>
          </a>
        ) : (
          <h5 className="mb-5 text-lg font-bold tracking-tight text-white text-center">
            {title}
          </h5>
        )}

        <p className="mb-2 font-normal text-gray-200 text-justify">
          {description}
        </p>
      </div>

      {/* --- BOTONES INFERIORES --- */}
      <div className="flex justify-around mt-2 border-t border-gray-200 pt-3">
        {/* Botón 1 - Estudiar */}
        <button
          onClick={handleStudyClick}
          disabled={!hasFlashcards}
          className={`${
            hasFlashcards
              ? "text-white hover:text-primary-medium"
              : "text-gray-400 cursor-not-allowed"
          }`}
          title={
            hasFlashcards
              ? "Estudiar"
              : "No hay flashcards disponibles para estudiar"
          }>
          <BookOpenText size={26} />
        </button>

        {/* Botón 2 - List detail Flashcards */}
        <button
          onClick={handleListClick}
          className="text-white hover:text-primary-medium"
          title="Flashcards detalle">
          <Library size={26} />
        </button>

        {/* Botón 3 - TEST */}
        <button
          onClick={handleGoClick}
          disabled={!hasFlashcards}
          className={`${
            hasFlashcards
              ? "text-white hover:text-primary-medium"
              : "text-gray-400 cursor-not-allowed"
          }`}
          title={
            hasFlashcards
              ? "Test"
              : "No hay flashcards disponibles para realizar el test"
          }>
          <BookCheck size={26} />
        </button>
      </div>
    </div>
  );
}
