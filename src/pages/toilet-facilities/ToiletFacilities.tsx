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
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useState, useEffect } from 'react';
import { RiWaterFlashFill } from 'react-icons/ri';
import { useQuery } from '@tanstack/react-query';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocationFilter from '../../components/LocationFilter';
import LinearProgress from '@mui/material/LinearProgress';

const getImageSrc = (url: string) => {
  return url.startsWith('file://') ? '/fallback-placeholder.jpg' : url;
};

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.spacing(1)};
  min-height: 150px;
`;

const FixedHeader = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: -9,
  zIndex: 100,
  backgroundColor: '#F1F1F5',
  padding: theme.spacing(2, 0),
  marginBottom: theme.spacing(2),
}));

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
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState<string>('');
  // Filter state
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');
  // Stat state
  const [totalToilets, setTotalToilets] = useState<number>(0);
  const [proportionImproved, setProportionImproved] = useState<string>('0%');
  const [householdToiletRatio, setHouseholdToiletRatio] = useState<string>('0');
  const [schoolToiletRatio, setSchoolToiletRatio] = useState<string>('0');
  // Chart data types
  type PieChartDataItem = { id: number; label: string; value: number; color: string };
  type BarChartDataItem = { condition: string; maintained: number; unmaintained: number };
  // Chart state
  const [pieChartData, setPieChartData] = useState<PieChartDataItem[]>([]);
  const [barChartData, setBarChartData] = useState<BarChartDataItem[]>([]);

  interface AnalyticsData {
    totalToilets: number;
    proportionImproved: number;
    householdToiletRatio: string | number | null | undefined;
    schoolToiletRatio: string | number | null | undefined;
    typeDistribution: {
      [key: string]: { count: number; percentage?: string };
    };
    conditionDistribution: {
      [key: string]: { count: number };
    };
  }

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['toilet-facilities-analytics', ward, village, hamlet],
    queryFn: () =>
      apiController.get(`/toilet-facilities/analytics?` +
        (ward ? `ward=${encodeURIComponent(ward)}&` : '') +
        (village ? `village=${encodeURIComponent(village)}&` : '') +
        (hamlet ? `hamlet=${encodeURIComponent(hamlet)}&` : '')
      ),
  });

  function normalizeValue(val: unknown): string {
    if (
      val === undefined ||
      val === null ||
      val === '' ||
      (typeof val === 'string' && val.trim().toLowerCase() === 'no data')
    ) {
      return '0';
    }
    return String(val);
  }

  useEffect(() => {
    if (analytics) {
      setTotalToilets(
        normalizeValue(analytics.totalToilets) === '0' ? 0 : Number(analytics.totalToilets)
      );
      setProportionImproved(
        normalizeValue(analytics.proportionImproved) === '0'
          ? '0%'
          : `${(Number(analytics.proportionImproved) * 100).toFixed(1)}%`
      );
      setHouseholdToiletRatio(normalizeValue(analytics.householdToiletRatio));
      setSchoolToiletRatio(normalizeValue(analytics.schoolToiletRatio));
      if (analytics.typeDistribution) {
        const colorPalette = ['#4CAF50', '#F44336', '#FF9800', '#2196F3', '#9C27B0', '#FF5722'];
        setPieChartData(
          Object.entries(analytics.typeDistribution).map(([type, values], index) => ({
            id: index,
            label: type,
            value: normalizeValue(values.count) === '0' ? 0 : Number(values.count),
            color: colorPalette[index % colorPalette.length],
          }))
        );
      }
      if (analytics.conditionDistribution) {
        setBarChartData([
          {
            condition: 'Condition',
            maintained:
              normalizeValue(analytics.conditionDistribution['Maintained']?.count) === '0'
                ? 0
                : Number(analytics.conditionDistribution['Maintained']?.count),
            unmaintained:
              normalizeValue(analytics.conditionDistribution['Unmaintained']?.count) === '0'
                ? 0
                : Number(analytics.conditionDistribution['Unmaintained']?.count),
          },
        ]);
      }
    }
    // Do not reset to 0/empty if analytics is undefined
  }, [analytics]);

  const { data: tableData, isLoading: isTableLoading } = useQuery({
    queryKey: [
      'toilet-facilities',
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm,
      ward,
      village,
      hamlet,
    ],
    queryFn: () =>
      apiController.get(
        `/toilet-facilities?limit=${pagination.pageSize}` +
        `&page=${pagination.pageIndex + 1}` +
        `&search=${searchTerm}` +
        (ward ? `&ward=${encodeURIComponent(ward)}` : '') +
        (village ? `&village=${encodeURIComponent(village)}` : '') +
        (hamlet ? `&hamlet=${encodeURIComponent(hamlet)}` : '')
      ),
  });

  // Removed totalPieValue (was only used for PieChart)

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

  const navigateToDetails = (id: string) => {
    navigate(`/toilet-facilities/${id}?${queryParams.toString()}`);
  };

  return (
    <Box sx={{ backgroundColor: '#F1F1F5', minHeight: '100vh', p: 3 }}>
      <Box sx={{ position: 'relative' }}>
        <FixedHeader>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
                    Toilet Facilities Dashboard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Comprehensive overview of toilet facilities in the region
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <LocationFilter ward={ward} village={village} hamlet={hamlet}
                    setWard={setWard} setVillage={setVillage} setHamlet={setHamlet}
                  />
                </Box>
              </Box>
              <Box sx={{ width: '100%', mb: 3 }}>
                {isLoading && <LinearProgress />}
              </Box>
            </Grid>
          </Grid>
        </FixedHeader>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Toilets"
              value={Number(totalToilets || 0).toLocaleString()}
              icon={<RiWaterFlashFill style={{ color: '#2563EB', fontSize: '2rem' }} />}
              bgColor="#E3F2FD"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Improved Facilities"
              value={proportionImproved || '0%'}
              icon={<ArrowUp style={{ color: '#4CAF50', fontSize: '2rem' }} />}
              bgColor="#E8F5E9"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Household Toilet Ratio"
              value={householdToiletRatio || '0'}
              icon={<RiWaterFlashFill style={{ color: '#2196F3', fontSize: '2rem' }} />}
              bgColor="#E3F2FD"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="School Toilet Ratio"
              value={schoolToiletRatio || '0'}
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
              <BarChart
                xAxis={[{ scaleType: 'band', data: pieChartData.map(item => item.label) }]}
                series={[{
                  data: pieChartData.map(item => item.value),
                  label: 'Count',
                  colors: pieChartData.map(item => item.color),
                  valueFormatter: (value) => `${value}`,
                }]}
                width={Math.min(760, window.innerWidth - 40)}
                height={370}
                sx={{
                  '& .MuiBarElement-root': {
                    // Use color from pieChartData if available
                    // This will be overridden by the colors prop if supported
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
                dataset={barChartData.map(item => ({
                  ...item,
                  maintained: item.maintained ?? 0,
                  unmaintained: item.unmaintained ?? 0,
                }))}
                yAxis={[{ scaleType: 'linear' }]}
                xAxis={[{ scaleType: 'band', dataKey: 'condition' }]}
                series={[
                  {
                    dataKey: 'maintained',
                    label: 'Maintained',
                    color: '#4CAF50',
                    valueFormatter: (value) => `${value}`,
                    stack: 'a',
                  },
                  {
                    dataKey: 'unmaintained',
                    label: 'Unmaintained',
                    color: '#F44336',
                    valueFormatter: (value) => `${value}`,
                    stack: 'a',
                  }
                ]}
                height={400}
                layout="vertical"
              />
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ overflowX: 'auto' }}>
            {isTableLoading && <LinearProgress sx={{ height: 2 }} />}
            <DataTable
              columns={columns}
              data={Array.isArray(tableData) ? tableData : []}
              pagination={{
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
              }}
              totalCount={typeof tableData === 'object' && tableData !== null && 'total' in tableData ? (tableData.total as number) : 0}
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

export default ToiletFacilities;