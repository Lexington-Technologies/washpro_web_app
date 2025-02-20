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
import React, { useState, useMemo } from 'react';
import { FaClipboardCheck, FaWrench } from 'react-icons/fa';
import { apiController } from '../../axios';
import WaterSourceDetailsDialog from './WaterSourceDetailsDialog';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '../../components/Table/DataTable';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';

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

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

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

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
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
    setSelectedSource(waterRisk);
    setModalOpen(true);
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
      <Paper sx={{ p: 2, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Risk Distribution Map
        </Typography>

        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '70vh' }}
            center={{ lat: 11.2832241, lng: 7.6644755 }}
            zoom={14}
          >
            {filteredWaterRisks.map(waterRisk => (
              <MarkerF
                key={waterRisk.waterSourceId}
                position={{
                  lat: waterRisk.location.coordinates[1],
                  lng: waterRisk.location.coordinates[0]
                }}
                onClick={() => handleMarkerClick(waterRisk)}
              />
            ))}
          </GoogleMap>
        )}
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
value: string;
icon: React.ReactElement;
iconColor: string;
}

export default WaterSourceRisk;