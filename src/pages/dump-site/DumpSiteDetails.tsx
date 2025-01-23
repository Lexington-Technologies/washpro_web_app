import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardMedia,
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
  Timeline as TimelineIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { apiController } from '../../axios';
import LoadingAnimation from '../../components/LoadingAnimation';

interface Geolocation {
  type: string;
  coordinates: number[];
}

interface DumpSite {
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  geolocation: Geolocation;
  type: string;
  status: string;
  condition: string;
  createdBy: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
  safetyRisk: string;
  evacuationSchedule: string;
  lastEvacuationDate: string;
  nextScheduledEvacuation: string;
}

// Utility to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Add getDisplayValue utility function
const getDisplayValue = (value?: string) => {
  return value && value.trim() !== '' ? value : 'Not Available';
};

// Map Icon
const dumpSiteIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Red color icon URL
  iconSize: [30, 30],
  iconAnchor: [15, 30], // Adjust the anchor point to the center bottom of the icon
  popupAnchor: [0, -30], // Adjust the popup anchor to the top of the icon
});

// Error Alert Component
const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
  <Container maxWidth="md" sx={{ mt: 3 }}>
    <Alert severity="error">{message}</Alert>
  </Container>
);

// Not Found Component
const NotFoundAlert: React.FC = () => (
  <Container maxWidth="md" sx={{ mt: 3 }}>
    <Alert severity="info">No dump site found</Alert>
  </Container>
);

// Map Component
const DumpSiteMap: React.FC<{ coordinates: number[] }> = ({ coordinates }) => (
  <MapContainer
    center={[coordinates[1], coordinates[0]]}
    zoom={15}
    scrollWheelZoom={true} // Enable zooming in and out using mouse pad
    style={{ height: '100%', width: '100%' }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />
    <Marker position={[coordinates[1], coordinates[0]]} icon={dumpSiteIcon}>
      <Popup>Dump Site Location</Popup>
    </Marker>
  </MapContainer>
);

// Add theme colors
const themeColors = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  background: '#f5f5f5',
  paper: '#ffffff',
};

// Add status utilities
const getStatusColor = (status: string): 'success' | 'warning' | 'error' => {
  switch (status.toLowerCase()) {
    case 'improved':
    case 'maintained':
      return 'success';
    case 'needs_maintenance':
    case 'periodic':
      return 'warning';
    case 'unimproved':
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

// Add Section Header component
const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
    {icon}
    <Typography variant="h6" component="h2" color="primary">
      {title}
    </Typography>
  </Box>
);

// Main Component
const DumpSiteDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: dumpSite, isLoading, error } = useQuery({
    queryKey: ['dumpSite', id],
    queryFn: () => apiController.get<DumpSite>(`/dump-sites/${id}`),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Dump Site at ${dumpSite?.village}`,
          text: `Dump site details for ${dumpSite?.village}, ${dumpSite?.ward}`,
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
  if (error instanceof Error) return <ErrorAlert message={error.message} />;
  if (!dumpSite) return <NotFoundAlert />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: themeColors.background, py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Chat about this dump site">
              <Button variant="contained" startIcon={<ChatIcon />}>
                Chat
              </Button>
            </Tooltip>
            <Tooltip title="Share dump site details">
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

        <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            {/* Image Section */}
            <Box sx={{ flex: 1, height: { xs: '300px', md: '400px' } }}>
              <CardMedia
                component="img"
                height="100%"
                image={dumpSite.picture || '/api/placeholder/800/400'}
                alt={`Dump site at ${dumpSite.village}`}
              />
            </Box>

            {/* Map Section */}
            <Box sx={{ flex: 1, height: { xs: '300px', md: '400px' } }}>
              <DumpSiteMap coordinates={dumpSite.geolocation.coordinates} />
            </Box>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Location Details */}
              <Grid item xs={12} md={6}>
                <SectionHeader icon={<LocationIcon color="primary" />} title="Location Details" />
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: themeColors.paper }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Ward:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{dumpSite.ward}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Village:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{dumpSite.village}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Hamlet:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{dumpSite.hamlet}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Public Space:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{dumpSite.publicSpace}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Technical Details */}
              <Grid item xs={12} md={6}>
                <SectionHeader icon={<BuildIcon color="primary" />} title="Technical Details" />
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: themeColors.paper }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Status:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Chip
                        icon={getStatusIcon(dumpSite.status)}
                        label={dumpSite.status}
                        color={getStatusColor(dumpSite.status)}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Condition:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Chip
                        icon={getStatusIcon(dumpSite.condition)}
                        label={dumpSite.condition}
                        color={getStatusColor(dumpSite.condition)}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Safety Risk:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{dumpSite.safetyRisk}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Evacuation :</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{dumpSite.evacuationSchedule}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Enumerator Details */}
              <Grid item xs={12} md={6}>
                <SectionHeader icon={<PersonIcon color="primary" />} title="Enumerator Details" />
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: themeColors.paper }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Created By:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{getDisplayValue(dumpSite.createdBy)}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Phone:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{getDisplayValue(dumpSite.phone)}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Email:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{getDisplayValue(dumpSite.email)}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Name:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{getDisplayValue(dumpSite.name)}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Timeline Section */}
            <SectionHeader icon={<TimelineIcon color="primary" />} title="Timeline" />
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: themeColors.paper }}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={4}>
                  <Typography color="text.secondary">Captured At:</Typography>
                  <Typography>{formatDate(dumpSite.capturedAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography color="text.secondary">Created At:</Typography>
                  <Typography>{formatDate(dumpSite.createdAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography color="text.secondary">Last Updated:</Typography>
                  <Typography>{formatDate(dumpSite.updatedAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography color="text.secondary">Last Evacuation Date:</Typography>
                  <Typography>{formatDate(dumpSite.lastEvacuationDate)}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography color="text.secondary">Next Scheduled Evacuation:</Typography>
                  <Typography>{formatDate(dumpSite.nextScheduledEvacuation)}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DumpSiteDetails;
