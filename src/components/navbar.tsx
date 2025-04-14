import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State for 3-dot menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  // Handle 3-dot menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle 3-dot menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#25306B",
        boxShadow: "none",
        transition: "margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: { xs: "56px !important", md: "90px !important" },
          px: { xs: 1, md: 3 },
        }}
      >
        {/* Left Side: Menu Icon and Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={onMenuClick}
              sx={{ color: "white" }}
            >
              <MenuIcon sx={{ fontSize: { xs: "2rem", md: "2rem" } }} />
            </IconButton>
          )}

          <Box>
            <Typography
              variant="h6"
              noWrap
              sx={{
                color: "white",
                fontWeight: 600,
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              Welcome, Muhammad Buhari
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                display: { xs: "none", sm: "block" },
                fontSize: { xs: "0.75rem", md: "0.875rem" },
              }}
            >
              Governor
            </Typography>
          </Box>
        </Box>

        {/* Right Side: Icons or 3-Dot Menu */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {isMobile ? (
            <>
              {/* 3-Dot Menu for Mobile */}
              <IconButton
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                }}
                onClick={handleMenuOpen}
              >
                <MoreVertIcon sx={{ color: "#DBEAFE" }} />
              </IconButton>

              {/* Menu for Overflow Actions */}
              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <NotificationsIcon sx={{ mr: 1, color: "#DBEAFE" }} />
                  Notifications
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <SettingsIcon sx={{ mr: 1, color: "#DBEAFE" }} />
                  Settings
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {/* Desktop Icons */}
              <IconButton
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                }}
              >
                <NotificationsIcon sx={{ color: "#DBEAFE" }} />
              </IconButton>

              <IconButton
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                }}
              >
                <SettingsIcon sx={{ color: "#DBEAFE" }} />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}