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
import React, { useState, useEffect } from 'react';
import { RiWaterFlashFill } from 'react-icons/ri';
import { useQuery } from '@tanstack/react-query';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getLocationParams } from '../../utils/location-filter';
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

const FixedHeader = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: -9,
  zIndex: 100,
  backgroundColor: '#F1F1F5',
  padding: theme.spacing(2, 0),
  marginBottom: theme.spacing(2),
}));

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

interface WaterSource {
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
}

interface AnalyticsData {
  totalWaterPoints: number;
  proportionImproved: number;
  avgDistance: number;
  typeDistribution: {
    [key: string]: {
      count: number;
    };
  };
  functionalStatusDistribution: {
    [key: string]: {
      'Functional': number;
      'Non Functional': number;
    };
  };
}

interface TableResponse {
  data: WaterSource[];
  total: number;
}

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  pageCount?: number;
}

// Chart data types
type PieChartDataItem = { id: number; label: string; value: number; color: string };
type BarChartDataItem = { type: string; functional: number; nonFunctional: number };

const WaterSourcesDashboard: React.FC = () => {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');

  // Stat values state
  const [totalWaterPoints, setTotalWaterPoints] = useState<number>(0);
  const [proportionImproved, setProportionImproved] = useState<string>('0');
  const [avgDistance, setAvgDistance] = useState<string>('0');
  // Chart data state
  const [pieChartData, setPieChartData] = useState<PieChartDataItem[]>([]);
  const [barChartData, setBarChartData] = useState<BarChartDataItem[]>([]);

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['water-sources-analytics', getLocationParams(ward, village, hamlet)],
    queryFn: () =>
      apiController.get(`/water-sources/analytics?${getLocationParams(ward, village, hamlet)}`),
  });

  useEffect(() => {
    if (analytics) {
      setTotalWaterPoints(analytics.totalWaterPoints);
      setProportionImproved(
        analytics.proportionImproved !== undefined
          ? `${(analytics.proportionImproved * 100).toFixed(1)}%`
          : '0'
      );
      setAvgDistance(analytics.avgDistance ? String(analytics.avgDistance) : '0');
      // Update pie chart data
      if (analytics.typeDistribution) {
        const colorPalette = ['#4CAF50', '#F44336', '#FF9800', '#2196F3', '#9C27B0', '#FF5722'];
        setPieChartData(
          Object.entries(analytics.typeDistribution).map(([type, values], index) => ({
            id: index,
            label: type,
            value: values.count,
            color: colorPalette[index % colorPalette.length],
          }))
        );
      }
      // Update bar chart data
      if (analytics.functionalStatusDistribution) {
        setBarChartData(
          Object.entries(analytics.functionalStatusDistribution).map(([type, values]) => ({
            type,
            functional: values['Functional'],
            nonFunctional: values['Non Functional'],
          }))
        );
      }
    }
    // Do not reset to 0 or empty if analytics is undefined
  }, [analytics]);

  const { data: tableData, isLoading: isTableLoading } = useQuery<TableResponse>({
    queryKey: [
      "water-sources",
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm,
      ward,
      village,
      hamlet,
    ],
    queryFn: () =>
      apiController.get(
        `/water-sources?limit=${pagination.pageSize}` +
        `&page=${pagination.pageIndex + 1}` +
        `&search=${searchTerm}` +
        (ward ? `&ward=${encodeURIComponent(ward)}` : '') +
        (village ? `&village=${encodeURIComponent(village)}` : '') +
        (hamlet ? `&hamlet=${encodeURIComponent(hamlet)}` : '')
      ),
  });

  const totalPieValue = pieChartData.reduce((sum, item) => sum + item.value, 0);

  const columnHelper = createColumnHelper<WaterSource>();
  const columns = [
    columnHelper.accessor('picture', {
      header: 'Picture',
      cell: (props) => (
        <Avatar src={(props.row.original.picture)} alt="water source" sx={{ borderRadius: '100%' }} />
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
            label={info.row.original.status}
            color={info.row.original.status === 'Functional' ? 'success' : 'error'}
          />
          <Chip
            variant="outlined"
            label={info.row.original.availability}
            color={info.row.original.availability === 'Always Available' ? 'success' : 'warning'}
          />
        </Stack>
      ),
    }),
  ];

  const navigateToDetails = (id: string) => {
    navigate(`/water-sources/${id}?${queryParams.toString()}`);
  };

  return (
<Box sx={{ backgroundColor: '#F1F1F5', minHeight: '100vh', p: 1 }}>
      <Box sx={{ position: 'relative' }}>
        {/* Wrap the header and filter in FixedHeader component */}
        <FixedHeader>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
                    Water Sources Dashboard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Comprehensive overview of water sources
                  </Typography>
                </Box>
                <Box>
                  <LocationFilter ward={ward} village={village} hamlet={hamlet}
                    setWard={setWard} setVillage={setVillage} setHamlet={setHamlet}
                  />
                </Box>
              </Box>
              <Box sx={{ width: '100%', mt: 2 }}>
                {isLoading && <LinearProgress />}
              </Box>
            </Grid>
          </Grid>
        </FixedHeader>

        {/* Rest of the content */}
        <Grid container spacing={2} sx={{ mb: 3 }}> {/* Added mt to account for fixed header */}
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Water Points"
              value={totalWaterPoints}
              icon={<RiWaterFlashFill size={24} color="#1976D2" />}
              bgColor="#E3F2FD"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Proportion Improved"
              value={proportionImproved}
              icon={<ArrowUp size={24} color="#4CAF50" />}
              bgColor="#E8F5E9"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Average Distance"
              value={`${avgDistance}m`}
              icon={<RiWaterFlashFill  size={24} color="#2196F3" />}
              bgColor="#E3F2FD"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Unimproved Drinkable Water Sources"
              value={(Number('1560').toLocaleString())}
              icon={<ArrowDown style={{ color: '#F44336', fontSize: '2rem' }} />}
              bgColor="#FFEBEE"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Water Source Types
                </Typography>
                <Box sx={{ height: 300 }}>
                  <PieChart
                    series={[
                      {
                        data: pieChartData,
                        arcLabel: (item) => `${item.label} (${((item.value / totalPieValue) * 100).toFixed(1)}%)`,
                        arcLabelMinAngle: 45,
                      },
                    ]}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: 'white',
                        fontWeight: 'bold',
                      },
                    }}
                    width={700}
                    height={300}
                  />
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Functional Status by Type
                </Typography>
                <Box sx={{ height: 300 }}>
                  <BarChart
                    dataset={barChartData}
                    xAxis={[{ scaleType: 'band', dataKey: 'type' }]}
                    series={[
                      { dataKey: 'functional', label: 'Functional', color: '#4CAF50' },
                      { dataKey: 'nonFunctional', label: 'Non-Functional', color: '#F44336' },
                    ]}
                    width={500}
                    height={300}
                  />
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ overflowX: 'auto' }}>
            {isTableLoading && <LinearProgress sx={{ height: 2 }} />}
            <DataTable
              columns={columns}
              data={Array.isArray(tableData?.data) ? tableData.data : []}
              pagination={{
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
              }}
              totalCount={tableData?.pagination?.total || 0}
              onPaginationChange={setPagination}
              onFilterChange={({ ward, village, hamlet }) => {
                setWard(ward || 'All');
                setVillage(village || 'All');
                setHamlet(hamlet || 'All');
                setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
              }}
              searchQuery={searchTerm}
              onSearchChange={(newSearch) => {
                setSearchTerm(newSearch);
                setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
              }}
              onRowClick={(row) => navigateToDetails(row._id)}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default WaterSourcesDashboard;
