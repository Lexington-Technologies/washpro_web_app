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
  styled,
  LinearProgress,
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
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';

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

const colorPalette = ['#4CAF50', '#F44336', '#FF9800', '#2196F3', '#9C27B0', '#FF5722', '#00BCD4', '#8BC34A'];

function normalizeValue(val: unknown): number {
  if (
    val === undefined ||
    val === null ||
    val === '' ||
    (typeof val === 'string' && val.trim().toLowerCase() === 'no data')
  ) {
    return 0;
  }
  const num = Number(val);
  return isNaN(num) ? 0 : num;
}

// Compute analytics from table data as fallback
function computeAnalyticsFromTable(tableData: OpenDefecation[]) {
  if (!Array.isArray(tableData) || tableData.length === 0) return null;
  const totalSites = tableData.length;
  // Distributions
  const spaceTypeDistribution: Record<string, { count: number; percentage: string }> = {};
  const environmentalSpaceDistribution: Record<string, { count: number; percentage: string }> = {};
  const peakTimeDistribution: Record<string, number> = {};
  const demographicsDistribution: Record<string, number> = {};
  const footTrafficDistribution: Record<string, number> = {};
  const densityDistribution: Record<string, number> = {};

  tableData.forEach((item) => {
    // Space Type
    if (item.spaceType) {
      spaceTypeDistribution[item.spaceType] = spaceTypeDistribution[item.spaceType] || { count: 0, percentage: '0%' };
      spaceTypeDistribution[item.spaceType].count++;
    }
    // Environmental Space
    if (item.environmentalSpaceType) {
      environmentalSpaceDistribution[item.environmentalSpaceType] = environmentalSpaceDistribution[item.environmentalSpaceType] || { count: 0, percentage: '0%' };
      environmentalSpaceDistribution[item.environmentalSpaceType].count++;
    }
    // Peak Time
    if (item.peakTime) {
      const pt = Array.isArray(item.peakTime) ? item.peakTime.join(',') : item.peakTime;
      peakTimeDistribution[pt] = (peakTimeDistribution[pt] || 0) + 1;
    }
    // Demographics
    if (item.demographics) {
      const demoArr = Array.isArray(item.demographics) ? item.demographics : [item.demographics];
      demoArr.forEach((d) => {
        if (typeof d === 'string') {
          demographicsDistribution[d] = (demographicsDistribution[d] || 0) + 1;
        }
      });
    }
    // Foot Traffic
    if (item.footTraffic) {
      footTrafficDistribution[item.footTraffic] = (footTrafficDistribution[item.footTraffic] || 0) + 1;
    }
    // Density
    if (item.density) {
      densityDistribution[item.density] = (densityDistribution[item.density] || 0) + 1;
    }
  });
  // Calculate percentages
  Object.keys(spaceTypeDistribution).forEach((k) => {
    spaceTypeDistribution[k].percentage = ((spaceTypeDistribution[k].count / totalSites) * 100).toFixed(2) + '%';
  });
  Object.keys(environmentalSpaceDistribution).forEach((k) => {
    environmentalSpaceDistribution[k].percentage = ((environmentalSpaceDistribution[k].count / totalSites) * 100).toFixed(2) + '%';
  });
  return {
    totalSites,
    spaceTypeDistribution,
    environmentalSpaceDistribution,
    peakTimeDistribution,
    demographicsDistribution,
    footTrafficDistribution,
    densityDistribution,
    // The following are not computable from tableData alone:
    schoolOD: 0,
    odfCommunities: 0,
    regressionRate: 0,
  };
}

const OpenDefication = () => {
  const [selectedLocation, setSelectedLocation] = useState<OpenDefecation | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const navigate = useNavigate();
  // WaterSources-style filter state
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');

  // Query for analytics
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: analyticsData, isLoading } = useQuery<any, Error>({
    queryKey: ['open-defecation-analytics', ward, village, hamlet],
    queryFn: () => apiController.get<any>(`/open-defecations/analytics?ward=${ward || ''}&village=${village || ''}&hamlet=${hamlet || ''}`),
  });

  // Query for table data (move this above analytics assignment)
  const { data: tableData, isTableLoading } = useQuery<OpenDefecation[], Error>({
    queryKey: ['open-defecation', ward, village, hamlet],
    queryFn: () => apiController.get<OpenDefecation[]>(`/open-defecations?ward=${ward || ''}&village=${village || ''}&hamlet=${hamlet || ''}`),
  });

  // Use analytics from API, or fallback to computed analytics from tableData
  const analytics = (analyticsData?.data && Object.keys(analyticsData.data).length > 0)
    ? analyticsData.data
    : (Array.isArray(tableData) && tableData.length > 0)
      ? computeAnalyticsFromTable(tableData)
      : null;

// PieChart data for spaceTypeDistribution
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const spaceTypePieData = analytics?.spaceTypeDistribution
  ? Object.entries(analytics.spaceTypeDistribution).map(([label, val]: any[], idx) => ({
      id: idx,
      label,
      value: normalizeValue(val.count),
      color: colorPalette[idx % colorPalette.length],
    }))
  : [];
const totalSpaceType = spaceTypePieData.reduce((sum, item) => sum + item.value, 0);

// PieChart data for environmentalSpaceDistribution
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const envSpacePieData = analytics?.environmentalSpaceDistribution
  ? Object.entries(analytics.environmentalSpaceDistribution).map(([label, val]: any[], idx) => ({
      id: idx,
      label,
      value: normalizeValue(val.count),
      color: colorPalette[idx % colorPalette.length],
    }))
  : [];
const totalEnvSpace = envSpacePieData.reduce((sum, item) => sum + item.value, 0);

