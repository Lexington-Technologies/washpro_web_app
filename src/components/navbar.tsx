import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#25306B",
        boxShadow: "none",
        padding: "20px 10px",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Welcome Section */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: "#ffffff", // White text
              fontWeight: "bold",
            }}
          >
            Welcome, Muhammad Buhari
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: "#dcdcdc", // Light text
            }}
          >
            Governor
          </Typography>
        </Box>

        {/* Icons Section */}
        <Box>
        <IconButton
        sx={{
          bgcolor: "white",
          borderRadius: "50%",
          width: 36,
          height: 36,
          "&:hover": {
            bgcolor: "#e0e0e0", 
          },
          marginRight: 1,
        }}
      >
        <NotificationsIcon sx={{ color: "#25306B", fontSize: "20px" }} />
      </IconButton>

      {/* Settings Icon */}
      <IconButton
        sx={{
          bgcolor: "white",
          borderRadius: "50%",
          width: 36,
          height: 36,
          "&:hover": {
            bgcolor: "#e0e0e0", 
          },
        }}
      >
        <SettingsIcon sx={{ color: "#25306B", fontSize: "20px" }} />
      </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
