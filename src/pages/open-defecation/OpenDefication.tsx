import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Avatar,
  Box,
  Card,
  IconButton,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Chip,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useState, useMemo } from 'react';
import { FaChartLine } from 'react-icons/fa';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { LocationOn, Business } from '@mui/icons-material';
import { HomeIcon } from 'lucide-react';
import CloseIcon from '@mui/icons-material/Close';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RiskAssessment {
  level: 'critical' | 'moderate' | 'good';
  cause: string;
}

interface OpenDefecation {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  publicSpace: string;
  space: string;
  footTraffic: string;
  peakTime: string[];
  demographics: string[];
  environmentalCharacteristics: string[];
  dailyAverage: string;
  createdBy: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
  geolocation: {
    type: string;
    coordinates: number[];
  };
  riskAssessment?: RiskAssessment;
}

interface FilterDropdownProps {
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}

const columnHelper = createColumnHelper<OpenDefecation>();

const columns = [
  columnHelper.accessor('picture', {
    header: 'Picture',
    cell: props => (
      <Avatar
        src={props.getValue()}
        alt="open defecation"
        sx={{ width: 50, height: 50 }}
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
  columnHelper.accessor('publicSpace', {
    header: 'Public Space',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('peakTime', {
    header: 'Peak Time',
    cell: info => info.getValue().join(', '),
  }),
  columnHelper.accessor('capturedAt', {
    header: 'Captured At',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),
];

const OpenDefication = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<OpenDefecation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const defaultPosition: [number, number] = [11.2832241, 7.6644755];
  const [ward, setWard] = useState('All');
  const [village, setVillage] = useState('All');
  const [hamlet, setHamlet] = useState('All');

  const { data, isLoading } = useQuery<OpenDefecation[], Error>({
    queryKey: ['open-defecations', { limit, page, search }],
    queryFn: () => apiController.get<OpenDefecation[]>(`/open-defecations?limit=${limit}&page=${page}&search=${search}`),
  });

// Memoized risk assessment function
const assessRisk = useMemo(() => (item) => {
  const footTraffic = item.footTraffic.toLowerCase();
  const isPeakTimeNight = item.peakTime.some((time) => time.toLowerCase().includes('night'));
  const isNearWater = item.environmentalCharacteristics.some((char) =>
    char.toLowerCase().includes('water') || char.toLowerCase().includes('stream')
  );

  if (footTraffic === 'high' && isPeakTimeNight) {
    return { level: 'critical', cause: 'High foot traffic during night hours' };
  } else if (isNearWater) {
    return { level: 'critical', cause: 'Proximity to water sources' };
  } else if (footTraffic === 'medium') {
    return { level: 'moderate', cause: 'Moderate foot traffic' };
  }
  return { level: 'good', cause: 'Low risk area' };
}, []);

// Custom marker icons from WaterSourceRisk
const criticalIcon = L.divIcon({
  html: '<svg width="50" height="70" viewBox="0 0 50 70" xmlns="http://www.w3.org/2000/svg"><path fill="#ef4444" stroke="#fff" stroke-width="3" d="M25 1C12 1 1 12 1 25c0 16 24 42 24 42s24-26 24-42C49 12 38 1 25 1z"/><circle cx="25" cy="25" r="10" fill="#fff"/><text x="25" y="30" font-size="14" text-anchor="middle" fill="#ef4444" font-weight="bold">⚠</text></svg>',
  iconSize: [50, 70],
  iconAnchor: [25, 70],
  popupAnchor: [0, -70],
  className: 'custom-svg-marker',
});

const moderateIcon = L.divIcon({
  html: '<svg width="50" height="70" viewBox="0 0 50 70" xmlns="http://www.w3.org/2000/svg"><path fill="#f59e0b" stroke="#fff" stroke-width="3" d="M25 1C12 1 1 12 1 25c0 16 24 42 24 42s24-26 24-42C49 12 38 1 25 1z"/><circle cx="25" cy="25" r="10" fill="#fff"/><text x="25" y="30" font-size="14" text-anchor="middle" fill="#f59e0b" font-weight="bold">⚠</text></svg>',
  iconSize: [50, 70],
  iconAnchor: [25, 70],
  popupAnchor: [0, -70],
  className: 'custom-svg-marker',
});

const safeIcon = L.divIcon({
  html: '<svg width="50" height="70" viewBox="0 0 50 70" xmlns="http://www.w3.org/2000/svg"><path fill="#22c55e" stroke="#fff" stroke-width="3" d="M25 1C12 1 1 12 1 25c0 16 24 42 24 42s24-26 24-42C49 12 38 1 25 1z"/><circle cx="25" cy="25" r="10" fill="#fff"/><text x="25" y="30" font-size="14" text-anchor="middle" fill="#22c55e" font-weight="bold">✓</text></svg>',
  iconSize: [50, 70],
  iconAnchor: [25, 70],
  popupAnchor: [0, -70],
  className: 'custom-svg-marker',
});

// Function to determine marker icon based on risk assessment
const getMarkerIcon = (item) => {
  const risk = assessRisk(item);
  return risk.level === 'critical' ? criticalIcon : risk.level === 'moderate' ? moderateIcon : safeIcon;
};

// Handle marker click
const handleMarkerClick = (item) => {
  setSelectedLocation(item);
  setModalOpen(true);
};

// Generate filter options
  const wardOptions = useMemo(() => {
    if (!data) return ['All'];
    return ['All', ...new Set(data.map(item => item.ward))];
  }, [data]);

  const villageOptions = useMemo(() => {
    if (!data) return ['All'];
    const filteredVillages = data
      .filter(item => ward === 'All' || item.ward === ward)
      .map(item => item.village);
    return ['All', ...new Set(filteredVillages)];
  }, [data, ward]);

  const hamletOptions = useMemo(() => {
    if (!data) return ['All'];
    const filteredHamlets = data
      .filter(item => (ward === 'All' || item.ward === ward) && (village === 'All' || item.village === village))
      .map(item => item.hamlet);
    return ['All', ...new Set(filteredHamlets)];
  }, [data, ward, village]);

  // Filtered data
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(item =>
      (ward === 'All' || item.ward === ward) &&
      (village === 'All' || item.village === village) &&
      (hamlet === 'All' || item.hamlet === hamlet)
    );
  }, [data, ward, village, hamlet]);

  // Update the stats cards to use filtered data
  const getHighRiskCount = (data: OpenDefecation[]) => {
    return data.filter(item => assessRisk(item).level === 'critical').length;
  };

  const getAverageDailyCases = (data: OpenDefecation[]) => {
    const total = data.reduce((sum, item) => sum + parseInt(item.dailyAverage), 0);
    return Math.round(total / (data.length || 1));
  };

  // Data for Bar Chart (Distribution by Ward)
  const wardDistributionData = useMemo(() => {
    if (!filteredData) return [];
    const wardCounts = filteredData.reduce((acc, item) => {
      acc[item.ward] = (acc[item.ward] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(wardCounts).map(([ward, count]) => ({ ward, count }));
  }, [filteredData]);

  // Data for Pie Chart (Distribution by Risk Level)
  const riskLevelDistributionData = useMemo(() => {
    if (!filteredData) return [];
    const riskCounts = filteredData.reduce((acc, item) => {
      const riskLevel = assessRisk(item).level;
      acc[riskLevel] = (acc[riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const total = filteredData.length;
    return Object.entries(riskCounts).map(([level, count]) => ({
      level,
      count,
      percentage: ((count / total) * 100).toFixed(1) + '%',
    }));
  }, [filteredData]);

  const COLORS = ['#22c55e', '#ef4444', '#f59e0b']; // Colors for critical (yellow), moderate (orange), good (green)
  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { level, count, percentage } = payload[0].payload;
      return (
        <Box sx={{ bgcolor: 'background.paper', p: 1, borderRadius: 1, boxShadow: 1 }}>
          <Typography variant="body2">{`${level}: ${count} (${percentage})`}</Typography>
        </Box>
      );
    }
    return null;
  };

  // Custom Tooltip for Bar Chart
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { ward, count } = payload[0].payload;
      return (
        <Box sx={{ bgcolor: 'background.paper', p: 1, borderRadius: 1, boxShadow: 1 }}>
          <Typography variant="body2">{`${ward}: ${count}`}</Typography>
        </Box>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 0.5 }}>
            Open Defecation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed insights about your selected location
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <FilterDropdown label="Ward" value={ward} options={wardOptions} onChange={setWard} />
            <FilterDropdown label="Village" value={village} options={villageOptions} onChange={setVillage} />
            <FilterDropdown label="Hamlet" value={hamlet} options={hamletOptions} onChange={setHamlet} />
          </Stack>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <StatsCard
          title="Total Observations"
          value={filteredData.length}
          icon={<VisibilityIcon />}
          iconColor="#2196f3"
        />
        <StatsCard
          title="High Risk Areas"
          value={getHighRiskCount(filteredData)}
          icon={<WarningIcon />}
          iconColor="#f44336"
        />
        <StatsCard
          title="Average Daily Cases"
          value={getAverageDailyCases(filteredData)}
          icon={<FaChartLine style={{ color: "#CA8A04" }} />}
          iconColor="#ff9800"
        />
      </Box>

      {/* Distribution Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Distribution by Ward
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={wardDistributionData}>
                <XAxis dataKey="ward" />
                <YAxis />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Distribution by Risk Level
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskLevelDistributionData}
                  dataKey="count"
                  nameKey="level"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ level, count, percentage }) => `${level}: ${count} (${percentage})`}
                >
                  {riskLevelDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
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
        <MapContainer center={defaultPosition} zoom={14} style={{ height: '70vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {data?.map((item) => (
        <Marker
          key={item._id}
          position={[item.geolocation.coordinates[1], item.geolocation.coordinates[0]]}
          icon={getMarkerIcon(item)}
          eventHandlers={{ click: () => handleMarkerClick(item) }}
        />
      ))}
    </MapContainer>        </Box>
      </Paper>

      {/* Location Details Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, bgcolor: '#f8f9fa' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Location Details
          </Typography>
          <IconButton
            onClick={() => setModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedLocation && (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src={selectedLocation.picture}
                    alt="Location"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 2,
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Risk Assessment</Typography>
                    <Chip
                      label={assessRisk(selectedLocation).level.toUpperCase()}
                      color={
                        assessRisk(selectedLocation).level === 'critical' ? 'error' :
                        assessRisk(selectedLocation).level === 'moderate' ? 'warning' : 'success'
                      }
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {assessRisk(selectedLocation).cause}
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <LocationOn />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Ward</Typography>
                        <Typography variant="subtitle1">{selectedLocation.ward}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Avatar sx={{ bgcolor: 'success.light' }}>
                        <Business />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Village</Typography>
                        <Typography variant="subtitle1">{selectedLocation.village}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Avatar sx={{ bgcolor: 'warning.light' }}>
                        <HomeIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Hamlet</Typography>
                        <Typography variant="subtitle1">{selectedLocation.hamlet}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Additional Information</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Public Space</Typography>
                        <Typography variant="body2">{selectedLocation.publicSpace}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Foot Traffic</Typography>
                        <Typography variant="body2">{selectedLocation.footTraffic}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Peak Times</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                          {selectedLocation.peakTime.map((time, index) => (
                            <Chip key={index} label={time} size="small" />
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Recent Observations Table */}
      <Paper sx={{ p: 2, borderRadius: 2, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Open Defecation Overview</Typography>
        </Box>

        <DataTable
          setSearch={setSearch}
          setPage={setPage}
          setLimit={setLimit}
          isLoading={isLoading}
          columns={columns}
          data={filteredData}
        />
      </Paper>
    </Box>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number | undefined;
  icon: React.ReactElement;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, iconColor }) => (
  <Card sx={{ flex: 1, p: 2, borderRadius: 2 }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
      <Box
        sx={{
          bgcolor: `${iconColor}15`,
          p: 1,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {React.cloneElement(icon, { sx: { color: iconColor } })}
      </Box>
    </Box>
  </Card>
);

const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  label, 
  options, 
  value = 'All',
  onChange 
}) => {
  return (
    <Box sx={{ minWidth: 210, height: 40 }}>
      <FormControl fullWidth size="small">
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          label={label}
          onChange={(e) => onChange?.(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.12)',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

const MapLegendItem = ({ color, label }: { color: string; label: string }) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: color }} />
    <Typography variant="caption" sx={{ fontWeight: 500, color: '#4b5563' }}>
      {label}
    </Typography>
  </Stack>
);

export default OpenDefication;