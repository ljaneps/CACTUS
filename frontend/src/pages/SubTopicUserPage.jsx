import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import CheckAuth from "../components/CheckAuth";
import SubTopicUserSection from "../components/sections/SubTopicUserSection";

export default function SubTopicUserPage() {
  const { user } = useAuth();
  const location = useLocation();
  const topic = location.state?.topic; // ✅ aquí llega el topic desde navigate

  return (
    <CheckAuth requireAuth={true}>
      <SubTopicUserSection topic={topic} user={user} />
    </CheckAuth>
  );
}
