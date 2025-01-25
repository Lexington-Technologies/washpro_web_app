import React, { useState } from 'react';
import { MapPin, Home, MapIcon, Users, ArrowLeft, MessageCircle, Download, ZoomIn, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Container, 
  Paper,
  styled,
  Tabs,
  Tab,
  Alert,
  IconButton,
  Stack,
  Tooltip,
  Modal
} from '@mui/material';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { apiController } from '../../axios';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingAnimation from '../../components/LoadingAnimation';
import { FaShareNodes } from 'react-icons/fa6';

// Define types for the toilet facility
interface ToiletFacility {
  geolocation: {
    type: string;
    coordinates: [number, number, number];
  };
  publicSpace: string;
  dependent: number;
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  space: string;
  compactments: number;
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
}

const DataCardWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

function DataCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <DataCardWrapper elevation={1}>
      <Icon style={{ color: '#1976d2', width: 20, height: 20 }} />
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          {value}
        </Typography>
      </Box>
    </DataCardWrapper>
  );
}

const ToiletFacilitiesDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false); // State to control image modal

  const { data: toiletFacility, isLoading, error } = useQuery<ToiletFacility>({
    queryKey: ['toiletFacility', id],
    queryFn: () => apiController.get<ToiletFacility>(`/toilet-facilities/${id}`).then(res => res),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleChat = () => {
    // Add chat functionality here
    console.log('Chat button clicked');
  };

  const handleShare = () => {
    try {
      navigator.share({
        title: 'Toilet Facility Details',
        text: `Check out this toilet facility at ${toiletFacility?.ward}`,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Sharing failed', error);
    }
  };

  const handleDownload = () => {
    // Add download functionality here
    console.log('Download button clicked');
  };

  const handleImageClick = () => {
    setIsImageOpen(true); // Open the image modal
  };

  const handleCloseImage = () => {
    setIsImageOpen(false); // Close the image modal
  };

  if (isLoading) return <LoadingAnimation />;

  if (error || !toiletFacility) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity={error ? "error" : "info"}>
          {error ? error.message : "No toilet facility found"}
        </Alert>
      </Container>
    );
  }

  const position: [number, number] = [toiletFacility?.geolocation.coordinates[1], toiletFacility?.geolocation.coordinates[0]];
  const picture = toiletFacility?.picture;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 1 }}>
      <Container maxWidth="lg">
        {/* Top Bar with Back Button and Action Buttons */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          {/* Back Button */}
          <Tooltip title="Go back">
            <IconButton onClick={handleGoBack} sx={{ color: 'primary.main' }}>
              <ArrowLeft />
            </IconButton>
          </Tooltip>

          {/* Action Buttons (Chat, Share, Download) */}
          <Stack direction="row" spacing={2}>
            <Tooltip title="Chat">
              <IconButton onClick={handleChat} sx={{ color: 'primary.main' }}>
                <MessageCircle />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton onClick={handleShare} sx={{ color: 'primary.main' }}>
                <FaShareNodes />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download">
              <IconButton onClick={handleDownload} sx={{ color: 'primary.main' }}>
                <Download />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Typography variant="h4" fontWeight="bold" color='#25306B' gutterBottom>
          Toilet Facility Details
        </Typography>

        {/* Map Section */}
        <Box sx={{ mb: 4, position: 'relative' }}>
          {/* Location Info Card */}
          <Card elevation={3} sx={{ p: 2, position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, width: 'calc(100% - 32px)', maxWidth: 750 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={4} md={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MapPin style={{ color: '#1976d2', width: 20, height: 20 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Latitude
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" noWrap>
                      {position[0].toFixed(6)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MapPin style={{ color: '#1976d2', width: 20, height: 20 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Longitude
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" noWrap>
                      {position[1].toFixed(6)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Home style={{ color: '#1976d2', width: 20, height: 20 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Ward
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" noWrap>
                      {toiletFacility?.ward}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MapIcon style={{ color: '#1976d2', width: 20, height: 20 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Hamlet
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" noWrap>
                      {toiletFacility?.hamlet}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Home style={{ color: '#1976d2', width: 20, height: 20 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Village
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" noWrap>
                      {toiletFacility?.village}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>

          <Card elevation={3}>
            <Box height={500}>
              <MapContainer 
                center={position} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                  <Popup>
                    {toiletFacility?.type} at {toiletFacility?.ward}
                  </Popup>
                </Marker>
              </MapContainer>
            </Box>
          </Card>
        </Box>

        {/* Tabs Section */}
        <Card elevation={3}>
          <CardContent>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="toilet facility tabs">
              <Tab label="General Information" />
              <Tab label="Safety Risks" />
            </Tabs>
            <Box sx={{ mt: 3 }}>
              {tabValue === 0 && (
                <Grid container spacing={2}>
                  {/* Image in General Information Tab */}
                  <Grid item xs={12}>
                    <Card elevation={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <Box
                          component="img"
                          src={picture}
                          alt="Toilet Facility"
                          onClick={handleImageClick}
                          sx={{
                            width: 300,
                            height: 300,
                            objectFit: 'cover',
                            cursor: 'pointer',
                            borderRadius: 1,
                            mr: 2,
                          }}
                        />
                        <Tooltip title="Zoom In">
                          <IconButton
                            onClick={handleImageClick}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              color: 'white',
                              bgcolor: 'rgba(0, 0, 0, 0.5)',
                              '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.7)',
                              },
                            }}
                          >
                            <ZoomIn />
                          </IconButton>
                        </Tooltip>
                        <Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                              <DataCard icon={MapPin} label="Ward" value={toiletFacility.ward} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <DataCard icon={Home} label="Village" value={toiletFacility.village} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <DataCard icon={MapIcon} label="Hamlet" value={toiletFacility.hamlet} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <DataCard icon={Users} label="Dependents" value={toiletFacility.dependent} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <DataCard icon={Home} label="Public Space" value={toiletFacility.publicSpace} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <DataCard icon={Home} label="Compactments" value={toiletFacility.compactments} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <DataCard icon={Home} label="Condition" value={toiletFacility.condition} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <DataCard icon={Home} label="Status" value={toiletFacility.status} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <DataCard icon={Home} label="Type" value={toiletFacility.type} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <DataCard icon={Home} label="Hand Washing Facility" value={toiletFacility.handWashingFacility} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <DataCard icon={Home} label="Days Since Last Evacuation" value={toiletFacility.daysSinceLastEvacuation} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <DataCard icon={Home} label="Evacuation Frequency" value={toiletFacility.evacuationFrequency} />
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              )}
              {tabValue === 1 && (
                <Grid container spacing={2}>
                  {toiletFacility.safetyRisk.map((risk, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card elevation={3}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Safety Risk {index + 1}
                          </Typography>
                          <Typography variant="body1">
                            {risk}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Updated Image Modal */} 
        <Modal open={isImageOpen} onClose={handleCloseImage}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: "100%",
              maxHeight: "100%",
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              outline: 'none',
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={handleCloseImage}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
                zIndex: 1,
              }}
            >
              <X />
            </IconButton>

            {/* Image */}
            <Box
              component="img"
              src={picture}
              alt="Toilet Facility"
              sx={{
                maxWidth: '70%',
                maxHeight: '70%',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default ToiletFacilitiesDetails;
