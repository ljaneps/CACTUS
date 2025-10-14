import { useAuth } from "../context/AuthContext";
import CheckAuth from "../components/CheckAuth";
import CreateTopicSection from "../components/sections/CreateTopicSection";

export default function CreateTopicPage() {
  const { user } = useAuth();

  return (
    <CheckAuth requireAuth={true}>
      <div>
        <CreateTopicSection />
      </div>
    </CheckAuth>
  );
}
