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
import { Testcomponent } from "./components/Testcomponent";

export default function Home() {
  return (
    <Router>
      <Routes>
        {/* Layout con solo Header */}
        <Route element={<HeaderLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<CreateAccountPage />} />
        </Route>

        {/* Layout con Sidebar + Header */}
        <Route element={<MainLayout />}>
          <Route path="test" element={<Testcomponent />} />
        </Route>

        {/* Redirecciones */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
