import {
  Add as AddIcon,
  FiberManualRecord as FiberManualRecordIcon,
  FilterAlt as FilterAltIcon,
  Remove as RemoveIcon,
  Waves,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useState, useMemo } from 'react';
import { FaClipboardCheck, FaDownload, FaExclamationTriangle, FaFilter, FaWrench } from 'react-icons/fa';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';

// Add SoakAway interface
interface SoakAway {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  publicSpace: string;
  space: string;
  condition: string;
  status: string;
  daysSinceLastEvacuation: number;
  evacuationFrequency: string;
  safetyRisk: string;
  daysSinceLastMaintenance: number | null;
  daysUntilEvacuation: number | null;
  maintenanceStatus: string;
  createdBy: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
  geolocation: {
    type: string;
    coordinates: number[];
  };
}

// Add column helper
const columnHelper = createColumnHelper<SoakAway>();

const columns = [
  columnHelper.accessor('picture', {
    header: 'Picture',
    cell: props => (
      <Avatar
        src={props.getValue()}
        alt="soakaway"
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
            color={info.row.original.condition === 'Maintained' ? 'success' : 'error'}
          />
          <Chip
            variant='outlined'
            label={info.row.original.status}
            color={info.row.original.status === 'Unimproved' ? 'warning' : 'success'}
          />
          <Chip
            variant='outlined'
            label={info.row.original.safetyRisk}
            color={info.row.original.safetyRisk === 'Fair' ? 'warning' : 'error'}
          />
        </Stack>
      )
    },
  }),
];

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


const SoakAways = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');

  const { data, isLoading } = useQuery<SoakAway[], Error>({
    queryKey: ['soak-aways', { limit, page, search }],
    queryFn: () => apiController.get<SoakAway[]>(`/soak-aways?limit=${limit}&page=${page}&search=${search}`),
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
      (!hamlet || item.hamlet === hamlet) &&
      (!search ||
        item.ward.toLowerCase().includes(search.toLowerCase()) ||
        item.village.toLowerCase().includes(search.toLowerCase()) ||
        item.hamlet.toLowerCase().includes(search.toLowerCase()) ||
        item.publicSpace.toLowerCase().includes(search.toLowerCase())
      )
    );
    
  }, [data, ward, village, hamlet, search]);

  const countByProperty = <T,>(
    data: T[] | undefined,
    property: keyof T,
    value: T[keyof T]
  ): number => {
    return data?.filter(item => item[property] !== undefined && item[property] === value).length || 0;
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, width: '100%' }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 0.5 }}>
            Soakaways
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

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, width: '100%' }}>
        <StatsCard
          title="Total Soakaways"
          value={filteredData.length}
          icon={<Waves />}
          iconColor="#2196f3"
        />
        <StatsCard
          title="Maintained"
          value={countByProperty(filteredData, 'condition', 'Maintained')}
          icon={<FaClipboardCheck style={{ color: "#16A34A" }} />}
          iconColor="#4caf50"
          valueColor="#16A34A"
        />
        <StatsCard
          title="Unmaintained"
          value={countByProperty(filteredData, 'condition', 'Unmaintained')}
          icon={<FaExclamationTriangle style={{ color: "#DC2626" }} />}
          iconColor="#f44336"
          valueColor="#f44336"
        />
        <StatsCard
          title="Dilapidated"
          value={countByProperty(filteredData, 'condition', 'Dilapidated')}
          icon={<FaWrench color="#CA8A04" />}
          iconColor="#ff9800"
          valueColor="#ff9800"
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
        {/* Soakaway Overview */}
        <Paper sx={{ mt: 3, p: 3, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Soakaway Overview
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
    </Box>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number | undefined;
  icon: React.ReactElement;
  iconColor?: string;
  valueColor?: string;
}

const StatsCard = ({ title, value, icon, iconColor, valueColor }: StatsCardProps) => (
  <Card sx={{ flex: 1, p: 2, borderRadius: 2, boxShadow: 2 }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: valueColor || 'text.primary' }}>
        {value}
      </Typography>
      <Box
        sx={{
          bgcolor: `${iconColor}15`,
          width: 48,
          height: 48,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {React.cloneElement(icon, { sx: { color: iconColor, fontSize: 24 } })}
      </Box>
    </Box>
  </Card>
);

export default SoakAways;