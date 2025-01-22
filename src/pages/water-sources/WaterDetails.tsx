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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  WaterDrop as WaterDropIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { apiController } from '../../axios';
import LoadingAnimation from '../../components/LoadingAnimation';

// Interfaces remain the same
interface Geolocation {
  type: string;
  coordinates: number[];
}

interface QualityTest {
  clearness: number;
  odor: number;
  ph: number;
  salinity: number;
  conductivity: number;
  capturedAt: string;
}

interface WaterSource {
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  publicSpace: string;
  geolocation: Geolocation;
  quality: string;
  status: string;
  type: string;
  qualityTest: QualityTest[];
  createdBy: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Utility functions with MUI theme colors
const getStatusColor = (status: string): 'success' | 'warning' | 'error' => {
  switch (status.toLowerCase()) {
    case 'functional':
      return 'success';
    case 'needs_repair':
    case 'maintenance_required':
      return 'warning';
    case 'non_functional':
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Map icon remains the same
const waterSourceIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Quality Test Chart Component
const QualityTestChart = ({ data }: { data: QualityTest[] }) => {
  const chartData = data.map(test => ({
    date: new Date(test.capturedAt).toLocaleDateString(),
    ph: test.ph,
    salinity: test.salinity,
    conductivity: test.conductivity,
  }));

  return (
    <Box sx={{ width: '100%', height: 300, mt: 4 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip />
          <Line type="monotone" dataKey="ph" stroke="#2196f3" name="pH" />
          <Line type="monotone" dataKey="salinity" stroke="#4caf50" name="Salinity" />
          <Line type="monotone" dataKey="conductivity" stroke="#ff9800" name="Conductivity" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

// Latest Quality Test Summary Component
const QualityTestSummary = ({ test }: { test: QualityTest }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Metric</TableCell>
          <TableCell align="right">Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(test)
          .filter(([key]) => !['capturedAt', 'createdBy', 'updatedAt', '_id'].includes(key))
          .map(([key, value]) => (
            <TableRow key={key}>
              <TableCell component="th" scope="row">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </TableCell>
              <TableCell align="right">{value}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const getDisplayValue = (value?: string) => {
  return value && value.trim() !== '' ? value : 'Not Available';
};

// Add these theme colors
const themeColors = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  background: '#f5f5f5',
  paper: '#ffffff',
};

// Update the section headers and cards with new styling
const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
    {icon}
    <Typography variant="h6" component="h2" color="primary">
      {title}
    </Typography>
  </Box>
);

// Main Component
const WaterSourceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: waterSource, isLoading, error } = useQuery({
    queryKey: ['waterSource', id],
    queryFn: () => apiController.get<WaterSource>(`/water-sources/${id}`),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Water Source at ${waterSource?.village}`,
          text: `Water source details for ${waterSource?.village}, ${waterSource?.ward}`,
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

  if (error instanceof Error || !waterSource) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity={error ? "error" : "info"}>
          {error ? error.message : "No water source found"}
        </Alert>
      </Container>
    );
  }

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
            <Tooltip title="Chat about this water source">
              <Button variant="contained" startIcon={<ChatIcon />}>
                Chat
              </Button>
            </Tooltip>
            <Tooltip title="Share water source details">
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
          <Grid container spacing={3} sx={{ p: 3 }}>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={waterSource?.picture || '/api/placeholder/800/400'}
                alt={`Water source at ${waterSource?.village}`}
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
                  center={[waterSource?.geolocation.coordinates[1], waterSource?.geolocation.coordinates[0]]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                  />
                  <Marker
                    position={[waterSource?.geolocation.coordinates[1], waterSource?.geolocation.coordinates[0]]}
                    icon={waterSourceIcon}
                  >
                    <Popup>Water Source Location</Popup>
                  </Marker>
                </MapContainer>
              </Box>
            </Grid>
          </Grid>

          <CardContent>
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
                      <Typography>{waterSource?.ward}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Village:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{waterSource?.village}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Hamlet:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{waterSource?.hamlet}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Public Space:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{waterSource?.publicSpace}</Typography>
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
                      <Typography color="text.secondary">Type:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Chip
                        label={waterSource?.type}
                        color="primary"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Status:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Chip
                        icon={getStatusIcon(waterSource?.status)}
                        label={waterSource?.status}
                        color={getStatusColor(waterSource?.status)}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Quality:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Chip
                        icon={getStatusIcon(waterSource?.quality)}
                        label={waterSource?.quality}
                        color={getStatusColor(waterSource?.quality)}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>


               {/* Agent Details */}
               <Grid item xs={12} md={6}>
                <SectionHeader icon={<PersonIcon color="primary" />} title="Agent Details" />
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: themeColors.paper }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Captured By:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{getDisplayValue(waterSource?.createdBy)}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Phone:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{getDisplayValue(waterSource?.phone)}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Email Address:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{getDisplayValue(waterSource?.email)}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Name:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{getDisplayValue(waterSource?.name)}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              


            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Quality Test Data */}
            {waterSource?.qualityTest && waterSource?.qualityTest.length > 0 && (
              <>
                <SectionHeader icon={<WaterDropIcon color="primary" />} title="Water Quality History" />
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: themeColors.paper }}>
                  <QualityTestChart data={waterSource?.qualityTest} />
                </Paper>
                <Box sx={{ mt: 4 }}>
                  <SectionHeader icon={<AssignmentIcon color="primary" />} title="Latest Quality Test Results" />
                  <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <QualityTestSummary test={waterSource?.qualityTest[waterSource?.qualityTest.length - 1]} />
                  </Paper>
                </Box>
              </>
            )}

            <Divider sx={{ my: 4 }} />

            {/* Timeline Information */}
            <SectionHeader icon={<TimelineIcon color="primary" />} title="Timeline" />
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: themeColors.paper }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography color="text.secondary">Captured At:</Typography>
                  <Typography>{formatDate(waterSource?.capturedAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography color="text.secondary">Created At:</Typography>
                  <Typography>{formatDate(waterSource?.createdAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography color="text.secondary">Last Updated:</Typography>
                  <Typography>{formatDate(waterSource?.updatedAt)}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default WaterSourceDetails;