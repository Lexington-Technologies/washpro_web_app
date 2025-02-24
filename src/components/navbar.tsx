// navbar.tsx
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
        transition: "margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: theme.zIndex.drawer + 1,}}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: { xs: '56px !important', md: '100px !important' },
          px: { xs: 1, md: 3 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={onMenuClick}
              sx={{ color: "white" }}
            >
              <MenuIcon sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }} />
            </IconButton>
          )}
          
          <Box>
            <Typography
              variant="h6"
              noWrap
              sx={{
                color: "white",
                fontWeight: 600,
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              Welcome, Muhammad Buhari
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                display: { xs: 'none', sm: 'block' },
                fontSize: { xs: '0.75rem', md: '0.875rem' }
              }}
            >
              Governor
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            <NotificationsIcon sx={{ color: "white" }} />
          </IconButton>

          <IconButton
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            <SettingsIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}