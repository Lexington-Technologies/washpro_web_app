import { AppBar, Box, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from '@mui/icons-material/Menu';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Menu button for mobile */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          {/* Welcome Section */}
          <Box>
            <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: "bold" }}>
              Welcome, Muhammad Buhari
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "#dcdcdc" }}>
              Governor
            </Typography>
          </Box>
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
