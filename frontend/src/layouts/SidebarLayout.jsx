import { Outlet } from "react-router-dom";
import Dashboard from "../components/SidebarComponent";


export default function DashboardLayout() {
  return (
    <Dashboard>
      <Outlet />
    </Dashboard>
  );
}
