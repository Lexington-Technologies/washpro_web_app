import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Modal,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Compass, Home, MapPin, X, ZoomIn, User, Phone, Users } from 'lucide-react';
import React, { useState } from 'react';
import { IoFootstepsOutline, IoMapOutline, IoTimeOutline, IoTodayOutline } from 'react-icons/io5';
import { PiUsersFour } from 'react-icons/pi';
import { useNavigate, useParams } from 'react-router-dom';
import { apiController } from '../../axios';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { DensityMediumTwoTone, Email } from '@mui/icons-material';

// Define types for the open defecation site
interface OpenDefication {
  geolocation: {
    type: string;
    coordinates: [number, number, number];
  };
  spaceType: string;
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  footTraffic: string;
  peakTime: string;
  demographics: string;
  environmentalSpaceType: string;
  density: string;
  createdBy: string;
  capturedAt: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

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

const OpenDeficationDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Track which image is clicked
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: openDefication, isLoading, error } = useQuery<OpenDefication>({
    queryKey: ['openDefication', id],
    queryFn: () => apiController.get<OpenDefication>(`/open-defecations/${id}`).then(res => res),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  if (error || !openDefication) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity={error ? "error" : "info"}>
          {error ? error.message : "No open defecation site found"}
        </Alert>
      </Container>
    );
  }

  const position = {
    lat: openDefication.geolocation.coordinates[1],
    lng: openDefication.geolocation.coordinates[0]
  };

  // Handle image click
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageOpen(true);
  };

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
                {"Open Defecation Site"}
              </Typography>
              <Typography color="text.secondary">
                {openDefication.ward}, {openDefication.village}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" />
          <Tab label="Contact Person Details" />
          <Tab label="Enumerator" />
        </Tabs>

        {/* Tab Panels */}
        <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          {activeTab === 0 ? (
            <OverviewTab openDefication={openDefication} position={position} onImageClick={() => handleImageClick(openDefication.picture)} />
          ) : activeTab === 1 ? (
            <ContactPersonTab contactPerson={openDefication?.domain || null} onImageClick={handleImageClick} />
          ) : (
            <EnumeratorTab enumerator={openDefication?.createdBy || null} onImageClick={handleImageClick} />
          )}
        </Box>

        {/* Image Modal */}
        <Modal
          open={isImageOpen}
          onClose={() => setIsImageOpen(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <IconButton
              onClick={() => setIsImageOpen(false)}
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
              src={selectedImage || ''}
              alt="Selected Image"
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

const OverviewTab = ({ openDefication, position, onImageClick }: {
  openDefication: OpenDefication;
  position: { lat: number; lng: number };
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
            <DetailItem icon={MapPin} label="Location" value={`${openDefication.hamlet}, ${openDefication.village}`} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={Home} label="Public Space" value={openDefication.spaceType} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={IoMapOutline} label="Environmental Characteristic" value={openDefication.environmentalSpaceType} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={IoFootstepsOutline} label="Foot Traffics" value={openDefication.footTraffic} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={IoTimeOutline} label="Peak Time" value={openDefication.peakTime} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={PiUsersFour} label="Demographics" value={openDefication.demographics} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={DensityMediumTwoTone} label="Density" value={openDefication.density} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem
              icon={Calendar}
              label="Last Updated"
              value={format(new Date(openDefication.updatedAt), 'PPP')}
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
          src={openDefication.picture}
          alt="Open Defecation Site"
          onClick={onImageClick}
          sx={{
            width: '100%',
            height: 450,
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
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            mapId={GOOGLE_MAPS_API_KEY}
            defaultZoom={15}
            defaultCenter={position}
            style={{ width: '100%', height: '100%' }}
          >
            <CustomMarker 
              position={position}
              tooltip={`${openDefication.spaceType} - ${openDefication.ward}`}
            />
            <MapCard
              latitude={position.lat}
              longitude={position.lng}
              hamlet={openDefication.hamlet}
              village={openDefication.village}
              ward={openDefication.ward}
            />
          </Map>
        </APIProvider>
      </Box>
    </Grid>
  </Grid>
);

const ContactPersonTab = ({ contactPerson, onImageClick }: { contactPerson: any; onImageClick: (imageUrl: string) => void }) => {
  if (!contactPerson) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Not a household
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={8}>
        <Card sx={{ mb: 2, height: '45%' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DetailItem icon={User} label="Contact Person Name" value={contactPerson.contactPersonName || "Not specified"} />
              </Grid>
              <Grid item xs={6}>
                <DetailItem icon={Phone} label="Phone Number" value={contactPerson.contactPersonPhoneNumber || "Not specified"} />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={6}>
                <DetailItem icon={Home} label="Address" value={contactPerson.address || "Not specified"} />
              </Grid>
              <Grid item xs={6}>
                <DetailItem icon={Users} label="Population" value={contactPerson.population || "Not specified"} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {contactPerson.picture ? (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '45%',
              '&:hover .zoom-icon': { opacity: 1 },
            }}
          >
            <Box
              component="img"
              src={contactPerson.picture}
              alt="Contact Person"
              onClick={() => onImageClick(contactPerson.picture)}
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
              onClick={() => onImageClick(contactPerson.picture)}
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
          " "
        )}
      </Grid>
    </Grid>
  );
};

const EnumeratorTab = ({ enumerator, onImageClick }: { enumerator: any; onImageClick: (imageUrl: string) => void }) => {
  if (!enumerator) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Not specified
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ mb: 2, height: '100%' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DetailItem icon={User} label="Full Name" value={enumerator.fullName || "Not specified"} />
              </Grid>
              <Grid item xs={6}>
                <DetailItem icon={Phone} label="Phone Number" value={enumerator.phone || "Not specified"} />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={6}>
                <DetailItem icon={Email} label="Email" value={enumerator.email || "Not specified"} />
              </Grid>
              <Grid item xs={6}>
                <DetailItem icon={Calendar} label="Last Login" value={enumerator.lastLogin ? format(new Date(enumerator.lastLogin), 'PPP') : "Not specified"} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
const getIconColor = (label: string): string => {
  switch (label) {
    case 'Location':
    case 'Hamlet':
      return '#FF5252'; // red
    case 'Public Space':
    case 'Village':
    case 'Ward':
      return '#2196F3'; // blue
    case 'Environmental Characteristic':
      return '#4CAF50'; // green
    case 'Foot Traffics':
      return '#FFC107'; // amber
    case 'Peak Time':
      return '#9C27B0'; // purple
    case 'Demographics':
      return '#FF9800'; // orange
    case 'Density':
      return '#795548'; // brown
    case 'Last Updated':
    case 'Last Login':
      return '#607D8B'; // blue grey
    case 'Contact Person Name':
    case 'Full Name':
      return '#E91E63'; // pink
    case 'Phone Number':
      return '#00BCD4'; // cyan
    case 'Email':
      return '#3F51B5'; // indigo
    case 'Address':
      return '#009688'; // teal
    case 'Population':
      return '#8BC34A'; // light green
    default:
      return '#666666'; // default gray
  }
};

const DetailItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
    <Icon size={20} style={{ color: getIconColor(label), marginTop: 4 }} />
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body1">
        {value}
      </Typography>
    </Box>
  </Box>
);


export default OpenDeficationDetails;