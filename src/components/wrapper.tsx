import Navbar from "./navbar";
import { Box } from "@mui/material";
import SideBar from "./sidebar";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflowY: "hidden"}}>
      {/* Sidebar */}
        <SideBar />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, padding: 1, overflowY: "scroll" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
