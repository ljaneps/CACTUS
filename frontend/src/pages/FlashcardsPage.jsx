import { FlashcardsSection } from "../components/sections/FlashcardsSection";
import CheckAuth from "../components/CheckAuth";
import { useLocation, useNavigate } from "react-router-dom";

export default function FlashcardsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const topicId = location.state?.topic?.topic_code;

  return (
    <CheckAuth requireAuth={true}>
      <FlashcardsSection
        topicId={topicId}
        onBack={() => navigate(`/subMain/${topicId}`)}
      />
    </CheckAuth>
  );
}
