import {
  Alert,
  Avatar,
  Box,
  Card,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  styled,
  Typography,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useState, useMemo } from 'react';
import { FaToilet } from 'react-icons/fa';
import { GiHole } from "react-icons/gi";
import { LuToilet } from "react-icons/lu";
import { PiToiletFill } from "react-icons/pi";
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';
import { useNavigate } from 'react-router-dom';

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

// Analytics structure as returned from the API
interface ToiletAnalytics {
  totalToilets: number;
  proportionImproved: number; // as a decimal (e.g. 0.0096)
  householdToiletRatio: string;
  schoolToiletRatio: string;
  conditionDistribution: {
    [key: string]: {
      count: number;
      percentage: string;
    };
  };
  typeDistribution: {
    [key: string]: {
      count: number;
      percentage: string;
    };
  };
}

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.spacing(1)};
  box-shadow: 5;
`;

// Error Alert Component
const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
  <Container maxWidth="md" sx={{ mt: 3 }}>
    <Alert severity="error">{message}</Alert>
  </Container>
);

// Not Found Component
const NotFoundAlert: React.FC = () => (
  <Container maxWidth="md" sx={{ mt: 3 }}>
    <Alert severity="info">No toilet facility found</Alert>
  </Container>
);

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor = '#E3F2FD' }) => (
  <StyledPaper>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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

const columnHelper = createColumnHelper<ToiletFacility>();

const columns = [
  columnHelper.accessor('picture', {
    header: 'Picture',
    cell: (props) => (
      <Avatar
        src={props.row.original.picture}
        alt="toilet facility"
        sx={{
          borderRadius: '100%',
        }}
      />
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
  columnHelper.accessor('hamlet', {
    header: 'Hamlet',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('spaceType', {
    header: 'Category',
    cell: (info) => info.getValue(),
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

const ToiletFacilities: React.FC = () => {
  // State hooks for table parameters and filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');

    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
  
  

  // Fetch toilet facilities data
  const { data, isLoading, error } = useQuery<ToiletFacility[], Error>({
    queryKey: ['toilet-facilities', { limit, page, search }],
    queryFn: () =>
      apiController.get<ToiletFacility[]>(`/toilet-facilities?limit=${limit}&page=${page}&search=${search}`),
  });

  // Fetch analytics data from the new endpoint
  const { data: analytics } = useQuery<ToiletAnalytics, Error>({
    queryKey: ['toilet-facilities-analytics'],
    queryFn: () => apiController.get<ToiletAnalytics>('/toilet-facilities/analytics'),
  });

  // Generate filter options from data
  const wardOptions = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map((item) => item.ward))];
  }, [data]);

  const villageOptions = useMemo(() => {
    if (!data) return [];
    const filteredVillages = data.filter((item) => !ward || item.ward === ward).map((item) => item.village);
    return [...new Set(filteredVillages)];
  }, [data, ward]);

  const hamletOptions = useMemo(() => {
    if (!data) return [];
    const filteredHamlets = data
      .filter((item) => (!ward || item.ward === ward) && (!village || item.village === village))
      .map((item) => item.hamlet);
    return [...new Set(filteredHamlets)];
  }, [data, ward, village]);

  // Filter the fetched data based on user selection
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (item) =>
        (!ward || item.ward === ward) &&
        (!village || item.village === village) &&
        (!hamlet || item.hamlet === hamlet)
    );
  }, [data, ward, village, hamlet]);

  // Determine if no filters are applied (empty strings mean "all")
  const noFilterApplied = useMemo(() => !ward && !village && !hamlet, [ward, village, hamlet]);

  // Compute effective analytics based on filters:
  // Use the API analytics when no filter is applied; otherwise, recalculate from filteredData.
  const effectiveAnalytics = useMemo(() => {
    if (noFilterApplied && analytics) {
      return {
        totalToilets: analytics.totalToilets,
        // Convert proportion to percentage string
        proportionImproved: analytics.proportionImproved
          ? (analytics.proportionImproved * 100).toFixed(1) + '%'
          : '0%',
        householdToiletRatio: analytics.householdToiletRatio,
        schoolToiletRatio: analytics.schoolToiletRatio,
        conditionDistribution: analytics.conditionDistribution,
        typeDistribution: analytics.typeDistribution,
      };
    } else {
      const total = filteredData.length;
      if (total === 0) {
        return {
          totalToilets: 0,
          proportionImproved: '0%',
          householdToiletRatio: '0',
          schoolToiletRatio: '0',
          conditionDistribution: { Maintained: { count: 0, percentage: '0%' }, Unmaintained: { count: 0, percentage: '0%' } },
          typeDistribution: {},
        };
      }
      // Compute improved proportion based on condition: assume "Maintained" counts as improved
      const maintainedCount = filteredData.filter((item) => item.condition === 'Maintained').length;
      const proportionImproved = ((maintainedCount / total) * 100).toFixed(1) + '%';

      // Compute condition distribution from filtered data
      const conditionCounts = filteredData.reduce((acc: any, item) => {
        const key = item.condition;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const conditionDistribution = {
        Maintained: {
          count: conditionCounts['Maintained'] || 0,
          percentage: ((conditionCounts['Maintained'] || 0) / total * 100).toFixed(1) + '%',
        },
        Unmaintained: {
          count: conditionCounts['Unmaintained'] || 0,
          percentage: ((conditionCounts['Unmaintained'] || 0) / total * 100).toFixed(1) + '%',
        },
      };

      // Compute type distribution from filtered data
      const typeCounts = filteredData.reduce((acc: any, item) => {
        const key = item.type;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const typeDistribution: Record<string, { count: number; percentage: string }> = {};
      Object.keys(typeCounts).forEach((key) => {
        typeDistribution[key] = {
          count: typeCounts[key],
          percentage: ((typeCounts[key] / total) * 100).toFixed(1) + '%',
        };
      });

      return {
        totalToilets: total,
        proportionImproved,
        householdToiletRatio: '0',
        schoolToiletRatio: '0',
        conditionDistribution,
        typeDistribution,
      };
    }
  }, [noFilterApplied, analytics, filteredData]);

  // Prepare chart data for toilet facility types
  const typeDistributionChartData = useMemo(() => {
    const chartData: { id: number; label: string; value: number; color: string }[] = [];
    const colorPalette = ['#4CAF50', '#FF9800', '#2196F3', '#F44336', '#9C27B0', '#FF5722'];
    if (effectiveAnalytics.typeDistribution) {
      let index = 0;
      for (const [type, dist] of Object.entries(effectiveAnalytics.typeDistribution)) {
        chartData.push({
          id: index,
          label: type,
          value: dist.count,
          color: colorPalette[index % colorPalette.length],
        });
        index++;
      }
    }
    return chartData;
  }, [effectiveAnalytics]);

  // Prepare chart data for condition distribution
  const conditionDistributionChartData = useMemo(() => {
    const chartData: { id: number; label: string; value: number; color: string }[] = [];
    const colorPalette = ['#4CAF50', '#F44336'];
    if (effectiveAnalytics.conditionDistribution) {
      const keys = Object.keys(effectiveAnalytics.conditionDistribution);
      keys.forEach((key, idx) => {
        chartData.push({
          id: idx,
          label: key,
          value: effectiveAnalytics.conditionDistribution[key].count,
          color: colorPalette[idx % colorPalette.length],
        });
      });
    }
    return chartData;
  }, [effectiveAnalytics]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error instanceof Error) return <ErrorAlert message={error.message} />;
  if (!data || data.length === 0) return <NotFoundAlert />;

  // A reusable filter dropdown component
  const FilterDropdown = ({
    label,
    value,
    options,
    onChange,
  }: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
  }) => (
    <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 210 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
        sx={{ height: 45 }}
      >
        <MenuItem value="">{`All ${label}`}</MenuItem>
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const navigateToDetails = (id: string) => {
    navigate(`/toilet-facilities/${id}?${queryParams.toString()}`);
  };


  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      {/* Header with Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
            Toilet Facilities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed insights and analytics based on your selected location.
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <FilterDropdown label="Ward" value={ward} options={wardOptions} onChange={setWard} />
            <FilterDropdown label="Village" value={village} options={villageOptions} onChange={setVillage} />
            <FilterDropdown label="Hamlet" value={hamlet} options={hamletOptions} onChange={setHamlet} />
          </Stack>
        </Box>
      </Box>

      {/* Analytics Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Toilet Facilities"
            value={Number(effectiveAnalytics.totalToilets).toLocaleString()}
            icon={<LuToilet style={{ color: '#2563EB', fontSize: '2rem' }} />}
            bgColor="#E3F2FD"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Improved Facilities"
            value={effectiveAnalytics.proportionImproved || '0%'}
            icon={<FaToilet style={{ color: '#4CAF50', fontSize: '2rem' }} />}
            bgColor="#E8F5E9"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Household Toilet Ratio"
            value={effectiveAnalytics.householdToiletRatio}
            icon={<GiHole style={{ color: '#FF9800', fontSize: '2rem' }} />}
            bgColor="#FFF3E0"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="School Toilet Ratio"
            value={effectiveAnalytics.schoolToiletRatio}
            icon={<PiToiletFill style={{ color: '#0EA5E9', fontSize: '2rem' }} />}
            bgColor="#E3F2FD"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4" mb={2}>
              Toilet Facility Types
            </Typography>
            <PieChart
              series={[
                {
                  data: typeDistributionChartData,
                  arcLabel: (item) => {
                    const total = effectiveAnalytics.totalToilets || 1;
                    return `${item.value.toLocaleString()} (${((item.value / total) * 100).toFixed(1)}%)`;
                  },
                  arcLabelMinAngle: 10,
                  outerRadius: 150,
                },
              ]}
              width={700}
              height={300}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fontWeight: 'bold',
                  fill: 'white',
                },
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4" mb={2}>
              Condition Distribution
            </Typography>
            <PieChart
              series={[
                {
                  data: conditionDistributionChartData,
                  arcLabel: (item) => {
                    const total = effectiveAnalytics.totalToilets || 1;
                    return `${item.value.toLocaleString()} (${((item.value / total) * 100).toFixed(1)}%)`;
                  },
                  arcLabelMinAngle: 10,
                  outerRadius: 150,
                },
              ]}
              width={600}
              height={300}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fontWeight: 'bold',
                  fill: 'white',
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Data Table Section */}
      <Card sx={{ mt: 3 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Toilet Facilities Overview
          </Typography>
          <DataTable
            setSearch={setSearch}
            setPage={setPage}
            setLimit={setLimit}
            isLoading={isLoading}
            columns={columns}
            data={filteredData || []}
            onRowClick={(row) => navigateToDetails(row._id)}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default ToiletFacilities;
