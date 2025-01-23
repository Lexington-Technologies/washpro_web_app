import { Box } from "@mui/material";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import Navbar from "./navbar";
import SideBar from "./sidebar";
import { useTheme, useMediaQuery } from "@mui/material";

export default function Wrapper() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleSidebar = () => {
    if (!isMobile) {
      setSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", overflowY: "hidden" }}>
      {/* Sidebar */}
      <SideBar
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        isDrawerOpen={isDrawerOpen}
        onDrawerToggle={toggleDrawer}
      />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Navbar 
          onMenuClick={toggleDrawer}
          onSidebarToggle={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <Box sx={{ flexGrow: 1, padding: 1, overflowY: "scroll" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
