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
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Calendar, Cog, HeartPulse, Home, MapPin, User, Users, X, ZoomIn } from 'lucide-react';
import React, { useState } from 'react';
import { GiWell } from 'react-icons/gi';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
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
  YAxis
} from 'recharts';
import { apiController } from '../../axios';

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

const WaterSourceDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: waterSource, isLoading, error } = useQuery<WaterSource>({
    queryKey: ['waterSource', id],
    queryFn: () => apiController.get<WaterSource>(`/water-sources/${id}`).then(res => res),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  console.log("water",waterSource)

    const { data: household } = useQuery({
      queryKey: ['/households'],
      queryFn: () => apiController.get(`/households`).then(res => res.data),
    }); 
    console.log("household",household)
  
  


  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  if (error || !waterSource) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity={error ? "error" : "info"}>
          {error ? error.message : "No water source found"}
        </Alert>
      </Container>
    );
  }

  const position: [number, number] = [waterSource.geolocation.coordinates[1], waterSource.geolocation.coordinates[0]];

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
                {"Water Source Details"}
              </Typography>
              <Typography color="text.secondary">
                {waterSource.ward}, {waterSource.village}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              variant='outlined'
              label={waterSource.status}
              color={waterSource.status === 'Functional' ? 'success' : 'error'}
            />
            <Chip
              variant='outlined'
              label={waterSource.quality}
              color={waterSource.quality === 'Drinkable' ? 'success' : 'error'}
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
          <Tab label="Person Contact" />
        </Tabs>

        {/* Tab Panels */}
        {activeTab === 0 ? (
          <OverviewTab waterSource={waterSource} position={position} onImageClick={() => setIsImageOpen(true)} />
        ) : activeTab === 1 ? (
          <QualityTab qualityTest={waterSource.qualityTest[0]} />
        ) : (
          <PersonContactTab domain={waterSource.domain} />
        )}

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
              src={waterSource.picture}
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
      </Container>
    </Box>
  );
};

const OverviewTab = ({ waterSource, position, onImageClick }: {
  waterSource: WaterSource;
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
            <DetailItem icon={MapPin} label="Location" value={`${waterSource.hamlet}, ${waterSource.village}`} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={Home} label="Category" value={waterSource.space} />
          </Grid>

        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem icon={GiWell} label="Water Source Type" value={waterSource.type} />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={Users} label="Dependents" value={waterSource.dependent || 'Not specified'} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
        <Grid item xs={6}>
            <DetailItem
              icon={HeartPulse}
              label="Water Quality"
              value={waterSource.quality}
            />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={Cog} label="Water Source Status" value={waterSource.status} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DetailItem
              icon={Calendar}
              label="Last Updated"
              value={format(new Date(waterSource.updatedAt), 'PPP')}
            />
          </Grid>
          <Grid item xs={6}>
            <DetailItem icon={User} label="Captured By" value={`Abdul Ubaid,\n(09118140594)`} />
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
          src={waterSource.picture}
          alt="Water Source"
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
            <Popup>{waterSource.type} at {waterSource.ward}</Popup>
          </Marker>
        </MapContainer>
      </Box>
{/* <Typography variant="h6" line sx={{ color: '#25306B', fontWeight: 300 }}>
            General Details
          </Typography>     */}
    </Grid>
  </Grid>
);


const QualityTab = ({ qualityTest }: { qualityTest: QualityTest }) => {
  const barData = [
    { name: 'Clearness', value: qualityTest.clearness },
    { name: 'Odor', value: qualityTest.odor },
    { name: 'pH Level', value: qualityTest.ph },
    { name: 'Salinity', value: qualityTest.salinity },
    { name: 'Conductivity', value: qualityTest.conductivity },
  ];

  const radarData = [
    {
      subject: 'Clearness',
      value: qualityTest.clearness,
      fullMark: 10,
    },
    {
      subject: 'Odor',
      value: qualityTest.odor,
      fullMark: 10,
    },
    {
      subject: 'pH',
      value: qualityTest.ph,
      fullMark: 14,
    },
    {
      subject: 'Salinity',
      value: qualityTest.salinity,
      fullMark: 10,
    },
    {
      subject: 'Conductivity',
      value: qualityTest.conductivity,
      fullMark: 10,
    },
  ];

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>Quality Metrics</Typography>
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
        <Typography variant="h6" gutterBottom>Quality Analysis</Typography>
        <Box sx={{ height: 400, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)', p: 2, borderRadius: 2 }}>
          <ResponsiveContainer>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar
                name="Quality"
                dataKey="value"
                stroke="#1976d2"
                fill="#1976d2"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{
          p: 3,
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
            <Grid item xs={12} md={6}>
              <DetailItem
                icon={User}
                label="Tested By"
                value={qualityTest.createdBy}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

const PersonContactTab = ({ domain }: { domain: { _id: string; createdBy: string } }) => (
  <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)' }}>
    <Typography variant="subtitle1" gutterBottom>Person Contact</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <DetailItem icon={User} label="Domain ID" value={domain._id} />
      </Grid>
      <Grid item xs={12} md={6}>
        <DetailItem icon={User} label="Created By" value={domain.createdBy} />
      </Grid>
    </Grid>
  </Box>
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

export default WaterSourceDetails;