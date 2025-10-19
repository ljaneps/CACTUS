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
  const header = topic.topic_title;

  const handleStudyClick = () => {
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
    navigate(`/subMain/${topic.topic_code}/go-test`, {
      state: { subtopic, topic },
    });
  };

  return (
    <div className="w-96 h-72 p-6 bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-white flex flex-col justify-between">
      {/* --- CONTENIDO --- */}
      <div>
        {href ? (
          <a href={href}>
            <h5 className="mb-5 text-lg font-bold tracking-tight text-gray-900 dark:text-primary text-center hover:text-primary transition-colors">
              {title}
            </h5>
          </a>
        ) : (
          <h5 className="mb-5 text-lg font-bold tracking-tight text-gray-900 dark:text-primary text-center">
            {title}
          </h5>
        )}

        <p className="mb-2 font-normal text-gray-700 dark:text-gray-400 text-justify">
          {description}
        </p>
      </div>

      {/* --- BOTONES INFERIORES --- */}
      <div className="flex justify-around mt-2 border-t border-gray-200 pt-3">
        {/* Botón 1 - Estudiar */}
        <button
          onClick={handleStudyClick}
          className="text-emerald-900 hover:text-primary-medium"
          title="Estudiar">
          <BookOpenText size={24} />
        </button>

        {/* Botón 2 - List detail Flashcards */}
        <button
          onClick={handleListClick}
          className="text-emerald-900 hover:text-primary-medium"
          title="Flashcards detalle">
          <Library size={24} />
        </button>

        {/* Botón 3 - TEST */}
        <button
          onClick={handleGoClick}
          className="text-emerald-900 hover:text-primary-medium"
          title="Test">
          <BookCheck size={24} />
        </button>
      </div>
    </div>
  );
}
