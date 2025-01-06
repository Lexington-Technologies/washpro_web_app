import { useState } from "react";
import Navbar from "./navbar";
import { Box } from "@mui/material";
import SideBar from "./sidebar";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";

export default function Wrapper() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuthStore();

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }  

  return (
    <Box sx={{ display: "flex", height: "100vh", overflowY: "hidden" }}>
      {/* Sidebar */}
      <SideBar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, padding: 1, overflowY: "scroll" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
