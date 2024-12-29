import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import {
  Dashboard,
  LocationOn,
  Public,
  WaterDrop,
  Wc,
  Delete,
  Waves,
  MonitorHeart,
  Visibility,
  Assignment,
  Logout,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

const SideBar = ({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
}) => {
  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "Location Information", icon: <LocationOn />, path: "/location-info" },
    { text: "Public Space Types", icon: <Public />, path: "/public-space-types" },
    { text: "Water Source Information", icon: <WaterDrop />, path: "/water-source-info" },
    { text: "Toilet Facilities", icon: <Wc />, path: "/toilet-facilities" },
    { text: "Dump Sites", icon: <Delete />, path: "/dump-sites" },
    { text: "Gutters", icon: <Waves />, path: "/gutters" },
    { text: "Soakaways", icon: <Waves />, path: "/soak-aways" },
    { text: "Distance Monitoring for Risks", icon: <MonitorHeart />, path: "/distance-monitor" },
    { text: "Open Defecation Observation", icon: <Visibility />, path: "/open-defecation" },
    { text: "Immediate Needs & Recommendations", icon: <Assignment />, path: "/needs-and-recommendation" },
  ];

  return (
    <Box
      sx={{
        width: isCollapsed ? 100 : 320, // Increased width for both states
        bgcolor: "white",
        height: "100%",
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s",
      }}
    >
      {/* Logo and Toggle Button */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: isCollapsed ? "center" : "space-between",
          alignItems: "center",
        }}
      >
        <Link to="/">
          <img
            src="/logo.svg"
            alt="WashPro Logo"
            style={{
              width: isCollapsed ? 50 : 200, // Resize logo for larger sidebar
              height: isCollapsed ? 50 : "auto",
              objectFit: "contain",
              transition: "width 0.3s, height 0.3s",
            }}
          />
        </Link>
        <ListItemButton
          onClick={onToggle}
          sx={{
            width: 40,
            height: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </ListItemButton>
      </Box>

      {/* Scrollable Navigation Items */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          paddingY: 1,
          scrollbarWidth: "none", // Hide scrollbar for Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Hide scrollbar for Webkit browsers
          },
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#1e40af" : "transparent",
                  color: isActive ? "white" : "#666",
                })}
                sx={{
                  py: 1.5,
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  "&:hover": {
                    bgcolor: "rgba(30, 64, 175, 0.04)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: "inherit",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: index === 0 ? 500 : 400,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Logout Button */}
      <Divider />
      <ListItem disablePadding>
        <ListItemButton
          sx={{
            py: 1.5,
            color: "#ef4444",
            justifyContent: isCollapsed ? "center" : "flex-start",
            "&:hover": {
              bgcolor: "rgba(239, 68, 68, 0.04)",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
            <Logout />
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                color: "inherit",
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    </Box>
  );
};

export default SideBar;
