import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useSidebar } from "../context/SidebarContext";
import MainUserSection from "../components/sections/MainUserSection";
import CheckAuth from "../components/CheckAuth";
import SubTopicUserPage from "./SubTopicUserPage";

export default function MainUserPage() {
  const { user } = useAuth();
  const { setUser } = useSidebar();
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    setUser(user); // actualiza el contexto para que Sidebar lo lea
  }, [user]);

  return (
    <CheckAuth requireAuth={true}>
      <div>
        <MainUserSection
          user={user}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
        />
        {selectedTopic && <SubTopicUserPage topic={selectedTopic} />}
      </div>
    </CheckAuth>
  );
}
