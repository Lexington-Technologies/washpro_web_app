import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Modal,
  Stack,
  Typography,
  Tooltip,
  Tabs,
  Tab,
  Card,
  CardContent
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Compass, Home, MapPin, X, ZoomIn, User, Phone, Users } from 'lucide-react';
import React, { useState } from 'react';
import { FaRegCircleUser } from 'react-icons/fa6';
import { MdOutlineCleaningServices } from 'react-icons/md';
import { PiRecycleFill } from 'react-icons/pi';
import { RiAlarmWarningLine, RiDeleteBin6Line } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import { apiController } from '../../axios';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Email } from '@mui/icons-material';

interface DumpSite {
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
  condition: string;
  status: string;
  type: string;
  safetyRisk: string;
  evacuationSchedule: string;
  lastEvacuationDate: string;
  nextScheduledEvacuation: string;
  createdBy: string;
  capturedAt: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface MapCardProps {
  latitude: number;
  longitude: number;
  hamlet: string;
  village: string;
  ward: string;
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

const DumpSiteDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: dumpSite, isLoading, error } = useQuery<DumpSite>({
    queryKey: ['dumpSite', id],
    queryFn: () => apiController.get<DumpSite>(`/dump-sites/${id}`).then(res => res),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  if (error || !dumpSite) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity={error ? "error" : "info"}>
          {error ? error.message : "No dump site found"}
        </Alert>
      </Container>
    );
  }

  const position = {
    lat: dumpSite.geolocation.coordinates[1],
    lng: dumpSite.geolocation.coordinates[0]
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
                {"Dump Site"}
              </Typography>
              <Typography color="text.secondary">
                {dumpSite.ward || 'Not specified'}, {dumpSite.village || 'Not specified'}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            {/* <Chip
              variant="outlined"
              label={dumpSite.status || 'Not specified'}
              color={dumpSite.status === 'Improved' ? 'success' : 'error'}
            /> */}
            <Chip
              variant="outlined"
              label={dumpSite.condition || 'Not specified'}
              color={dumpSite.condition === 'Foul smelling' ? 'success' : 'error'}
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
            <OverviewTab dumpSite={dumpSite} position={position} onImageClick={() => setIsImageOpen(true)} />
          ) : activeTab === 1 ? (
            <ContactPersonTab contactPerson={dumpSite?.domain || null} />
          ) : (
            <EnumeratorTab enumerator={dumpSite?.createdBy || null} />
          )}
        </Box>

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
              src={dumpSite.picture}
              alt="Dump Site"
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

const OverviewTab = ({ dumpSite, position, onImageClick }: {
  dumpSite: DumpSite;
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
            <DetailItem icon={MapPin} label="Location" value={`${dumpSite.hamlet || 'Not specified'}, ${dumpSite.village || 'Not specified'}`} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={Home} label="Public Space" value={dumpSite.spaceType || 'Not specified'} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={RiAlarmWarningLine} label="Safety Risk Level" value={dumpSite.safetyRisk || 'Not specified'} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={PiRecycleFill} label="Evacuation Schedule" value={dumpSite.evacuationSchedule || 'Not specified'} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem
              icon={Calendar}
              label="Last Updated"
              value={format(new Date(dumpSite.updatedAt), 'PPP')}
            />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={FaRegCircleUser} label="Captured By" value={'AbdulUbaid'} />
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
          src={dumpSite.picture}
          alt="Dump Site"
          onClick={onImageClick}
          sx={{
            width: '100%',
            height: 400,
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
              tooltip={`${dumpSite.type || 'Not specified'} - ${dumpSite.ward || 'Not specified'}`}
            />
            <MapCard
              latitude={position.lat}
              longitude={position.lng}
              hamlet={dumpSite.hamlet || 'Not specified'}
              village={dumpSite.village || 'Not specified'}
              ward={dumpSite.ward || 'Not specified'}
            />
          </Map>
        </APIProvider>
      </Box>
    </Grid>
  </Grid>
);

const ContactPersonTab = ({ contactPerson }: { contactPerson: any }) => {
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
        <Card sx={{ mb: 2, height: '100%' }}>
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
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
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
              height: '100%',
              '&:hover .zoom-icon': { opacity: 1 },
            }}
          >
            <Box
              component="img"
              src={contactPerson.picture}
              alt="Contact Person"
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

const EnumeratorTab = ({ enumerator }: { enumerator: any }) => {
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

const DetailItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number | null | undefined }) => {
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
        <Typography variant="body1">{value || "Not specified"}</Typography>
      </Box>
    </Box>
  );
};

export default DumpSiteDetails;