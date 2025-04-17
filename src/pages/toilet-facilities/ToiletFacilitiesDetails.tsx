import {
  Alert,
  Box,
  capitalize,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Modal,
  Stack,
  Tab,
  Tabs,
  Typography,
  Card,
  CardContent,
  Tooltip,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Calendar, Compass, Home, MapPin, Toilet, User, Users, X, ZoomIn } from 'lucide-react';
import React, { useState } from 'react';
import { FiAlertOctagon } from "react-icons/fi";
import { MdCleaningServices } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { apiController } from '../../axios';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Email, People, Phone } from '@mui/icons-material';

interface ToiletFacility {
  geolocation: {
    type: string;
    coordinates: [number, number, number];
  };
  publicSpace: string;
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  unmaintainedReasons: string
  numberOfSharedHouse: string;
  spaceType: string;
  compactments: number;
  dependent: number;
  condition: string;
  status: string;
  type: string;
  safetyRisk: string[];
  handWashingFacility?: string; // Made optional
  daysSinceLastEvacuation: number;
  evacuationFrequency: string;
  createdBy: string;
  capturedAt: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  domain?: {
    contactPersonName?: string;
    contactPersonPhoneNumber?: string;
    address?: string;
    population?: string;
    picture?: string;
  };
}

interface Enumerator {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

interface MapCardProps {
  latitude: number;
  longitude: number;
  hamlet: string;
  village: string;
  ward: string;
}

const CustomMarker = ({ position, tooltip }: { position: { lat: number; lng: number }; tooltip: string }) => {
  return (
    <AdvancedMarker position={position}>
      <Tooltip title={tooltip} arrow>
        <Box
          sx={{
            position: 'relative',
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: '#FF0000',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            animation: 'pulse 1.5s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(0.9)', opacity: 0.7 },
              '50%': { transform: 'scale(1.1)', opacity: 1 },
              '100%': { transform: 'scale(0.9)', opacity: 0.7 },
            },
          }}
        >
          <Pin
            background='#FF0000'
            glyphColor="#FFF"
            borderColor="#7F0000"
          />
        </Box>
      </Tooltip>
    </AdvancedMarker>
  );
};

