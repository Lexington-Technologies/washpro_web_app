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
  MenuItem
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
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
    header: 'publicSpace',
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
  const [openDefications, setOpenDefications] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<OpenDefecation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const defaultPosition: [number, number] = [11.2832241, 7.6644755];
  const [selectedWard, setSelectedWard] = useState('All');
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [selectedHamlet, setSelectedHamlet] = useState('All');

  const { data, isLoading } = useQuery<OpenDefecation[], Error>({
    queryKey: ['open-defecations', { limit, page, search }],
    queryFn: () => apiController.get<OpenDefecation[]>(`/open-defecations?limit=${limit}&page=${page}&search=${search}`),
  });

  console.log("odf", data)

  useEffect(() => {
    if (data) {
      setOpenDefications(data)
    }
  }, [data]);

  // Fix Leaflet's default icon path issues
  React.useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: markerIconUrl,
      iconRetinaUrl: markerIconRetina,
      shadowUrl: markerShadow,
    });
  }, []);

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
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // Function to determine risk level and cause
  const assessRisk = (item: OpenDefecation): RiskAssessment => {
    const footTraffic = item.footTraffic.toLowerCase();
    const isPeakTimeNight = item.peakTime.some(time => time.toLowerCase().includes('night'));
    const isNearWater = item.environmentalCharacteristics.some(char => 
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
  };

  const getMarkerIcon = (item: OpenDefecation) => {
    const risk = assessRisk(item);
    switch (risk.level) {
      case 'critical':
        return criticalIcon;
      case 'moderate':
        return moderateIcon;
      default:
        return safeIcon;
    }
  };

  const handleMarkerClick = (item: OpenDefecation) => {
    setSelectedLocation(item);
    setModalOpen(true);
  };


  const getUniqueValues = (key: keyof OpenDefecation): string[] => {
    const values = data?.map(item => item[key] as string) || [];
    return ['All', ...Array.from(new Set(values))];
  };

  // Add this filtered data computation
  const filteredData = React.useMemo(() => {
    if (!data) return [];
    
    return data.filter(item => {
      const wardMatch = selectedWard === 'All' || item.ward === selectedWard;
      const villageMatch = selectedVillage === 'All' || item.village === selectedVillage;
      const hamletMatch = selectedHamlet === 'All' || item.hamlet === selectedHamlet;
      return wardMatch && villageMatch && hamletMatch;
    });
  }, [data, selectedWard, selectedVillage, selectedHamlet]);

  // Update the stats cards to use filtered data
  const getHighRiskCount = (data: OpenDefecation[]) => {
    return data.filter(item => assessRisk(item).level === 'critical').length;
  };

  const getAverageDailyCases = (data: OpenDefecation[]) => {
    const total = data.reduce((sum, item) => sum + parseInt(item.dailyAverage), 0);
    return Math.round(total / (data.length || 1));
  };

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
        <Box sx={{ mb: 1 }}>
            <Stack direction="row" spacing={2}>
              <FilterDropdown 
                label="Ward" 
                options={getUniqueValues('ward')}
                value={selectedWard}
                onChange={(value) => setSelectedWard(value)}
              />
              <FilterDropdown 
                label="Village" 
                options={getUniqueValues('village')}
                value={selectedVillage}
                onChange={(value) => setSelectedVillage(value)}
              />
              <FilterDropdown 
                label="Hamlet" 
                options={getUniqueValues('hamlet')}
                value={selectedHamlet}
                onChange={(value) => setSelectedHamlet(value)}
              />
            </Stack>
          </Box>
      </Box>

      {/* Update Stats Cards */}
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

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 2, backgroundColor: '#f0f0f0' }}>
        <Paper sx={{ p: 2, borderRadius: 2, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Open Defecation Risk Map</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f44336' }} />
                <Typography sx={{fontSize: 13, fontWeight: 'bold'}}>Critical Risk (&lt;30m)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff9800' }} />
                <Typography sx={{fontSize: 13, fontWeight: 'bold'}}>Moderate Risk (&gt;30m)</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 1 }}>
            <Stack direction="row" spacing={2}>
              <FilterDropdown 
                label="Ward" 
                options={getUniqueValues('ward')}
                value={selectedWard}
                onChange={(value) => setSelectedWard(value)}
              />
              <FilterDropdown 
                label="Village" 
                options={getUniqueValues('village')}
                value={selectedVillage}
                onChange={(value) => setSelectedVillage(value)}
              />
              <FilterDropdown 
                label="Hamlet" 
                options={getUniqueValues('hamlet')}
                value={selectedHamlet}
                onChange={(value) => setSelectedHamlet(value)}
              />
            </Stack>
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
              {filteredData.map((item) => (
                <Marker
                  key={item._id}
                  position={[item.geolocation.coordinates[1], item.geolocation.coordinates[0]]}
                  icon={getMarkerIcon(item)}
                  eventHandlers={{
                    click: () => handleMarkerClick(item)
                  }}
                />
              ))}
            </MapContainer>
          </Box>
        </Paper>
      </Box>

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
        <Typography variant="h6" sx={{ fontWeight: 600, }}>Open Defication Overview</Typography>
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
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth size="small">
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          label={label}
          onChange={(e) => onChange?.(e.target.value)}
          sx={{
            bgcolor: 'white',
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