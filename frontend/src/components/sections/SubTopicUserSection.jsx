import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { CardSubTopicComponent } from "../cards/CardSubTopicComponent";

export default function SubTopicUserSection() {
  const { topicId } = useParams(); // <-- SIEMPRE viene de la URL
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [topicData, setTopicData] = useState(null);

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

      {/* Contenido principal */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topicData?.subtopics?.map((subtopic) => (
          <div key={subtopic.subtopic_code}>
            <CardSubTopicComponent
              topic={topicData} // <-- AHORA VIENE DE LA API
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
