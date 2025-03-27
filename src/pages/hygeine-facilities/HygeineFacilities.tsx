import {
  Box,
  Card,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  styled,
  Typography,
  MenuItem,
  Select,
  Stack,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState, useMemo, useEffect } from 'react';
import { FaHandHoldingWater, FaSchool, FaHospital, FaHome } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';

// Styled Components
const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.spacing(1)};
  box-shadow: 5;
  min-height: 150px; // Uniform height for all cards
`;

// StatCard Component
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

// HygieneFacilities Component
const HygieneFacilities: React.FC = () => {
  // State for filters
  const [spaceTypeFilter, setSpaceTypeFilter] = useState<string>('All');
  const [wardFilter, setWardFilter] = useState<string>('All');
  const [villageFilter, setVillageFilter] = useState<string>('All');
  const [hamletFilter, setHamletFilter] = useState<string>('All');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const handlePaginationChange = (newPagination: { pageIndex: number; pageSize: number }) => {
    setPagination(newPagination);
  };

  // Fetch data from the API
  const { data, isLoading, error } = useQuery({
    queryKey: ['hand-washing'],
    queryFn: () => apiController.get('/hand-washing'),
  });

  // Save state to localStorage whenever filters change
  useEffect(() => {
    const filters = { spaceTypeFilter, wardFilter, villageFilter, hamletFilter };
    localStorage.setItem('hygieneFacilitiesFilters', JSON.stringify(filters));
  }, [spaceTypeFilter, wardFilter, villageFilter, hamletFilter]);

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedFilters = localStorage.getItem('hygieneFacilitiesFilters');
    if (savedFilters) {
      const { spaceTypeFilter, wardFilter, villageFilter, hamletFilter } = JSON.parse(savedFilters);
      setSpaceTypeFilter(spaceTypeFilter);
      setWardFilter(wardFilter);
      setVillageFilter(villageFilter);
      setHamletFilter(hamletFilter);
    }
  }, []);

  // Extract unique filter options from the data
  const spaceTypeOptions = useMemo(() => {
    if (!data) return [];
    const uniqueSpaceTypes = [...new Set(data.map((item) => item.spaceType))];
    return ['All', ...uniqueSpaceTypes];
  }, [data]);

  const wardOptions = useMemo(() => {
    if (!data) return [];
    const uniqueWards = [...new Set(data.map((item) => item.ward))];
    return ['All', ...uniqueWards];
  }, [data]);

  const villageOptions = useMemo(() => {
    if (!data) return [];
    const uniqueVillages = [...new Set(data.map((item) => item.village))];
    return ['All', ...uniqueVillages];
  }, [data]);

  const hamletOptions = useMemo(() => {
    if (!data) return [];
    const uniqueHamlets = [...new Set(data.map((item) => item.hamlet))];
    return ['All', ...uniqueHamlets];
  }, [data]);

  // Filtered Data for Cards and Charts
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const matchesSpaceType = spaceTypeFilter === 'All' || item.spaceType === spaceTypeFilter;
      const matchesWard = wardFilter === 'All' || item.ward === wardFilter;
      const matchesVillage = villageFilter === 'All' || item.village === villageFilter;
      const matchesHamlet = hamletFilter === 'All' || item.hamlet === hamletFilter;
      return matchesSpaceType && matchesWard && matchesVillage && matchesHamlet;
    });
  }, [data, spaceTypeFilter, wardFilter, villageFilter, hamletFilter]);

  // Table Data (Always shows all data)
  const tableData = useMemo(() => data || [], [data]);

  // Calculate Statistics
  const totalHygieneFacilities = useMemo(() => {
    return filteredData.length;
  }, [filteredData]);

  const householdToiletsWithHygienePercentage = useMemo(() => {
    const household = filteredData.filter((item) => item.spaceType === 'Household');
    if (household.length === 0) return 0;
    const withHygiene = household.filter((item) =>
      item.handwashingMaterials.includes('Water Available') && item.handwashingMaterials.includes('Soap Available')
    ).length;
    return ((withHygiene / household.length) * 100).toFixed(1);
  }, [filteredData]);

  const schoolHygieneFacilityToStudentRatio = useMemo(() => {
    const schools = filteredData.filter((item) => item.spaceType === 'School');
    if (schools.length === 0) return 0;
    const withHygiene = schools.filter((item) =>
      item.handwashingMaterials.includes('Water Available') && item.handwashingMaterials.includes('Soap Available')
    ).length;
    return (withHygiene / schools.length).toFixed(2);
  }, [filteredData]);

  const functionalHygieneFacilitiesInHFPercentage = useMemo(() => {
    const healthFacilities = filteredData.filter((item) => item.spaceType === 'Health');
    if (healthFacilities.length === 0) return 0;
    const withHygiene = healthFacilities.filter((item) =>
      item.handwashingMaterials.includes('Water Available') && item.handwashingMaterials.includes('Soap Available')
    ).length;
    return ((withHygiene / healthFacilities.length) * 100).toFixed(1);
  }, [filteredData]);

  // Pie Chart Data for Hygiene Facility Types
  const hygieneDistributionData = useMemo(() => {
    const totals = filteredData.reduce(
      (acc, item) => {
        if (item.handwashingMaterials.includes('Water Available') && item.handwashingMaterials.includes('Soap Available')) {
          acc.waterAndSoap += 1;
        } else if (item.handwashingMaterials.includes('Water Available')) {
          acc.waterOnly += 1;
        } else if (item.handwashingMaterials.includes('Soap Available')) {
          acc.soapOnly += 1;
        } else {
          acc.withoutHygiene += 1;
        }
        return acc;
      },
      { withoutHygiene: 0, soapOnly: 0, waterOnly: 0, waterAndSoap: 0 }
    );
    return [
      { id: 0, label: 'Without Hygiene Facilities', value: totals.withoutHygiene, color: '#F44336' },
      { id: 1, label: 'With Soap Only', value: totals.soapOnly, color: '#FF9800' },
      { id: 2, label: 'With Water Only', value: totals.waterOnly, color: '#2196F3' },
      { id: 3, label: 'With Water & Soap', value: totals.waterAndSoap, color: '#4CAF50' },
    ];
  }, [filteredData]);

  // Bar Chart Data for Functional and Non-functional Facilities
  const functionalStatusChartData = useMemo(() => {
    const locations = ['Household', 'School', 'Health', 'Almajiri School'];
    return locations.map((location) => {
      const facilities = filteredData.filter((item) => item.spaceType === location);
      const functional = facilities.filter((item) =>
        item.handwashingMaterials.includes('Water Available') && item.handwashingMaterials.includes('Soap Available')
      ).length;
      const nonFunctional = facilities.length - functional;
      return { location, functional, nonFunctional };
    });
  }, [filteredData]);

  // TanStack Table Setup
  const columnHelper = createColumnHelper<typeof tableData[0]>();
  const columns = [
    columnHelper.accessor('picture', {
      header: 'Picture',
      cell: props => (
        <Avatar
          src={props.row.original.picture}
          alt="water source"
          sx={{
            borderRadius: '100%',
          }}
        />
      ),
    }),
      columnHelper.accessor('spaceType', {
      header: 'Space Type',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('handwashingMaterials', {
      header: 'Handwashing Materials',
      cell: (info) => info.getValue().join(', '),
    }),
    columnHelper.accessor('location', {
      header: 'Location',
      cell: (info) => info.getValue(),
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
  ];

  // Loading and Error States
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Error: {error.message}
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
            Hygiene Facilities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed insights about hygiene facilities in different locations
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 120 }}>
              <InputLabel>Space Type</InputLabel>
              <Select
                value={spaceTypeFilter}
                onChange={(e) => setSpaceTypeFilter(e.target.value)}
                label="Space Type"
                sx={{ height: 45 }}
              >
                {spaceTypeOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 120 }}>
              <InputLabel>Ward</InputLabel>
              <Select
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
                label="Ward"
                sx={{ height: 45 }}
              >
                {wardOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 120 }}>
              <InputLabel>Village</InputLabel>
              <Select
                value={villageFilter}
                onChange={(e) => setVillageFilter(e.target.value)}
                label="Village"
                sx={{ height: 45 }}
              >
                {villageOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 120 }}>
              <InputLabel>Hamlet</InputLabel>
              <Select
                value={hamletFilter}
                onChange={(e) => setHamletFilter(e.target.value)}
                label="Hamlet"
                sx={{ height: 45 }}
              >
                {hamletOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>
      </Box>
      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Hygiene Facilities"
            value={totalHygieneFacilities.toLocaleString()}
            icon={<FaHandHoldingWater style={{ color: '#2563EB', fontSize: '2rem' }} />}
            bgColor="#E3F2FD"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Household Toilets with Hygiene (%)"
            value={`${householdToiletsWithHygienePercentage}%`}
            icon={<FaHome style={{ color: '#4CAF50', fontSize: '2rem' }} />}
            bgColor="#E8F5E9"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="School Hygiene Facility-to-Student Ratio"
            value={schoolHygieneFacilityToStudentRatio}
            icon={<FaSchool style={{ color: '#FF9800', fontSize: '2rem' }} />}
            bgColor="#FFF3E0"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Functional Hygiene Facilities in HFs (%)"
            value={`${functionalHygieneFacilitiesInHFPercentage}%`}
            icon={<FaHospital style={{ color: '#0EA5E9', fontSize: '2rem' }} />}
            bgColor="#E3F2FD"
          />
        </Grid>
      </Grid>
      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" mb={2}>Hygiene Facility Types</Typography>
            <PieChart
              series={[{
                data: hygieneDistributionData,
                arcLabel: (item) => {
                  const total = hygieneDistributionData.reduce((sum, d) => sum + d.value, 0);
                  return `${((item.value / total) * 100).toFixed(1)}%`;
                },
                arcLabelMinAngle: 10,
                outerRadius: 150,
                innerRadius: 50,
              }]}
              width={Math.min(560, window.innerWidth - 40)}
              height={370}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fontWeight: 'bold',
                  fill: 'white',
                  fontSize: '0.8rem',
                },
              }}
              slotProps={{
                legend: {
                  direction: 'row',
                  position: { vertical: 'bottom', horizontal: 'middle' },
                  padding: 0,
                  labelStyle: { fontSize: '0.75rem' },
                },
              }}
            />
          </Card>
        </Grid>
        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" mb={2}>Functional Status of Facilities</Typography>
            <BarChart
              xAxis={[
                {
                  scaleType: 'band',
                  data: functionalStatusChartData.map((item) => item.location),
                },
              ]}
              series={[
                { 
                  data: functionalStatusChartData.map((item) => item.functional), 
                  label: 'Functional',
                  color: '#2196F3', // Blue for Functional
                },
                { 
                  data: functionalStatusChartData.map((item) => item.nonFunctional), 
                  label: 'Non-Functional',
                  color: '#F44336', // Red for Non-functional
                },
              ]}
              width={Math.min(600, window.innerWidth - 40)}
              height={400}
            />
          </Card>
        </Grid>
      </Grid>
      {/* Table Section */}
      <Card sx={{ mt: 3, boxShadow: 5 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Hygiene Facilities Overview</Typography>
          <Paper sx={{ overflowX: 'auto' }}>
            <DataTable
              columns={columns}
              data={tableData}
              pagination={pagination}
              onPaginationChange={handlePaginationChange}
              totalCount={tableData.length} // Replace with server-side total count if applicable
            />
          </Paper>
        </Box>
      </Card>
    </Box>
  );
};

export default HygieneFacilities;