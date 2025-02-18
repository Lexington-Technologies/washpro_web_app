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
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useState, useMemo } from 'react';
import { FaClipboardCheck, FaWrench } from 'react-icons/fa';
import { apiController } from '../../axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import WaterSourceDetailsDialog from './WaterSourceDetailsDialog';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '../../components/Table/DataTable';
// Interfaces
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


// Function to create an SVG-based Leaflet map marker
const createSvgMarker = (color: string, iconSymbol: string) => {
  return new L.DivIcon({
    html: `
      <svg width="50" height="70" viewBox="0 0 50 70" xmlns="http://www.w3.org/2000/svg">
        <!-- Marker Background (Pin Shape) -->
        <path fill="${color}" stroke="#fff" stroke-width="3"
          d="M25 1C12 1 1 12 1 25c0 16 24 42 24 42s24-26 24-42C49 12 38 1 25 1z"/>
        <!-- Inner Circle -->
        <circle cx="25" cy="25" r="10" fill="#fff"/>
        <!-- Icon/Text in the Center -->
        <text x="25" y="30" font-size="14" text-anchor="middle" fill="${color}" font-weight="bold">
          ${iconSymbol}
        </text>
      </svg>
    `,
    iconSize: [50, 70], // Adjust marker size
    iconAnchor: [25, 70], // Align bottom-center
    popupAnchor: [0, -70], // Position popup above the marker
    className: 'custom-svg-marker'
  });
};

// Define SVG markers for different risk levels
const criticalIcon = createSvgMarker('#ef4444', '⚠'); // Red with warning symbol
const moderateIcon = createSvgMarker('#f59e0b', '⚠'); // Orange with warning symbol
const safeIcon = createSvgMarker('#22c55e', '✓'); // Green with checkmark

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
const columnHelper = createColumnHelper()

// Make some columns!
import { Chip } from '@mui/material';

// Updated Columns
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

// Main Component
const WaterSourceRisk = () => {
  const [selectedSource, setSelectedSource] = useState<WaterSourceRiskData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
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

  console.log("waterRisks", waterRisks);

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


// Helper function to determine marker icon based on risk levels
const getMarkerIcon = (waterRisk: WaterSourceRiskData) => {
  const hasCritical = waterRisk.facilities.toilets.some(t => t.riskLevel === 'critical');
  const hasModerate = waterRisk.facilities.toilets.some(t => t.riskLevel === 'moderate');
  
  if (hasCritical) return criticalIcon;
  if (hasModerate) return moderateIcon;
  return safeIcon;
};


// Default position for the map
const defaultPosition: [number, number] = waterRisks && waterRisks.length.toLocaleString() > 0
  ? [waterRisks[0].location.coordinates[1], waterRisks[0].location.coordinates[0]]
  : [11.2832241, 7.6644755]; // Fallback position

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

const handleMarkerClick = (waterRisk: WaterSourceRiskData) => {
  setSelectedSource(waterRisk);
  setModalOpen(true); // Open the modal
};

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

    {/* Enhanced Map Section */}
    <Paper sx={{ p: 2, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Risk Distribution Map
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <MapLegendItem color="#ef4444" label="Critical Risk (<10m)" />
          <MapLegendItem color="#f59e0b" label="Moderate Risk (10-30m)" />
          <MapLegendItem color="#22c55e" label="Safe Distance (>30m)" />
        </Stack>
      </Box>

      <Box sx={{ height: '70vh', borderRadius: 3, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        <MapContainer center={defaultPosition} zoom={14} style={{ height: '100%', width: '100%' }} attributionControl={false}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {filteredWaterRisks?.map((waterRisk) => (
            <Marker
              key={waterRisk.waterSourceId}
              position={[waterRisk.location.coordinates[1], waterRisk.location.coordinates[0]]}
              icon={getMarkerIcon(waterRisk)}
              eventHandlers={{ click: () => handleMarkerClick(waterRisk) }}
            />
          ))}
        </MapContainer>
      </Box>
    </Paper>
      <DataTable 
        isLoading={isLoading} 
        columns={columns} 
        data={waterRisksmock}
      />    

    {/* Dialog and Modal */}
    {selectedSource && (
      <WaterSourceDetailsDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        waterSource={selectedSource}
        isImageOpen={isImageOpen}
        onImageOpen={() => setIsImageOpen(true)}
        onImageClose={() => setIsImageOpen(false)}
      />
    )}
  </Box>
);
};

// Reusable Components
const FilterDropdown = ({ label, value, options, onChange }) => (
<FormControl variant="outlined" sx={{ minWidth: 140, mx: 1 }}>
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

const MapLegendItem = React.memo(({ color, label }) => (
<Stack direction="row" alignItems="center" spacing={1}>
  <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: color }} />
  <Typography variant="caption" sx={{ fontWeight: 500, color: '#4b5563' }}>
    {label}
  </Typography>
</Stack>
));

// Interfaces for reusable components
interface StatsCardProps {
title: string;
value: string;
icon: React.ReactElement;
iconColor: string;
}

export default WaterSourceRisk;