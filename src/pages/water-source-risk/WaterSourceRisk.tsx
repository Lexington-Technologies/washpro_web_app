import { Waves, WaterDrop, LocationOn, Business } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Card,
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Chip,
  Divider,
  Avatar,
  Modal,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  CircularProgress,
} from '@mui/material';
import { ZoomIn, X, HomeIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useState } from 'react';
import { FaClipboardCheck, FaWrench } from 'react-icons/fa';
import { apiController } from '../../axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

interface Location {
  ward: string;
  village: string;
  hamlet: string;
  coordinates: [number, number, number];
}

interface Facility {
  facilityId: string;
  distance: number;
  riskLevel: 'critical' | 'moderate' | 'good';
}

interface Facilities {
  toilets: Facility[];
  soakAways: Facility[];
  openDefecation: Facility[];
  gutters: Facility[];
}

interface RiskSummary {
  critical: number;
  moderate: number;
  good: number;
  total: number;
}

interface Summary {
  toilets: RiskSummary;
  soakAways: RiskSummary;
  openDefecation: RiskSummary;
  gutters: RiskSummary;
}

interface WaterSourceRiskData {
  waterSourceId: string;
  waterSourceType: string;
  location: Location;
  facilities: Facilities;
  summary: Summary;
}

// interface summaryData {
//   id: string;
// }


