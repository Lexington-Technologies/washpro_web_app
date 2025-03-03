import { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Paper,
  Card,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import ErrorIcon from '@mui/icons-material/Error';
import { FaWrench, FaClipboardCheck } from 'react-icons/fa';
import Waves from '@mui/icons-material/Waves';
import { apiController } from '../../axios';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '../../components/Table/DataTable';
import { MapPin, Compass, X, Droplet, AlertCircle, HomeIcon, LayersIcon } from 'lucide-react';
import { CompassCalibration, CompassCalibrationSharp, Home, LocationCity, PinDrop } from '@mui/icons-material';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) => (
  <FormControl variant="outlined" sx={{ minWidth: 210 }}>
    <InputLabel>{label}</InputLabel>
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as string)}
      label={label}
      sx={{ height: 40 }}
    >
      <MenuItem value="">All {label}</MenuItem>
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

interface WaterSourceRiskData {
  waterSourceId: string;
  waterSourceType: string;
  location: Location;
  facilities: Facilities;
  summary: Summary;
}

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

// mock data
const waterRisksmock = [
  {
    picture: "https://example.com/images/source1.jpg",
    ward: "Ward A",
    village: "Village X",
    hamlet: "Hamlet 1",
    type: "Borehole",
    critical: 5,
    moderate: 10,
    good: 20
  },
  {
    picture: "https://example.com/images/source2.jpg",
    ward: "Ward B",
    village: "Village Y",
    hamlet: "Hamlet 2",
    type: "Well",
    critical: 2,
    moderate: 8,
    good: 15
  },
  {
    picture: "https://example.com/images/source3.jpg",
    ward: "Ward C",
    village: "Village Z",
    hamlet: "Hamlet 3",
    type: "Hand Pump",
    critical: 3,
    moderate: 5,
    good: 12
  },
  {
    picture: "https://example.com/images/source4.jpg",
    ward: "Ward A",
    village: "Village W",
    hamlet: "Hamlet 4",
    type: "Spring",
    critical: 1,
    moderate: 4,
    good: 18
  },
  {
    picture: "https://example.com/images/source5.jpg",
    ward: "Ward D",
    village: "Village Q",
    hamlet: "Hamlet 5",
    type: "River",
    critical: 7,
    moderate: 12,
    good: 25
  }
];

// Define your row shape
const columnHelper = createColumnHelper<WaterSourceRiskData>();

