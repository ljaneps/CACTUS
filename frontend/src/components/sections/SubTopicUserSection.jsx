import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CardSubTopicComponent } from "../cards/CardSubTopicComponent";

export default function SubTopicUserSection() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [topicData, setTopicData] = useState(null);

  const location = useLocation();
  const topic = location.state?.topic?.topic;
  const topic_code = topic?.topic_code;

  console.log("CODE TOPIC:", topic_code);

  useEffect(() => {
    if (!user?.username || !topic_code) return;

    const fetchUserSubTopics = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/topics/topic-detail/${topic_code}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los subtemas del usuario");
        }
        const data = await response.json();
        setTopicData(data);
        console.log("Subtemas obtenidos:", data);
      } catch (error) {
        console.error("Error al obtener los subtemas del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSubTopics();
  }, [user, topic_code]);

  if (loading) return <p>Cargando subtemas...</p>;
  if (!topicData) return <p>No se encontraron datos del tema.</p>;

return (
  <div className="min-h-screen">
    {/* Header */}
    <header className="flex justify-between items-center px-6 py-4">
      <h1 className="text-2xl font-bold text-emerald-900 uppercase">
        {topic.topic_title}
      </h1>
    </header>

    {/* Contenido principal */}
    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {topicData?.subtopics?.map((subtopic) => (
        <div key={subtopic.subtopic_code} className="flex items-center">
          <CardSubTopicComponent
            header={topic.topic_title}
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
