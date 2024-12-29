import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider
} from '@mui/material';
import { NavLink } from 'react-router-dom';
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
  Logout
} from '@mui/icons-material';

const SideBar = () => {
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Location Information', icon: <LocationOn />, path: '/location-info' },
    { text: 'Public Space Types', icon: <Public />, path: '/public-space-types' },
    { text: 'Water Source Information', icon: <WaterDrop />, path: '/water-source-info' },
    { text: 'Toilet Facilities', icon: <Wc />, path: '/toilet-facilities' },
    { text: 'Dump Sites', icon: <Delete />, path: '/dump-sites' },
    { text: 'Gutters', icon: <Waves />, path: '/gutters' },
    { text: 'Soakaways', icon: <Waves />, path: '/soak-aways' },
    { text: 'Distance Monitoring for Risks', icon: <MonitorHeart />, path: '/distance-monitor' },
    { text: 'Open Defecation Observation', icon: <Visibility />, path: '/open-defecation' },
    { text: 'Immediate Needs & Recommendations', icon: <Assignment />, path: '/needs-and-recommendation' }
  ];

  return (
    <Box sx={{ 
      width: 280, 
      bgcolor: 'white', 
      height: '100%',
      boxShadow: 1,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Logo */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <img 
          src="/logo.svg" 
          alt="WashPro Logo" 
          style={{ 
            width: 250,
            objectFit: 'contain'
          }}
        />
      </Box>

      {/* Navigation Items */}
      <List sx={{ flex: 1, pt: 0 }}>
        {menuItems.map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              style={({ isActive }) => ({
                backgroundColor: isActive ? '#1e40af' : 'transparent',
                color: isActive ? 'white' : '#666',
              })}
              sx={{
                py: 1.5,
                '&.Mui-selected': {
                  bgcolor: '#1e40af',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#1e40af'
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white'
                  }
                },
                '&:hover': {
                  bgcolor: 'rgba(30, 64, 175, 0.04)'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: index === 0 ? 500 : 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <Divider />
      <ListItem disablePadding>
        <ListItemButton
          sx={{
            py: 1.5,
            color: '#ef4444',
            '&:hover': {
              bgcolor: 'rgba(239, 68, 68, 0.04)'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <Logout />
          </ListItemIcon>
          <ListItemText 
            primary="Logout"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              color: 'inherit'
            }}
          />
        </ListItemButton>
      </ListItem>
    </Box>
  );
};

export default SideBar;
