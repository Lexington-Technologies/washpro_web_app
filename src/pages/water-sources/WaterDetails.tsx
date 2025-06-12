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
import { ArrowLeft, Calendar, Cog, Compass, HeartPulse, Home, MapPin, Phone, User, Users, X, ZoomIn, MapPinHouse, Droplet } from 'lucide-react';
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
  motorizedInfo: {
    tankSize: number | null;
    numberOfTaps: number | null;
  };
}

interface QualityTest {
  clearness: string;
  ph: number;
  salinity: number | null;
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

// New Component: StatusChip
const StatusChip: React.FC<{ label?: string; status: 'success' | 'error' | 'warning' }> = ({ label, status }) => (
  <Chip
    label={label}
    sx={{
      fontWeight: 600,
      px: 1.5,
      py: 1,
      borderRadius: 1,
      ...(status === 'success' && { bgcolor: '#e8f5e9', color: '#2e7d32' }),
      ...(status === 'error' && { bgcolor: '#ffebee', color: '#c62828' }),
      ...(status === 'warning' && { bgcolor: '#fff8e1', color: '#f57f17' }),
    }}
  />
);

// New Component: DetailCard
const DetailCard: React.FC<{ 
  title: string; 
  icon?: React.ReactNode;
  noPadding?: boolean;
  children: React.ReactNode 
}> = ({ title, icon, noPadding = false, children }) => (
  <Box sx={{ 
    border: '1px solid', 
    borderColor: 'divider', 
    borderRadius: 2, 
    overflow: 'hidden',
    bgcolor: 'background.paper'
  }}>
    <Box sx={{ 
      bgcolor: 'primary.light', 
      px: 2, 
      py: 1.5, 
      display: 'flex', 
      alignItems: 'center',
      gap: 1
    }}>
      {icon}
      <Typography variant="subtitle1" fontWeight="600">{title}</Typography>
    </Box>
    <Box sx={{ p: noPadding ? 0 : 2 }}>{children}</Box>
  </Box>
);

// New Component: MediaCard
const MediaCard: React.FC<{ 
  title: string; 
  src: string; 
  onClick: () => void 
}> = ({ title, src, onClick }) => (
  <Box sx={{ 
    border: '1px solid', 
    borderColor: 'divider', 
    borderRadius: 2, 
    overflow: 'hidden',
    bgcolor: 'background.paper'
  }}>
    <Box sx={{ 
      bgcolor: 'primary.light', 
      px: 2, 
      py: 1.5, 
      display: 'flex', 
      alignItems: 'center',
      gap: 1
    }}>
      <Typography variant="subtitle1" fontWeight="600">{title}</Typography>
    </Box>
    <Box sx={{ position: 'relative' }}>
      <Box
        component="img"
        src={src}
        alt={title}
        onClick={onClick}
        sx={{
          width: '100%',
          height: 250,
          objectFit: 'cover',
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'scale(1.03)' }
        }}
      />
      <IconButton
        onClick={onClick}
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': { bgcolor: 'white' },
          boxShadow: 1,
        }}
      >
        <ZoomIn size={20} />
      </IconButton>
    </Box>
  </Box>
);

// New Component: MapInfoBox
const MapInfoBox: React.FC<{ 
  hamlet?: string; 
  village?: string; 
  ward?: string; 
  position: [number, number] 
}> = ({ hamlet, village, ward, position }) => (
  <Box sx={{
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1000,
    bgcolor: 'background.paper',
    p: 1.5,
    borderRadius: 1,
    boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
    maxWidth: 300
  }}>
    <InfoItem label="Hamlet" value={hamlet} />
    <InfoItem label="Village" value={village} />
    <InfoItem label="Ward" value={ward} />
    <InfoItem 
      label="Coordinates" 
      value={`${position[0].toFixed(6)}, ${position[1].toFixed(6)}`} 
    />
  </Box>
);

// New Component: InfoItem
const InfoItem: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
  <Box sx={{ display: 'flex', gap: 1 }}>
    <Typography variant="body2" fontWeight="500">{label}:</Typography>
    <Typography variant="body2">{value || 'N/A'}</Typography>
  </Box>
);

