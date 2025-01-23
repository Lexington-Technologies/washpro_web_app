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
  LocationOn as LocationIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Nature as NatureIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { apiController } from '../../axios';
import LoadingAnimation from '../../components/LoadingAnimation';

interface OpenDefication {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  publicSpace: string;
  footTraffic: string;
  peakTime: string[];
  demographics: string[];
  environmentalCharacteristics: string[];
  dailyAverage: string;
  createdBy: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
  geolocation: {
    type: string;
    coordinates: number[];
  };
}

const CARD_MIN_HEIGHT = 160;
const CARD_PADDING = 2.5;

const themeColors = {
  primary: '#1976d2',
  background: '#f5f5f5',
  paper: '#ffffff',
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const locationIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
    {icon}
    <Typography variant="h6" component="h2" color="primary">
      {title}
    </Typography>
  </Box>
);

const CardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Paper 
    elevation={2} 
    sx={{ 
      p: CARD_PADDING,
      borderRadius: 1.5,
      bgcolor: themeColors.paper,
      height: '100%',
      minHeight: CARD_MIN_HEIGHT,
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    {children}
  </Paper>
);

const LocationDetails: React.FC<{ data: OpenDefication }> = ({ data }) => (
  <Grid container spacing={1.5}>
    {[
      { label: 'Ward', value: data.ward },
      { label: 'Village', value: data.village },
      { label: 'Hamlet', value: data.hamlet },
      { label: 'Public Space', value: data.publicSpace },
      { label: 'Space Type', value: 'N/A' },
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

const ActivityDetails: React.FC<{ data: OpenDefication }> = ({ data }) => (
  <Grid container spacing={1.5}>
    <Grid item xs={4}>
      <Typography color="text.secondary">Foot Traffic:</Typography>
    </Grid>
    <Grid item xs={8}>
      <Chip
        label={data.footTraffic}
        color={data.footTraffic === '201+' ? 'error' : 'warning'}
        size="small"
      />
    </Grid>
    <Grid item xs={4}>
      <Typography color="text.secondary">Daily Average:</Typography>
    </Grid>
    <Grid item xs={8}>
      <Chip
        label={data.dailyAverage}
        color={
          data.dailyAverage === '21-50' ? 'warning' :
          data.dailyAverage === '51+' ? 'error' : 'success'
        }
        size="small"
      />
    </Grid>
    <Grid item xs={4}>
      <Typography color="text.secondary">Peak Time:</Typography>
    </Grid>
    <Grid item xs={8}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {data.peakTime.map((time) => (
          <Chip 
            key={time} 
            label={time} 
            variant="outlined"
            color="primary"
            size="small" 
          />
        ))}
      </Box>
    </Grid>
  </Grid>
);

const EnvironmentalDetails: React.FC<{ data: OpenDefication }> = ({ data }) => (
  <Grid container spacing={1.5}>
    <Grid item xs={4}>
      <Typography color="text.secondary">Demographics:</Typography>
    </Grid>
    <Grid item xs={8}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {data.demographics.map((demo) => (
          <Chip 
            key={demo} 
            label={demo} 
            color="primary" 
            size="small"
            variant="outlined"
          />
        ))}
      </Box>
    </Grid>
    <Grid item xs={4}>
      <Typography color="text.secondary">Environmental Characteristics:</Typography>
    </Grid>
    <Grid item xs={8}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {data.environmentalCharacteristics.map((char) => (
          <Chip 
            key={char} 
            label={char} 
            color="default" 
            size="small"
            variant="outlined"
          />
        ))}
      </Box>
    </Grid>
  </Grid>
);

const TimelineDetails: React.FC<{ data: OpenDefication }> = ({ data }) => (
  <Grid container spacing={2}>
    {[
      { label: 'Captured At', value: formatDate(data.capturedAt) },
      { label: 'Created At', value: formatDate(data.createdAt) },
      { label: 'Last Updated', value: formatDate(data.updatedAt) },
      { label: 'Created By', value: data.createdBy },
    ].map((item) => (
      <Grid item xs={12} sm={3} key={item.label}>
        <Typography color="text.secondary">{item.label}:</Typography>
        <Typography>{item.value}</Typography>
      </Grid>
    ))}
  </Grid>
);

const OpenDeficationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['open-defecation', id],
    queryFn: () => apiController.get<OpenDefication>(`/open-defecations/${id}`),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Open Defecation Site at ${data?.village}`,
          text: `Site details for ${data?.village}, ${data?.ward}`,
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
  if (!data) return <Alert severity="info">No data found</Alert>;

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
            <Tooltip title="Chat about this site">
              <Button variant="contained" startIcon={<ChatIcon />}>
                Chat
              </Button>
            </Tooltip>
            <Tooltip title="Share site details">
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

        <Card elevation={3} sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
          {/* Image and Map Section */}
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={data.picture || '/api/placeholder/800/400'}
                alt={`Site at ${data.village}`}
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
                  center={[data.geolocation.coordinates[1], data.geolocation.coordinates[0]]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                  />
                  <Marker
                    position={[data.geolocation.coordinates[1], data.geolocation.coordinates[0]]}
                    icon={locationIcon}
                  >
                    <Popup>Site Location</Popup>
                  </Marker>
                </MapContainer>
              </Box>
            </Grid>
          </Grid>

          <CardContent sx={{ p: 2.5 }}>
            <Grid container spacing={2.5}>
              {/* Location Details */}
              <Grid item xs={12} md={6}>
                <SectionHeader icon={<LocationIcon color="primary" />} title="Location Details" />
                <CardWrapper>
                  <LocationDetails data={data} />
                </CardWrapper>
              </Grid>

              {/* Activity Details */}
              <Grid item xs={12} md={6}>
                <SectionHeader icon={<AssessmentIcon color="primary" />} title="Activity Details" />
                <CardWrapper>
                  <ActivityDetails data={data} />
                </CardWrapper>
              </Grid>

              {/* Environmental Details */}
              <Grid item xs={12} md={12}>
                <SectionHeader icon={<NatureIcon color="primary" />} title="Environmental Details" />
                <CardWrapper>
                  <EnvironmentalDetails data={data} />
                </CardWrapper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2.5 }} />

            {/* Timeline Section */}
            <SectionHeader icon={<TimelineIcon color="primary" />} title="Timeline" />
            <CardWrapper>
              <TimelineDetails data={data} />
            </CardWrapper>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default OpenDeficationDetails;