// Make some columns!
const columns = [
  columnHelper.accessor('picture', {
    header: 'Picture',
    cell: props => (
      <Avatar
        src={props.row.original.picture}
        alt="water source"
        sx={{
          borderRadius: '100%', // Make avatar round
        }}
      />
    ),
  }),
  columnHelper.accessor('ward', {
    header: 'Ward',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('village', {
    header: 'Village',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('hamlet', {
    header: 'Hamlet',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: info => info.getValue(),
  }),

  // **Styled Badge for Critical**
  columnHelper.accessor('critical', {
    header: 'Critical',
    cell: info => (
      <Chip
        label={info.getValue().toLocaleString()} // Format number
        sx={{
          color: '#ff1744', // Text color
          backgroundColor: '#fee2e2', // Background color
          fontWeight: 'bold',
        }}
      />
    ),
  }),

  // **Styled Badge for Moderate**
  columnHelper.accessor('moderate', {
    header: 'Moderate',
    cell: info => (
      <Chip
        label={info.getValue().toLocaleString()} // Format number
        sx={{
          color: '#ed6c02', // Text color
          backgroundColor: 'rgb(242, 221, 204)', // Background color
          fontWeight: 'bold',
        }}
      />
    ),
  }),

  // **Styled Badge for Good**
  columnHelper.accessor('good', {
    header: 'Good',
    cell: info => (
      <Chip
        label={info.getValue().toLocaleString()} // Format number
        sx={{
          color: 'rgb(51, 141, 27)', // Text color
          backgroundColor: '#8fdf82', // Background color
          fontWeight: 'bold',
        }}
      />
    ),
  }),
];

const WaterSourceRisk = () => {
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');
  const [showMapMarkers, setShowMapMarkers] = useState(false);
  const [selectedSource, setSelectedSource] = useState<WaterSourceRiskData | null>(null);

  const { data: waterRisks, error, isLoading } = useQuery<WaterSourceRiskData[], Error>({
    queryKey: ['waterSourceRisk'],
    queryFn: async () => {
      const response = await apiController.get<WaterSourceRiskData[]>('/analysis');
      return response;
    },
  });

  // Generate filter options
  const wardOptions = useMemo(() => 
    [...new Set(waterRisks?.map(item => item.location.ward))],
    [waterRisks]
  );

  const villageOptions = useMemo(() => 
    [...new Set(waterRisks
      ?.filter(item => !ward || item.location.ward === ward)
      .map(item => item.location.village))],
    [waterRisks, ward]
  );

  const hamletOptions = useMemo(() => 
    [...new Set(waterRisks
      ?.filter(item => 
        (!ward || item.location.ward === ward) && 
        (!village || item.location.village === village))
      .map(item => item.location.hamlet))],
    [waterRisks, ward, village]
  );

  // Filtered water sources
  const filteredWaterRisks = useMemo(() => 
    waterRisks?.filter(item =>
      (!ward || item.location.ward === ward) &&
      (!village || item.location.village === village) &&
      (!hamlet || item.location.hamlet === hamlet)
    ) || [],
    [waterRisks, ward, village, hamlet]
  );

  // Calculate metrics with filtering
  const { totalSources, criticalRisks, moderateRisks, safeFacilities } = useMemo(() => {
    return filteredWaterRisks.reduce((acc, source) => {
      const { summary } = source;
      const hasCritical = Object.values(summary).some(s => s.critical > 0);
      const hasModerate = !hasCritical && Object.values(summary).some(s => s.moderate > 0);

      return {
        totalSources: acc.totalSources + 1,
        criticalRisks: acc.criticalRisks + (hasCritical ? 1 : 0),
        moderateRisks: acc.moderateRisks + (hasModerate ? 1 : 0),
        safeFacilities: acc.safeFacilities + (!hasCritical && !hasModerate ? 1 : 0)
      };
    }, { totalSources: 0, criticalRisks: 0, moderateRisks: 0, safeFacilities: 0 });
  }, [filteredWaterRisks]);

  // Handle filter changes
  const handleFilterChange = (type: 'ward' | 'village' | 'hamlet', value: string) => {
    if (type === 'ward') {
      setWard(value);
      setVillage('');
      setHamlet('');
    } else if (type === 'village') {
      setVillage(value);
      setHamlet('');
    } else {
      setHamlet(value);
    }

    // Hide markers if all filters are set to "All"
    if ((type === 'ward' && value === '') || (type === 'village' && value === '') || (type === 'hamlet' && value === '')) {
      setShowMapMarkers(false);
    } else {
      setShowMapMarkers(true);
    }
  };

  const handleMarkerClick = (waterRisk: WaterSourceRiskData) => {
    setSelectedSource(waterRisk);
  };

  const handleCloseModal = () => {
    setSelectedSource(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" color="error.main">
          Failed to load water source data <br/> try again: 
          {/* {error.message} */}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 600 }}>
            Water Risk Monitoring
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Filtered water sources analysis
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <FilterDropdown
            label="Ward"
            value={ward}
            options={wardOptions}
            onChange={(value) => handleFilterChange('ward', value)}
          />
          <FilterDropdown
            label="Village"
            value={village}
            options={villageOptions}
            onChange={(value) => handleFilterChange('village', value)}
          />
          <FilterDropdown
            label="Hamlet"
            value={hamlet}
            options={hamletOptions}
            onChange={(value) => handleFilterChange('hamlet', value)}
          />
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Sources"
            value={totalSources}
            icon={<Waves />}
            iconColor="#3b82f6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Critical Risks"
            value={criticalRisks}
            icon={<ErrorIcon />}
            iconColor="#ef4444"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Moderate Risks"
            value={moderateRisks}
            icon={<FaWrench />}
            iconColor="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Safe Facilities"
            value={safeFacilities}
            icon={<FaClipboardCheck />}
            iconColor="#22c55e"
          />
        </Grid>
      </Grid>

      {/* Map Section */}
      <Paper sx={{ p: 2, marginBottom: 5, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', overflow: 'hidden', position: 'relative' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Risk Distribution Map
        </Typography>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Box sx={{ height: 500, borderRadius: 2, overflow: 'hidden' }}>
            <Map
              defaultZoom={14}
              defaultCenter={{ lat: 11.2832241, lng: 7.6644755 }}
              mapId={GOOGLE_MAPS_API_KEY}
              options={{ gestureHandling: 'greedy', disableDefaultUI: false }}
            >
              {showMapMarkers &&
                filteredWaterRisks.map((waterRisk) => {
                  const position = {
                    lat: waterRisk.location.coordinates[1],
                    lng: waterRisk.location.coordinates[0],
                  };
                  return (
                    <AdvancedMarker 
                      key={waterRisk.waterSourceId} 
                      position={position}
                      onClick={() => handleMarkerClick(waterRisk)}
                    >
                      <Pin
                        background={waterRisk.summary.toilets.critical > 0 ? '#B71C1C' : '#4CAF50'}
                        glyphColor="#FFF"
                        borderColor="#7F0000"
                      />
                    </AdvancedMarker>
                  );
                })}
            </Map>
          </Box>
        </APIProvider>
      </Paper>

      <DataTable 
        isLoading={isLoading} 
        columns={columns} 
        data={waterRisksmock}
      />

      {/* Details Modal */}
      <WaterSourceDetailsDialog
        open={!!selectedSource}
        onClose={handleCloseModal}
        waterSource={selectedSource}
      />
    </Box>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactElement;
  iconColor: string;
}

const StatsCard = React.memo(({ title, value, icon, iconColor }: StatsCardProps) => (
  <Card sx={{ flex: 1, p: 2, borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {Number(value).toLocaleString()}
      </Typography>
      <Box sx={{ bgcolor: `${iconColor}15`, p: 1, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {React.cloneElement(icon, { sx: { color: iconColor } })}
      </Box>
    </Box>
  </Card>
));

const DetailItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
    <Icon size={20} style={{ color: '#4a5568', marginTop: 4 }} />
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const WaterSourceDetailsDialog = ({ 
  open, 
  onClose, 
  waterSource 
}: { 
  open: boolean;
  onClose: () => void;
  waterSource: WaterSourceRiskData | null;
}) => (
<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
  <DialogTitle
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#fff',
      p: 3,
      bgcolor: '#1a237e',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Droplet size={24} color="#fff" />
      <Typography variant="h6" fontWeight={600} color="#fff">
        Water Source Details
      </Typography>
    </Box>
    <IconButton onClick={onClose} sx={{ color: '#fff' }}>
      <X size={20} />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers sx={{ bgcolor: '#F8F9FA', p: 3 }}>
    {waterSource && (
      <Grid container spacing={3}>
        {/* Image Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: '#fff',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {waterSource.image ? (
              <Box
                component="img"
                src={waterSource.image}
                alt="Water Source"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 300,
                  borderRadius: 2,
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              />
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: 'center', fontStyle: 'italic' }}
              >
                Image not available
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Location Details Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: '#fff',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}
            >
              <MapPin size={20} style={{ marginRight: 8 }} />
              Location Details
            </Typography>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <DetailItem
                    icon={() => <Home color="primary" />}
                    label="Hamlet"
                    value={waterSource.location.hamlet}
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <DetailItem
                    icon={() => <LocationCity color="success" />}
                    label="Village"
                    value={waterSource.location.village}
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <DetailItem
                    icon={() => <PinDrop color="error" />}
                    label="Ward"
                    value={waterSource.location.ward}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DetailItem
                    icon={() => <CompassCalibrationSharp color="info" />}
                    label="Coordinates"
                    value={`${waterSource.location.coordinates[1]}, ${waterSource.location.coordinates[0]}`}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Card>
        </Grid>

        {/* Risk Summary Card */}
        <Grid item xs={12}>
          <Card
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: '#fff',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}
            >
              <AlertCircle size={20} style={{ marginRight: 8 }} />
              Risk Summary
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={`Critical: ${waterSource.summary.toilets.critical}`}
                  sx={{
                    bgcolor: '#fee2e2',
                    color: '#dc2626',
                    fontWeight: 600,
                    borderRadius: 1,
                    '&:hover': {
                      opacity: 0.9,
                    },
                  }}
                />
                <Chip
                  label={`Moderate: ${waterSource.summary.toilets.moderate}`}
                  sx={{
                    bgcolor: '#ffedd5',
                    color: '#f97316',
                    fontWeight: 600,
                    borderRadius: 1,
                    '&:hover': {
                      opacity: 0.9,
                    },
                  }}
                />
                <Chip
                  label={`Good: ${waterSource.summary.toilets.good}`}
                  sx={{
                    bgcolor: '#dcfce7',
                    color: '#16a34a',
                    fontWeight: 600,
                    borderRadius: 1,
                    '&:hover': {
                      opacity: 0.9,
                    },
                  }}
                />
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    )}
  </DialogContent>

  <DialogActions
    sx={{
      p: 2,
      boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)',
    }}
  >
    <Button
      onClick={onClose}
      sx={{
        color: '#fff',
        fontWeight: 600,
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>
);

export default WaterSourceRisk;