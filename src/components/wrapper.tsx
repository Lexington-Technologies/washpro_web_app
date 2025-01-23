import { Box } from "@mui/material";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import Navbar from "./navbar";
import SideBar from "./sidebar";

export default function Wrapper() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuthStore();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", overflowY: "hidden" }}>
      <SideBar isCollapsed={isCollapsed} onToggle={handleToggle} />
      
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Navbar onMenuClick={handleToggle} />
        <Box sx={{ flexGrow: 1, padding: 1, overflowY: "scroll" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
