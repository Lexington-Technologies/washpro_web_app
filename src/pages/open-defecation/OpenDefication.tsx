import { useState, useMemo } from 'react';
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
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';
import { LocationOn, Business } from '@mui/icons-material';
import { HomeIcon } from 'lucide-react';
import CloseIcon from '@mui/icons-material/Close';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningIcon from '@mui/icons-material/Warning';
import { FaChartLine } from 'react-icons/fa';
import React from 'react';

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

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

const OpenDefication = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<OpenDefecation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [ward, setWard] = useState('All');
  const [village, setVillage] = useState('All');
  const [hamlet, setHamlet] = useState('All');

  const { data, isLoading } = useQuery<OpenDefecation[], Error>({
    queryKey: ['open-defecations', { limit, page, search }],
    queryFn: () => apiController.get<OpenDefecation[]>(`/open-defecations?limit=${limit}&page=${page}&search=${search}`),
  });

  // Memoized risk assessment function
  const assessRisk = useMemo(() => (item: OpenDefecation) => {
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

  // Handle marker click
  const handleMarkerClick = (item: OpenDefecation) => {
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

  const COLORS = ['#22c55e', '#ef4444', '#f59e0b']; // Colors for critical (red), moderate (orange), good (green)

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
          value={filteredData.filter(item => assessRisk(item).level === 'critical').length}
          icon={<WarningIcon />}
          iconColor="#f44336"
        />
        <StatsCard
          title="Average Daily Cases"
          value={Math.round(filteredData.reduce((sum, item) => sum + parseInt(item.dailyAverage), 0) / (filteredData.length || 1))}
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
                <Tooltip />
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
                  {riskLevelDistributionData.map((e, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Enhanced Map Section */}
      <Paper sx={{ p: 2, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Risk Distribution Map
        </Typography>

        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Box sx={{ height: '70vh', borderRadius: 2, overflow: 'hidden' }}>
            <Map
              defaultZoom={14}
              defaultCenter={{ lat: 11.2832241, lng: 7.6644755 }}
              mapId={GOOGLE_MAPS_API_KEY}
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              {filteredData.map((openDefecation) => {
                const position = {
                  lat: openDefecation.geolocation.coordinates[1],
                  lng: openDefecation.geolocation.coordinates[0],
                };
                const riskLevel = assessRisk(openDefecation).level;

                return (
                  <AdvancedMarker
                    key={openDefecation._id}
                    position={position}
                    onClick={() => handleMarkerClick(openDefecation)}
                  >
                    <Pin
                      background={riskLevel === 'critical' ? '#B71C1C' : riskLevel === 'moderate' ? '#FFA726' : '#4CAF50'}
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

      {/* Location Details Modal */}
      <Dialog
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle
    sx={{
      m: 0,
      p: 2,
      bgcolor: '#f8f9fa',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}
  >
    <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: '#1a237e' }}>
      Location Details
    </Typography>
    <IconButton
      onClick={() => setModalOpen(false)}
      sx={{
        color: '#1a237e',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent dividers sx={{ bgcolor: '#F8F9FA', p: 3 }}>
    {selectedLocation && (
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: '#fff',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                height: '60%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {selectedLocation.picture ? (
                <Box
                  component="img"
                  src={selectedLocation.picture}
                  alt="Location"
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

            {/* Additional Information */}
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#fff',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                mt: 3,
              }}
            >
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
                Additional Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Public Space
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {selectedLocation.publicSpace}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Foot Traffic
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {selectedLocation.footTraffic}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Peak Times
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                    {selectedLocation.peakTime.map((time, index) => (
                      <Chip
                      variant='outlined'
                        key={index}
                        label={time}
                        size="small"
                        sx={{
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} md={6}>
            {/* Risk Assessment */}
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#fff',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                mb: 3,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
                Risk Assessment
              </Typography>
              <Chip
                label={assessRisk(selectedLocation).level.toUpperCase()}
                color={
                  assessRisk(selectedLocation).level === 'critical'
                    ? 'error'
                    : assessRisk(selectedLocation).level === 'moderate'
                    ? 'warning'
                    : 'success'
                }
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {assessRisk(selectedLocation).cause}
              </Typography>
            </Card>

            {/* Location Details */}
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#fff',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                mb: 3,
              }}
            >
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
                Location Details
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <LocationOn />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Ward
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {selectedLocation.ward}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <Avatar sx={{ bgcolor: 'success.light' }}>
                    <Business />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Village
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {selectedLocation.village}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <Avatar sx={{ bgcolor: 'warning.light' }}>
                    <HomeIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Hamlet
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {selectedLocation.hamlet}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
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

export default OpenDefication;