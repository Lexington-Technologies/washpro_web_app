import { AppBar, Box, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';

interface NavbarProps {
  onMenuClick: () => void;
  onSidebarToggle: () => void;
  isSidebarCollapsed: boolean;
}

export default function Navbar({ onMenuClick, onSidebarToggle, isSidebarCollapsed }: NavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#25306B",
        boxShadow: "none",
        padding: { xs: '12px 8px', md: '20px 16px' },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: { xs: '56px !important', md: '64px !important' },
          px: { xs: 0, md: 2 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
          {isMobile ? (
            <IconButton
              color="inherit"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: { xs: 1, md: 2 } }}
            >
              <MenuIcon sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }} />
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              edge="start"
              onClick={onSidebarToggle}
              sx={{ mr: { xs: 1, md: 2 } }}
            >
              {isSidebarCollapsed ? (
                <ChevronRight sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }} />
              ) : (
                <ChevronLeft sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }} />
              )}
            </IconButton>
          )}
          
          {/* Welcome Section */}
          <Box sx={{ maxWidth: { xs: '200px', md: 'none' }, overflow: 'hidden' }}>
            <Typography
              variant="h6"
              sx={{
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: { xs: '1rem', md: '1.25rem' },
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              Welcome, Muhammad Buhari
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#dcdcdc",
                display: { xs: 'none', sm: 'block' },
                fontSize: { xs: '0.75rem', md: '0.875rem' }
              }}
            >
              Governor
            </Typography>
          </Box>
        </Box>

        {/* Icons Section */}
        <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 } }}>
          <IconButton
            sx={{
              bgcolor: "white",
              borderRadius: "50%",
              width: { xs: 32, md: 36 },
              height: { xs: 32, md: 36 },
              "&:hover": { bgcolor: "#e0e0e0" },
            }}
          >
            <NotificationsIcon sx={{ 
              color: "#25306B", 
              fontSize: { xs: '1.1rem', md: '1.25rem' } 
            }} />
          </IconButton>

          <IconButton
            sx={{
              bgcolor: "white",
              borderRadius: "50%",
              width: { xs: 32, md: 36 },
              height: { xs: 32, md: 36 },
              "&:hover": { bgcolor: "#e0e0e0" },
            }}
          >
            <SettingsIcon sx={{ 
              color: "#25306B", 
              fontSize: { xs: '1.1rem', md: '1.25rem' } 
            }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}