import { ReactElement, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Collapse,
} from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Dashboard,
  LocationOn,
  Public,
  Delete,
  Waves,
  MonitorHeart,
  Logout,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  Assignment,
  Visibility,
  People,
} from "@mui/icons-material";
import { RiWaterFlashFill } from "react-icons/ri";
import { FaToilet, FaPoop, FaBiohazard } from "react-icons/fa";
import { MdSanitizer, MdPlumbing } from "react-icons/md";
import { useAuthStore } from "../store";

interface MenuItem {
  text: string;
  icon: ReactElement;
  path: string;
}

interface SideBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const NAVIGATION_ITEMS = {
  main: [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "Intervention", icon: <LocationOn />, path: "/interventions" },
    { text: "Wash", icon: <MdSanitizer />, path: "/wash" },
    { text: "Public Space Types", icon: <Public />, path: "/public-space-types" },
    { text: "Water Sources", icon: <RiWaterFlashFill />, path: "/water-sources" },
    { text: "Toilet Facilities", icon: <FaToilet />, path: "/toilet-facilities" },
  ],
  waste: [
    { text: "Dump Sites", icon: <Delete />, path: "/dump-sites" },
    { text: "Gutters", icon: <Waves />, path: "/gutters" },
    { text: "Soakaways", icon: <MdPlumbing />, path: "/soak-aways" },
  ],
  users: [
    { text: "Users", icon: <People />, path: "/users" },
    { text: "Enumerators", icon: <People />, path: "/enumerator" },
  ],
  bottom: [
    { text: "Water Source Risk Monitoring", icon: <MonitorHeart />, path: "/monitor" },
    { text: "Open Defecation", icon: <FaPoop />, path: "/open-defecation" },
    { text: "Needs & Maintainers", icon: <Assignment />, path: "/needs-and-maintainers" },
    { text: "Sanitation", icon: <MdSanitizer />, path: "/sanitation" },
    { text: "Field Monitoring", icon: <Visibility />, path: "/field-monitoring" },
  ],
} as const;

const SideBar = ({ isCollapsed, onToggle }: SideBarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [openSections, setOpenSections] = useState({
    waste: false,
    users: false,
  });

  const handleSectionToggle = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderMenuItem = (item: MenuItem) => (
    <ListItem key={item.text} disablePadding>
      <ListItemButton
        component={NavLink}
        to={item.path}
        sx={theme => ({
          py: 1.5,
          justifyContent: isCollapsed ? "center" : "flex-start",
          "&.active": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
            },
          },
          "&:not(.active):hover": {
            backgroundColor: theme.palette.action.hover,
          },
        })}
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
            }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );

  const renderCollapsibleSection = (
    title: string,
    items: MenuItem[],
    section: keyof typeof openSections,
    icon: ReactElement
  ) => (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => handleSectionToggle(section)}
          sx={theme => ({
            py: 1.5,
            justifyContent: isCollapsed ? "center" : "flex-start",
            color: theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          })}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: "inherit",
              justifyContent: "center",
            }}
          >
            {icon}
          </ListItemIcon>
          {!isCollapsed && (
            <>
              <ListItemText
                primary={title}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                }}
              />
              {openSections[section] ? <ExpandLess /> : <ExpandMore />}
            </>
          )}
        </ListItemButton>
      </ListItem>
      <Collapse in={openSections[section]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map(item => (
            <ListItem key={item.text} disablePadding sx={{ pl: isCollapsed ? 2 : 4 }}>
              {renderMenuItem(item)}
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );

  return (
    <Box
      component="nav"
      sx={theme => ({
        width: isCollapsed ? 100 : 320,
        bgcolor: theme.palette.background.paper,
        height: "100%",
        boxShadow: theme.shadows[1],
        display: "flex",
        flexDirection: "column",
        transition: theme.transitions.create("width", {
          duration: theme.transitions.duration.standard,
        }),
      })}
    >
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
              width: isCollapsed ? 50 : 200,
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
            borderRadius: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </ListItemButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: 6,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: 3,
          },
        }}
      >
        <List>
          {NAVIGATION_ITEMS.main.map(renderMenuItem)}
          {renderCollapsibleSection("Waste", NAVIGATION_ITEMS.waste, "waste", <FaBiohazard />)}
          {renderCollapsibleSection("Accounts", NAVIGATION_ITEMS.users, "users", <People />)}
          {NAVIGATION_ITEMS.bottom.map(renderMenuItem)}
        </List>
      </Box>

      <Divider />
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleLogout}
          sx={theme => ({
            py: 1.5,
            color: theme.palette.error.main,
            justifyContent: isCollapsed ? "center" : "flex-start",
            "&:hover": {
              backgroundColor: theme.palette.error.light,
              opacity: 0.1,
            },
          })}
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