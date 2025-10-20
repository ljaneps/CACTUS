import { useEffect, useState } from "react";
import { CardMainTopicComponent } from "../cards/cardMainTopicComponent";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MainUserSection() {
  const { user } = useAuth();
  const [userTopics, setUserTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null); // ✅ se define aquí
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.username) return;

    const fetchUserTopics = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/topics/topics-by-user/${user.username}`
        );
        if (!response.ok) {
          throw new Error(`Error al obtener temas: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        setUserTopics(data);
      } catch (error) {
        console.error("Error al obtener los temas del usuario:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserTopics();
  }, [user]);

  const handleSelect = (topicId) => {
    const topic = userTopics.find((item) => item.topic.topic_code === topicId);
    setSelectedTopic(topic); // ✅ ahora esta función sí existe
    navigate(`/subMain/${topicId}`, { state: { topic } });
    console.log("Seleccionaste el tema:", topic);
  };

  if (loading) {
    return <p className="text-center mt-10">Cargando temas...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 items-center">
      {userTopics.map((item) => (
        <div key={item.topic.topic_code} className="flex items-center">
          <CardMainTopicComponent
            currentuser={user.username}
            id={item.topic.topic_code}
            title={item.topic.topic_title}
            description={item.topic.description}
            date_ini={item.date_ini}
            date_goal={item.date_goal}
            low_percent={item.low_percent}
            intermediate_percent={item.intermediate_percent}
            high_percent={item.high_percent}
            onSelect={() => handleSelect(item.topic.topic_code)}
            option="delete"
          />
        </div>
      ))}
    </div>
  );
}