const WaterSourceRisk = () => {
  const [selectedSource, setSelectedSource] = useState<WaterSourceRiskData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const { data: waterRisks, error, isLoading } = useQuery<WaterSourceRiskData[], Error>({
    queryKey: ['waterSourceRisk'],
    queryFn: async () => {
      const response = await apiController.get<WaterSourceRiskData[]>('/analysis');
      return response;
    },
  });
  console.log("risk",waterRisks )

  // summary
  // const { data: summary } = useQuery<summaryData[], Error>({
  //   queryKey: ['summary'],
  //   queryFn: async () => {
  //     const response = await apiController.get<summaryData[]>('/analysis/summary');
  //     return response;
  //   },
  // });
  // console.log("summary",summary )

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, color: 'error.main' }}>
        <Typography variant="h6">Error loading data</Typography>
      </Box>
    );
  }

  const handleMarkerClick = (waterRisk: WaterSourceRiskData) => {
    setSelectedSource(waterRisk);
    setModalOpen(true);
  };

  // Define custom icons
  const criticalIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const moderateIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const safeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // Calculate the center position based on the first water source or use default
  const defaultPosition: [number, number] = waterRisks && waterRisks.length > 0
    ? [waterRisks[0].location.coordinates[1], waterRisks[0].location.coordinates[0]]
    : [11.2832241, 7.6644755];

  // Helper function to determine marker icon based on risk levels
  const getMarkerIcon = (waterRisk: WaterSourceRiskData) => {
    const hasCritical = waterRisk.facilities.toilets.some(t => t.riskLevel === 'critical');
    const hasModerate = waterRisk.facilities.toilets.some(t => t.riskLevel === 'moderate');
    
    if (hasCritical) return criticalIcon;
    if (hasModerate) return moderateIcon;
    return safeIcon;
  };

  const FilterDropdown = ({ label, options }) => {
    const [selectedOption, setSelectedOption] = useState('');
  
    const handleChange = (event) => {
      setSelectedOption(event.target.value);
    };
  
    return (
      <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 120 }}>
        <InputLabel>{label}</InputLabel>
        <Select value={selectedOption} onChange={handleChange} label={label} sx={{ height: 45 }}>
          {options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };
  

  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 0.5 }}>
            Distance Monitoring for Risks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {waterRisks?.length || 0} Water Sources Monitored
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <FilterDropdown label="Ward" options={['All']} />
          <FilterDropdown label="Village" options={['All']} />
          <FilterDropdown label="Hamlet" options={['All']} />
        </Stack>
      </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <StatsCard
          title="Critical Risks"
          value={"798"}
          icon={<ErrorIcon />}
          iconColor="#f44336"
        />
        <StatsCard
          title="Moderate Risks"
          value={"198"}
          icon={<FaWrench style={{ color: "#CA8A04" }} />}
          iconColor="#ff9800"
        />
        <StatsCard
          title="Safe Facilities"
          value={"670"}
          icon={<FaClipboardCheck style={{ color: "#4caf50" }} />}
          iconColor="#4caf50"
        />
        <StatsCard
          title="Total Facilities"
          value={"1,666"}
          icon={<Waves style={{ color: "#2196f3" }} />}
          iconColor="#2196f3"
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 2, backgroundColor: '#f0f0f0' }}>
        <Paper sx={{ p: 2, borderRadius: 2, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Risk Heatmap</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f44336' }} />
                <Typography sx={{fontSize: 13, fontWeight: 'bold'}}>Critical Risk (&lt;10m)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff9800' }} />
                <Typography sx={{fontSize: 13, fontWeight: 'bold'}}>Moderate Risk (10-30m)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50' }} />
                <Typography sx={{fontSize: 13, fontWeight: 'bold'}}>Safe Distance (&gt;30m)</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ height: 600, bgcolor: '#F8FAFC', borderRadius: 1, overflow: 'hidden' }}>
            <MapContainer
              center={defaultPosition}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {waterRisks?.map((waterRisk) => (
                <Marker 
                  key={waterRisk.waterSourceId}
                  position={[waterRisk.location.coordinates[1], waterRisk.location.coordinates[0]]}
                  icon={getMarkerIcon(waterRisk)}
                  eventHandlers={{
                    click: () => handleMarkerClick(waterRisk)
                  }}
                />
              ))}
            </MapContainer>
          </Box>
        </Paper>
      </Box>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, bgcolor: '#f8f9fa' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Water Source Details
          </Typography>
          <IconButton
            onClick={() => setModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedSource && (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      position: 'relative',
                      '&:hover .zoom-icon': { opacity: 1 },
                      height: '100%',
                    }}
                  >
                    <Box
                      component="img"
                      src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80"
                      alt="Water source"
                      onClick={() => setIsImageOpen(true)}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 2,
                        cursor: 'pointer',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
                      }}
                    />
                    <IconButton
                      className="zoom-icon"
                      onClick={() => setIsImageOpen(true)}
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
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>Risk Summary</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, bgcolor: '#fee2e2', borderRadius: 1 }}>
                          <Typography variant="body2" color="error">Critical Risks</Typography>
                          <Typography variant="h4">{selectedSource.summary.toilets.critical}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, bgcolor: '#fef3c7', borderRadius: 1 }}>
                          <Typography variant="body2" color="warning.main">Moderate Risks</Typography>
                          <Typography variant="h4">{selectedSource.summary.toilets.moderate}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, bgcolor: '#dcfce7', borderRadius: 1 }}>
                          <Typography variant="body2" color="success.main">Safe Facilities</Typography>
                          <Typography variant="h4">{selectedSource.summary.toilets.good}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, bgcolor: '#dbeafe', borderRadius: 1 }}>
                          <Typography variant="body2" color="info.main">Total Facilities</Typography>
                          <Typography variant="h4">{selectedSource.summary.toilets.total}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Box
                    sx={{
                      bgcolor: '#fff',
                      p: 3,
                      borderRadius: 2,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      height: '100%', // Ensure the height matches the adjacent container
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between', // Distribute content evenly
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <WaterDrop sx={{ color: 'primary.main', fontSize: 28 }} />
                      <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                        {selectedSource.waterSourceType}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
                          <LocationOn sx={{ color: 'primary.main' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Ward
                          </Typography>
                          <Typography variant="subtitle1" fontWeight="500">
                            {selectedSource.location.ward}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Avatar sx={{ bgcolor: 'success.light', width: 40, height: 40 }}>
                          <Business sx={{ color: 'success.main' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Village
                          </Typography>
                          <Typography variant="subtitle1" fontWeight="500">
                            {selectedSource.location.village}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Avatar sx={{ bgcolor: 'warning.light', width: 40, height: 40 }}>
                          <HomeIcon color="warning" />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Hamlet
                          </Typography>
                          <Typography variant="subtitle1" fontWeight="500">
                            {selectedSource.location.hamlet}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Chip
                        icon={<LocationOn />}
                        label={`${selectedSource.location.coordinates[1].toFixed(6)}, ${selectedSource.location.coordinates[0].toFixed(6)}`}
                        variant="outlined"
                        color="primary"
                        sx={{ width: '100%', justifyContent: 'flex-start', px: 1 }}
                      />
                    </Box>
                  </Box>
                </Grid>                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Nearby Facilities</Typography>
                  <Grid container spacing={2}>
                    {['toilets', 'soakAways', 'openDefecation', 'gutters'].map((facilityType) => (
                      <Grid item xs={12} sm={6} md={3} key={facilityType}>
                        <Card sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom sx={{ textTransform: 'capitalize' }}>
                            {facilityType.replace(/([A-Z])/g, ' $1').trim()}
                          </Typography>
                          <Typography variant="h5">
                            {selectedSource.facilities[facilityType as keyof Facilities].length}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>                
              </Grid>
            </Box>
          )}
        </DialogContent>
      </Dialog>

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
            src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80"
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
    </Box>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, iconColor }) => (
  <Card sx={{ flex: 1, p: 2, borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
      <Box sx={{
        bgcolor: `${iconColor}15`,
        p: 1,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {React.cloneElement(icon, { sx: { color: iconColor } })}
      </Box>
    </Box>
  </Card>
);

export default WaterSourceRisk;