// BarChart data for peakTimeDistribution
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const peakTimeBarData = analytics?.peakTimeDistribution
  ? Object.entries(analytics.peakTimeDistribution).map(([label, val]: any[]) => ({
      label,
      value: normalizeValue(val),
    }))
  : [];

// BarChart data for demographicsDistribution
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const demographicsBarData = analytics?.demographicsDistribution
  ? Object.entries(analytics.demographicsDistribution).map(([label, val]: any[]) => ({
      label: label.replace(/\[|\]|"/g, ''),
      value: normalizeValue(val),
    }))
  : [];

// BarChart data for footTrafficDistribution
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const footTrafficBarData = analytics?.footTrafficDistribution
  ? Object.entries(analytics.footTrafficDistribution).map(([label, val]: any[]) => ({
      label,
      value: normalizeValue(val),
    }))
  : [];

// BarChart data for densityDistribution
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const densityBarData = analytics?.densityDistribution
  ? Object.entries(analytics.densityDistribution).map(([label, val]: any[]) => ({
      label,
      value: normalizeValue(val),
    }))
  : [];

const FixedHeader = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: -9,
  zIndex: 100,
  backgroundColor: '#F1F1F5',
  padding: theme.spacing(2, 0),
  marginBottom: theme.spacing(2),
}));

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
    <Box sx={{ backgroundColor: '#F1F1F5', minHeight: '100vh', p: 3 }}>
      <Box sx={{ position: 'relative' }}>
        {/* FixedHeader for sticky header and filters */}
        <FixedHeader>
          <Grid container spacing={3}>
            <Grid item xs={12}>
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
                  <LocationFilter ward={ward} village={village} hamlet={hamlet} setWard={setWard} setVillage={setVillage} setHamlet={setHamlet} />
                </Box>
              </Box>
              {/* Loading bar below filters, matching WaterSources */}
              {(isLoading || isTableLoading) && <LinearProgress sx={{ mb: 2 }} />}
            </Grid>
          </Grid>
        </FixedHeader>
        {/* Analytics Cards, Charts, Map, Table, etc. go here, below the sticky header */}
        {/* Analytics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard title="Total Observations" value={normalizeValue(analytics?.totalSites)} icon={<FaChartLine />} iconColor="#3b82f6" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard title="Schools with OD" value={normalizeValue(analytics?.schoolOD)} icon={<DangerousIcon />} iconColor="#ef4444" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard title="ODF Communities" value={normalizeValue(analytics?.odfCommunities)} icon={<SafetyCheckIcon />} iconColor="#4CAF50" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard title="ODF Regression Rate" value={`${normalizeValue(analytics?.regressionRate).toFixed(1)}%`} icon={<FaChartLine />} iconColor="#f59e0b" />
          </Grid>
        </Grid>

        {/* Analytics Charts */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" mb={2}>Distribution by Space Type</Typography>
              <PieChart
                series={[{
                  data: spaceTypePieData,
                  arcLabel: (item) => totalSpaceType > 0 ? `${((item.value / totalSpaceType) * 100).toFixed(1)}%` : '0%',
                  arcLabelMinAngle: 10,
                  outerRadius: 180,
                  innerRadius: 40,
                }]}
                width={Math.min(760, window.innerWidth - 40)}
                height={370}
                sx={{ [`& .${pieArcLabelClasses.root}`]: { fontWeight: 'bold', fill: 'white', fontSize: '0.8rem' } }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" mb={2}>Distribution by Environmental Space</Typography>
              <PieChart
                series={[{
                  data: envSpacePieData,
                  arcLabel: (item) => totalEnvSpace > 0 ? `${((item.value / totalEnvSpace) * 100).toFixed(1)}%` : '0%',
                  arcLabelMinAngle: 10,
                  outerRadius: 180,
                  innerRadius: 40,
                }]}
                width={Math.min(760, window.innerWidth - 40)}
                height={370}
                sx={{ [`& .${pieArcLabelClasses.root}`]: { fontWeight: 'bold', fill: 'white', fontSize: '0.8rem' } }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" mb={2}>Peak Time Distribution</Typography>
              <BarChart
                dataset={peakTimeBarData}
                yAxis={[{ scaleType: 'linear' }]}
                xAxis={[{ scaleType: 'band', dataKey: 'label' }]}
                series={[{ dataKey: 'value', label: 'Count', color: '#2196F3' }]}
                height={370}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" mb={2}>Demographics Distribution</Typography>
              <BarChart
                dataset={demographicsBarData}
                yAxis={[{ scaleType: 'linear' }]}
                xAxis={[{ scaleType: 'band', dataKey: 'label' }]}
                series={[{ dataKey: 'value', label: 'Count', color: '#9C27B0' }]}
                height={370}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" mb={2}>Foot Traffic Distribution</Typography>
              <BarChart
                dataset={footTrafficBarData}
                yAxis={[{ scaleType: 'linear' }]}
                xAxis={[{ scaleType: 'band', dataKey: 'label' }]}
                series={[{ dataKey: 'value', label: 'Count', color: '#FF9800' }]}
                height={370}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" mb={2}>Density Distribution</Typography>
              <BarChart
                dataset={densityBarData}
                yAxis={[{ scaleType: 'linear' }]}
                xAxis={[{ scaleType: 'band', dataKey: 'label' }]}
                series={[{ dataKey: 'value', label: 'Count', color: '#4CAF50' }]}
                height={370}
              />
            </Card>
          </Grid>
        </Grid>

        {/* Map Section */}
        <Paper sx={{ p: 2, mb: 5, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Observations Map
          </Typography>
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <Box sx={{ height: 700, borderRadius: 2, overflow: 'hidden' }}>
              <Map
                defaultZoom={15}
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
