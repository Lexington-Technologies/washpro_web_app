import { useState } from 'react';
import { Box, Card, CircularProgress, Typography, Grid, Paper, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { apiController } from '../../axios';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '../../components/Table/DataTable';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { FaUsers } from 'react-icons/fa';

// Interfaces
interface EnumeratorPerformance {
  id: string;
  name: string;
  totalFacilities: number;
  lastActive: string;
  villages: string[];
  totalRecords: number;
}

// Define column helper
const columnHelper = createColumnHelper<EnumeratorPerformance>();

// Define table columns
const columns = [
  columnHelper.accessor('fullName', {
    header: 'Enumerator',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('totalRecords', {
    header: 'Total',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('waterSources', {
    header: 'W/s',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('openDefecation', {
    header: 'Odf',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('soakAways', {
    header: 'SoakAways',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('toiletFacilities', {
    header: 'ToiletFacilities',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('dumpSites', {
    header: 'DumpSites',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('gutters', {
    header: 'Gutters',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('lastLogin', {
    header: 'Last Active',
    cell: info => new Date(info.getValue() as string).toLocaleString(),
  }),
];

// Styled Components
const StatCard = ({ title, value, icon, bgColor }) => (
  <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: bgColor }}>
    <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
      {icon}
      <Box>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

// Main Enumerators Component
const Enumerators = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery<[], Error>({
    queryKey: ['enumerator-performance'],
    queryFn: () => apiController.get(`/analytics/summary?limit=${limit}&page=${page}&search=${search}`),
  });

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;

  // Analytics Calculations
  const totalEnumerators = data?.enumerators?.length || 0;
  const activeEnumerators = data?.enumerators?.filter(e => new Date(e.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0;
  const totalCaptures = data?.enumerators?.reduce((sum, e) => sum + e.totalRecords, 0) || 0;

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      {/* Stats */}
      <Grid container spacing={3} mb={3}>
        {[ 
          { title: 'Total Enumerators', value: totalEnumerators, icon: <FaUsers size={30} color='#2563EB' />, bgColor: '#DBEAFE' },
          { title: 'Active Enumerators', value: activeEnumerators, icon: <ArrowUp size={30} color='#4CAF50' />, bgColor: '#E8F5E9' },
          { title: 'Total Captures', value: totalCaptures, icon: <ArrowDown size={30} color='#EF5350' />, bgColor: '#FFEBEE' },
        ].map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <StatCard title={stat.title} value={stat.value} icon={stat.icon} bgColor={stat.bgColor} />
          </Grid>
        ))}
      </Grid>
      
      {/* Data Table */}
      <Card sx={{ mt: 3,   }}>
        <DataTable setSearch={setSearch} setPage={setPage} setLimit={setLimit} isLoading={isLoading} columns={columns} data={data?.enumerators || []} />
      </Card>
    </Box>
  );
};

export default Enumerators;
