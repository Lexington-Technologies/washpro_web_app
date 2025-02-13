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
  CardMedia,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Calendar, Home, MapPin, Phone, Toilet, User, Users, X, ZoomIn } from 'lucide-react';
import React, { useState } from 'react';
import { FaChartSimple } from 'react-icons/fa6';
import { FiAlertOctagon } from "react-icons/fi";
import { GiSpill } from "react-icons/gi";
import { MdCleaningServices, MdOutlineWash } from 'react-icons/md';
import { RiDoorLine } from 'react-icons/ri';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';
import { apiController } from '../../axios';

// Define types for the toilet facility
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
  space: string;
  compactments: number;
  dependent: number;
  condition: string;
  status: string;
  type: string;
  safetyRisk: string[];
  handWashingFacility: string;
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

  const position: [number, number] = [toiletFacility.geolocation.coordinates[1], toiletFacility.geolocation.coordinates[0]];

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
                {"Toilet Facility Details"}
              </Typography>
              <Typography color="text.secondary">
                {toiletFacility.ward}, {toiletFacility.village}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label={toiletFacility.status}
              color={toiletFacility.status === 'Improved' ? 'success' : 'error'}
            />
            <Chip
              label={toiletFacility.condition}
              color={toiletFacility.condition === 'Maintained' ? 'success' : 'warning'}
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
          <Tab label="Person Contact" />
        </Tabs>

        {/* Tab Panels */}
        {activeTab === 0 ? (
          <OverviewTab toiletFacility={toiletFacility} position={position} onImageClick={() => setIsFacilityImageOpen(true)} />
        ) : (
          <PersonContactTab toiletFacility={toiletFacility} setIsPersonImageOpen={setIsPersonImageOpen} />
        )}

        {/* Image Modal for Toilet Facility */}
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

        {/* Image Modal for Contact Person */}
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

const OverviewTab = ({ toiletFacility, position, onImageClick }: {
  toiletFacility: ToiletFacility;
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
            <DetailItem icon={MapPin} label="Location" value={`${toiletFacility.hamlet}, ${toiletFacility.village}`} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={Home} label="Category" value={toiletFacility.space || 'Not Specified'} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={Toilet} label="Toilet Type" value={toiletFacility.type} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={Users} label="Dependents" value={toiletFacility.dependent || 'Not specified'} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={MdCleaningServices} label="Toilet Condition" value={toiletFacility.condition} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={FaChartSimple} label="Toilet Status" value={toiletFacility.status} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={MdOutlineWash} label="Hand Washing" value={capitalize(toiletFacility.handWashingFacility)} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={RiDoorLine} label="Compactments" value={toiletFacility.compactments || 'Not specified'} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={FiAlertOctagon} label="Safety Risk" value={toiletFacility.safetyRisk.join(', ')} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={GiSpill} label="Evacuation Status" value={toiletFacility.daysSinceLastEvacuation || 'Not specified'} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={User} label="Captured By" value={`Abdul Ubaid,\n(09118140594)`} />
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
            <Popup>{toiletFacility.type} at {toiletFacility.ward}</Popup>
          </Marker>
        </MapContainer>
      </Box>
    </Grid>
  </Grid>
);

const PersonContactTab = ({ toiletFacility, setIsPersonImageOpen }: { toiletFacility: ToiletFacility; setIsPersonImageOpen: (open: boolean) => void }) => {
  // Check if the person contact details are available
  const contactPersonName = toiletFacility?.domain?.contactPersonName || 'Not Specified';
  const contactPersonPhoneNumber = toiletFacility?.domain?.contactPersonPhoneNumber || 'Not Specified';
  const address = toiletFacility?.domain?.address || 'Not Specified';
  const population = toiletFacility?.domain?.population || 'Not Specified';
  const contactPersonImage = toiletFacility?.domain?.picture;

  return (
    <Grid container spacing={3}>
      <Grid item xs={8}>
        <Card sx={{ mb: 2, height: '100%' }}>
          <CardContent>
            <Grid container spacing={2}>
              {/* First Row for Contact Details */}
              <Grid item xs={6}>
                <DetailItem icon={User} label="Person Name" value={contactPersonName} />
              </Grid>
              <Grid item xs={6}>
                <DetailItem icon={Phone} label="Phone No" value={contactPersonPhoneNumber} />
              </Grid>
                {/* Divider between contact details and image */}
                <Grid item xs={12}>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

              {/* Second Row */}
              <Grid item xs={6}>
                <DetailItem icon={Home} label="Address" value={address} />
              </Grid>
              <Grid item xs={6}>
                <DetailItem icon={Users} label="Population" value={population} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Image positioned outside the card on the right */}
      <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {contactPersonImage ? (
          <Box
            sx={{
              position: 'relative',
              width: '100%', // Set a fixed width for the image
              height: '100%', // Set a fixed height for the image
              '&:hover .zoom-icon': { opacity: 1 },
            }}
          >
            <Box
              component="img"
              src={contactPersonImage}
              alt="Contact Person"
              onClick={() => setIsPersonImageOpen(true)} // Open the contact person's image modal
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
              onClick={() => setIsPersonImageOpen(true)} // Open the contact person's image modal
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

export default ToiletFacilitiesDetails;
