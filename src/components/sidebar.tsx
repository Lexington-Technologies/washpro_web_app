import {
  Book,
  ChevronLeft,
  ChevronRight,
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
  WavesOutlined,
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
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { FaCity, FaPoop, FaSchool, FaToilet, FaUserCog } from "react-icons/fa";
import { GiHazardSign, GiWaterRecycling } from "react-icons/gi";
import { MdSanitizer } from "react-icons/md";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store"; // Ensure this path is correct
import { Hospital } from "lucide-react";
import { FaHouse } from "react-icons/fa6";
import { Logo } from "../assets/svg";
import { BsShieldFillPlus } from "react-icons/bs";
import { RiWaterFlashFill } from "react-icons/ri";


interface SideBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isDrawerOpen: boolean;
  onDrawerToggle: () => void;
}

const SideBar = ({ isCollapsed, isDrawerOpen, onDrawerToggle, onToggle }: SideBarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  // State for dropdown menus
  const [openWash, setOpenWash] = useState(false);
  const [openWaste, setOpenWaste] = useState(false);
  const [openUsers, setOpenUsers] = useState(false);

  // Handle logout
  const handleLogout = () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Close drawer on mobile
  const handleClose = () => {
    if (isMobile) onDrawerToggle();
  };

  // Close drawer on navigation
  const handleNavigation = () => {
    if (isMobile) onDrawerToggle();
  };

  // Main menu items
  const mainMenuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/", title: "Dashboard" },
    {
      text: "Water Sources",
      icon: <WavesOutlined />,
      path: "/water-sources",
      title: "Water Sources",
      subItems: [
        {
          text: "Water Source Risk",
        icon:<GiWaterRecycling style={{ fontSize: 24 }} />,
          path: "/water-source-risk",
          title: "Water Source Risk",
        },
      ],
    },
    {
      text: "Toilet Facilities",
      icon: <FaToilet />,
      path: "/toilet-facilities",
      title: "Toilet Facilities",
    },
    { text: "Open Defecation", icon: <FaPoop />, path: "/open-defecation", title: "Open Defecation" },
    { text: "Sanitation", icon: <MdSanitizer style={{ fontSize: 24 }}/>, path: "/sanitation", title: "Sanitation" },
    { text: "Calendar", icon: <Schedule />, path: "/calendar", title: "Calendar" },
    { text: "Intervention", icon: <BsShieldFillPlus />, path: "/interventions", title: "Intervention" },
    { text: "Wash", icon: <RiWaterFlashFill />, path: "/wash", title: "Wash" },
    { text: "Routine Activities", icon: <RiWaterFlashFill />, path: "/routine-activities", title: "Routine Activities" },
    { text: "Financial Summary", icon: <RiWaterFlashFill />, path: "/financial-summary", title: "Financial Summary" },
    { text: "AI Assistant", icon: <SmartToy />, path: "/ai-assistant", title: "AI Assistant" },
    { text: "Knowledge Base", icon: <Book />, path: "/knowledge-base", title: "Knowledge Base" },
  ];

  // Wash submenu items
  const washSubItems = [
    { text: "HouseHold", icon: <FaHouse />, path: "/household", title: "HouseHold" },
    { text: "School", icon: <FaSchool />, path: "/school", title: "School" },
    { text: "Health Facilities", icon: <Hospital />, path: "/health-facilities", title: "Health Facilities" },
    { text: "Tsangaya", icon: <FaCity />, path: "/tsangaya", title: "Tsangaya" },
  ];

  // Waste submenu items
  const wasteSubItems = [
    { text: "Dump Sites", icon: <Delete />, path: "/dump-sites", title: "Dump Sites" },
    { text: "Gutters", icon: <Waves />, path: "/gutters", title: "Gutters" },
    { text: "Soakaways", icon: <Waves />, path: "/soak-aways", title: "Soakaways" },
  ];

  // Users submenu items
  const usersSubItems = [
    { text: "Admins", icon: <FaUserCog />, path: "/users", title: "Admins" },
    { text: "Enumerators", icon: <People />, path: "/enumerator", title: "Enumerators" },
  ];

  // Bottom menu items
  const bottomMenuItems = [
    { text: "Cholera Outbreak", icon: <GiHazardSign />, path: "/cholera-outbreak", title: "Cholera Outbreak" },
    { text: "Risk Analysis", icon: <GiHazardSign />, path: "/risk-analysis", title: "Risk Analysis" },
    { text: "Reports", icon: <Report />, path: "/reports", title: "Reports" },
  ];

  // Render a single menu item
  const renderMenuItem = (item: any) => (
    <Tooltip title={isCollapsed ? item.title : ""} placement="right" disableHoverListener={!isCollapsed} key={item.text}>
      <ListItem disablePadding>
        <ListItemButton
          component={NavLink}
          to={item.path}
          onClick={handleNavigation}
          sx={{
            py: 1.5,
            mx: 1,
            mb: 0.5,
            justifyContent: isCollapsed ? "center" : "flex-start",
            borderRadius: "8px",
            transition: "all 0.2s",
            "&.active": {
              backgroundColor: "#25306B",
              color: "white",
              "& .MuiListItemIcon-root": { color: "white" },
            },
            "&:not(.active):hover": {
              bgcolor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: "auto",
              color: "#25306B",
              mr: isCollapsed ? 0 : 2,
              justifyContent: "center",
              transition: "margin-right 0.3s",
            }}
          >
            {item.icon}
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );

  // Sidebar content
  const sidebarContent = (
    <Box
      sx={{
        width: isCollapsed ? 88 : 280,
        bgcolor: "white",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
        px: 1,
      }}
    >
      {/* Logo and Toggle Section */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          minHeight: 80,
        }}
      >
        <Link to="/">
          <img
            src={Logo}
            alt="Logo"
            style={{
              width: isCollapsed ? 50 : 160,
              height: isCollapsed ? 50 : "auto",
              objectFit: "contain",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </Link>
        {/* Desktop Toggle Button */}
        {!isMobile && (
          <IconButton
            onClick={onToggle}
            sx={{
              position: "absolute",
              right: 8,
              top: 25,
              bottom: 8,
              bgcolor: "rgba(37, 48, 107, 0.1)",
              "&:hover": { bgcolor: "rgba(37, 48, 107, 0.2)" },
              width: 32,
              height: 32,
            }}
          >
            {isCollapsed ? (
              <ChevronRight sx={{ fontSize: "1.2rem", color: "#25306B" }} />
            ) : (
              <ChevronLeft sx={{ fontSize: "1.2rem", color: "#25306B" }} />
            )}
          </IconButton>
        )}
        {/* Mobile Close Button */}
        {isMobile && (
          <IconButton
            onClick={onDrawerToggle}
            sx={{
              width: 40,
              height: 40,
              color: theme.palette.primary.main,
            }}
          >
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Scrollable Menu Items */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          py: 1,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <List>
          {/* Main Menu Items */}
          {mainMenuItems.map((item, index) => (
            <div key={item.text}>
              {renderMenuItem(item)}
              {item.subItems &&
                item.subItems.map((subItem) => (
                  <div key={subItem.text}>{renderMenuItem(subItem)}</div>
                ))}
            </div>
          ))}

          {/* Wash Dropdown */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setOpenWash(!openWash)}
              sx={{
                py: 1.5,
                mx: 1,
                mb: 0.5,
                borderRadius: "8px",
                justifyContent: isCollapsed ? "center" : "flex-start",
                color: "#25306B",
                "&:hover": { bgcolor: theme.palette.action.hover },
              }}
            >
              <Tooltip title={isCollapsed ? "Wash Status" : ""} placement="right" disableHoverListener={!isCollapsed}>
                <ListItemIcon
                  sx={{
                    minWidth: "auto",
                    color: "inherit",
                    mr: isCollapsed ? 0 : 2,
                    justifyContent: "center",
                  }}
                >
                  <GiWaterRecycling style={{ fontSize: 24 }} />
                </ListItemIcon>
              </Tooltip>
              {!isCollapsed && (
                <>
                  <ListItemText
                    primary="Wash Status"
                    primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }}
                  />
                  {openWash ? <ExpandLess /> : <ExpandMore />}
                </>
              )}
            </ListItemButton>
          </ListItem>
          <Collapse in={openWash} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {washSubItems.map((item) => (
                <div key={item.text}>{renderMenuItem(item)}</div>
              ))}
            </List>
          </Collapse>

          {/* Waste Dropdown */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setOpenWaste(!openWaste)}
              sx={{
                py: 1.5,
                mx: 1,
                mb: 0.5,
                borderRadius: "8px",
                justifyContent: isCollapsed ? "center" : "flex-start",
                color: "#25306B",
                "&:hover": { bgcolor: theme.palette.action.hover },
              }}
            >
              <Tooltip title={isCollapsed ? "Waste Management" : ""} placement="right" disableHoverListener={!isCollapsed}>
                <ListItemIcon
                  sx={{
                    minWidth: "auto",
                    color: "inherit",
                    mr: isCollapsed ? 0 : 2,
                    justifyContent: "center",
                  }}
                >
                  <GiHazardSign style={{ fontSize: 24 }} />
                </ListItemIcon>
              </Tooltip>
              {!isCollapsed && (
                <>
                  <ListItemText
                    primary="Waste Management"
                    primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }}
                  />
                  {openWaste ? <ExpandLess /> : <ExpandMore />}
                </>
              )}
            </ListItemButton>
          </ListItem>
          <Collapse in={openWaste} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {wasteSubItems.map((item) => (
                <div key={item.text}>{renderMenuItem(item)}</div>
              ))}
            </List>
          </Collapse>

          {/* Users Dropdown */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setOpenUsers(!openUsers)}
              sx={{
                py: 1.5,
                mx: 1,
                mb: 0.5,
                borderRadius: "8px",
                justifyContent: isCollapsed ? "center" : "flex-start",
                color: "#25306B",
                "&:hover": { bgcolor: theme.palette.action.hover },
              }}
            >
              <Tooltip title={isCollapsed ? "Accounts" : ""} placement="right" disableHoverListener={!isCollapsed}>
                <ListItemIcon
                  sx={{
                    minWidth: "auto",
                    color: "inherit",
                    mr: isCollapsed ? 0 : 2,
                    justifyContent: "center",
                  }}
                >
                  <People />
                </ListItemIcon>
              </Tooltip>
              {!isCollapsed && (
                <>
                  <ListItemText
                    primary="Accounts"
                    primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }}
                  />
                  {openUsers ? <ExpandLess /> : <ExpandMore />}
                </>
              )}
            </ListItemButton>
          </ListItem>
          <Collapse in={openUsers} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {usersSubItems.map((item) => (
                <div key={item.text}>{renderMenuItem(item)}</div>
              ))}
            </List>
          </Collapse>

          {/* Bottom Menu Items */}
          {bottomMenuItems.map((item) => (
            <div key={item.text}>{renderMenuItem(item)}</div>
          ))}
        </List>
      </Box>

      {/* Logout Button */}
      <Divider />
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            py: 1.5,
            mx: 1,
            mb: 1,
            color: "#ef4444",
            borderRadius: "8px",
            justifyContent: isCollapsed ? "center" : "flex-start",
            "&:hover": { bgcolor: "rgba(239, 68, 68, 0.04)" },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: "auto",
              color: "inherit",
              mr: isCollapsed ? 0 : 2,
              justifyContent: "center",
            }}
          >
            <Logout />
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: "0.875rem" }}
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
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { boxShadow: theme.shadows[16] } }}
    >
      {sidebarContent}
    </Drawer>
  ) : (
    <Box
      component="nav"
      sx={{
        width: isCollapsed ? 88 : 280,
        flexShrink: 0,
        display: { xs: "none", md: "block" },
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {sidebarContent}
    </Box>
  );
};

export default SideBar;