const iconColors = {
  location: {
    bg: '#e3f2fd',
    icon: '#1976d2'
  },
  status: {
    bg: '#e8f5e9',
    icon: '#2e7d32'
  },
  contact: {
    bg: '#fff3e0',
    icon: '#f57c00'
  },
  quality: {
    bg: '#e8eaf6',
    icon: '#3f51b5'
  },
  default: {
    bg: '#f5f5f5',
    icon: '#757575'
  }
};

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
        {/* Header with improved spacing */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'action.hover', borderRadius: 1 }}>
              <ArrowLeft />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight="600">
                Water Source Details
              </Typography>
              <Typography color="text.secondary" variant="subtitle2">
                ID: {id} | {waterSource?.ward}, {waterSource?.village}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <StatusChip 
              label={waterSource?.status}
              status={waterSource?.status === 'Functional' ? 'success' : 'error'} 
            />
            <StatusChip 
              label={waterSource?.availability}
              status={waterSource?.availability === 'Always Available' ? 'success' : 'warning'} 
              />
          </Stack>
        </Stack>

        {/* Centered Tabs with better visual hierarchy */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
              px: 2,
            }}
          >
            <Tab label="Overview" sx={{ fontWeight: 600 }} />
            <Tab label="Water Quality" sx={{ fontWeight: 600 }} />
        </Tabs>
        </Box>

        {/* Content Area */}
        <Box sx={{ 
          bgcolor: 'background.paper', 
          borderRadius: 3, 
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          p: 3,
          maxHeight: 'calc(100vh - 200px)', 
          overflowY: 'auto',
        }}>
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
        <Grid container spacing={3}>
      {/* Left Column - Details */}
      <Grid item xs={12} md={7}>
        <Grid container spacing={2}>
          {/* Location Card */}
          <Grid item xs={12}>
            <DetailCard title="Location Details" icon={<MapPin size={20} />}>
              <Grid container spacing={2}>
                <DetailItem icon={MapPin} label="Hamlet" value={waterSource?.hamlet} />
                <DetailItem icon={Home} label="Village" value={waterSource?.village} />
                <DetailItem icon={Home} label="Ward" value={waterSource?.ward} />
                <DetailItem icon={Droplet} label="Type" value={waterSource?.type} />
                <DetailItem icon={Compass} label="Coordinates" 
                  value={`${position[0].toFixed(6)}, ${position[1].toFixed(6)}`} />
          </Grid>
            </DetailCard>
          </Grid>
          
          {/* Status Card */}
          <Grid item xs={12}>
            <DetailCard title="Status Information" icon={<Cog size={20} />}>
              <Grid container spacing={2}>
                <DetailItem icon={Cog} label="Status" value={waterSource?.status} />
                <DetailItem icon={HeartPulse} label="Availability" value={waterSource?.availability} />
                <DetailItem icon={Calendar} label="Last Updated" 
                  value={format(new Date(waterSource?.updatedAt), 'PP')} />
        </Grid>
            </DetailCard>
          </Grid>
          
          {/* Motorized Info Card */}
          {waterSource?.motorizedInfo && (
            <Grid item xs={12}>
              <DetailCard title="Motorized Information" icon={<Cog size={20} />}>
                <Grid container spacing={2}>
                  <DetailItem icon={Cog} label="Tank Size" 
                    value={waterSource.motorizedInfo.tankSize ? `${waterSource.motorizedInfo.tankSize}L` : 'N/A'} />
                  <DetailItem icon={Cog} label="Number of Taps" 
                    value={waterSource.motorizedInfo.numberOfTaps || 'N/A'} />
          </Grid>
              </DetailCard>
        </Grid>
          )}
          
          {/* Enumerator Card */}
          <Grid item xs={12}>
            <DetailCard title="Enumerator Details" icon={<User size={20} />}>
              <Grid container spacing={2}>
            <DetailItem icon={User} label="Full Name" value={waterSource?.createdBy?.fullName} />
                <DetailItem icon={Phone} label="Phone" value={waterSource?.createdBy?.phone} />
                <DetailItem icon={Calendar} label="Captured At" 
                  value={format(new Date(waterSource?.createdBy?.createdAt), 'PP')} />
          </Grid>
            </DetailCard>
          </Grid>
          </Grid>
        </Grid>

      {/* Right Column - Media */}
      <Grid item xs={12} md={5}>
        <Stack spacing={3}>
    {/* Water Source Image */}
          <MediaCard 
            title="Water Source Photo"
        src={waterSource?.picture}
        onClick={onWaterSourceImageClick}
          />

    {/* Person Image */}
    {waterSource?.createdBy?.picture && (
            <MediaCard 
              title="Household Photo"
          src={waterSource?.createdBy?.picture}
          onClick={onPersonImageClick}
            />
          )}
        </Stack>
