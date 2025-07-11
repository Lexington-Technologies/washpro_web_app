import {
  Avatar,
  Box,
  Card,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
  styled,
  LinearProgress,
} from '@mui/material';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useState } from 'react';
import { RiWaterFlashFill } from 'react-icons/ri';
import { useQuery } from '@tanstack/react-query';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';
import { useNavigate } from 'react-router-dom';
import LocationFilter from '../../components/LocationFilter';

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.spacing(1)};
  min-height: 150px;
`;

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor = '#E3F2FD' }) => (
  <StyledPaper>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
      <Box>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
        <Typography variant="h4" sx={{ mt: 1, fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
      {icon && (
        <Box sx={{ bgcolor: bgColor, p: 1, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </Box>
      )}
    </Box>
  </StyledPaper>
);

interface DumpSite {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  spaceType: string;
  type: string;
  status: string;
  availability: string;
  distance?: number;
  householdsUsingUnimproved?: number;
  capturedAt: string;
  evacuationSchedule: string;
  fencing: string;
}

const DumpSites: React.FC = () => {
  // Global filter state
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Fetch analytics with filters
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['dump-sites-analytics', ward, village, hamlet],
    queryFn: () =>
      apiController.get(
        `/dump-sites/analytics?` +
        (ward ? `ward=${encodeURIComponent(ward)}&` : '') +
        (village ? `village=${encodeURIComponent(village)}&` : '') +
        (hamlet ? `hamlet=${encodeURIComponent(hamlet)}&` : '')
      ),
  });
  const analytics = analyticsData || {};

  // Fetch table data with filters (optional, for fallback)
  const { data: tableData, isLoading: isTableLoading } = useQuery({
    queryKey: ['dump-sites', ward, village, hamlet],
    queryFn: () =>
      apiController.get(
        `/dump-sites?` +
        (ward ? `ward=${encodeURIComponent(ward)}&` : '') +
        (village ? `village=${encodeURIComponent(village)}&` : '') +
        (hamlet ? `hamlet=${encodeURIComponent(hamlet)}&` : '')
      ),
  });

  // Normalize analytics values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function norm(val: any) {
    if (val === undefined || val === null || val === '' || (typeof val === 'string' && val.trim().toLowerCase() === 'no data')) return 0;
    return Number(val) || 0;
  }

  // Stat cards
  const totalSites = norm(analytics.totalSites);

  // Pie/Bar chart data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const spaceTypeBarData = Object.entries(analytics.spaceTypeDistribution || {}).map(([label, value]: any[], idx) => ({
    label,
    value: norm(value),
    id: idx,
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const evacuationPieData = Object.entries(analytics.evacuationSchedulePercentages || {}).map(([label, value]: any[], idx) => ({
    label,
    value: norm(value),
    id: idx,
  }));

  const columnHelper = createColumnHelper<DumpSite>();

  const columns = [
    columnHelper.accessor('picture', {
      header: 'Picture',
      cell: props => <Avatar src={props.getValue()} alt="Dump Site" sx={{ borderRadius: '100%' }} />, 
    }),
    columnHelper.accessor('ward', { cell: info => info.getValue() }),
    columnHelper.accessor('village', { cell: info => info.getValue() }),
    columnHelper.accessor('hamlet', { cell: info => info.getValue() }),
    columnHelper.accessor('spaceType', { header: 'Categories', cell: info => info.getValue() }),
    columnHelper.accessor('capturedAt', {
      header: 'Date & Time',
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    }),  
    columnHelper.accessor('type', {
      header: 'Tags',
      cell: info => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip variant="outlined" label={info.row.original.evacuationSchedule} color={info.row.original.evacuationSchedule === 'None' ? 'success' : 'info'} />
          <Chip variant="outlined" label={info.row.original.fencing} color={info.row.original.fencing === 'close' ? 'warning' : 'error'} />
        </Stack>
      )
    }),
  ];

  const navigateToDetails = (id: string) => {
    navigate(`/dump-sites/${id}?${queryParams.toString()}`);
  };

  // FixedHeader styled component (like in WaterSources)
  const FixedHeader = styled(Box)(({ theme }) => ({
    position: 'sticky',
    top: -9,
    zIndex: 100,
    backgroundColor: '#F1F1F5',
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(2),
  }));

  return (
    <Box sx={{ backgroundColor: '#F1F1F5', minHeight: '100vh', p: 3 }}>
      <FixedHeader>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
              DumpSites Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Comprehensive overview of DumpSites
            </Typography>
          </Box>
          <Box>
            <LocationFilter ward={ward} village={village} hamlet={hamlet} setWard={setWard} setVillage={setVillage} setHamlet={setHamlet} />
          </Box>
        </Box>
        {isTableLoading && <LinearProgress sx={{ mb: 2 }} />}
      </FixedHeader>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}><StatCard title="Total Dumpsite" value={Number(totalSites).toLocaleString()} icon={<RiWaterFlashFill style={{ color: '#2563EB', fontSize: '2rem' }} />} bgColor="#E3F2FD" /></Grid>
        {/* Add more stat cards as needed, using analytics fields */}
      </Grid>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" mb={2}>Space Type Distribution</Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: spaceTypeBarData.map(d => d.label) }]}
              series={[{
                data: spaceTypeBarData.map(d => d.value),
                label: 'Number of Sites',
                color: '#1976D2',
                valueFormatter: (val) => `${val} sites`,
              }]}
              height={400}
              width={Math.min(800, window.innerWidth - 40)}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" mb={2}>Evacuation Schedule</Typography>
            <PieChart
              series={[
                {
                  data: evacuationPieData,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  arcLabel: (item: any) => `${item.value.toFixed(1)}%`,
                  arcLabelMinAngle: 10,
                  outerRadius: 160,
                  innerRadius: 30,
                  cx: 160,
                },
              ]}
              width={450}
              height={320}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fontWeight: 'bold',
                  fill: '#fff',
                  fontSize: '0.85rem',
                },
              }}
            />
          </Card>
        </Grid>
        {/* Add more charts for conditionPieData as needed */}
      </Grid>
      <Card sx={{ mt: 3 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            DumpSites Overview
          </Typography>
          <Paper sx={{ overflowX: 'auto' }}>
            <DataTable
              columns={columns}
              data={tableData as DumpSite[]}
              pagination={pagination}
              onPaginationChange={setPagination}
              onRowClick={(row) => navigateToDetails(row._id)}
            />
          </Paper>
        </Box>
      </Card>
    </Box>
  );
};

export default DumpSites;