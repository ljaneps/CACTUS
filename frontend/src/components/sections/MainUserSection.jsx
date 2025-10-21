import { useEffect, useState } from "react";
import { CardMainTopicComponent } from "../cards/cardMainTopicComponent";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MainUserSection() {
  const { user } = useAuth();
  const [userTopics, setUserTopics] = useState([]);
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
        console.log("Temas del usuario:", data);
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
    if (!topic) return console.warn("No se encontró el tema con ID:", topicId);

    navigate(`/subMain/${topicId}`, { state: { topic } });
  };

  const handleDelete = (id) => {
    setUserTopics((prevTopics) =>
      prevTopics.filter((item) => item.topic.topic_code !== id)
    );
  };


  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Cargando temas...</p>;
  }

  if (userTopics.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-300 text-4xl p-9">
        No tienes temas asignados todavía.
      </p>
    );
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
            onDelete={handleDelete}
          />
        </div>
      ))}
    </div>
  );
}
