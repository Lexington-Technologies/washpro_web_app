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
  CircularProgress,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { FaCheckCircle, FaClipboardCheck, FaExclamationCircle, FaExclamationTriangle, FaWrench } from 'react-icons/fa';
import { apiController } from '../../axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

interface Location {
  ward: string;
  village: string;
  hamlet: string;
  coordinates: [number, number, number];
}

interface Facility {
  facilityId: string;
  distance: number;
  riskLevel: 'critical' | 'moderate' | 'good';
}

interface Facilities {
  toilets: Facility[];
  soakAways: Facility[];
  openDefecation: Facility[];
  gutters: Facility[];
}

interface RiskSummary {
  critical: number;
  moderate: number;
  good: number;
  total: number;
}

interface Summary {
  toilets: RiskSummary;
  soakAways: RiskSummary;
  openDefecation: RiskSummary;
  gutters: RiskSummary;
}

interface WaterSourceRiskData {
  waterSourceId: string;
  waterSourceType: string;
  location: Location;
  facilities: Facilities;
  summary: Summary;
}

const WaterSourceRisk = () => {
  const { data: waterRisk, isLoading, error } = useQuery<WaterSourceRiskData, Error>({
    queryKey: ['waterSourceRisk'],
    queryFn: async () => {
      const response = await apiController.get<WaterSourceRiskData>('/analysis');
      return response;
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, color: 'error.main' }}>
        <Typography variant="h6">Error loading data</Typography>
      </Box>
    );
  }

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

  const defaultPosition: [number, number] = waterRisk ? [waterRisk.location.coordinates[1], waterRisk.location.coordinates[0]] : [11.2832241, 7.6644755];

  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 0.5 }}>
            Distance Monitoring for Risks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {waterRisk?.location.ward} - {waterRisk?.location.village}
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
          title="Critical Risks"
          value={waterRisk?.summary.toilets.critical.toString() || "0"}
          icon={<ErrorIcon />}
          iconColor="#f44336"
        />
        <StatsCard
          title="Moderate Risks"
          value={waterRisk?.summary.toilets.moderate.toString() || "0"}
          icon={<FaWrench style={{ color: "#CA8A04" }} />}
          iconColor="#ff9800"
        />
        <StatsCard
          title="Safe Facilities"
          value={waterRisk?.summary.toilets.good.toString() || "0"}
          icon={<FaClipboardCheck style={{ color: "#4caf50" }} />}
          iconColor="#4caf50"
        />
        <StatsCard
          title="Total Facilities"
          value={waterRisk?.summary.toilets.total.toString() || "0"}
          icon={<Waves style={{ color: "#2196f3" }} />}
          iconColor="#2196f3"
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 2, backgroundColor: '#f0f0f0', }}>
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
                <MapContainer
                  center={defaultPosition}
                  zoom={15}
                  style={{ height: '400px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  {waterRisk && (
                    <Marker 
                      position={[waterRisk.location.coordinates[1], waterRisk.location.coordinates[0]]}
                      icon={safeIcon}
                    >
                      <Popup>
                        <div>
                          <strong>{waterRisk.waterSourceType}</strong>
                          <br />
                          Ward: {waterRisk.location.ward}
                          <br />
                          Village: {waterRisk.location.village}
                          <br />
                          Hamlet: {waterRisk.location.hamlet}
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ flex: 2, p: 2, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Facility Details</Typography>
              <Box sx={{ height: 400, borderRadius: 1, overflow: 'auto' }}>
                <List>
                  <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #E2E8F0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaExclamationCircle color="#f44336" />
                      <Typography>Critical Risk Toilets</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 'bold' }}>{waterRisk?.summary.toilets.critical}</Typography>
                  </ListItem>
                  <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #E2E8F0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaExclamationTriangle color="#ff9800" />
                      <Typography>Soak Aways</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 'bold' }}>{waterRisk?.summary.soakAways.total}</Typography>
                  </ListItem>
                  <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #E2E8F0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaCheckCircle color="#4caf50" />
                      <Typography>Open Defecation</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 'bold' }}>{waterRisk?.summary.openDefecation.total}</Typography>
                  </ListItem>
                  <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #E2E8F0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaCheckCircle color="#4caf50" />
                      <Typography>Gutters</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 'bold' }}>{waterRisk?.summary.gutters.total}</Typography>
                  </ListItem>
                </List>
              </Box>
            </Paper>
          </Grid>
        </Grid>
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
