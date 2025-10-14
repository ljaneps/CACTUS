import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import HeaderLayout from "./layouts/HeaderLayout";
import MainLayout from "./layouts/MainLayout";
import TopicLayout from "./layouts/TopicLayout";
import MainUserPage from "./pages/MainUserPage";
import SubTopicUserPage from "./pages/SubTopicUserPage";
import CreateTopicPage from "./pages/CreateTopicPage";
import { Testcomponent } from "./components/Testcomponent";

export default function Home() {
  return (
    <Router>
      <Routes>
        {/* Layout con solo Header */}
        <Route element={<HeaderLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<CreateAccountPage />} />
          <Route path="create-topic" element={<CreateTopicPage />} />
        </Route>

        {/* Layout con Sidebar + Header */}
        <Route element={<TopicLayout />}>
          <Route path="main" element={<MainUserPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="subMain/:topicId" element={<SubTopicUserPage />} />
        </Route>

        {/* Redirecciones */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
