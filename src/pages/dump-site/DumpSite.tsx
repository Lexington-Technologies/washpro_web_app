import {
  Avatar,
  Box,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useState, useMemo } from 'react';
import { RiWaterFlashFill } from 'react-icons/ri';
import { useQuery } from '@tanstack/react-query';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const [wardFilter, setWardFilter] = useState<string>('All');
  const [villageFilter, setVillageFilter] = useState<string>('All');
  const [hamletFilter, setHamletFilter] = useState<string>('All');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const { data: analytics } = useQuery({
    queryKey: ['dump-sites-analytics', wardFilter, villageFilter, hamletFilter],
    queryFn: () => apiController.get(
      `/dump-sites/analytics?ward=${wardFilter !== 'All' ? wardFilter : ''}&village=${villageFilter !== 'All' ? villageFilter : ''}&hamlet=${hamletFilter !== 'All' ? hamletFilter : ''}`
    ),
  });

  const { data: tableData, isLoading: isTableLoading } = useQuery({
    queryKey: ['dump-sites'],
    queryFn: () => apiController.get('/dump-sites'),
  });

  const totalSites = analytics?.totalSites || 0;
  const proportionImproved = analytics?.proportionImproved !== undefined ? `${(analytics.proportionImproved * 100).toFixed(1)}%` : '0';
  const avgDistance = analytics?.avgDistance || '0';
  const householdsUsingUnimproved = analytics?.householdsUsingUnimproved || '0';
  const wardOptions = useMemo(() => (analytics?.filters?.wards ? ['All', ...analytics.filters.wards] : ['All']), [analytics]);
  const villageOptions = useMemo(() => (analytics?.filters?.villages ? ['All', ...analytics.filters.villages] : ['All']), [analytics]);
  const hamletOptions = useMemo(() => (analytics?.filters?.hamlets ? ['All', ...analytics.filters.hamlets] : ['All']), [analytics]);

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

  if (isTableLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress size={60} thickness={4} /></Box>;
  }

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
            DumpSites Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive overview of DumpSites
          </Typography>
        </Box>
        {/* <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ maxWidth: '800px', justifyContent: 'flex-end', gap: 1 }}>
          {[{ label: 'Ward', value: wardFilter, setValue: setWardFilter, options: wardOptions }, { label: 'Village', value: villageFilter, setValue: setVillageFilter, options: villageOptions }, { label: 'Hamlet', value: hamletFilter, setValue: setHamletFilter, options: hamletOptions }].map(({ label, value, setValue, options }, idx) => (
            <FormControl key={idx} size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{label}</InputLabel>
              <Select value={value} onChange={(e) => setValue(e.target.value)} label={label}>
                {options.map((option, index) => (
                  <MenuItem key={index} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Stack> */}
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}><StatCard title="Total Dumpsite" value={Number(totalSites).toLocaleString()} icon={<RiWaterFlashFill style={{ color: '#2563EB', fontSize: '2rem' }} />} bgColor="#E3F2FD" /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Improved Dumpsite" value={'1,072'} icon={<ArrowUp style={{ color: '#4CAF50', fontSize: '2rem' }} />} bgColor="#E8F5E9" /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Avg. Distance to Improved Water (m)" value={'30m'} icon={<RiWaterFlashFill style={{ color: '#2196F3', fontSize: '2rem' }} />} bgColor="#E3F2FD" /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Unimproved DumpSites" value={'1,298'} icon={<ArrowDown style={{ color: '#F44336', fontSize: '2rem' }} />} bgColor="#FFEBEE" /></Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {analytics?.spaceTypeDistribution && (
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" mb={2}>Space Type Distribution</Typography>
              <BarChart
                xAxis={[{ scaleType: 'band', data: Object.keys(analytics.spaceTypeDistribution) }]}
                series={[{
                  data: Object.values(analytics.spaceTypeDistribution),
                  label: 'Number of Sites',
                  color: '#1976D2',
                  valueFormatter: (val) => `${val} sites`,
                }]}
                height={400}
                width={Math.min(800, window.innerWidth - 40)}
              />
            </Card>
          </Grid>
        )}

        {analytics?.evacuationSchedulePercentages && (
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" mb={2}>Evacuation Schedule</Typography>
              <PieChart
                series={[
                  {
                    data: Object.entries(analytics.evacuationSchedulePercentages).map(([label, value], idx) => ({
                      id: idx,
                      label,
                      value,
                    })),
                    arcLabel: (item) => `${item.value.toFixed(1)}%`,
                    arcLabelMinAngle: 10,
                    outerRadius: 160,
                    innerRadius: 30,
                    cx: 160,
                    tooltip: {
                      render: (item) => `${item.label}: ${item.value.toFixed(1)}%`,
                    },
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
        )}
      </Grid>

      <Card sx={{ mt: 3 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            DumpSites Overview
          </Typography>
          <Paper sx={{ overflowX: 'auto' }}>
            <DataTable
              columns={columns}
              data={tableData}
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