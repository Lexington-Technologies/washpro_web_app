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
  Skeleton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { apiController } from '../../axios';

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

// Map Icon
const dumpSiteIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Red color icon URL
  iconSize: [30, 30],
  iconAnchor: [15, 30], // Adjust the anchor point to the center bottom of the icon
  popupAnchor: [0, -30], // Adjust the popup anchor to the top of the icon
});

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 4 }}>
    <Skeleton variant="rectangular" height={300} />
    <Skeleton variant="rectangular" height={150} />
    <Skeleton variant="rectangular" height={150} />
  </Box>
);

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

  if (isLoading) return <LoadingSkeleton />;
  if (error instanceof Error) return <ErrorAlert message={error.message} />;
  if (!dumpSite) return <NotFoundAlert />;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f0f0f0', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            variant="outlined"
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => {
              // Implement download functionality
            }}
          >
            Download Report
          </Button>
        </Box>
        <Card elevation={3}>
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
            {/* Location and Technical Details */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Location Details
                </Typography>
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
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Technical Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography color="text.secondary">Type:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{dumpSite.type}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="text.secondary">Status:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{dumpSite.status}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="text.secondary">Condition:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{dumpSite.condition}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="text.secondary">Safety Risk:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{dumpSite.safetyRisk}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="text.secondary">Evacuation Schedule:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{dumpSite.evacuationSchedule}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Timeline Information */}
            <Typography variant="h5" gutterBottom>
              Timeline
            </Typography>
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
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DumpSiteDetails;
