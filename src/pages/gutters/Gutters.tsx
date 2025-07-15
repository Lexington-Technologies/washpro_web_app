import {
  Avatar,
  Box,
  Card,
  Chip,
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

// FixedHeader styled component (like in WaterSources)
const FixedHeader = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: -9,
  zIndex: 100,
  backgroundColor: '#F1F1F5',
  padding: theme.spacing(2, 0),
  marginBottom: theme.spacing(2),
}));

const GutterDashboard: React.FC = () => {
  // Global filter state
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Fetch analytics with filters
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['gutters-analytics', ward, village, hamlet],
    queryFn: () =>
      apiController.get(
        `/gutters/analytics?` +
        (ward ? `ward=${encodeURIComponent(ward)}&` : '') +
        (village ? `village=${encodeURIComponent(village)}&` : '') +
        (hamlet ? `hamlet=${encodeURIComponent(hamlet)}&` : '')
      ),
  });
  const analytics = analyticsData || {};

  // Fetch table data with filters (optional, for fallback)
  const { data: tableData, isLoading: isTableLoading } = useQuery({
    queryKey: ['gutters', ward, village, hamlet],
    queryFn: () =>
      apiController.get(
        `/gutters?` +
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
  const totalGutters = norm(analytics.totalGutters);

  // Pie/Bar chart data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const spaceTypeBarData = Object.entries(analytics.spaceTypeDistribution || {}).map(([label, value]: any[], idx) => ({
    label,
    value: norm(value),
    id: idx,
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dischargePieData = Object.entries(analytics.dischargePercentages || {}).map(([label, value]: any[], idx) => ({
    label,
    value: norm(value),
    id: idx,
  }));

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
    <Box sx={{ backgroundColor: '#F1F1F5', minHeight: '100vh', p: 3 }}>
      <FixedHeader>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
               Gutter Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Comprehensive overview of gutters
            </Typography>
          </Box>
          <Box>
            <LocationFilter ward={ward} village={village} hamlet={hamlet} setWard={setWard} setVillage={setVillage} setHamlet={setHamlet} />
          </Box>
        </Box>
        {isTableLoading && <LinearProgress sx={{ mb: 2 }} />}
      </FixedHeader>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Gutters"
            value={Number(totalGutters).toLocaleString()}
            icon={<RiWaterFlashFill style={{ color: '#2563EB', fontSize: '2rem' }} />}
            bgColor="#E3F2FD"
          />
        </Grid>
        {/* Add more stat cards as needed, using analytics fields */}
      </Grid>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" mb={2}>
              Gutter Space Type Distribution
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: spaceTypeBarData.map(d => d.label) }]}
              series={[
                {
                  data: spaceTypeBarData.map(d => d.value),
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
                  cx: 200,
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
        {/* Add more charts for evacuationPieData, conditionPieData as needed */}
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
