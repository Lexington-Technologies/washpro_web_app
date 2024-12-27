import { Box, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
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
          <List sx={{ height: "!00%", overflow:"auto" }}>
            <ListItem button selected>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <LocationOnIcon />
              </ListItemIcon>
              <ListItemText primary="Location Information" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <PublicIcon />
              </ListItemIcon>
              <ListItemText primary="Public Space Types" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <WaterIcon />
              </ListItemIcon>
              <ListItemText primary="Water Source Information" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <WcIcon />
              </ListItemIcon>
              <ListItemText primary="Toilet Facilities" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="Dump Sites" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <MonitorIcon />
              </ListItemIcon>
              <ListItemText primary="Distance Monitoring for Risks" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <VisibilityIcon />
              </ListItemIcon>
              <ListItemText primary="Open Defecation Observation" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Immediate Needs & Recommendations" />
            </ListItem>
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
