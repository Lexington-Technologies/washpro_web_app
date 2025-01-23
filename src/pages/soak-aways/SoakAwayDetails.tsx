import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  Button,
  Container,
  Divider,
  Chip,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Chat as ChatIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  LocationOn as LocationIcon,
  Build as BuildIcon,
  Person as PersonIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { apiController } from '../../axios';
import LoadingAnimation from '../../components/LoadingAnimation';

interface SoakAway {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  publicSpace: string;
  space: string;
  condition: string;
  status: string;
  daysSinceLastEvacuation: number;
  evacuationFrequency: string;
  safetyRisk: string;
  daysSinceLastMaintenance: number | null;
  daysUntilEvacuation: number | null;
  maintenanceStatus: string;
  createdBy: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
  geolocation: {
    type: string;
    coordinates: number[];
  };
}

const themeColors = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  background: '#f5f5f5',
  paper: '#ffffff',
};

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getDisplayValue = (value?: string) => {
  return value && value.trim() !== '' ? value : 'Not Available';
};

const getStatusColor = (status: string): 'success' | 'warning' | 'error' => {
  switch (status.toLowerCase()) {
    case 'maintained':
      return 'success';
    case 'needs_maintenance':
      return 'warning';
    case 'unmaintained':
    default:
      return 'error';
  }
};

const getStatusIcon = (status: string) => {
  switch (getStatusColor(status)) {
    case 'success':
      return <CheckCircleIcon color="success" />;
    case 'warning':
      return <WarningIcon color="warning" />;
    case 'error':
      return <ErrorIcon color="error" />;
  }
};

// Map icon
const gutterIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Section Header component
const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
    {icon}
    <Typography variant="h6" component="h2" color="primary">
      {title}
    </Typography>
  </Box>
);

const LocationDetails: React.FC<{ soakaway: SoakAway }> = ({ soakaway }) => (
  <Grid container spacing={1.5}>
    {[
      { label: 'Ward', value: soakaway.ward },
      { label: 'Village', value: soakaway.village },
      { label: 'Hamlet', value: soakaway.hamlet },
      { label: 'Public Space', value: soakaway.publicSpace },
      { label: 'Space Type', value: soakaway.space },
    ].map((item) => (
      <React.Fragment key={item.label}>
        <Grid item xs={4}>
          <Typography color="text.secondary">{item.label}:</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography>{item.value}</Typography>
        </Grid>
      </React.Fragment>
    ))}
  </Grid>
);

const TechnicalDetails: React.FC<{ soakaway: SoakAway }> = ({ soakaway }) => (
  <Grid container spacing={1.5}>
    {[
      { 
        label: 'Status', 
        value: soakaway.status,
        chip: true,
        color: getStatusColor(soakaway.status)
      },
      { 
        label: 'Condition', 
        value: soakaway.condition,
        chip: true,
        color: getStatusColor(soakaway.condition)
      },
      { 
        label: 'Safety Risk', 
        value: soakaway.safetyRisk,
        chip: true,
        color: soakaway.safetyRisk === 'Fair' ? 'warning' : 'error'
      },
    ].map((item) => (
      <React.Fragment key={item.label}>
        <Grid item xs={4}>
          <Typography color="text.secondary">{item.label}:</Typography>
        </Grid>
        <Grid item xs={8}>
          {item.chip ? (
            <Chip
              label={item.value}
              color={item.color}
              size="small"
            />
          ) : (
            <Typography>{item.value}</Typography>
          )}
        </Grid>
      </React.Fragment>
    ))}
  </Grid>
);

const MaintenanceDetails: React.FC<{ soakaway: SoakAway }> = ({ soakaway }) => (
  <Grid container spacing={1.5}>
    {[
      { 
        label: 'Maintenance Status', 
        value: soakaway.maintenanceStatus,
        chip: true,
        color: soakaway.maintenanceStatus === 'Overdue' ? 'error' : 'warning'
      },
      { 
        label: 'Days Since Last Evacuation', 
        value: `${soakaway.daysSinceLastEvacuation} days` 
      },
      { 
        label: 'Evacuation Frequency', 
        value: soakaway.evacuationFrequency 
      },
      { 
        label: 'Days Until Next Evacuation', 
        value: soakaway.daysUntilEvacuation ?? 'Not scheduled'
      },
      {
        label: 'Days Since Last Maintenance',
        value: soakaway.daysSinceLastMaintenance ? `${soakaway.daysSinceLastMaintenance} days` : 'No record'
      }
    ].map((item) => (
      <React.Fragment key={item.label}>
        <Grid item xs={4}>
          <Typography color="text.secondary">{item.label}:</Typography>
        </Grid>
        <Grid item xs={8}>
          {item.chip ? (
            <Chip
              label={item.value}
              color={item.color}
              size="small"
            />
          ) : (
            <Typography>{item.value}</Typography>
          )}
        </Grid>
      </React.Fragment>
    ))}
  </Grid>
);

