import {
  Alert,
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Modal,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Calendar, Home, MapPin, X, ZoomIn } from 'lucide-react';
import React, { useState } from 'react';
import { IoCameraOutline, IoFootstepsOutline, IoMapOutline, IoTimeOutline, IoTodayOutline } from 'react-icons/io5';
import { PiUsersFour } from 'react-icons/pi';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';
import { apiController } from '../../axios';
import LoadingAnimation from '../../components/LoadingAnimation';

// Define types for the open defecation site
interface OpenDefication {
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
  footTraffic: string;
  peakTime: string;
  demographics: string;
  environmentalCharacteristics: string;
  dailyAverage: string;
  createdBy: string;
  capturedAt: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

const OpenDeficationDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: openDefication, isLoading, error } = useQuery<OpenDefication>({
    queryKey: ['openDefication', id],
    queryFn: () => apiController.get<OpenDefication>(`/open-defecations/${id}`).then(res => res),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <LoadingAnimation />;
  if (error || !openDefication) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity={error ? "error" : "info"}>
          {error ? error.message : "No open defecation site found"}
        </Alert>
      </Container>
    );
  }

  const position: [number, number] = [openDefication.geolocation.coordinates[1], openDefication.geolocation.coordinates[0]];

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
        </Tabs>

        {/* Tab Panels */}
        {activeTab === 0 ? (
          <OverviewTab openDefication={openDefication} position={position} onImageClick={() => setIsImageOpen(true)} />
        ) : (null)}

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
              src={openDefication.picture}
              alt="Open Defecation Site"
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
  position: [number, number];
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
            <DetailItem icon={Home} label="Public Space" value={openDefication.publicSpace} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={IoMapOutline} label="Environmental Characteristic" value={openDefication.environmentalCharacteristics} />
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
            <DetailItem icon={IoTodayOutline} label="Daily Average" value={openDefication.dailyAverage} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={IoCameraOutline} label="Captured By" value={'AbdulUbaid'} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
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
        mb: 4
      }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={position}>
            <Popup>{openDefication.publicSpace} at {openDefication.ward}</Popup>
          </Marker>
        </MapContainer>
      </Box>
    </Grid>
  </Grid>
);

const DetailItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
    <Icon size={20} style={{ color: '#666', marginTop: 4 }} />
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