const MapCard: React.FC<MapCardProps> = ({ latitude, longitude, hamlet, village, ward }) => (
  <Box
    sx={{
      position: 'absolute',
      top: 7,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      bgcolor: 'background.paper',
      p: 1,
      borderRadius: 2,
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
      display: 'flex',
      gap: 1,
      alignItems: 'center',
      width: '100%',
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

const iconColorMap: { [key: string]: string } = {
  MapPin: '#FF4B4B',         // Bright red
  GiWell: '#4284FF',        // Bright blue
  HeartPulse: '#FF6B8B',    // Pink
  Cog: '#6B7280',           // Gray
  Calendar: '#FF69B4',      // Hot pink
  User: '#22C55E',          // Green
  Phone: '#3B82F6',         // Blue
  Home: '#F97316',          // Orange
  Users: '#06B6D4',         // Cyan
  PinDrop: '#EF4444',       // Red
  Compass: '#0EA5E9',       // Sky blue
  ZoomIn: '#6366F1',        // Indigo
  Email: '#8B5CF6',         // Purple
  Toilet: '#10B981',        // Emerald
  FiAlertOctagon: '#F59E0B', // Amber
  MdCleaningServices: '#14B8A6', // Teal
  People: '#6366F1',        // Indigo
  X: '#4B5563',            // Gray
};
const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    <Icon style={{ color: iconColorMap[Icon.displayName] || '#000' }} />
    <Typography variant="body2" fontWeight={500} color="text.secondary">
      {capitalize(label)}:
    </Typography>
    <Typography variant="body2" color="text.primary">
      {value}
    </Typography>
  </Stack>
);

const OverviewTab = ({ toiletFacility, position, onImageClick }: {
  toiletFacility: ToiletFacility;
  position: { lat: number, lng: number };
  onImageClick: () => void;
}) => (
  <Grid container spacing={4}>
    <Grid item xs={12} md={8}>
      <Box sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        height: '100%'
      }}>
        <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>
          Location Details
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={MapPin} label="Location" value={`${toiletFacility.hamlet}, ${toiletFacility.village}`} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={Home} label="Category" value={toiletFacility.spaceType} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={Toilet} label="Toilet Type" value={toiletFacility.type} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={MdCleaningServices} label="Toilet Condition" value={toiletFacility.condition} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={MdCleaningServices} label="Toilet Condition" value={toiletFacility.condition} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={People} label="Number of shared households" value={toiletFacility.numberOfSharedHouse} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={FiAlertOctagon} label="Safety Risk" value={toiletFacility.safetyRisk?.join(', ')} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem
              icon={Calendar}
              label="Last Updated"
              value={format(new Date(toiletFacility.updatedAt), 'PPP')}
            />
          </Grid>
        </Grid>

      </Box>
    </Grid>

    <Grid item xs={12} md={4}>
      <Box
        sx={{
          position: 'relative',
          '&:hover .zoom-icon': { opacity: 1 }
        }}
      >
        <Box
          component="img"
          src={toiletFacility.picture}
          alt="Toilet Facility"
          onClick={onImageClick}
          sx={{
            width: '100%',
            height: 600,
            objectFit: 'cover',
            borderRadius: 2,
            cursor: 'pointer',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        />
        <IconButton
          className="zoom-icon"
          onClick={onImageClick}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            opacity: 0,
            transition: 'opacity 0.2s',
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
            color: 'white'
          }}
        >
          <ZoomIn />
        </IconButton>
      </Box>
    </Grid>

    <Grid item xs={12}>
      <Box sx={{
        height: 500,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        mb: 4,
        position: 'relative'
      }}>
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
          <Map
            mapId={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            defaultZoom={15}
            defaultCenter={position}
            style={{ width: '100%', height: '100%' }}
          >
            <CustomMarker position={position} tooltip="Toilet Facility" />
            <MapCard
              latitude={position.lat}
              longitude={position.lng}
              hamlet={toiletFacility.hamlet}
              village={toiletFacility.village}
              ward={toiletFacility.ward}
            />
          </Map>
        </APIProvider>
      </Box>
    </Grid>
  </Grid>
);

const PersonContactTab = ({ toiletFacility, setIsPersonImageOpen }: { toiletFacility: ToiletFacility; setIsPersonImageOpen: (open: boolean) => void }) => {
  const address = toiletFacility?.domain?.address;
  const population = toiletFacility?.domain?.population;
  const contactPersonImage = toiletFacility?.domain?.picture;
  const contactPersonName = toiletFacility?.domain?.contactPersonName;
  const contactPersonPhoneNumber = toiletFacility?.domain?.contactPersonPhoneNumber;

  return (
    <Grid container spacing={3}>
      <Grid item xs={8}>
        <Card sx={{ mb: 2, height: '100%' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DetailItem icon={User} label="Contact Person Name" value={contactPersonName} />
              </Grid>
              <Grid item xs={6}>
                <DetailItem icon={Phone} label="Phone Number" value={contactPersonPhoneNumber} />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={6}>
                <DetailItem icon={Home} label="Address" value={address} />
              </Grid>
              <Grid item xs={6}>
                <DetailItem icon={Users} label="Population" value={population} />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {contactPersonImage ? (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              '&:hover .zoom-icon': { opacity: 1 },
            }}
          >
            <Box
              component="img"
              src={contactPersonImage}
              alt="Contact Person"
              onClick={() => setIsPersonImageOpen(true)}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 2,
                cursor: 'pointer',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
              }}
            />
            <IconButton
              className="zoom-icon"
              onClick={() => setIsPersonImageOpen(true)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                opacity: 0,
                transition: 'opacity 0.2s',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                color: 'white',
              }}
            >
              <ZoomIn />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <Typography color="text.secondary">No image available</Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

const EnumeratorTab = ({ enumerator }: { enumerator: Enumerator }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ mb: 2, height: '100%' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DetailItem icon={User} label="Full Name" value={enumerator.fullName} />
              </Grid>
              <Grid item xs={6}>
                <DetailItem icon={Phone} label="Phone Number" value={enumerator.phone} />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={6}>
                <DetailItem icon={Email} label="Email" value={enumerator.email} />
              </Grid>
              <Grid item xs={6}>
                <DetailItem icon={Calendar} label="Last Login" value={format(new Date(enumerator.lastLogin), 'PPP')} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

const ToiletFacilitiesDetails: React.FC = () => {
  const [isFacilityImageOpen, setIsFacilityImageOpen] = useState(false);
  const [isPersonImageOpen, setIsPersonImageOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: toiletFacility, isLoading, error } = useQuery<ToiletFacility>({
    queryKey: ['toiletFacility', id],
    queryFn: () => apiController.get<ToiletFacility>(`/toilet-facilities/${id}`).then(res => res),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  if (error || !toiletFacility) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity={error ? "error" : "info"}>
          {error ? error.message : "No toilet facility found"}
        </Alert>
      </Container>
    );
  }

  const position = {
    lat: toiletFacility.geolocation.coordinates[1],
    lng: toiletFacility.geolocation.coordinates[0]
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => navigate(-1)}>
              <ArrowLeft />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight="500">
                {"Toilet Facility Details"}
              </Typography>
              <Typography color="text.secondary">
                {toiletFacility.ward}, {toiletFacility.village}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              variant="outlined"
              label={toiletFacility.type}
              color={toiletFacility.type === '"Pit Latrine without slab"' ? 'info' : 'primary'}
            />
            <Chip
              variant="outlined"
              label={toiletFacility.condition}
              color={toiletFacility.condition === 'Maintained' ? 'success' : 'warning'}
            />
          </Stack>
        </Stack>

        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" />
          <Tab label="Contact Person Details" />
          <Tab label="Enumerator" />
        </Tabs>

        <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          {activeTab === 0 ? (
            <OverviewTab 
              toiletFacility={toiletFacility} 
              position={position} 
              onImageClick={() => setIsFacilityImageOpen(true)} 
            />
          ) : activeTab === 1 ? (
            <PersonContactTab 
              toiletFacility={toiletFacility} 
              setIsPersonImageOpen={setIsPersonImageOpen} 
            />
          ) : (
            <EnumeratorTab enumerator={toiletFacility?.createdBy} />
          )}
        </Box>

        <Modal
          open={isFacilityImageOpen}
          onClose={() => setIsFacilityImageOpen(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <IconButton
              onClick={() => setIsFacilityImageOpen(false)}
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
              src={toiletFacility.picture}
              alt="Toilet Facility"
              sx={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: 2,
              }}
            />
          </Box>
        </Modal>

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
              src={toiletFacility?.domain?.picture}
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

export default ToiletFacilitiesDetails;