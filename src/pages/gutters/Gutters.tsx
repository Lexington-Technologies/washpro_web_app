import {
  Avatar,
  Box,
  Card,
  Chip,
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

interface Gutter {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  geolocation: {
    type: string;
    coordinates: number[];
  };
  type: string;
  condition: string;
  status: string;
  dischargePoint: string;
  createdBy: string;
  spaceType: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
}

const GutterDashboard: React.FC = () => {
  const [wardFilter, setWardFilter] = useState<string>('All');
  const [villageFilter, setVillageFilter] = useState<string>('All');
  const [hamletFilter, setHamletFilter] = useState<string>('All');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const { data: analytics } = useQuery({
    queryKey: ['gutters-analytics', wardFilter, villageFilter, hamletFilter],
    queryFn: () =>
      apiController.get(
        `/gutters/analytics?ward=${wardFilter !== 'All' ? wardFilter : ''}&village=${
          villageFilter !== 'All' ? villageFilter : ''
        }&hamlet=${hamletFilter !== 'All' ? hamletFilter : ''}`
      ),
  });

  console.log(analytics);

  const { data: tableData, isLoading: isTableLoading } = useQuery({
    queryKey: ['gutters'],
    queryFn: () => apiController.get('/gutters'),
  });

  console.log(tableData);

  const isLoading = isTableLoading;
  const totalGutters = analytics?.totalGutters || 0;
  const proportionImproved =
    analytics?.proportionImproved !== undefined
      ? `${(analytics.proportionImproved * 100).toFixed(1)}%`
      : '0';
  const avgDistance = analytics?.avgDistance || '0';
  const householdsUsingUnimproved = analytics?.householdsUsingUnimproved || '0';
  const wardOptions = useMemo(() => (analytics?.filters?.wards ? ['All', ...analytics.filters.wards] : ['All']), [analytics]);
  const villageOptions = useMemo(() => (analytics?.filters?.villages ? ['All', ...analytics.filters.villages] : ['All']), [analytics]);
  const hamletOptions = useMemo(() => (analytics?.filters?.hamlets ? ['All', ...analytics.filters.hamlets] : ['All']), [analytics]);
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
    if (!analytics || !analytics.functionalStatusDistribution) return [];
    return Object.entries(analytics.functionalStatusDistribution).map(([type, values]) => ({
      type,
      functional: values['Functional'],
      nonFunctional: values['Non Functional'],
    }));
  }, [analytics]);

  const demoAnalytics = {
    totalGutters: 2204,
    spaceTypeDistribution: {
      Household: 1290,
      Health: 3,
      Community: 846,
      Markets: 13,
      Others: 14,
      School: 3,
      Mosque: 7,
      "Motor park": 6,
      Tsangaya: 7,
      "Social Centers": 4,
      Abattoirs: 1,
      "Livestock Markets": 10,
    },
    conditionPercentages: {
      Unmaintained: null,
      Maintained: null,
    },
    evacuationSchedulePercentages: {
      Periodic: 62.52268602540835,
      None: 37.47731397459165,
    },
    dischargePercentages: {
      Culvert: 13.611615245009073,
      "Open drainage Pit": 32.57713248638838,
      "Road/sidewalk": 44.96370235934664,
      Soakaway: 8.847549909255898,
    },
  };

  const spaceTypePieData = Object.entries(demoAnalytics.spaceTypeDistribution).map(
    ([label, value], idx) => ({
      id: idx,
      label,
      value,
    })
  );
  const evacuationPieData = Object.entries(demoAnalytics.evacuationSchedulePercentages).map(
    ([label, value], idx) => ({
      id: idx,
      label,
      value,
    })
  );
  const dischargePieData = Object.entries(demoAnalytics.dischargePercentages).map(
    ([label, value], idx) => ({
      id: idx,
      label,
      value,
    })
  );

  const columnHelper = createColumnHelper<Gutter>();

  const columns = [
    columnHelper.accessor('picture', {
      header: 'Picture',
      cell: props => (
        <Avatar
          src={props.getValue()}
          alt="gutter"
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
    columnHelper.accessor('spaceType', {
      header: 'Categories',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('capturedAt', {
      header: 'Date & Time',
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    }),  
    columnHelper.accessor('type', {
      header: 'Tags',
      cell: info => {
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              variant='outlined'
              label={info.row.original.condition}
              color={info.row.original.condition === 'Good' ? 'success' : info.row.original.condition === 'Poor' ? 'error' : 'warning'}
            />
            <Chip
              variant='outlined'
              label={info.row.original.discharge}
              color={info.row.original.discharge === 'Household' ? 'success' : 'primary'}
            />
            <Chip
              variant='outlined'
              label={info.row.original.type}
              color={info.row.original.type === 'Maintained' ? 'success' : 'primary'}
            />
          </Stack>
        )
      },
    }),
  ];

  const navigateToDetails = (id: string) => {
    navigate(`/gutters/${id}?${queryParams.toString()}`);
  };
  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
             Gutter Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive overview of water sources
          </Typography>
        </Box>
        <Box>
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ maxWidth: '800px', justifyContent: 'flex-end', gap: 1 }}>
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
          </Stack>
        </Box>
      </Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Water Points"
            value={Number(totalGutters).toLocaleString()}
            icon={<RiWaterFlashFill style={{ color: '#2563EB', fontSize: '2rem' }} />}
            bgColor="#E3F2FD"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Improved Sources"
            value={proportionImproved}
            icon={<ArrowUp style={{ color: '#4CAF50', fontSize: '2rem' }} />}
            bgColor="#E8F5E9"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Distance to Improved water point (m)"
            value={avgDistance === 'Data not available' || avgDistance === '0' ? '0' : avgDistance}
            icon={<RiWaterFlashFill style={{ color: '#2196F3', fontSize: '2rem' }} />}
            bgColor="#E3F2FD"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Unimproved Drinkable Water Sources"
            value={householdsUsingUnimproved === '0' ? '0' : householdsUsingUnimproved}
            icon={<ArrowDown style={{ color: '#F44336', fontSize: '2rem' }} />}
            bgColor="#FFEBEE"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>

      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" mb={2}>
            Gutter Space Type Distribution
          </Typography>
          <BarChart
            xAxis={[{ scaleType: 'band', data: Object.keys(demoAnalytics.spaceTypeDistribution) }]}
            series={[
              {
                data: Object.values(demoAnalytics.spaceTypeDistribution),
                label: 'Count',
                valueFormatter: (value) => `${value}`,
              },
            ]}
            height={400}
            width={900} 
          />

        </Card>
      </Grid>

  <Grid item xs={12} md={6}>
    <Card sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" mb={2}>
        Discharge Point Distribution
      </Typography>
      <PieChart
        series={[
          {
            data: dischargePieData,
            arcLabel: (item) => `${item.value.toFixed(1)}%`,
            arcLabelMinAngle: 10,
            outerRadius: 120,
            innerRadius: 30,
            cx:200,
            tooltip: {
              render: (item: any) => `${item.label}: ${item.value.toFixed(1)}`,
            },
          },
        ]}
        width={600}
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
</Grid>


      <Card sx={{ mt: 3 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Gutter Overview
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

export default GutterDashboard;
