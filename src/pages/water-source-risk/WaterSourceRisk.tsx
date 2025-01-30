import { Waves } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  Box,
  Button,
  Card,
  Grid,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaClipboardCheck, FaExclamationCircle, FaExclamationTriangle, FaWrench } from 'react-icons/fa';
import { apiController } from '../../axios';

const WaterSourceRisk = () => {
  const [waterRisk, setWaterRisk] = useState({});

  const { data } = useQuery<unknown>({
    queryKey: ['distance'], // Or any other meaningful key
    queryFn: () => apiController.get('/analysis/distance'),
  });

  useEffect(() => {
    if (data) {
      setWaterRisk(data)
      console.log(data);
    }
  }, [data]);

  // Define custom icons
const criticalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const moderateIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const safeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const defaultPosition = [27.7172, 85.3240]; // Default map center

// Sample data for markers
const locations = [
  {
    position: [27.7172, 85.3240], // Latitude, Longitude
    type: 'Critical Risk',
    ward: 'Ward 1',
    icon: criticalIcon,
  },
  {
    position: [27.7000, 85.3000],
    type: 'Moderate Risk',
    ward: 'Ward 2',
    icon: moderateIcon,
  },
  {
    position: [27.7100, 85.3100],
    type: 'Safe Zone',
    ward: 'Ward 3',
    icon: safeIcon,
  },
];

  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 0.5 }}>
            Distance Monitoring for Risks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed insights about your selected location
          </Typography>
        </Box>
        <Button
          startIcon={<FilterAltIcon />}
          variant="contained"
          sx={{
            bgcolor: 'white',
            color: 'text.primary',
            boxShadow: 1,
            '&:hover': { bgcolor: 'grey.100' },
            textTransform: 'none',
          }}
        >
          Filter
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <StatsCard
          title="Critical Alerts"
          value="24"
          icon={<ErrorIcon />}
          iconColor="#f44336"
        />
        <StatsCard
          title="Moderate Risks"
          value="67"
          icon={<FaWrench style={{ color: "#CA8A04" }} />}
          iconColor="#ff9800"
        />
        <StatsCard
          title="Safe Zones"
          value="143"
          icon={<FaClipboardCheck style={{ color: "#4caf50" }} />}
          iconColor="#4caf50"
        />
        <StatsCard
          title="Monitored Sites"
          value="234"
          icon={<Waves style={{ color: "#2196f3" }} />}
          iconColor="#2196f3"
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 2, backgroundColor: '#f0f0f0', }}>
        {/* Risk Heatmap */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={8}>
            <Paper sx={{ flex: 2, p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                <Typography variant="h6">Risk Heatmap</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f44336' }} />
                    <Typography sx={{fontSize: 13, fontWeight: 'bold'}}>Critical Risk (&lt;10m)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff9800' }} />
                    <Typography sx={{fontSize: 13, fontWeight: 'bold'}}>Moderate Risk (10-30m)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50' }} />
                    <Typography sx={{fontSize: 13, fontWeight: 'bold'}}>Safe Distance (&gt;30m)</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ height: 400, bgcolor: '#F8FAFC', borderRadius: 1, overflow: 'hidden' }}>
              {/* <MapContainer
                center={defaultPosition}
                zoom={13}
                style={{ height: '400px', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {locations.map((location, index) => (
                  <Marker key={index} position={location.position} icon={location.icon}>
                    <Popup>
                      {location.type} at {location.ward}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer> */}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ flex: 2, p: 2, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Details</Typography>
              <Box sx={{ height: 400, borderRadius: 1, overflow: 'hidden' }}>
                <List>
                  <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #E2E8F0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaExclamationCircle color="#f44336" />
                      <Typography>Location</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 'bold' }}>12</Typography>
                  </ListItem>
                  <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #E2E8F0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaExclamationTriangle color="#ff9800" />
                      <Typography>Space</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 'bold' }}>Household</Typography>
                  </ListItem>
                  <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #E2E8F0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaCheckCircle color="#4caf50" />
                      <Typography>Toilet Type</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 'bold' }}>Pit Latrine</Typography>
                  </ListItem>
                </List>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Right Column */}

      </Box>
    </Box>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, iconColor }) => (
  <Card sx={{ flex: 1, p: 2, borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
      <Box sx={{
        bgcolor: `${iconColor}15`,
        p: 1,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {React.cloneElement(icon, { sx: { color: iconColor } })}
      </Box>
    </Box>
  </Card>
);

// Alert Item Component
interface AlertItemProps {
  status: 'critical' | 'warning' | 'safe';
  icon: React.ReactElement;
  title: string;
  description: string;
}

const AlertItem: React.FC<AlertItemProps> = ({ status, icon, title, description }) => {
  const getStatusColor = (status: 'critical' | 'warning' | 'safe'): string => {
    switch (status) {
      case 'critical':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      case 'safe':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        bgcolor: `${getStatusColor(status)}10`,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        border: 1,
        borderColor: `${getStatusColor(status)}30`,
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: `${getStatusColor(status)}15`,
        }}
      >
        {icon}
      </Box>
      {/* Text */}
      <Box>
        <Typography variant="subtitle2" sx={{ color: getStatusColor(status), mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default WaterSourceRisk;
