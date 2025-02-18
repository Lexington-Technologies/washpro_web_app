import {
  Book,
  Close,
  Dashboard,
  Delete,
  ExpandLess,
  ExpandMore,
  Logout,
  People,
  Report,
  Schedule,
  SmartToy,
  Waves,
  WavesOutlined
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery, useTheme,
} from "@mui/material";
import { useState } from "react";
import { FaPoop, FaToilet, FaUserCog } from "react-icons/fa";
import { GiHazardSign, GiWaterRecycling } from "react-icons/gi";
import { MdSanitizer } from "react-icons/md";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import {Logo} from "../assets/svg/index";

interface SideBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isDrawerOpen: boolean;
  onDrawerToggle: () => void;
}

const SideBar = ({ isCollapsed, isDrawerOpen, onDrawerToggle }: SideBarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const [openWaste, setOpenWaste] = useState(false);
  const [openUsers, setOpenUsers] = useState(false);
  const { logout } = useAuthStore();

  const handleLogout = () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleClose = () => {
    if (isMobile) {
      onDrawerToggle();
    }
  };

  const handleNavigation = () => {
    if (isMobile) {
      onDrawerToggle();
    }
  };

  const mainMenuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/", title: "Dashboard" },
    // { text: "Intervention", icon: <BsShieldFillPlus />, path: "/interventions", title: "Intervention" },
    // { text: "Wash", icon: <RiWaterFlashFill />, path: "/wash", title: "Wash" },
    { text: "Water Sources", icon: <WavesOutlined />, path: "/water-sources", title: "Water Sources", subItems: [
        { text: "Water Source Risk", icon: <GiWaterRecycling />, path: "/water-source-risk", title: "Water Source Risk" },
    ]},
    { text: "Toilet Facilities", icon: <FaToilet />, path: "/toilet-facilities", title: "Toilet Facilities" },
    { text: "Calendar", icon: <Schedule />, path: "/calendar", title: "Calendar" },
    { text: "AI Assistant", icon: <SmartToy />, path: "/ai-assistant", title: "AI Assistant" },
    { text: "Knowledge Base", icon: <Book />, path: "/knowledge-base", title: "Knowledge Base" },
  ];

  const wasteSubItems = [
    { text: "Dump Sites", icon: <Delete />, path: "/dump-sites", title: "Dump Sites" },
    { text: "Gutters", icon: <Waves />, path: "/gutters", title: "Gutters" },
    { text: "Soakaways", icon: <Waves />, path: "/soak-aways", title: "Soakaways" },
  ];

  const usersSubItems = [
    { text: "Admins", icon: <FaUserCog />, path: "/users", title: "Admins" },
    { text: "Enumerators", icon: <People />, path: "/enumerator", title: "Enumerators" },
  ];

  const bottomMenuItems = [
    { text: "Open Defecation", icon: <FaPoop />, path: "/open-defecation", title: "Open Defecation" },
    // { text: "Needs & Maintainers", icon: <FaCog />, path: "/needs-and-maintainers", title: "Needs & Maintainers" },
    { text: "Sanitation", icon: <MdSanitizer />, path: "/sanitation", title: "Sanitation" },
    // { text: "Routine Activities", icon: <Schedule />, path: "/routine-activities", title: "Routine Activities" },
    { text: "Reports", icon: <Report />, path: "/reports", title: "Reports" }
  ];

  const renderMenuItem = (item: any) => (
    <ListItem key={item.text} disablePadding>
      <ListItemButton
        component={NavLink}
        to={item.path}
        onClick={handleNavigation}
        title={item.title}
        sx={{
          py: 1.5,
          justifyContent: isCollapsed ? "center" : "flex-start",
          "&.active": {
            backgroundColor: "#25306B",
            borderRadius: "20px 20px ",
            color: "white",
            "&:hover": {
              bgcolor: "#25306B",
            },
          },
          "&:not(.active):hover": {
            bgcolor: "rgba(37, 48, 107, 0.04)",
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 40,
            color: "#4B5563",
            justifyContent: "center",
            "& svg": {
              fontSize: 20
            },
            ".active &": {
              color: "white"
            }
          }}
        >
          {item.icon}
        </ListItemIcon>
        {!isCollapsed && (
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              fontSize: "0.875rem",
              fontWeight: item.index === 0 ? 500 : 400,
            }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );

  const sidebarContent = (
    <Box
      sx={{
        width: isCollapsed ? 100 : 270,
        bgcolor: "white",
        height: "100%",
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s",
        px: 1,
      }}
    >
      {/* Logo and Close Button for Mobile */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link to="/">
          <img
            src={Logo}
            alt="WashPro Logo"
            style={{
              width: isCollapsed ? 50 : 200,
              height: isCollapsed ? 50 : "auto",
              objectFit: "fill",
              transition: "width 0.3s, height 0.3s",
            }}
          />
        </Link>
        {isMobile && (
          <IconButton
            onClick={onDrawerToggle}
            sx={{
              width: 40,
              height: 40,
              color: "#25306B",
            }}
          >
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Scrollable Navigation Items */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          paddingY: 1,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <List>
          {/* Main Menu Items */}
          {mainMenuItems.map((item, index) => (
            <div key={item.text}>
              {renderMenuItem(item)}
              {item.subItems && item.subItems.map(subItem => (
                <div key={subItem.text}>
                  {renderMenuItem(subItem)}
                </div>
              ))}
            </div>
          ))}

          {/* Waste Dropdown */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setOpenWaste(!openWaste)}
              sx={{
                py: 1.5,
                justifyContent: isCollapsed ? "center" : "flex-start",
                color: "#666",
                "&:hover": {
                  bgcolor: "rgba(37, 48, 107, 0.04)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: "#4B5563",
                  justifyContent: "center",
                  "& svg": {
                    fontSize: 24
                  }
                }}
              >
                <GiHazardSign style={{ fontSize: 25 }} />
              </ListItemIcon>
              {!isCollapsed && (
                <>
                  <ListItemText
                    primary="Waste"
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                    }}
                  />
                  {openWaste ? <ExpandLess /> : <ExpandMore />}
                </>
              )}
            </ListItemButton>
          </ListItem>

          <Collapse in={openWaste} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {wasteSubItems.map(item => (
                <div key={item.text}>
                  {renderMenuItem(item)}
                </div>
              ))}
            </List>
          </Collapse>

          {/* Users Dropdown */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setOpenUsers(!openUsers)}
              sx={{
                py: 1.5,
                justifyContent: isCollapsed ? "center" : "flex-start",
                color: "#666",
                "&:hover": {
                  bgcolor: "rgba(37, 48, 107, 0.04)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: "#4B5563",
                  justifyContent: "center",
                  "& svg": {
                    fontSize: 24
                  }
                }}
              >
                <People />
              </ListItemIcon>
              {!isCollapsed && (
                <>
                  <ListItemText
                    primary="Accounts"
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                    }}
                  />
                  {openUsers ? <ExpandLess /> : <ExpandMore />}
                </>
              )}
            </ListItemButton>
          </ListItem>

          <Collapse in={openUsers} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {usersSubItems.map(item => (
                <div key={item.text}>
                  {renderMenuItem(item)}
                </div>
              ))}
            </List>
          </Collapse>

          {/* Bottom Menu Items */}
          {bottomMenuItems.map(item => (
            <div key={item.text}>
              {renderMenuItem(item)}
            </div>
          ))}
        </List>
      </Box>

      {/* Logout Button */}
      <Divider />
      <ListItem onClick={handleLogout} disablePadding>
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
          <ListItemIcon sx={{
            minWidth: 40,
            color: "inherit",
            justifyContent: "center",
            "& svg": {
              fontSize: 24
            }
          }}>
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

  return isMobile ? (
    <Drawer
      variant="temporary"
      open={isDrawerOpen}
      onClose={handleClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        
      }}
    >
      {sidebarContent}
    </Drawer>
  ) : (
    <Box
      component="nav"
      sx={{
        width: isCollapsed ? 100 : 270,
        flexShrink: 0,
        display: { xs: 'none', md: 'block' },
      }}
    >
      {sidebarContent}
    </Box>
  );
};

export default SideBar;
