import {
  Box,
  Card,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  styled,
} from '@mui/material';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
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

// Define columns for DataTable
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: any[] = [
  {
    header: 'Ward',
    accessorKey: 'ward',
  },
  {
    header: 'Village',
    accessorKey: 'village',
  },
  {
    header: 'Hamlet',
    accessorKey: 'hamlet',
  },
  {
    header: 'Space Type',
    accessorKey: 'spaceType',
  },
  {
    header: 'Condition',
    accessorKey: 'condition',
  },
  {
    header: 'Maintenance Status',
    accessorKey: 'maintenanceStatus',
  },
  {
    header: 'Captured At',
    accessorKey: 'capturedAt',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cell: (info: any) => new Date(info.getValue()).toLocaleString(),
  },
];

const SoakAways: React.FC = () => {
  // Global filter state
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Fetch analytics with filters
  const { data: analyticsData } = useQuery({
    queryKey: ['soak-aways-analytics', ward, village, hamlet],
    queryFn: () =>
      apiController.get(
        `/soak-aways/analytics?` +
        (ward ? `ward=${encodeURIComponent(ward)}&` : '') +
        (village ? `village=${encodeURIComponent(village)}&` : '') +
        (hamlet ? `hamlet=${encodeURIComponent(hamlet)}&` : '')
      ),
  });
  const analytics = analyticsData || {};

  // Fetch table data with filters (optional, for fallback)
  const { data: tableData, isLoading: isTableLoading } = useQuery({
    queryKey: ['soak-aways', ward, village, hamlet],
    queryFn: () =>
      apiController.get(
        `/soak-aways?` +
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const totalSoakaways = norm((analytics as any)?.totalSoakaways || (analytics as any)?.TotalSoakaway);

  // Pie/Bar chart data
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const spaceTypeBarData = Object.entries((analytics as any)?.spaceTypeDistribution || {}).map(([label, value]: any[], idx) => ({
    label,
    value: norm(value),
    id: idx,
  }));
  // const conditionPieData = Object.entries(analytics?.conditionPercentages || {}).map(([label, value]: any[], idx) => ({
  //   label,
  //   value: norm(value),
  //   id: idx,
  // }));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const evacuationPieData = Object.entries((analytics as any)?.evacuationSchedulePercentages || {}).map(([label, value]: any[], idx) => ({
    label,
    value: norm(value),
    id: idx,
  }));

  if (isTableLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }
  const navigateToDetails = (id: string) => {
    navigate(`/soak-aways/${id}?${queryParams.toString()}`);
  };
  return (
    <Box sx={{ backgroundColor: '#F1F1F5', minHeight: '100vh', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
            SoakAways Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive overview of SoakAways
          </Typography>
        </Box>
        <Box>
          <LocationFilter ward={ward} village={village} hamlet={hamlet} setWard={setWard} setVillage={setVillage} setHamlet={setHamlet} />
        </Box>
      </Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total SoakAways"
            value={Number(totalSoakaways).toLocaleString()}
            icon={<RiWaterFlashFill style={{ color: '#2563EB', fontSize: '2rem' }} />}
            bgColor="#E3F2FD"
          />
        </Grid>
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
                label: 'Count',
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
            SoakAways Overview
          </Typography>
          <Paper sx={{ overflowX: 'auto' }}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <DataTable
              columns={columns}
              data={tableData as any[]}
              pagination={pagination}
              onPaginationChange={setPagination}
              onRowClick={(row: any) => navigateToDetails(row._id)}
            />
          </Paper>
        </Box>
      </Card>
    </Box>
  );
};

export default SoakAways;