</Grid>

      {/* Map Section - Full Width */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <DetailCard title="Location Map" icon={<Compass size={20} />} noPadding>
          <Box sx={{ height: 400, position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={{ lat: position[0], lng: position[1] }}
        zoom={15}
      >
        <MarkerF position={{ lat: position[0], lng: position[1] }} />
      </GoogleMap>
            <MapInfoBox 
        hamlet={waterSource?.hamlet}
        village={waterSource?.village}
        ward={waterSource?.ward}
              position={position}
      />
    </Box>
        </DetailCard>
  </Grid>
        </Grid>
  );
};

const QualityTab = ({ qualityTest }: { qualityTest: QualityTest }) => {
  const barData = [
    { name: 'Clearness', value: qualityTest.clearness === 'Dirty' ? 0 : 10 },
    { name: 'pH Level', value: qualityTest.ph },
    { name: 'Salinity', value: qualityTest.salinity || 0 },
    { name: 'Conductivity', value: qualityTest.conductivity },
  ];

  const radarData = [
    { subject: 'Clearness', value: qualityTest.clearness === 'Dirty' ? 0 : 10, fullMark: 10 },
    { subject: 'pH', value: qualityTest.ph, fullMark: 14 },
    { subject: 'Salinity', value: qualityTest.salinity || 0, fullMark: 10 },
    { subject: 'Conductivity', value: qualityTest.conductivity, fullMark: 10 },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <DetailCard title="Quality Metrics">
          <Box sx={{ height: 300 }}>
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
        </DetailCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <DetailCard title="Quality Analysis">
          <Box sx={{ height: 300 }}>
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
        </DetailCard>
      </Grid>
      <Grid item xs={12}>
        <DetailCard title="Test Information">
          <Grid container spacing={2}>
              <DetailItem
                icon={Calendar}
                label="Test Date"
              value={format(new Date(qualityTest.capturedAt), 'PPPp')}
              />
              <DetailItem
              icon={Calendar}
              label="Last Updated"
              value={format(new Date(qualityTest.updatedAt), 'PPPp')}
            />
          </Grid>
        </DetailCard>
      </Grid>
    </Grid>
  );
};

const DetailItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => {
  // Determine which color set to use based on the label
  const getColorSet = () => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('hamlet') || labelLower.includes('village') || labelLower.includes('ward') || labelLower.includes('coordinates')) {
      return iconColors.location;
    }
    if (labelLower.includes('status') || labelLower.includes('availability')) {
      return iconColors.status;
    }
    if (labelLower.includes('name') || labelLower.includes('phone') || labelLower.includes('contact')) {
      return iconColors.contact;
    }
    if (labelLower.includes('quality') || labelLower.includes('test')) {
      return iconColors.quality;
    }
    return iconColors.default;
  };

  const colors = getColorSet();

  return (
    <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1 }}>
      <Box sx={{ 
        bgcolor: colors.bg, 
        p: 1, 
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={18} color={colors.icon} />
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="body1" fontWeight="500">{value || 'Not specified'}</Typography>
      </Box>
    </Grid>
  );
};

export default WaterSourceDetails;