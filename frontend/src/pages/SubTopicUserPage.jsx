import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { useEffect } from "react";
import CheckAuth from "../components/CheckAuth";
import SubTopicUserSection from "../components/sections/SubTopicUserSection";

export default function SubTopicUserPage() {
  const { user } = useAuth();
  const location = useLocation();
  const { setSelectedTopic } = useSidebar();
  const topic = location.state?.topic; // ✅ aquí llega el topic desde navigate

  useEffect(() => {
    if (topic) {
      setSelectedTopic(topic); // actualiza el contexto
      localStorage.setItem("selectedTopic", JSON.stringify(topic)); // opcional para persistencia
    } else {
      // si no hay state, lo tomamos de localStorage
      const saved = localStorage.getItem("selectedTopic");
      if (saved) setSelectedTopic(JSON.parse(saved));
    }
  }, [topic]);
  return (
    <CheckAuth requireAuth={true}>
      <SubTopicUserSection topic={topic} user={user} />
    </CheckAuth>
  );
}
