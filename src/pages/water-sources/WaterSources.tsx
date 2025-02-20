import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
  styled,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useState, useEffect, useMemo } from 'react';
import { FaWrench } from 'react-icons/fa6';
import { RiWaterFlashFill } from 'react-icons/ri';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';
import { BarChart, PieChart, pieArcLabelClasses } from '@mui/x-charts';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { IoWater } from 'react-icons/io5';
import { Timeline } from '@mui/icons-material';

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

// Styled Components
const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.spacing(1)};
  height: 100%;
  box-shadow: 10;
`;

const StyledCard = ({ ...props }) => {
  return (
    <Card
      {...props}
      sx={{
        height: '100%',
        ...props.sx,
      }}
    >
      {props.children}
    </Card>
  );
};

const FilterDropdown = ({ label, options, value, onChange, disabled }) => (
  <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 210 }}>
    <InputLabel>{label}</InputLabel>
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label={label}
      sx={{ height: 45 }}
      disabled={disabled}
    >
      <MenuItem value="">All</MenuItem>
      {options.map((option, index) => (
        <MenuItem key={index} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

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
const columnHelper = createColumnHelper<WaterSource>();

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
      );
    },
  }),
];

// Main Component
const WaterSourcesDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
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
  const wardOptions = useMemo(() => [...new Set(data?.map(item => item.ward) || [])], [data]);
  const villageOptions = useMemo(() => [...new Set(data?.map(item => item.village) || [])], [data]);
  const hamletOptions = useMemo(() => [...new Set(data?.map(item => item.hamlet) || [])], [data]);

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

  // Analytics Count
  const stats = useMemo(() => ({
    functional: filteredData.filter(source => source.status === 'Functional').length.toLocaleString(),
    nonFunctional: filteredData.filter(source => source.status === 'Non Functional').length.toLocaleString(),
    maintenanceDue: filteredData.filter(source => source.status === 'Maintenance Due').length.toLocaleString(),
    drinkable: filteredData.filter(source => source.quality === 'Drinkable').length.toLocaleString(),
    nonDrinkable: filteredData.filter(source => source.quality === 'Non Drinkable').length.toLocaleString(),
  }), [filteredData]);

  // Bar Chart Data
  const dataset = [
    {
      type: 'Protected Dug Wells',
      functional: filteredData.filter(source => source.type === 'Protected Dug Wells' && source.status === 'Functional').length,
      nonFunctional: filteredData.filter(source => source.type === 'Protected Dug Wells' && source.status === 'Non Functional').length,
    },
    {
      type: 'Unprotected Dug Wells',
      functional: filteredData.filter(source => source.type === 'Unprotected Dug Wells' && source.status === 'Functional').length,
      nonFunctional: filteredData.filter(source => source.type === 'Unprotected Dug Wells' && source.status === 'Non Functional').length,
    },
    {
      type: 'Hand Pump Boreholes',
      functional: filteredData.filter(source => source.type === 'Hand Pump Boreholes' && source.status === 'Functional').length,
      nonFunctional: filteredData.filter(source => source.type === 'Hand Pump Boreholes' && source.status === 'Non Functional').length,
    },
    {
      type: 'Motorized Boreholes',
      functional: filteredData.filter(source => source.type === 'Motorized Boreholes' && source.status === 'Functional').length,
      nonFunctional: filteredData.filter(source => source.type === 'Motorized Boreholes' && source.status === 'Non Functional').length,
    },
  ];

  // Pie Chart Data
  const pieChartData = [
    {
      id: 'Drinkable',
      label: 'Drinkable',
      value: filteredData.filter(item => item.quality === 'Drinkable').length || 0,
      color: '#40B3E6',
    },
    {
      id: 'Non Drinkable',
      label: 'Non Drinkable',
      value: filteredData.filter(item => item.quality === 'Non Drinkable').length || 0,
      color: '#FF9800',
    },
  ];

  const handleTabChange = (e, newValue) => {
    setCurrentTab(newValue);
  };

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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
            Water Sources Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive overview of water sources
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <FilterDropdown label="Ward" options={wardOptions} value={ward} onChange={setWard} disabled={isLoading} />
          <FilterDropdown label="Village" options={villageOptions} value={village} onChange={setVillage} disabled={isLoading} />
          <FilterDropdown label="Hamlet" options={hamletOptions} value={hamlet} onChange={setHamlet} disabled={isLoading} />
        </Stack>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { title: 'Total Sources', value: filteredData.length.toLocaleString(), icon: <RiWaterFlashFill style={{ color: '#2563EB', fontSize: '2rem' }} />, bgColor: '#DBEAFE' },
          { title: 'Functional', value: stats.functional, icon: <ArrowUp style={{ color: '#4CAF50', fontSize: '2rem' }} />, bgColor: '#E8F5E9' },
          { title: 'Non-Functional', value: stats.nonFunctional, icon: <ArrowDown style={{ color: '#EF5350', fontSize: '2rem' }} />, bgColor: '#FFEBEE' },
          { title: 'Due for Maintenance', value: stats.maintenanceDue, icon: <FaWrench style={{ color: '#FFA726', fontSize: '2rem' }} />, bgColor: '#FFF3E0' },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard title={stat.title} value={stat.value} icon={stat.icon} bgColor={stat.bgColor} />
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <StyledCard>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              '& .MuiTab-root': {
                minHeight: 64,
                textTransform: 'none',
              },
            }}
          >
            <Tab icon={<Timeline />} label="Overview" iconPosition="start" />
            <Tab icon={<IoWater />} label="Water Quality" iconPosition="start" />
          </Tabs>
        </Box>

        <CardContent>
          {currentTab === 0 && (
            <Box>
              {/* Bar Chart */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold', color: '#2d3436' }}>
                    Water Source Functionality
                  </Typography>
                  <BarChart
                    series={[
                      { dataKey: 'functional', label: 'Functional', color: '#4CAF50' },
                      { dataKey: 'nonFunctional', label: 'Non-Functional', color: '#EF5350' },
                    ]}
                    xAxis={[{ scaleType: 'band', dataKey: 'type' }]}
                    dataset={dataset}
                    height={350}
                  />
                </Grid>

                {/* Pie Chart */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold', color: '#2d3436' }}>
                    Water Quality Distribution
                  </Typography>
                  <PieChart
                    series={[
                      {
                        data: pieChartData,
                        arcLabel: (item) => {
                          const total = pieChartData.reduce((sum, d) => sum + d.value, 0);
                          return total > 0 ? `${Math.round((item.value / total) * 100)}%` : '0%';
                        },
                        outerRadius: 140,
                        innerRadius: 50,
                        cornerRadius: 4,
                        paddingAngle: 2,
                        highlightScope: { highlighted: 'item', faded: 'global' },
                      },
                    ]}
                    width={500}
                    height={350}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: '#2d3436',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        pointerEvents: 'none',
                      },
                      '& .MuiPieArc-root': {
                        transition: 'transform 0.2s, filter 0.2s',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          filter: 'brightness(1.1)',
                        },
                      },
                    }}
                    slotProps={{
                      legend: {
                        direction: 'row',
                        position: { vertical: 'bottom', horizontal: 'middle' },
                        padding: { top: 20 },
                        labelStyle: {
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          fill: '#2d3436',
                        },
                        itemMarkWidth: 12,
                        itemMarkHeight: 12,
                        markGap: 5,
                        itemGap: 15,
                      },
                    }}
                    margin={{ top: 40, right: 40, bottom: 100, left: 40 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {currentTab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold', color: '#2d3436' }}>
                Water Quality Metrics
              </Typography>
              <Grid container spacing={3}>
                {[
                  { title: 'Drinkable', value: stats.drinkable, icon: <IoWater style={{ color: '#2196F3', fontSize: '2rem' }} />, bgColor: '#E3F2FD' },
                  { title: 'Non-Drinkable', value: stats.nonDrinkable, icon: <IoWater style={{ color: '#FF9800', fontSize: '2rem' }} />, bgColor: '#FFF3E0' },
                ].map((stat, index) => (
                  <Grid item xs={12} sm={6} md={6} key={index}>
                    <StatCard title={stat.title} value={stat.value} icon={stat.icon} bgColor={stat.bgColor} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </CardContent>
      </StyledCard>

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