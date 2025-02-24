import { Waves } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Box,
  Card,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  CircularProgress,
  Avatar,
  Chip,
  Tooltip,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useMemo } from 'react';
import { FaClipboardCheck, FaWrench } from 'react-icons/fa';
import { apiController } from '../../axios';
import WaterSourceDetailsDialog from './WaterSourceDetailsDialog';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '../../components/Table/DataTable';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MapPin, Home, Compass } from 'lucide-react';
import { useJsApiLoader } from '@react-google-maps/api';

// Interfaces
interface Location {
  ward: string;
  village: string;
  hamlet: string;
  coordinates: [number, number, number];
}

interface MapCardProps {
  latitude: number;
  longitude: number;
  hamlet: string;
  village: string;
  ward: string;
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

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

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

const DetailItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => {
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
        <Typography variant="body1">{value}</Typography>
      </Box>
    </Box>
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

const CustomMarker = ({ position, tooltip, isActive }: { position: { lat: number; lng: number }; tooltip: string; isActive: boolean }) => {
  return (
    <AdvancedMarker position={position}>
      <Tooltip title={tooltip} arrow>
        <Box
          sx={{
            position: 'relative',
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: isActive ? '#B71C1C' : '#E53935',
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
            background={isActive ? '#B71C1C' : '#E53935'}
            glyphColor="#FFF"
            borderColor="#7F0000"
          />
        </Box>
      </Tooltip>
    </AdvancedMarker>
  );
};

// Main Component
const WaterSourceRisk = () => {
  const [selectedSource, setSelectedSource] = useState<WaterSourceRiskData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');

  const { data: waterRisks, error, isLoading } = useQuery<WaterSourceRiskData[], Error>({
    queryKey: ['waterSourceRisk'],
    queryFn: async () => {
      const response = await apiController.get<WaterSourceRiskData[]>('/analysis');
      return response;
    },
  });

  // Generate filter options
  const wardOptions = useMemo(() => {
    if (!waterRisks) return [];
    return [...new Set(waterRisks.map(item => item.location.ward))];
  }, [waterRisks]);

  const villageOptions = useMemo(() => {
    if (!waterRisks) return [];
    const filteredVillages = waterRisks
      .filter(item => !ward || item.location.ward === ward)
      .map(item => item.location.village);
    return [...new Set(filteredVillages)];
  }, [waterRisks, ward]);

  const hamletOptions = useMemo(() => {
    if (!waterRisks) return [];
    const filteredHamlets = waterRisks
      .filter(item => (!ward || item.location.ward === ward) && (!village || item.location.village === village))
      .map(item => item.location.hamlet);
    return [...new Set(filteredHamlets)];
  }, [waterRisks, ward, village]);

  // Filtered water risks
  const filteredWaterRisks = useMemo(() => {
    if (!waterRisks) return [];
    return waterRisks.filter(item =>
      (!ward || item.location.ward === ward) &&
      (!village || item.location.village === village) &&
      (!hamlet || item.location.hamlet === hamlet)
    );
  }, [waterRisks, ward, village, hamlet]);

// Calculate statistics using reduce
const { criticalCount, moderateCount, safeCount, totalCount } = useMemo(() => {
  return filteredWaterRisks.reduce(
    (acc, risk) => ({
      criticalCount:
        acc.criticalCount +
        risk.summary.toilets.critical +
        risk.summary.soakAways.critical +
        risk.summary.openDefecation.critical +
        risk.summary.gutters.critical,

      moderateCount:
        acc.moderateCount +
        risk.summary.toilets.moderate +
        risk.summary.soakAways.moderate +
        risk.summary.openDefecation.moderate +
        risk.summary.gutters.moderate,

      safeCount:
        acc.safeCount +
        risk.summary.toilets.good +
        risk.summary.soakAways.good +
        risk.summary.openDefecation.good +
        risk.summary.gutters.good,

      totalCount:
        acc.totalCount + risk.facilities.toilets.length + risk.facilities.soakAways.length + risk.facilities.openDefecation.length + risk.facilities.gutters.length
      
      }),
    { criticalCount: 0, moderateCount: 0, safeCount: 0, totalCount: 0 } // Initial accumulator values
  );
}, [filteredWaterRisks]);

  const handleMarkerClick = (waterRisk: WaterSourceRiskData) => {
    setSelectedSource(prev => 
      prev?.waterSourceId === waterRisk.waterSourceId ? null : waterRisk
    );
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
          Failed to load water source data
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
    {/* Header Section */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Box>
        <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 600 }}>
          Water Risk Monitoring
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          water sources monitoring
        </Typography>
      </Box>
      <Stack direction="row" spacing={1}>
        <FilterDropdown label="Ward" value={ward} options={wardOptions} onChange={setWard} />
        <FilterDropdown label="Village" value={village} options={villageOptions} onChange={setVillage} />
        <FilterDropdown label="Hamlet" value={hamlet} options={hamletOptions} onChange={setHamlet} />
      </Stack>
    </Box>

    {/* Statistics Cards */}
<Grid container spacing={3} sx={{ mb: 3 }}>
  <Grid item xs={12} sm={6} md={3}>
    <StatsCard 
      title="Critical Risks" 
      value={criticalCount} 
      icon={<ErrorIcon />} 
      iconColor="#ef4444" 
    />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <StatsCard 
      title="Moderate Risks" 
      value={moderateCount}
      icon={<FaWrench />} 
      iconColor="#f59e0b" 
    />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <StatsCard 
      title="Safe Facilities" 
      value={safeCount}
      icon={<FaClipboardCheck />} 
      iconColor="#22c55e" 
    />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <StatsCard 
      title="Total Facilities" 
      value={totalCount}
      icon={<Waves />} 
      iconColor="#3b82f6" 
    />
  </Grid>
</Grid>
      <Paper sx={{ p: 2, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', overflow: 'hidden', position: 'relative' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Risk Distribution Map
        </Typography>
        
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Box sx={{ height: 500, borderRadius: 2, overflow: 'hidden' }}>
            <Map
              defaultZoom={14}
              defaultCenter={{ lat: 11.2832241, lng: 7.6644755 }}
              mapId={GOOGLE_MAPS_API_KEY}
              options={{
                gestureHandling: 'greedy',
                disableDefaultUI: false,
              }}
            >
              {filteredWaterRisks.map((waterRisk) => {
                const position = {
                  lat: waterRisk.location.coordinates[1],
                  lng: waterRisk.location.coordinates[0]
                };
                const isActive = selectedSource?.waterSourceId === waterRisk.waterSourceId;
                
                return (
                  <React.Fragment key={waterRisk.waterSourceId}>
                    <div onClick={() => handleMarkerClick(waterRisk)}>
                      <CustomMarker
                        position={position}
                        tooltip={`${waterRisk.location.hamlet} - ${waterRisk.waterSourceType}`}
                        isActive={isActive}
                      />
                    </div>
                    
                    {isActive && (
                      <MapCard
                        latitude={position.lat}
                        longitude={position.lng}
                        hamlet={waterRisk.location.hamlet}
                        village={waterRisk.location.village}
                        ward={waterRisk.location.ward}
                      />
                    )}
                  </React.Fragment>
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

      {selectedSource && (
        <WaterSourceDetailsDialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          waterSource={selectedSource}
        />
      )}
    </Box>
  );
};

// Reusable Components
const FilterDropdown = ({ label, value, options, onChange }) => (
  <FormControl variant="outlined" sx={{ mb: 2, minWidth: 210 }}>
    <InputLabel>{label}</InputLabel>
    <Select value={value} onChange={(e) => onChange(e.target.value)} label={label} sx={{ height: 40 }}>
      <MenuItem value="">All {label}</MenuItem>
      {options.map((option, index) => (
        <MenuItem key={index} value={option}>{option}</MenuItem>
      ))}
    </Select>
  </FormControl>
);

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

// Interfaces for reusable components
interface StatsCardProps {
title: string;
value: number;
icon: React.ReactElement;
iconColor: string;
}

export default WaterSourceRisk;