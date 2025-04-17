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
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Button,
  DialogActions,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { X, MapPin, AlertCircle, Home } from 'lucide-react';
import DangerousIcon from '@mui/icons-material/Dangerous';
import SafetyCheckIcon from '@mui/icons-material/SafetyCheck';
import { FaChartLine } from 'react-icons/fa';
import React from 'react';

interface OpenDefecation {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  spaceType: string;
  footTraffic: string;
  peakTime: string[] | string;
  dailyAverage: string;
  geolocation: {
    coordinates: number[];
  };
  isSchoolArea: boolean;
  odfStatus: boolean;
  regressionRate: number;
}

const columnHelper = createColumnHelper<OpenDefecation>();

const columns = [
  columnHelper.accessor('picture', {
    header: 'Picture',
    cell: (props) => (
      <Avatar src={props.getValue()} alt="open defecation" sx={{ width: 50, height: 50 }} />
    ),
  }),
  columnHelper.accessor('ward', {
    header: 'Ward',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('village', {
    header: 'Village',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('hamlet', {
    header: 'Hamlet',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('spaceType', {
    header: 'Public Space',
    cell: (info) => info.getValue(),
  }),
];

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

const riskColorMapping = {
  critical: "#ff0000",
  moderate: "#f3a080",
  safe: "#4CAF50",
};

const OpenDefication = () => {
  const [selectedLocation, setSelectedLocation] = useState<OpenDefecation | null>(null);
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');

  const { data:analyticsData, isLoading:analyticsLoading } = useQuery<OpenDefecation[], Error>({
    queryKey: ['open-defecation-analytics'],
    queryFn: () => apiController.get<OpenDefecation[]>('/open-defecations/analytics'),
  });
console.log(analyticsData)

  const { data, isLoading } = useQuery<OpenDefecation[], Error>({
    queryKey: ['open-defecation'],
    queryFn: () => apiController.get<OpenDefecation[]>('/open-defecations'),
  });

  // Analytics computation
  const analytics = useMemo(() => ({
    totalSites: data?.length || 0,
    schoolOD: data?.filter(item => item.isSchoolArea).length || 0,
    odfCommunities: data?.filter(item => item.odfStatus).length || 0,
    regressionRate: data?.reduce((sum, item) => sum + item.regressionRate, 0) / (data?.length || 1) || 0,
  }), [data]);

  // Filter handlers
  const handleFilterChange = (filterType: 'ward' | 'village' | 'hamlet', value: string) => {
    if (filterType === 'ward') {
      setWard(value);
      setVillage('');
      setHamlet('');
    } else if (filterType === 'village') {
      setVillage(value);
      setHamlet('');
    } else if (filterType === 'hamlet') {
      setHamlet(value);
    }
  };

  // Filter options
  const wardOptions = useMemo(
    () => Array.from(new Set(data?.map((item) => item.ward) || [])),
    [data]
  );

  const villageOptions = useMemo(
    () =>
      Array.from(
        new Set(
          data
            ?.filter((item) => !ward || item.ward === ward)
            .map((item) => item.village) || []
        )
      ),
    [data, ward]
  );

  const hamletOptions = useMemo(
    () =>
      Array.from(
        new Set(
          data
            ?.filter(
              (item) =>
                (!ward || item.ward === ward) &&
                (!village || item.village === village)
            )
            .map((item) => item.hamlet) || []
        )
      ),
    [data, ward, village]
  );

  const filteredData = useMemo(() => 
    data?.filter(item =>
      (!ward || item.ward === ward) &&
      (!village || item.village === village) &&
      (!hamlet || item.hamlet === hamlet)
    ) || []
  , [data, ward, village, hamlet]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Header & Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 600 }}>
            Open Defecation Analysis
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Filtered open defecation observations
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <FilterDropdown label="Ward" value={ward} options={wardOptions} onChange={(v) => handleFilterChange('ward', v)} />
          <FilterDropdown label="Village" value={village} options={villageOptions} onChange={(v) => handleFilterChange('village', v)} />
          <FilterDropdown label="Hamlet" value={hamlet} options={hamletOptions} onChange={(v) => handleFilterChange('hamlet', v)} />
        </Stack>
      </Box>

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Observations" value={analytics.totalSites} icon={<FaChartLine />} iconColor="#3b82f6" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Schools with OD" value={analytics.schoolOD} icon={<DangerousIcon />} iconColor="#ef4444" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="ODF Communities" value={analytics.odfCommunities} icon={<SafetyCheckIcon />} iconColor="#4CAF50" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="ODF Regression Rate" value={`${analytics.regressionRate.toFixed(1)}%`} icon={<FaChartLine />} iconColor="#f59e0b" />
        </Grid>
      </Grid>

      {/* Map Section */}
      <Paper sx={{ p: 2, mb: 5, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Observations Map
        </Typography>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Box sx={{ height: 500, borderRadius: 2, overflow: 'hidden' }}>
            <Map
              defaultZoom={11}
              defaultCenter={{ lat: 11.2832241, lng: 7.6644755 }}
              mapId={GOOGLE_MAPS_API_KEY}
            >
              {filteredData.map((item) => (
                <AdvancedMarker
                  key={item._id}
                  position={{ lat: item.geolocation.coordinates[1], lng: item.geolocation.coordinates[0] }}
                  onClick={() => setSelectedLocation(item)}
                >
                  <Box sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: riskColorMapping.critical,
                    border: '2px solid #fff',
                  }} />
                </AdvancedMarker>
              ))}
            </Map>
          </Box>
        </APIProvider>
      </Paper>

      {/* Data Table */}
      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={filteredData}
        onRowClick={(row) => setSelectedLocation(row)}
      />

      {/* Details Modal */}
      <Dialog open={!!selectedLocation} onClose={() => setSelectedLocation(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ p: 3, bgcolor: '#1a237e', color: '#fff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Observation Details</Typography>
            <IconButton onClick={() => setSelectedLocation(null)} sx={{ color: '#fff' }}>
              <X size={20} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedLocation && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
                  {selectedLocation.picture ? (
                    <img
                      src={selectedLocation.picture}
                      alt="Observation"
                      style={{ width: '100%', borderRadius: 8 }}
                    />
                  ) : (
                    <Typography color="text.secondary">Image not available</Typography>
                  )}
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <MapPin size={20} style={{ marginRight: 8 }} />
                    Location Details
                  </Typography>
                  <Grid container spacing={2}>
                    <DetailItem icon={<Home />} label="Ward" value={selectedLocation.ward} />
                    <DetailItem icon={<MapPin />} label="Village" value={selectedLocation.village} />
                    <DetailItem icon={<MapPin />} label="Hamlet" value={selectedLocation.hamlet} />
                  </Grid>
                </Card>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <AlertCircle size={20} style={{ marginRight: 8 }} />
                    Additional Information
                  </Typography>
                  <Grid container spacing={2}>
                    <DetailItem label="Space Type" value={selectedLocation.spaceType} />
                    <DetailItem label="Foot Traffic" value={selectedLocation.footTraffic} />
                    <DetailItem 
                      label="Peak Times" 
                      value={Array.isArray(selectedLocation.peakTime) ? 
                        selectedLocation.peakTime.join(', ') : 
                        selectedLocation.peakTime} 
                    />
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedLocation(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Helper Components
const FilterDropdown = ({ label, value, options, onChange }: {
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
        <MenuItem key={option} value={option}>{option}</MenuItem>
      ))}
    </Select>
  </FormControl>
);

const StatsCard = ({ title, value, icon, iconColor }: {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  iconColor: string;
}) => (
  <Card sx={{ p: 2, borderRadius: 3, height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <Typography variant="body2" color="text.secondary">{title}</Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4">{value}</Typography>
      <Box sx={{ bgcolor: `${iconColor}15`, p: 1.5, borderRadius: '50%' }}>
        {React.cloneElement(icon, { style: { color: iconColor, fontSize: 24 } })}
      </Box>
    </Box>
  </Card>
);

const DetailItem = ({ icon, label, value }: {
  icon?: React.ReactElement;
  label: string;
  value: string;
}) => (
  <Grid item xs={6}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {icon && React.cloneElement(icon, { style: { color: '#666', fontSize: 20 } })}
      <Box>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body1">{value}</Typography>
      </Box>
    </Box>
  </Grid>
);

export default OpenDefication;
