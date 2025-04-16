import {
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
  WaterDropOutlined,
  Waves,
  WarningAmber,
  CleaningServices,
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
import {
  FaPoop,
  FaToilet,
  FaUserCog,
  FaServicestack,
} from "react-icons/fa";
import { GiHazardSign, GiWaterRecycling } from "react-icons/gi";
import { MdSanitizer } from "react-icons/md";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Logo } from "../assets/svg";
import { BsFillShieldLockFill, BsWater } from "react-icons/bs";
import { useAuthStore } from "../store";

interface SideBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isDrawerOpen: boolean;
  onDrawerToggle: () => void;
}

const SideBar = ({
  isCollapsed,
  isDrawerOpen,
  onDrawerToggle,
  onToggle,
}: SideBarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const [openWaste, setOpenWaste] = useState(false);
  const [openRoutineActivities, setOpenRoutineActivities] = useState(false);
  const [openActivities, setOpenActivities] = useState(false);

  const handleLogout = () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleClose = () => {
    if (isMobile) onDrawerToggle();
  };

  const handleNavigation = () => {
    if (isMobile) onDrawerToggle();
  };

  const mainMenuItems = [
    {
      text: "Dashboard",
      icon: <Dashboard />,
      path: "/",
      title: "Dashboard",
    },
    {
      text: "Wash Status",
      icon: <BsWater />,
      path: "/wash-status",
      title: "Wash Status",
    },
    {
      text: "Water Sources",
      icon: <WaterDropOutlined />,
      path: "/water-sources",
      title: "Water Sources",
    },
    {
      text: "Toilet Facilities",
      icon: <FaToilet />,
      path: "/toilet-facilities",
      title: "Toilet Facilities",
    },
    {
      text: "Hand Washing Facilities",
      icon: <CleaningServices />,
      path: "/hygeine-facilities",
      title: "Hand Washing Facilities",
    },
    {
      text: "Open Defecation",
      icon: <FaPoop />,
      path: "/open-defecation",
      title: "Open Defecation",
    },
    {
      text: "Waste Management",
      icon: <GiHazardSign style={{ fontSize: 24 }} />,
      path: "#",
      title: "Waste Management",
      subItems: [
        { text: "Gutters", icon: <Waves />, path: "/gutters", title: "Gutters" },
        { text: "Dumpsites", icon: <Delete />, path: "/dump-sites", title: "Dump Sites" },
        { text: "Soakaways", icon: <Waves />, path: "/soak-aways", title: "Soakaways" },
      ]
    },
    {
      text: "Water Source Risk",
      icon: <GiWaterRecycling style={{ fontSize: 24 }} />,
      path: "/water-source-risk",
      title: "Water Source Risk",
    },
    {
      text: "Intervention",
      icon: <BsFillShieldLockFill />,
      path: "/interventions",
      title: "Intervention",
    },
    {
      text: "Financing",
      icon: <Report />,
      path: "/financial-summary",
      title: "Financing",
    },
    {
      text: "Cholera Outbreak",
      icon: <WarningAmber />,
      path: "/cholera-outbreak",
      title: "Cholera Outbreak",
    },
    {
      text: "Risk Analysis",
      icon: <GiHazardSign />,
      path: "/risk-analysis",
      title: "Risk Analysis",
    },
  ];

  const routineActivitiesSubItems = [
    { text: "Sanitation", icon: <MdSanitizer style={{ fontSize: 24 }} />, path: "/sanitation", title: "Sanitation" },
    { text: "Activities", icon: <FaServicestack />, path: "/activities", title: "Activities" },
    { text: "Chlorination", icon: <Report />, path: "/chlorination", title: "Chlorination" },
    { text: "Issues Log", icon: <Report />, path: "/issues-log", title: "Issues Log" },
    { text: "LAM Reporting", icon: <MdSanitizer style={{ fontSize: 24 }} />, path: "/lam-report", title: "LAM Report" },
  ];

  const bottomMenuItems = [
    {
      text: "Reports",
      icon: <Report />,
      path: "/reports",
      title: "Reports",
    },
  ];

  const renderMenuItem = (item: any) => (
    <Tooltip
      title={isCollapsed ? item.title : ""}
      placement="right"
      disableHoverListener={!isCollapsed}
      key={item.text}
    >
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

  const renderChildMenuItem = (item: any) => (
    <Tooltip
      title={isCollapsed ? item.title : ""}
      placement="right"
      disableHoverListener={!isCollapsed}
      key={item.text}
    >
      <ListItem disablePadding>
        <ListItemButton
          component={NavLink}
          to={item.path}
          onClick={handleNavigation}
          sx={{
            py: 1.5,
            mx: 1,
            mb: 0.5,
            ml: isCollapsed ? 1 : 4,
            justifyContent: isCollapsed ? "center" : "flex-start",
            borderRadius: "6px",
            transition: "all 0.2s",
            backgroundColor: theme.palette.primary.lighter,
            borderLeft: `3px solid ${theme.palette.primary.main}`,
            '&:hover': {
              backgroundColor: theme.palette.primary.light,
            },
            "&.active": {
              backgroundColor: theme.palette.primary.dark,
              color: "white",
              borderLeftColor: theme.palette.primary.contrastText,
              "& .MuiListItemIcon-root": { color: "white" },
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: "auto",
              color: "inherit",
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

  const renderDropdown = (
    title: string,
    open: boolean,
    setOpen: any,
    items: any[],
    icon: any
  ) => (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => setOpen(!open)}
          sx={{
            py: 1.5,
            mx: 1,
            mb: 0.5,
            borderRadius: "8px",
            justifyContent: isCollapsed ? "center" : "flex-start",
            color: open ? theme.palette.primary.main : "#25306B",
            backgroundColor: open ? theme.palette.action.selected : "inherit",
            "&:hover": { 
              bgcolor: open ? theme.palette.action.hover : theme.palette.action.hover 
            },
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Tooltip
            title={isCollapsed ? title : ""}
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItemIcon
              sx={{
                minWidth: "auto",
                color: "inherit",
                mr: isCollapsed ? 0 : 2,
                justifyContent: "center",
              }}
            >
              {icon}
            </ListItemIcon>
          </Tooltip>
          {!isCollapsed && (
            <>
              <ListItemText
                primary={title}
                primaryTypographyProps={{ 
                  fontSize: "0.875rem", 
                  fontWeight: 600,
                  color: "inherit"
                }}
              />
              {open ? (
                <ExpandLess sx={{ color: "inherit" }} />
              ) : (
                <ExpandMore sx={{ color: "inherit" }} />
              )}
            </>
          )}
        </ListItemButton>
      </ListItem>
      <Collapse 
        in={open} 
        timeout="auto" 
        unmountOnExit
        sx={{
          background: `linear-gradient(to right, ${theme.palette.primary.lighter} 20%, transparent 100%)`,
          borderRadius: '8px',
          mx: 1,
          mb: 1,
        }}
      >
        <List component="div" disablePadding>
          {items.map((item) => (
            <div key={item.text}>{renderChildMenuItem(item)}</div>
          ))}
        </List>
      </Collapse>
    </>
  );

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
          <Box
            component='img'
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
          {mainMenuItems.map((item) => (
            <div key={item.text}>
              {item.subItems ? renderDropdown(
                item.text,
                openWaste,
                setOpenWaste,
                item.subItems,
                item.icon
              ) : renderMenuItem(item)}
            </div>
          ))}
          
          {renderDropdown(
            "Routine Activities",
            openRoutineActivities,
            setOpenRoutineActivities,
            routineActivitiesSubItems,
            <FaServicestack />
          )}

          {bottomMenuItems.map((item) => (
            <div key={item.text}>{renderMenuItem(item)}</div>
          ))}
        </List>
      </Box>
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