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
import { Link, NavLink } from "react-router-dom";
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
import { useState } from "react";
import { RiWaterFlashFill } from "react-icons/ri";
import { FaToilet, FaPoop, FaBiohazard } from "react-icons/fa";
import { MdSanitizer, MdPlumbing } from "react-icons/md";
import { useAuthStore } from "../store";
import { useNavigate } from "react-router-dom";

const SideBar = ({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
}) => {
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

  const mainMenuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "Intervention", icon: <LocationOn />, path: "/interventions" },
    { text: "Wash", icon: <MdSanitizer />, path: "/wash" },
    { text: "Public Space Types", icon: <Public />, path: "/public-space-types" },
    { text: "Water Sources", icon: <RiWaterFlashFill />, path: "/water-sources" },
    { text: "Toilet Facilities", icon: <FaToilet />, path: "/toilet-facilities" },
  ];

  const wasteSubItems = [
    { text: "Dump Sites", icon: <Delete />, path: "/dump-sites" },
    { text: "Gutters", icon: <Waves />, path: "/gutters" },
    { text: "Soakaways", icon: <MdPlumbing />, path: "/soak-aways" },
  ];

  const usersSubItems = [
    { text: "Admins", icon: <People />, path: "/admin" },
    { text: "Enumerators", icon: <People />, path: "/enumerator" },
  ];

  const bottomMenuItems = [
    { text: "Water Source Risk Monitoring", icon: <MonitorHeart />, path: "/monitor" },
    { text: "Open Defecation", icon: <FaPoop />, path: "/open-defecation" },
    { text: "Needs & Maintainers", icon: <Assignment />, path: "/needs-and-maintainers" },
    { text: "Sanitation", icon: <MdSanitizer />, path: "/sanitation" },
    { text: "Field Monitoring", icon: <Visibility />, path: "/field-monitoring" },
  ];

  return (
    <Box
      sx={{
        width: isCollapsed ? 100 : 320,
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
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <List>
          {/* Main Menu Items */}
          {mainMenuItems.map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  py: 1.5,
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  "&.active": {
                    backgroundColor: "#25306B",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#25306B", // No hover effect for active
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
                  color: "inherit",
                  justifyContent: "center",
                }}
              >
                <FaBiohazard />
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
              {wasteSubItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    sx={{
                      py: 1.5,
                      pl: isCollapsed ? 2 : 4,
                      justifyContent: isCollapsed ? "center" : "flex-start",
                      "&.active": {
                        backgroundColor: "#25306B",
                        color: "white",
                        "&:hover": {
                          bgcolor: "#25306B", // No hover effect for active
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
                  color: "inherit",
                  justifyContent: "center",
                }}
              >
                <People />
              </ListItemIcon>
              {!isCollapsed && (
                <>
                  <ListItemText
                    primary="Users"
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
              {usersSubItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    sx={{
                      py: 1.5,
                      pl: isCollapsed ? 2 : 4,
                      justifyContent: isCollapsed ? "center" : "flex-start",
                      "&.active": {
                        backgroundColor: "#25306B",
                        color: "white",
                        "&:hover": {
                          bgcolor: "#25306B", // No hover effect for active
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
              ))}
            </List>
          </Collapse>

          {/* Bottom Menu Items */}
          {bottomMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  py: 1.5,
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  "&.active": {
                    backgroundColor: "#25306B",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#25306B", // No hover effect for active
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
          <ListItemIcon  sx={{ minWidth: 40, color: "inherit" }}>
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
