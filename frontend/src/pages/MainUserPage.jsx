import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import MainUserSection from "../components/sections/MainUserSection";
import CheckAuth from "../components/CheckAuth";
import SubTopicUserPage from "./SubTopicUserPage";

export default function MainUserPage() {
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState(null);

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
