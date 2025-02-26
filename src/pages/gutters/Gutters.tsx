import {
  Avatar,
  Box,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { GiBrickWall, GiRiver, GiSpill, GiSplashyStream } from 'react-icons/gi';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';

// Add Gutter interface
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
  publicSpace: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Add column helper and column definitions
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
            label={info.row.original.condition}
            color={info.row.original.condition === 'Good' ? 'success' : info.row.original.condition === 'Poor' ? 'error' : 'warning'}
          />
          <Chip
            variant='outlined'
            label={info.row.original.status}
            color={info.row.original.status === 'Maintained' ? 'success' : 'warning'}
          />
        </Stack>
      )
    },
  }),
];

// Define FilterDropdown component before using it
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

const GutterDashboard = () => {
  // Add state management
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');

  // Add query hook
  const { data: gutters, isLoading } = useQuery<Gutter[], Error>({
    queryKey: ['gutters', { limit, page, search }],
    queryFn: () => apiController.get<Gutter[]>(`/gutters?limit=${limit}&page=${page}&search=${search}`),
  });

  // Generate filter options
  const wardOptions = useMemo(() => {
    if (!gutters) return [];
    return [...new Set(gutters.map(item => item.ward))];
  }, [gutters]);

  const villageOptions = useMemo(() => {
    if (!gutters) return [];
    const filteredVillages = gutters
      .filter(item => !ward || item.ward === ward)
      .map(item => item.village);
    return [...new Set(filteredVillages)];
  }, [gutters, ward]);

  const hamletOptions = useMemo(() => {
    if (!gutters) return [];
    const filteredHamlets = gutters
      .filter(item => (!ward || item.ward === ward) && (!village || item.village === village))
      .map(item => item.hamlet);
    return [...new Set(filteredHamlets)];
  }, [gutters, ward, village]);

  // Filtered data
  const filteredData = useMemo(() => {
    if (!gutters) return [];
    return gutters.filter(item =>
      (!ward || item.ward === ward) &&
      (!village || item.village === village) &&
      (!hamlet || item.hamlet === hamlet) &&
      (!search ||
        item.ward.toLowerCase().includes(search.toLowerCase()) ||
        item.village.toLowerCase().includes(search.toLowerCase()) ||
        item.hamlet.toLowerCase().includes(search.toLowerCase()) ||
        item.publicSpace.toLowerCase().includes(search.toLowerCase())
      )
    );


  }, [gutters, ward, village, hamlet, search]);

  // Fixed countByProperty function
  const countByProperty = <T,>(
    data: T[] | undefined,
    property: keyof T,
    value: T[keyof T]
  ): number => {
    return data?.filter(item => item[property] !== undefined && item[property] === value).length.toLocaleString() || 0;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#2C3E50', fontWeight: 600, mb: 0.5 }}>
            Gutters
          </Typography>
          <Typography variant="body1" color="text.secondary">
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

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {/* Total Site Card */}
        <Card sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 2 }}>
          <Box>
            <Typography color="text.secondary">Total Gutters</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>{filteredData.length.toLocaleString()}</Typography>
          </Box>
          <Box
            sx={{
              bgcolor: '#E0F2FE',
              p: 1.5,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GiRiver style={{ color: '#3B82F6', fontSize: '2rem' }} />
          </Box>
        </Card>

        {/* Maintained Card */}
        <Card sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 2 }}>
          <Box>
            <Typography color="text.secondary">Constructed with Block</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#4CAF50' }}>
              {countByProperty(filteredData, 'type', 'Constructed with Block')}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: '#E8F5E9',
              p: 1.5,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <GiBrickWall style={{ color: '#4CAF50', fontSize: '2rem' }} />
          </Box>
        </Card>

        {/* Overfilled Card */}
        <Card sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 2 }}>
          <Box>
            <Typography color="text.secondary">Locally Dug</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#EF4444' }}>
              {countByProperty(filteredData, 'type', 'Locally Dug')}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: '#FEE2E2',
              p: 1.5,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GiSplashyStream style={{ color: '#EF4444', fontSize: '2rem' }} />
          </Box>
        </Card>

        {/* Unmaintained Card */}
        <Card sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 2 }}>
          <Box>
            <Typography color="text.secondary">Surfaced Gutter</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#F59E0B' }}>
              {countByProperty(filteredData, 'type', 'Surface Gutter')}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: '#FEF3C7',
              p: 1.5,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GiSpill style={{ color: '#F59E0B', fontSize: '2rem' }} />
          </Box>
        </Card>
      </Box>

      {/* Maintenance Table */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Gutter Overview
          </Typography>
        </Box>

        <DataTable
          setSearch={setSearch}
          setPage={setPage}
          setLimit={setLimit}
          isLoading={isLoading}
          columns={columns}
          data={filteredData || []}
        />
      </Paper>
    </Box>
  );
};

export default GutterDashboard;