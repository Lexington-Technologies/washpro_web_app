  import React, { useState } from 'react';
  import { MapPin, Droplets, Calendar, User, Home, MapIcon, TestTube2, Layers, Users, ArrowLeft, MessageCircle, Download, ZoomIn, X } from 'lucide-react';
  import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
  import { format } from 'date-fns';
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
    Modal} from '@mui/material';
  import 'leaflet/dist/leaflet.css';
  import { useQuery } from '@tanstack/react-query';
  import { apiController } from '../../axios';
  import { useParams, useNavigate } from 'react-router-dom';
  import LoadingAnimation from '../../components/LoadingAnimation';
  import { FaShareNodes } from 'react-icons/fa6';

  // Define types for the water source and quality test
  interface WaterSource {
    geolocation: {
      type: string;
      coordinates: [number, number, number];
    };
    publicSpace: string;
    dependent: number;
    _id: string;
    domain: string;
    picture: string;
    ward: string;
    village: string;
    hamlet: string;
    space: string;
    quality: string;
    status: string;
    type: string;
    createdBy: string;
    capturedAt: string;
    qualityTest: QualityTest[];
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

  const WaterSourceDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [isImageOpen, setIsImageOpen] = useState(false); // State to control image modal

    const { data: waterSource, isLoading, error } = useQuery<WaterSource>({
      queryKey: ['waterSource', id],
      queryFn: () => apiController.get<WaterSource>(`/water-sources/${id}`).then(res => res),
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
          title: 'Water Source Details',
          text: `Check out this water source at ${waterSource?.ward}`,
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

    if (error || !waterSource) {
      return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity={error ? "error" : "info"}>
            {error ? error.message : "No water source found"}
          </Alert>
        </Container>
      );
    }

    const position: [number, number] = [waterSource?.geolocation.coordinates[1], waterSource?.geolocation.coordinates[0]];
    const picture = waterSource?.picture;

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
            Water Source Details
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
                        {waterSource?.ward}
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
                        {waterSource?.hamlet}
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
                        {waterSource?.village}
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
                      {waterSource?.type} at {waterSource?.ward}
                    </Popup>
                  </Marker>
                </MapContainer>
              </Box>
            </Card>
          </Box>

          {/* Tabs Section */}
          <Card elevation={3}>
            <CardContent>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="water source tabs">
                <Tab label="General Information" />
                <Tab label="Quality Test Results" />
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
                            alt="Water Source"
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
                                top: 10,
                                right: 890,
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
                                <DataCard icon={MapPin} label="Ward" value={waterSource.ward} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <DataCard icon={Home} label="Village" value={waterSource.village} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <DataCard icon={MapIcon} label="Hamlet" value={waterSource.hamlet} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <DataCard icon={Droplets} label="Quality" value={waterSource.quality} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <DataCard icon={Layers} label="Type" value={waterSource.type} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <DataCard icon={User} label="Created By" value={waterSource.createdBy} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <DataCard icon={Calendar} label="Captured At" value={format(new Date(waterSource.capturedAt), 'PPP')} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <DataCard icon={Users} label="Dependents" value={waterSource.dependent} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <DataCard icon={MapPin} label="Public Space" value={waterSource.publicSpace} />
                              </Grid>
                            </Grid>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                )}
                  {tabValue === 1 && (
                    <Grid container spacing={1} >
                      {waterSource?.qualityTest.map((test) => (
                        <React.Fragment key={test._id} >
                          <Grid item xs={12} md={6}>
                            <DataCard 
                              icon={TestTube2} 
                              label="Clearness"
                              value={test.clearness}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DataCard 
                              icon={TestTube2} 
                              label="Odor"
                              value={test.odor}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DataCard 
                              icon={TestTube2} 
                              label="pH"
                              value={test.ph}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DataCard 
                              icon={TestTube2} 
                              label="Salinity"
                              value={test.salinity}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DataCard 
                              icon={TestTube2} 
                              label="Conductivity"
                              value={test.conductivity}
                            />
                          </Grid>
                        </React.Fragment>
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
      alt="Water Source"
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

  export default WaterSourceDetails;