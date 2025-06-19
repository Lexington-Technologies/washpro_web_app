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
  Button,
  DialogActions,
  Stack,
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
import LocationFilter from '../../components/LocationFilter';
import { useNavigate } from 'react-router-dom';

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

interface AnalyticsResponse {
  totalSites: number;
  schoolOD: number;
  odfCommunities: number;
  regressionRate: number;
}

interface PaginationState {
  pageIndex: number;
  pageSize: number;
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
  columnHelper.accessor('geolocation.coordinates', {
    header: 'Date & Time',
    cell: (info) => new Date(info.getValue() as string).toLocaleString(),
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
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const navigate = useNavigate();
  const { ward, village, hamlet } = useLocationFilter();

  const { data: analyticsData } = useQuery<AnalyticsResponse, Error>({
    queryKey: ['open-defecation-analytics', ward, village, hamlet],
    queryFn: () => apiController.get<AnalyticsResponse>(`/open-defecations/analytics?ward=${ward || ''}&village=${village || ''}&hamlet=${hamlet || ''}`),
  });

  const { data: tableData } = useQuery<OpenDefecation[], Error>({
    queryKey: ['open-defecation', ward, village, hamlet],
    queryFn: () => apiController.get<OpenDefecation[]>(`/open-defecations?ward=${ward || ''}&village=${village || ''}&hamlet=${hamlet || ''}`),
  });

  const filteredData = useMemo(() => 
    tableData?.filter(item =>
      (!ward || item.ward === ward) &&
      (!village || item.village === village) &&
      (!hamlet || item.hamlet === hamlet)
    ) || []
  , [tableData, ward, village, hamlet]);

  const navigateToDetails = (id: string) => {
    navigate(`/open-defecation/${id}`);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Header & Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 600 }}>
            Open Defecation
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Filtered open defecation observations
          </Typography>
        </Box>
        <Box>
          <LocationFilter />
        </Box>
      </Box>

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Observations" value={analyticsData?.totalSites || 0} icon={<FaChartLine />} iconColor="#3b82f6" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Schools with OD" value={analyticsData?.schoolOD || 0} icon={<DangerousIcon />} iconColor="#ef4444" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="ODF Communities" value={analyticsData?.odfCommunities || 0} icon={<SafetyCheckIcon />} iconColor="#4CAF50" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="ODF Regression Rate" value={`${(analyticsData?.regressionRate || 0).toFixed(1)}%`} icon={<FaChartLine />} iconColor="#f59e0b" />
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
        data={tableData || []}
        columns={columns}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        }}
        onPaginationChange={setPagination}
        onFilterChange={() => {
          setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
        }}
        wardFilter={ward}
        villageFilter={village}
        hamletFilter={hamlet}
        onRowClick={(row) => navigateToDetails(row._id)}
      />

      {/* Location Details Dialog */}
      {selectedLocation && (
        <Dialog
          open={!!selectedLocation}
          onClose={() => setSelectedLocation(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Location Details</Typography>
              <IconButton onClick={() => setSelectedLocation(null)}>
                <X />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ position: 'relative', height: 300, borderRadius: 2, overflow: 'hidden' }}>
                  <img
                    src={selectedLocation.picture}
                    alt="location"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <DetailItem icon={<MapPin />} label="Location" value={`${selectedLocation.ward}, ${selectedLocation.village}, ${selectedLocation.hamlet}`} />
                  <DetailItem icon={<Home />} label="Space Type" value={selectedLocation.spaceType} />
                  <DetailItem icon={<AlertCircle />} label="Foot Traffic" value={selectedLocation.footTraffic} />
                  <DetailItem icon={<AlertCircle />} label="Peak Time" value={Array.isArray(selectedLocation.peakTime) ? selectedLocation.peakTime.map(String).join(', ') : String(selectedLocation.peakTime)} />
                  <DetailItem icon={<AlertCircle />} label="Daily Average" value={selectedLocation.dailyAverage} />
                  <DetailItem icon={<AlertCircle />} label="School Area" value={selectedLocation.isSchoolArea ? 'Yes' : 'No'} />
                  <DetailItem icon={<AlertCircle />} label="ODF Status" value={selectedLocation.odfStatus ? 'Yes' : 'No'} />
                  <DetailItem icon={<AlertCircle />} label="Regression Rate" value={`${selectedLocation.regressionRate}%`} />
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedLocation(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

// Helper Components
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
