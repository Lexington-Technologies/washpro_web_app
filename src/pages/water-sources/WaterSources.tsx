import {
  Avatar,
  Box,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  styled,
  Typography,
  CircularProgress
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useState, useEffect, useMemo } from 'react';
import { FaWrench } from 'react-icons/fa6';
import { RiWaterFlashFill } from 'react-icons/ri';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';
import { BarChart as MuiBarChart, PieChart as MuiPieChart } from '@mui/x-charts';
import { ArrowDown, ArrowUp } from 'lucide-react';

// Interfaces
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
}

interface WaterSource {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  geolocation: {
    type: string;
    coordinates: number[];
  };
  quality: string;
  status: string;
  type: string;
  createdBy: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
  publicSpace: string;
  dependent: number;
  space: string;
  qualityTest: {
    clearness: number;
    odor: number;
    ph: number;
    salinity: number;
    conductivity: number;
    capturedAt: string;
    createdBy: string;
    publicSpace: string;
    updatedAt: string;
    _id: string;
  }[];
}

// StyledComponents
const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.spacing(1)};
  height: 100%;
  box-shadow: 10;
`;

// Components
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor }) => (
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
    </Box>
  </StyledPaper>
);

// Define your row shape
const columnHelper = createColumnHelper<WaterSource>()

// Make some columns!
const columns = [
  columnHelper.accessor('picture', {
    header: 'Picture',
    cell: props => (
      <Avatar
        src={props.row.original.picture}
        alt="water source"
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
    header: 'Category',
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
            label={info.row.original.quality}
            color={info.row.original.quality === 'Drinkable' ? 'info' : 'error'}
          />
        </Stack>
      )
    },
  }),
]

// Main Component
const WaterSourcesDashboard: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  const { data, isLoading, isError, error } = useQuery<WaterSource[], Error>({
    queryKey: ['water-sources', { limit, page, search }],
    queryFn: () => apiController.get<WaterSource[]>(`/water-sources?limit=${limit}&page=${page}&search=${search}`),
  });

  // Filter State Initialization
  const [filteredData, setFilteredData] = useState<WaterSource[]>([]);

  // Applying Filters in useEffect
  useEffect(() => {
    setIsFiltering(true);
    let filtered = data ? [...data] : [];
    if (ward) filtered = filtered.filter(item => item.ward === ward);
    if (village) filtered = filtered.filter(item => item.village === village);
    if (hamlet) filtered = filtered.filter(item => item.hamlet === hamlet);
    setFilteredData(filtered);
    setIsFiltering(false);
  }, [data, ward, village, hamlet]);

  // Generating Filter Dropdown Options
  const wardOptions = useMemo(() => [...new Set(data?.map(item => item.ward) || [])], [data]);
  const villageOptions = useMemo(() => [...new Set(data?.map(item => item.village) || [])], [data]);
  const hamletOptions = useMemo(() => [...new Set(data?.map(item => item.hamlet) || [])], [data]);

  // Analytics Count
  const stats = {
    functional: filteredData.filter(source => source.status === 'Functional').length.toLocaleString(),
    nonFunctional: filteredData.filter(source => source.status === 'Non Functional').length.toLocaleString(),
    maintenanceDue: filteredData.filter(source => source.status === 'Maintenance Due').length.toLocaleString(),
  };

  // Bar Chart Data
  const dataset = [
    { 
      type: 'Protected Dug Wells', 
      functional: filteredData.filter(source => source.type === 'Protected Dug Wells' && source.status === 'Functional').length, 
      nonFunctional: filteredData.filter(source => source.type === 'Protected Dug Wells' && source.status === 'Non Functional').length 
    },
    { 
      type: 'Unprotected Dug Wells', 
      functional: filteredData.filter(source => source.type === 'Unprotected Dug Wells' && source.status === 'Functional').length, 
      nonFunctional: filteredData.filter(source => source.type === 'Unprotected Dug Wells' && source.status === 'Non Functional').length 
    },  
    { 
      type: 'Hand Pump Boreholes', 
      functional: filteredData.filter(source => source.type === 'Hand Pump Boreholes' && source.status === 'Functional').length, 
      nonFunctional: filteredData.filter(source => source.type === 'Hand Pump Boreholes' && source.status === 'Non Functional').length 
    },
    { 
      type: 'Motorized Boreholes', 
      functional: filteredData.filter(source => source.type === 'Motorized Boreholes' && source.status === 'Functional').length, 
      nonFunctional: filteredData.filter(source => source.type === 'Motorized Boreholes' && source.status === 'Non Functional').length 
    },
  ];

  // Pie Chart Data
  const pieChartData = [
    { 
      id: 'Drinkable', 
      label: 'Drinkable', 
      value: filteredData.filter(item => item.quality === 'Drinkable').length || 0, 
      color: '#40B3E6' 
    },
    { 
      id: 'Non Drinkable', 
      label: 'Non Drinkable', 
      value: filteredData.filter(item => item.quality === 'Non Drinkable').length || 0, 
      color: '#FF9800' 
    },
  ];

  const FilterDropdown = ({ label, options, value, onChange }) => (
    <FormControl variant="outlined" sx={{ mb: 2, minWidth: 210 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={(e) => onChange(e.target.value)} label={label}>
        <MenuItem value="">All</MenuItem>
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  if (isLoading || isFiltering) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">Error: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      {/* Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
            Water Sources
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed insights about your selected location
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <FilterDropdown label="Ward" options={wardOptions} value={ward} onChange={setWard} />
          <FilterDropdown label="Village" options={villageOptions} value={village} onChange={setVillage} />
          <FilterDropdown label="Hamlet" options={hamletOptions} value={hamlet} onChange={setHamlet} />
        </Stack>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} mb={3}>
        {[ 
          { title: 'Total Sources', value: filteredData.length.toLocaleString(), icon: <RiWaterFlashFill style={{ color: '#2563EB', fontSize: '2rem' }} />, bgColor: '#DBEAFE' },
          { title: 'Functional', value: stats.functional, icon: <ArrowUp style={{ color: '#4CAF50', fontSize: '2rem' }}/>, bgColor: '#E8F5E9' },
          { title: 'Non-Functional', value: stats.nonFunctional, icon: <ArrowDown style={{ color: '#EF5350', fontSize: '2rem' }}/>, bgColor: '#FFEBEE' },
          { title: 'Due for Maintenance', value: stats.maintenanceDue, icon: <FaWrench style={{ color: '#FFA726', fontSize: '2rem' }}/>, bgColor: '#FFF3E0' },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard title={stat.title} value={stat.value} icon={stat.icon} bgColor={stat.bgColor} />
          </Grid>
        ))}
      </Grid>

    {/* Charts */}
    <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Water Source Functionality</Typography>
            <MuiBarChart series={[{ dataKey: 'functional', label: 'Functional', color: '#4CAF50' }, { dataKey: 'nonFunctional', label: 'Non-Functional', color: '#EF5350' }]} xAxis={[{ scaleType: 'band', dataKey: 'type' }]} dataset={dataset} height={350} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Safe Water</Typography>
            <MuiPieChart
              series={[
                { 
                  data: pieChartData, 
                  arcLabel: (item) => {
                    const total = filteredData.length || 1; // Avoid division by zero
                    return `${((item.value / total) * 100).toFixed(1)}%`;
                  },
                  innerRadius: 40, 
                  outerRadius: 100 
                }
              ]}
              width={600}
              height={350}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Table */}
      <DataTable 
        setSearch={setSearch} 
        setPage={setPage} 
        setLimit={setLimit} 
        isLoading={isLoading} 
        columns={columns} 
        data={filteredData || []} 
      />
      </Box>
  );
};

export default WaterSourcesDashboard;