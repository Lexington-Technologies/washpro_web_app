import { useState } from "react";
import Navbar from "./navbar";
import { Box } from "@mui/material";
import SideBar from "./sidebar";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflowY: "hidden" }}>
      {/* Sidebar */}
      <SideBar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Navbar onToggleSidebar={toggleSidebar} />
        <Box sx={{ flexGrow: 1, padding: 1, overflowY: "scroll" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
