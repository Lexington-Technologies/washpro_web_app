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

interface Geolocation {
  type: string;
  coordinates: number[];
}

interface Gutter {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  geolocation: Geolocation;
  condition: string;
  status: string;
  dischargePoint: string;
  createdBy: string;
  phone?: string;    // Add optional fields for Enumerator Details
  email?: string;
  name?: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
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

const LocationDetails: React.FC<{ gutter: Gutter }> = ({ gutter }) => (
  <Grid container spacing={2}>
    {[
      { label: 'Ward', value: gutter.ward },
      { label: 'Village', value: gutter.village },
      { label: 'Hamlet', value: gutter.hamlet },
      { label: 'Discharge Point', value: gutter.dischargePoint },
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

const AgentDetails: React.FC<{ gutter: Gutter }> = ({ gutter }) => (
  <Grid container spacing={2}>
    {[
      { label: 'Created By', value: gutter.createdBy },
      { label: 'Phone', value: gutter.phone },
      { label: 'Email', value: gutter.email },
      { label: 'Name', value: gutter.name },
    ].map((item) => (
      <React.Fragment key={item.label}>
        <Grid item xs={4}>
          <Typography color="text.secondary">{item.label}:</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography>{getDisplayValue(item.value)}</Typography>
        </Grid>
      </React.Fragment>
    ))}
  </Grid>
);

const TechnicalDetails: React.FC<{ gutter: Gutter }> = ({ gutter }) => (
  <Grid container spacing={2}>
    <Grid item xs={4}>
      <Typography color="text.secondary">Status:</Typography>
    </Grid>
    <Grid item xs={8}>
      <Chip
        icon={getStatusIcon(gutter.status)}
        label={gutter.status}
        color={getStatusColor(gutter.status)}
      />
    </Grid>
    <Grid item xs={4}>
      <Typography color="text.secondary">Condition:</Typography>
    </Grid>
    <Grid item xs={8}>
      <Typography>{gutter.condition}</Typography>
    </Grid>
    <Grid item xs={4}>
      <Typography color="text.secondary">Discharge Point:</Typography>
    </Grid>
    <Grid item xs={8}>
      <Typography>{gutter.dischargePoint}</Typography>
    </Grid>
  </Grid>
);

const CARD_SPACING = 10;
const CARD_PADDING = 2;
const SECTION_MARGIN = 9;

const CardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Paper 
    elevation={2} 
    sx={{ 
      p: CARD_PADDING,
      borderRadius: 1.5,
      bgcolor: themeColors.paper,
      height: '100%',
      minHeight: 160,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {children}
  </Paper>
);

const GutterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: gutter, isLoading, error } = useQuery({
    queryKey: ['gutter', id],
    queryFn: () => apiController.get<Gutter>(`/gutters/${id}`),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Gutter at ${gutter?.village}`,
          text: `Gutter details for ${gutter?.village}, ${gutter?.ward}`,
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
  if (!gutter) return <Alert severity="info">No gutter found</Alert>;

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
            <Tooltip title="Chat about this gutter">
              <Button variant="contained" startIcon={<ChatIcon />}>
                Chat
              </Button>
            </Tooltip>
            <Tooltip title="Share gutter details">
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
                src={gutter.picture || '/api/placeholder/800/400'}
                alt={`Gutter at ${gutter.village}`}
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
                  center={[gutter.geolocation.coordinates[1], gutter.geolocation.coordinates[0]]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                  />
                  <Marker
                    position={[gutter.geolocation.coordinates[1], gutter.geolocation.coordinates[0]]}
                    icon={gutterIcon}
                  >
                    <Popup>Gutter Location</Popup>
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
                  <LocationDetails gutter={gutter} />
                </CardWrapper>
              </Grid>

              {/* Technical Details */}
              <Grid item xs={12} md={6}>
                <SectionHeader icon={<BuildIcon color="primary" />} title="Technical Details" />
                <CardWrapper>
                  <TechnicalDetails gutter={gutter} />
                </CardWrapper>
              </Grid>

              {/* Enumerator Details */}
              <Grid item xs={12} md={6}>
                <SectionHeader icon={<PersonIcon color="primary" />} title="Enumerator Details" />
                <CardWrapper>
                  <AgentDetails gutter={gutter} />
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
              <Grid container spacing={2}>
                {[
                  { label: 'Captured At', value: gutter.capturedAt },
                  { label: 'Created At', value: gutter.createdAt },
                  { label: 'Last Updated', value: gutter.updatedAt },
                ].map((item) => (
                  <Grid item xs={12} sm={4} key={item.label}>
                    <Typography color="text.secondary">{item.label}:</Typography>
                    <Typography>{formatDate(item.value)}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default GutterDetails;