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

const getImageSrc = (url: string) => {
  return url.startsWith('file://') ? '/fallback-placeholder.jpg' : url;
};

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

interface ToiletFacility {
  geolocation: {
    type: string;
    coordinates: [number, number, number];
  };
  spaceType: string;
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  space: string;
  compactments: number;
  dependent: number;
  condition: string;
  status: string;
  type: string;
  safetyRisk: string[];
  handWashingFacility: string;
  daysSinceLastEvacuation: number;
  evacuationFrequency: string;
  createdBy: string;
  capturedAt: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
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
        <Box
          sx={{
            bgcolor: bgColor,
            p: 1,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      )}
    </Box>
  </StyledPaper>
);

const ToiletFacilities: React.FC = () => {
  const [wardFilter, setWardFilter] = useState<string>('All');
  const [villageFilter, setVillageFilter] = useState<string>('All');
  const [hamletFilter, setHamletFilter] = useState<string>('All');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const { data: analytics } = useQuery({
    queryKey: ['toilet-facilities-analytics', wardFilter, villageFilter, hamletFilter],
    queryFn: () =>
      apiController.get(
        `/toilet-facilities/analytics?ward=${wardFilter !== 'All' ? wardFilter : ''}&village=${
          villageFilter !== 'All' ? villageFilter : ''
        }&hamlet=${hamletFilter !== 'All' ? hamletFilter : ''}`
      ),
  });

  console.log(analytics)

  const { data: tableData, isLoading: isTableLoading } = useQuery({
    queryKey: ['toilet-facilities', wardFilter, villageFilter, hamletFilter],
    queryFn: () =>
      apiController.get(
        `/toilet-facilities?ward=${wardFilter !== 'All' ? wardFilter : ''}&village=${
          villageFilter !== 'All' ? villageFilter : ''
        }&hamlet=${hamletFilter !== 'All' ? hamletFilter : ''}`
      ),
  });

  const isLoading = isTableLoading;
  const totalToilets = analytics?.totalToilets || 0;
  const proportionImproved =
    analytics?.proportionImproved !== undefined
      ? `${(analytics.proportionImproved * 100).toFixed(1)}%`
      : '0%';
  const householdToiletRatio = analytics?.householdToiletRatio === 'No data' ? '0' : (analytics?.householdToiletRatio || '0');
  const schoolToiletRatio = analytics?.schoolToiletRatio === 'No data' ? '0' : (analytics?.schoolToiletRatio || '0');

  const wardOptions = useMemo(
    () => (analytics?.filters?.wards ? ['All', ...analytics.filters.wards] : ['All']),
    [analytics]
  );

  const villageOptions = useMemo(
    () => (analytics?.filters?.villages ? ['All', ...analytics.filters.villages] : ['All']),
    [analytics]
  );

  const hamletOptions = useMemo(
    () => (analytics?.filters?.hamlets ? ['All', ...analytics.filters.hamlets] : ['All']),
    [analytics]
  );

  const pieChartData = useMemo(() => {
    if (!analytics || !analytics.typeDistribution) return [];
    const colorPalette = ['#4CAF50', '#F44336', '#FF9800', '#2196F3', '#9C27B0', '#FF5722'];
    return Object.entries(analytics.typeDistribution).map(([type, values], index) => ({
      id: index,
      label: type,
      value: values.count,
      color: colorPalette[index % colorPalette.length],
    }));
  }, [analytics]);

  const totalPieValue = pieChartData.reduce((sum, item) => sum + item.value, 0);

  const barChartData = useMemo(() => {
    if (!analytics?.conditionDistribution) return [];
    return [
      {
        condition: 'Condition',
        maintained: analytics.conditionDistribution['Maintained']?.count || 0,
        unmaintained: analytics.conditionDistribution['Unmaintained']?.count || 0,
      }
    ];
  }, [analytics]);

  const columnHelper = createColumnHelper<ToiletFacility>();

  const columns = [
    columnHelper.accessor('picture', {
      header: 'Picture',
      cell: (props) => (
        <Avatar
          src={getImageSrc(props.row.original.picture)}
          alt="toilet facility"
          sx={{ borderRadius: '100%' }}
        />
      ),
    }),
    columnHelper.accessor('ward', { header: 'Ward', cell: (info) => info.getValue() }),
    columnHelper.accessor('village', { header: 'Village', cell: (info) => info.getValue() }),
    columnHelper.accessor('hamlet', { header: 'Hamlet', cell: (info) => info.getValue() }),
    columnHelper.accessor('spaceType', { header: 'Category', cell: (info) => info.getValue() }),
    columnHelper.accessor('capturedAt', {
      header: 'Date & Time',
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    }),
    columnHelper.accessor('type', {
      header: 'Tags',
      cell: (info) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip variant="outlined" label={info.row.original.type} color="primary" />
          <Chip
            variant="outlined"
            label={info.row.original.condition}
            color={info.row.original.condition === 'Maintained' ? 'success' : 'warning'}
          />
          <Chip
            variant="outlined"
            label={info.row.original.type}
            color={info.row.original.type === 'Pit Latrine without slab' ? 'info' : 'error'}
          />
        </Stack>
      ),
    }),
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const navigateToDetails = (id: string) => {
    navigate(`/toilet-facilities/${id}?${queryParams.toString()}`);
  };

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
            Toilet Facilities Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive overview of toilet facilities in the region
          </Typography>
        </Box>
        <Box>
          {/* <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ maxWidth: '800px', justifyContent: 'flex-end', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Ward</InputLabel>
              <Select value={wardFilter} onChange={(e) => setWardFilter(e.target.value)} label="Ward">
                {wardOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Village</InputLabel>
              <Select value={villageFilter} onChange={(e) => setVillageFilter(e.target.value)} label="Village">
                {villageOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Hamlet</InputLabel>
              <Select value={hamletFilter} onChange={(e) => setHamletFilter(e.target.value)} label="Hamlet">
                {hamletOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack> */}
        </Box>
      </Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Toilets"
            value={Number(totalToilets).toLocaleString()}
            icon={<RiWaterFlashFill style={{ color: '#2563EB', fontSize: '2rem' }} />}
            bgColor="#E3F2FD"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Improved Facilities"
            value={proportionImproved}
            icon={<ArrowUp style={{ color: '#4CAF50', fontSize: '2rem' }} />}
            bgColor="#E8F5E9"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Household Toilet Ratio"
            value={householdToiletRatio}
            icon={<RiWaterFlashFill style={{ color: '#2196F3', fontSize: '2rem' }} />}
            bgColor="#E3F2FD"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="School Toilet Ratio"
            value={schoolToiletRatio}
            icon={<ArrowDown style={{ color: '#F44336', fontSize: '2rem' }} />}
            bgColor="#FFEBEE"
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" mb={2}>
            Distribution by Type
            </Typography>
            <PieChart
              series={[
                {
                  data: pieChartData,
                  arcLabel: (item) => totalPieValue > 0 ? `${((item.value / totalPieValue) * 100).toFixed(1)}%` : '0%',
                  arcLabelMinAngle: 10,
                  outerRadius: 180,
                  innerRadius: 40,
                  tooltip: ({ datum }) => `${datum.label}: ${datum.value}`,
                },
              ]}
              width={Math.min(760, window.innerWidth - 40)}
              height={370}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fontWeight: 'bold',
                  fill: 'white',
                  fontSize: '0.8rem',
                },
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" mb={2}>
            Functionality by Type
            </Typography>
            <BarChart
              dataset={barChartData}
              yAxis={[{ scaleType: 'linear' }]}
              xAxis={[{ scaleType: 'band', dataKey: 'condition' }]}
              series={[
                {
                  dataKey: 'maintained',
                  label: 'Maintained',
                  color: '#4CAF50',
                  valueFormatter: (value) => `${value}`,
                },
                {
                  dataKey: 'unmaintained',
                  label: 'Unmaintained',
                  color: '#F44336',
                  valueFormatter: (value) => `${value}`,
                }
              ]}
              height={400}
              layout="vertical"
            />
          </Card>
        </Grid>
      </Grid>
      <Card sx={{ mt: 3 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Toilet Facilities Overview
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

export default ToiletFacilities;