const TimelineDetails: React.FC<{ soakaway: SoakAway }> = ({ soakaway }) => (
  <Grid container spacing={2}>
    {[
      { label: 'Captured At', value: soakaway.capturedAt },
      { label: 'Created At', value: soakaway.createdAt },
      { label: 'Last Updated', value: soakaway.updatedAt },
    ].map((item) => (
      <Grid item xs={12} sm={4} key={item.label}>
        <Typography color="text.secondary">{item.label}:</Typography>
        <Typography>{formatDate(item.value)}</Typography>
      </Grid>
    ))}
  </Grid>
);

const CARD_SPACING = 10;
const CARD_PADDING = 2;
const SECTION_MARGIN = 10;

const CardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Paper 
    elevation={2} 
    sx={{ 
      p: CARD_PADDING,
      borderRadius: 1.5,
      bgcolor: themeColors.paper,
      height: '90%',
      minHeight: "100%",
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {children}
  </Paper>
);

const SoakAwayDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: soakaway, isLoading, error } = useQuery({
    queryKey: ['soakaway', id],
    queryFn: () => apiController.get<SoakAway>(`/soak-aways/${id}`),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `SoakAway at ${soakaway?.village}`,
          text: `SoakAway details for ${soakaway?.village}, ${soakaway?.ward}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (isLoading) return <LoadingAnimation />;
  if (error instanceof Error) return <Alert severity="error">{error.message}</Alert>;
  if (!soakaway) return <Alert severity="info">No soakaway found</Alert>;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: themeColors.background, py: 3 }}>
      <Container maxWidth="lg">
        {/* Header Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Chat about this soakaway">
              <Button variant="contained" startIcon={<ChatIcon />}>
                Chat
              </Button>
            </Tooltip>
            <Tooltip title="Share soakaway details">
              <Button variant="contained" startIcon={<ShareIcon />} onClick={handleShare}>
                Share
              </Button>
            </Tooltip>
            <Tooltip title="Download detailed report">
              <Button variant="contained" startIcon={<DownloadIcon />}>
                Download Report
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {/* Main Content Card */}
        <Card elevation={3} sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
          {/* Image and Map Section */}
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={soakaway.picture || '/api/placeholder/800/400'}
                alt={`SoakAway at ${soakaway.village}`}
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ height: 400, borderRadius: 1, overflow: 'hidden' }}>
                <MapContainer
                  center={[soakaway.geolocation.coordinates[1], soakaway.geolocation.coordinates[0]]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                  />
                  <Marker
                    position={[soakaway.geolocation.coordinates[1], soakaway.geolocation.coordinates[0]]}
                    icon={gutterIcon}
                  >
                    <Popup>SoakAway Location</Popup>
                  </Marker>
                </MapContainer>
              </Box>
            </Grid>
          </Grid>

          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={CARD_SPACING}>
              {/* Location Details */}
              <Grid item xs={12} md={6}>
                <SectionHeader icon={<LocationIcon color="primary" />} title="Location Details" />
                <CardWrapper>
                  <LocationDetails soakaway={soakaway} />
                </CardWrapper>
              </Grid>

              {/* Technical Details */}
              <Grid item xs={12} md={6}>
                <SectionHeader icon={<BuildIcon color="primary" />} title="Technical Details" />
                <CardWrapper>
                  <TechnicalDetails soakaway={soakaway} />
                </CardWrapper>
              </Grid>

              {/* Maintenance Details */}
              <Grid item xs={12} md={6}>
                <SectionHeader icon={<BuildIcon color="primary" />} title="Maintenance Details" />
                <CardWrapper>
                  <MaintenanceDetails soakaway={soakaway} />
                </CardWrapper>
              </Grid>
            </Grid>

            <Divider sx={{ my: SECTION_MARGIN }} />

            {/* Timeline Section */}
            <SectionHeader icon={<TimelineIcon color="primary" />} title="Timeline" />
            <Paper 
              elevation={2} 
              sx={{ 
                p: CARD_PADDING,
                borderRadius: 1.5,
                bgcolor: themeColors.paper 
              }}
            >
              <TimelineDetails soakaway={soakaway} />
            </Paper>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SoakAwayDetails;
