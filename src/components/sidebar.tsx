import React from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PublicIcon from "@mui/icons-material/Public";
import WaterIcon from "@mui/icons-material/Water";
import WcIcon from "@mui/icons-material/Wc";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReportIcon from "@mui/icons-material/Report";
import MonitorIcon from "@mui/icons-material/Monitor";

export default function Sidebar() {
  const links = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { label: "Location Information", icon: <LocationOnIcon />, path: "/location-info" },
    { label: "Public Space Types", icon: <PublicIcon />, path: "/public-space-types" },
    { label: "Water Source Information", icon: <WaterIcon />, path: "/water-source-info" },
    { label: "Toilet Facilities", icon: <WcIcon />, path: "/toilet-facilities" },
    { label: "Dump Sites", icon: <DeleteIcon />, path: "/dump-sites" },
    { label: "Distance Monitoring for Risks", icon: <MonitorIcon />, path: "/distance-monitoring" },
    { label: "Open Defecation Observation", icon: <VisibilityIcon />, path: "/open-defecation" },
    { label: "Immediate Needs & Recommendations", icon: <ReportIcon />, path: "/immediate-needs" },
  ];

  return (
    <Box
      sx={{
        flexShrink: 0,
        width: 300,
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
          <img
            src="/logo.svg"
            alt="Logo"
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
        <List sx={{ height: "100%", overflow: "auto" }}>
          {links.map((link, index) => (
            <ListItem
              button
              key={index}
              component={NavLink}
              to={link.path}
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#E3F2FD" : "transparent",
                color: isActive ? "#25306B" : "#666",
              })}
              sx={{
                "&.Mui-selected, &.Mui-selected:hover": {
                  backgroundColor: "#E3F2FD",
                  color: "#25306B",
                },
                "&:hover": { backgroundColor: "#F3F4F6" },
              }}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box>
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>
    </Box>
  );
}
