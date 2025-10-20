import { useEffect, useState } from "react";
import { CardMainTopicComponent } from "../cards/cardMainTopicComponent";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function FreeTopicsSection() {
  const { user } = useAuth();
  const [freeTopics, setFreeTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.username) return;

    const fetchFreeTopics = async () => {
      try {
        const response = await fetch("http://localhost:8000/topics/topics");
        if (!response.ok) {
          throw new Error(`Error al obtener temas: ${response.statusText}`);
        }
        const data = await response.json();
        setFreeTopics(data);
      } catch (error) {
        console.error(
          "Error al obtener los temas libres para el usuario:",
          error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchFreeTopics();
  }, [user]);

  if (loading) return <p>Cargando temas...</p>;
  if (!freeTopics.length) return <p>No hay temas disponibles.</p>;

  // Agrupar por categoría
  const topicsByCategory = freeTopics.reduce((acc, topic) => {
    if (!acc[topic.category]) acc[topic.category] = [];
    acc[topic.category].push(topic);
    return acc;
  }, {});

  return (
    <div className="space-y-10 p-6">
      {Object.entries(topicsByCategory).map(([category, topics]) => (
        <div key={category}>
          <h2 className="text-xl font-bold text-gray-800 mb-4">{category}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((item) => (
              <CardMainTopicComponent
                key={item.topic_code}
                currentuser={user.username}
                id={item.topic_code}
                title={item.topic_title}
                description={item.description}
                date_ini={item.date_ini}
                date_goal={item.date_goal}
                low_percent={item.low_percent}
                intermediate_percent={item.intermediate_percent}
                high_percent={item.high_percent}
                onSelect={() => console.log("Seleccionado:", item.topic_code)}
                option="add"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
