import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { CardSubTopicComponent } from "../cards/CardSubTopicComponent";
import { Plus } from "lucide-react";

export default function SubTopicUserSection() {
  const { topicId } = useParams(); // <-- SIEMPRE viene de la URL
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [topicData, setTopicData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.username || !topicId) return;

    const fetchUserSubTopics = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/topics/topic-detail/${topicId}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los subtemas del usuario");
        }
        const data = await response.json();
        setTopicData(data);
        console.log("Subtemas obtenidos:", data);
      } catch (error) {
        console.error("Error al obtener los subtemas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSubTopics();
  }, [user, topicId]);

  const handleCreateSub = () => {
    navigate(`/subMain/${topicId}/new-sub`, {
      state: { topicId },
    });
  };

  if (loading) return <p>Cargando subtemas...</p>;
  if (!topicData) return <p>No se encontraron datos del tema.</p>;

  return (
    <div className="min-h-screen px-6 py-8">
      {/* Header */}
      <header className="mb-14 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-emerald-900 uppercase tracking-wide">
          {topicData?.topic_title || "TEMA"}
        </h1>
      </header>

      {/* Card para crear nuevo subtema*/}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="w-96 h-72 p-6 bg-gradient-to-b from-primary to-primary-light border-gray-300 rounded-lg shadow-sm dark:bg-white flex flex-col justify-between">
          <div>
            <h5 className="mb-5 text-lg font-bold tracking-tight dark:text-gray-200 text-center hover:text-white transition-colors">
              Crea tu primer subtema
            </h5>

            <p className="mb-2 font-normal text-gray-2 dark:text-gray-300 text-justify">
              Organiza tus conocimientos en pequeñas secciones. Haz clic aquí
              para añadir un nuevo subtema y comenzar a estudiar de forma más
              estructurada.
            </p>
          </div>

          <div className="flex justify-around mt-2 border-t border-gray-200 pt-3">
            <button
              onClick={handleCreateSub}
              className="text-white hover:text-primary-medium"
              title="Estudiar">
              <Plus size={26} />
            </button>
          </div>
        </div>

        {topicData?.subtopics?.map((subtopic) => (
          <div key={subtopic.subtopic_code}>
            <CardSubTopicComponent
              topic={topicData}
              subtopic={subtopic}
              title={subtopic.subtopic_title}
              description={subtopic.description}
            />
          </div>
        ))}
      </main>
    </div>
  );
}
