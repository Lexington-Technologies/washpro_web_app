import {
  Alert,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Modal,
  Tab,
  Tabs,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Cog, Compass, HeartPulse, Home, MapPin, Phone, User, Users, X, ZoomIn } from 'lucide-react';
import React, { useState } from 'react';
import { GiWell } from 'react-icons/gi';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { apiController } from '../../axios';
import { Box, Typography, Stack } from '@mui/material';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
interface WaterSource {
  geolocation: {
    type: string;
    coordinates: [number, number, number];
  };
  publicSpace: string;
  dependent: number;
  _id: string;
  createdBy: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  space: string;
  contactPersonName: string;
  contactPersonPhoneNumber: string;
  address: string;
  population: string;
  availability: string;
  status: string;
  type: string;
  spaceType: string;
  capturedAt: string;
  qualityTest: QualityTest[];
  wellConditions: string[];
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface QualityTest {
  clearness: number;
  odor: number;
  ph: number;
  salinity: number;
  conductivity: number;
  capturedAt: string;
  createdBy: string;
  updatedAt: string;
  _id: string;
}

// Add the MapCard component
interface MapCardProps {
  latitude: number;
  longitude: number;
  hamlet: string;
  village: string;
  ward: string;
}

const MapCard: React.FC<MapCardProps> = ({ latitude, longitude, hamlet, village, ward }) => (
  <Box
    sx={{
      position: 'absolute',
      top: 7,
      left: 600,
      transform: 'translateX(-50%)',
      zIndex: 1000,
      bgcolor: 'background.paper',
      p: 1,
      borderRadius: 2,
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
      display: 'flex',
      gap: 5,
      alignItems: 'center',
      width: '60%',
      maxWidth: 600,
    }}
  >
    <DetailItem icon={MapPin} label="Hamlet" value={hamlet} />
    <DetailItem icon={Home} label="Village" value={village} />
    <DetailItem icon={Home} label="Ward" value={ward} />
    <DetailItem
      icon={Compass}
      label="Coordinates"
      value={`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
    />
  </Box>
);

const WaterSourceDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isWaterSourceImageOpen, setIsWaterSourceImageOpen] = useState(false);
  const [isPersonImageOpen, setIsPersonImageOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: waterSource, isLoading, error } = useQuery<WaterSource>({
    queryKey: ['waterSource', id],
    queryFn: () => apiController.get<WaterSource>(`/water-sources/${id}`).then(res => res),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  console.log('Water Source:', waterSource);

  const handleWaterSourceImageClick = () => setIsWaterSourceImageOpen(true);
  const handlePersonImageClick = () => setIsPersonImageOpen(true);

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  if (error || !waterSource) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity={error ? 'error' : 'info'}>{error ? error.message : 'No water source found'}</Alert>
      </Container>
    );
  }

  const position: [number, number] = [waterSource?.geolocation.coordinates[1], waterSource?.geolocation.coordinates[0]];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => navigate(-1)}>
              <ArrowLeft />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight="500">
                {'Water Source Risk'}
              </Typography>
              <Typography color="text.secondary">
                {waterSource?.ward}, {waterSource?.village}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              variant="outlined"
              label={waterSource?.status}
              color={waterSource?.status === 'Functional' ? 'success' : 'error'}
            />
            <Chip
              variant="outlined"
              label={waterSource?.availability}
              color={waterSource?.availability === 'Always Available' ? 'success' : 'warning'}
              />
          </Stack>
        </Stack>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" />
          <Tab label="Water Quality" />
        </Tabs>

        {/* Tab Panels */}
        <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          {activeTab === 0 ? (
            <OverviewTab
              waterSource={waterSource}
              position={position}
              onWaterSourceImageClick={handleWaterSourceImageClick}
              onPersonImageClick={handlePersonImageClick}
            />
          ) : (
            <QualityTab qualityTest={waterSource?.qualityTest[0]} />
          )}
        </Box>

        {/* Water Source Image Modal */}
        <Modal
          open={isWaterSourceImageOpen}
          onClose={() => setIsWaterSourceImageOpen(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <IconButton
              onClick={() => setIsWaterSourceImageOpen(false)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
              }}
            >
              <X />
            </IconButton>
            <Box
              component="img"
              src={waterSource?.picture}
              alt="Water Source"
              sx={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: 2,
              }}
            />
          </Box>
        </Modal>

        {/* Person Image Modal */}
        <Modal
          open={isPersonImageOpen}
          onClose={() => setIsPersonImageOpen(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <IconButton
              onClick={() => setIsPersonImageOpen(false)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
              }}
            >
              <X />
            </IconButton>
            <Box
              component="img"
              src={waterSource?.createdBy?.picture}
              alt="Contact Person"
              sx={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: 2,
              }}
            />
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

const OverviewTab = ({
  waterSource,
  position,
  onWaterSourceImageClick,
  onPersonImageClick,
}: {
  waterSource: WaterSource;
  position: [number, number];
  onWaterSourceImageClick: () => void;
  onPersonImageClick: () => void;
}) => {
  // Load Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'], // Optional: Add libraries if needed
  });

  // Handle loading and errors
  if (loadError) return <Typography>Error loading Google Maps</Typography>;
  if (!isLoaded) return <CircularProgress />;

  return (
    <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          height: '100%',
        }}
      >
        <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>
          Location Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={MapPin} label="Location" value={`${waterSource?.hamlet}, ${waterSource?.village}`} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={GiWell} label="Water Source Type" value={waterSource?.type} />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={HeartPulse} label="Space Type" value={waterSource?.spaceType} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={Cog} label="Water Source Status" value={waterSource?.status} />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
        <Grid item xs={6}>
        <DetailItem
              icon={Calendar}
              label="Last Updated"
              value={format(new Date(waterSource?.updatedAt), 'PPP')}
            />
          </Grid>
            <Grid item xs={6}>
            <DetailItem icon={GiWell} label="Water Source Condition" value={waterSource?.wellConditions?.length ? waterSource.wellConditions[0] : 'Not specified'} />
            </Grid>
        </Grid>
    

        
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>
         Contact Person Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={User} label="Contact Person Name" value={waterSource?.createdBy?.fullName || 'Not specified'} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={Phone} label="Phone No" value={waterSource?.createdBy?.phone || 'Not specified'} />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        {/* <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={Home} label="Address" value={waterSource?.createdBy?.address || 'Not specified'} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={Users} label="Dependants" value={waterSource?.createdBy?.population || 'Not specified'} />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} /> */}
        <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>
          Enumerators Details
        </Typography>
        <Grid container spacing={3}>
        <Grid item xs={6}>
            <DetailItem icon={User} label="Full Name" value={waterSource?.createdBy?.fullName} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={User} label="Phone no" value={waterSource?.createdBy?.phone} />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={Home} label="Email" value={waterSource?.createdBy?.email || 'Not specified'} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={Users} label="Captured At"               
            value={format(new Date(waterSource?.createdBy?.createdAt), 'PPP')} />
          </Grid>
        </Grid>

      </Box>
    </Grid>

    {/* Right Column */}
<Grid item xs={12} md={4}>
  <Box
    sx={{
      p: 2,
      borderRadius: 2,
      bgcolor: 'background.paper',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
      mb: 3,
    }}
  >
    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>
      Attachments
    </Typography>
    
    {/* Water Source Image */}
    <Box
      sx={{
        position: 'relative',
        mb: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src={waterSource?.picture}
        alt="Water Source"
        onClick={onWaterSourceImageClick}
        sx={{
          width: '100%',
          height: 350,
          objectFit: 'cover',
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)'
          }
        }}
      />
      <IconButton
        onClick={onWaterSourceImageClick}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
          color: 'text.primary',
        }}
      >
        <ZoomIn size={20} />
      </IconButton>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          p: 1,
          textAlign: 'center',
          color: 'text.secondary',
          bgcolor: 'background.default',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        Water Source Photo
      </Typography>
    </Box>

    {/* Person Image */}
    {waterSource?.createdBy?.picture && (
      <Box
        sx={{
          position: 'relative',
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={waterSource?.createdBy?.picture}
          alt="Contact Person"
          onClick={onPersonImageClick}
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
        />
        <IconButton
          onClick={onPersonImageClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
            color: 'text.primary',
          }}
        >
          <ZoomIn size={20} />
        </IconButton>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            p: 1,
            textAlign: 'center',
            color: 'text.secondary',
            bgcolor: 'background.default',
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          Hosue hold photo
        </Typography>
      </Box>
    )}
  </Box>
</Grid>

    {/* Google Maps Section */}
    <Grid item xs={12}>
    <Box
      sx={{
        height: 500,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        mb: 4,
        position: 'relative', // Add this for proper positioning
      }}
    >
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={{ lat: position[0], lng: position[1] }}
        zoom={15}
      >
        <MarkerF position={{ lat: position[0], lng: position[1] }} />
      </GoogleMap>
      <MapCard
        latitude={position[0]}
        longitude={position[1]}
        hamlet={waterSource?.hamlet}
        village={waterSource?.village}
        ward={waterSource?.ward}
      />
    </Box>
  </Grid>
        </Grid>
  );
}

const QualityTab = ({ qualityTest }: { qualityTest: QualityTest }) => {
  const barData = [
    { name: 'Clearness', value: qualityTest.clearness },
    { name: 'Odor', value: qualityTest.odor },
    { name: 'pH Level', value: qualityTest.ph },
    { name: 'Salinity', value: qualityTest.salinity },
    { name: 'Conductivity', value: qualityTest.conductivity },
  ];

  const radarData = [
    { subject: 'Clearness', value: qualityTest.clearness, fullMark: 10 },
    { subject: 'Odor', value: qualityTest.odor, fullMark: 10 },
    { subject: 'pH', value: qualityTest.ph, fullMark: 14 },
    { subject: 'Salinity', value: qualityTest.salinity, fullMark: 10 },
    { subject: 'Conductivity', value: qualityTest.conductivity, fullMark: 10 },
  ];

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Quality Metrics
        </Typography>
        <Box sx={{ height: 400, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)', p: 2, borderRadius: 2 }}>
          <ResponsiveContainer>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="value" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Quality Analysis
        </Typography>
        <Box sx={{ height: 400, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)', p: 2, borderRadius: 2 }}>
          <ResponsiveContainer>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar name="Quality" dataKey="value" stroke="#1976d2" fill="#1976d2" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p:  3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <Typography variant="subtitle1" gutterBottom>Test Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <DetailItem
                icon={Calendar}
                label="Test Date"
                value={format(new Date(qualityTest.capturedAt), 'PPP')}
              />
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <DetailItem
                icon={User}
                label="Tested By"
                value={qualityTest.createdBy}
              />
            </Grid> */}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

const DetailItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => {
  const iconColorMap: { [key: string]: string } = {
    MapPin: '#ff6b6b',
    GiWell: '#4dabf7',
    HeartPulse: '#ff8787',
    Cog: '#495057',
    Calendar: '#f783ac',
    User: '#69db7c',
    Phone: '#4dabf7',
    Home: '#ffa94d',
    Users: '#20c997',
    PinDrop: '#ff6b6b',
    Compass: '#4dabf7',
    ZoomIn: '#495057',
  };

  const iconColor = iconColorMap[Icon.displayName || Icon.name] || '#666';

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      <Icon size={20} style={{ color: iconColor, marginTop: 4 }} />
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="body1">{value}</Typography>
      </Box>
    </Box>
  );
};

export default WaterSourceDetails;