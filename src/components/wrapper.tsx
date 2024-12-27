import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { Box } from "@mui/material";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflowY: "hidden"}}>
      {/* Sidebar */}
        <Sidebar />

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
