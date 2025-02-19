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
import { FaDownload, FaFilter, FaToilet } from 'react-icons/fa';
import { GiHole } from "react-icons/gi";
import { LuToilet } from "react-icons/lu";
import { PiToiletFill } from "react-icons/pi";
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';

interface StatCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  bgColor?: string;
}

interface ToiletFacility {
  geolocation: {
    type: string;
    coordinates: [number, number, number];
  };
  publicSpace: string;
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
        <Box sx={{
          bgcolor: bgColor,
          p: 1,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
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
    cell: props => (
      <Avatar
        src={props.row.original.picture}
        alt="toilet facility"
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
  columnHelper.accessor('publicSpace', {
    header: 'Categories',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'Tags',
    cell: info => {
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            variant='outlined'
            label={info.row.original.type}
            color={'primary'}
          />
          <Chip
            variant='outlined'
            label={info.row.original.status}
            color={info.row.original.status === 'Functional' ? 'success' : 'warning'}
          />
          <Chip
            variant='outlined'
            label={info.row.original.condition}
            color={info.row.original.condition === 'Drinkable' ? 'info' : 'error'}
          />
        </Stack>
      )
    },
  }),
];

const ToiletFacilities: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');

  const { data, isLoading, error } = useQuery<ToiletFacility[], Error>({
    queryKey: ['toilet-facilities', { limit, page, search }],
    queryFn: () => apiController.get<ToiletFacility[]>(`/toilet-facilities?limit=${limit}&page=${page}&search=${search}`),
  });

  // Generate filter options
  const wardOptions = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map(item => item.ward))];
  }, [data]);

  const villageOptions = useMemo(() => {
    if (!data) return [];
    const filteredVillages = data
      .filter(item => !ward || item.ward === ward)
      .map(item => item.village);
    return [...new Set(filteredVillages)];
  }, [data, ward]);

  const hamletOptions = useMemo(() => {
    if (!data) return [];
    const filteredHamlets = data
      .filter(item => (!ward || item.ward === ward) && (!village || item.village === village))
      .map(item => item.hamlet);
    return [...new Set(filteredHamlets)];
  }, [data, ward, village]);

  // Filtered data
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(item =>
      (!ward || item.ward === ward) &&
      (!village || item.village === village) &&
      (!hamlet || item.hamlet === hamlet)
    );
  }, [data, ward, village, hamlet]);

  // Count toilet types
  const toiletTypeCounts = useMemo(() => {
    if (!filteredData) return { pitLatrine: 0, wcSitting: 0, wcSquatting: 0 };
    return {
      pitLatrine: filteredData.filter(item => item.type === 'Pit Latrine').length.toLocaleString(),
      wcSitting: filteredData.filter(item => item.type === 'WC Sitting').length.toLocaleString(),
      wcSquatting: filteredData.filter(item => item.type === 'WC Squatting').length.toLocaleString(),
    };
  }, [filteredData]);

  // Format data for Toilet Facility Types PieChart
  const toiletTypeChartData = [
    { id: 0, label: 'Pit Latrine', value: toiletTypeCounts.pitLatrine, color: '#4CAF50' },
    { id: 1, label: 'WC Sitting', value: toiletTypeCounts.wcSitting, color: '#FF9800' },
    { id: 2, label: 'WC Squatting', value: toiletTypeCounts.wcSquatting, color: '#2196F3' },
  ];

  // Count hand washing facilities
  const safetyRisk = {
    yes: filteredData.filter(item => item.handWashingFacility === 'yes').length,
    no: filteredData.filter(item => item.handWashingFacility === 'no').length,
  };

  // Format data for Hand Washing Facility PieChart
  const safetyRiskChartData = [
    { id: 0, label: 'Handwash', value: safetyRisk.yes, color: '#4CAF50' },
    { id: 1, label: 'No Handwash', value: safetyRisk.no, color: '#F44336' },
  ];

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  if (error instanceof Error) return <ErrorAlert message={error.message} />;
  if (!data || data.length === 0) return <NotFoundAlert />;

  const FilterDropdown = ({ label, value, options, onChange }) => (
    <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 210 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={(e) => onChange(e.target.value)} label={label} sx={{ height: 45 }}>
        <MenuItem value="">All {label}</MenuItem>
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
            Toilet Facilities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed insights about your selected location
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
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Toilet Facility"
            value={filteredData.length.toLocaleString() || 0}
            icon={<LuToilet style={{ color: '#2563EB', fontSize: '2rem' }} />}
            bgColor="#E3F2FD"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Pit Latrine"
            value={toiletTypeCounts.pitLatrine || 0}
            icon={<GiHole style={{ color: '#4CAF50', fontSize: '1.8rem' }} />}
            bgColor="#E8F5E9"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="WC Sitting"
            value={toiletTypeCounts.wcSitting || 0}
            icon={<FaToilet style={{ color: '#FF9800', fontSize: '2rem' }} />}
            bgColor="#FFF3E0"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="WC Squatting"
            value={toiletTypeCounts.wcSquatting || 0}
            icon={<PiToiletFill style={{ color: '#0EA5E9', fontSize: '2rem' }} />}
            bgColor="#E3F2FD"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Toilet Facility Types</Typography>
            <PieChart
              series={[
                {
                  data: toiletTypeChartData,
                  arcLabel: (item) => {
                    const total = filteredData.length || 1; // Avoid division by zero
                    return `${item.value.toLocaleString()} (${((item.value / total) * 100).toFixed(1)}%)`;
                  },
                  arcLabelMinAngle: 10, // Reduced to ensure small segments show labels
                  outerRadius: 150,
                }
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
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Hand Washing Facility</Typography>
            <PieChart
              series={[
                {
                  data: safetyRiskChartData,
                  arcLabel: (item) => {
                    const total = filteredData.length || 1; // Avoid division by zero
                    return `${item.value.toLocaleString()} (${((item.value / total) * 100).toFixed(1)}%)`;
                  },
                  arcLabelMinAngle: 10, // Reduced to ensure small segments show labels
                  outerRadius: 150,
                }
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

      {/* Table Section */}
      <Card sx={{ mt: 3, boxShadow: 5 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, }}>Toilet Facilities Overview</Typography>
          </Box>
          <DataTable setSearch={setSearch} setPage={setPage} setLimit={setLimit} isLoading={isLoading} columns={columns} data={filteredData || []} />
        </Box>
      </Card>
    </Box>
  );
};

export default ToiletFacilities;