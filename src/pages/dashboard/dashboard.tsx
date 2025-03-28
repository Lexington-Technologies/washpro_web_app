import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  FaToilet,
  FaTrash,
  FaWater,
  FaHome,
  FaSchool,
  FaCity,
} from 'react-icons/fa';
import { FaHandHoldingDroplet, FaHeartPulse, FaPoop } from 'react-icons/fa6';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { apiController } from '../../axios';

const Dashboard = () => {
  // Fetch data using react-query
  const { data, isLoading, error } = useQuery({
    queryFn: () => apiController.get('/analytics/dashboard'),
    queryKey: ['dashboard'],
  });

  const handWashData = useQuery({
    queryFn: () => apiController.get('/hand-washing'),
    queryKey: ['hand-washing'],
  });

  console.log(handWashData);



  // State for filters
  const [ward, setWard] = useState('All');
  const [village, setVillage] = useState('All');
  const [hamlet, setHamlet] = useState('All');

  // Loading and error states
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

  // Extract data from the API response
  const { filterOptions, washCards: apiWashCards, facilityCards: apiFacilityCards, waterAnalytics, sanitationAnalytics, populationAnalytics } = data;

  // Filter data based on selected filters
  const filterData = (data, filters) => {
    const { ward, village, hamlet } = filters;
    let filteredData = { ...data };

    // Filter by ward
    if (ward !== 'All') {
      filteredData = {
        ...filteredData,
        washCards: filteredData.washCards?.filter((card) => card.ward === ward) || [],
        facilityCards: filteredData.facilityCards?.filter((card) => card.ward === ward) || [],
        populationAnalytics: {
          ...filteredData.populationAnalytics,
          genderDistribution: filteredData.populationAnalytics?.genderDistribution?.filter((g) => g.ward === ward) || [],
        },
      };
    }

    // Filter by village
    if (village !== 'All') {
      filteredData = {
        ...filteredData,
        washCards: filteredData.washCards?.filter((card) => card.village === village) || [],
        facilityCards: filteredData.facilityCards?.filter((card) => card.village === village) || [],
        populationAnalytics: {
          ...filteredData.populationAnalytics,
          genderDistribution: filteredData.populationAnalytics?.genderDistribution?.filter((g) => g.village === village) || [],
        },
      };
    }

    // Filter by hamlet
    if (hamlet !== 'All') {
      filteredData = {
        ...filteredData,
        washCards: filteredData.washCards?.filter((card) => card.hamlet === hamlet) || [],
        facilityCards: filteredData.facilityCards?.filter((card) => card.hamlet === hamlet) || [],
        populationAnalytics: {
          ...filteredData.populationAnalytics,
          genderDistribution: filteredData.populationAnalytics?.genderDistribution?.filter((g) => g.hamlet === hamlet) || [],
        },
      };
    }

    return filteredData;
  };

  // Apply filters to the data
  const filteredData = filterData(data, { ward, village, hamlet });

  // Map filtered data to the expected format for cards
  const facilityCards = [
    { title: 'Total Water Sources', value: filteredData.facilityCards?.find((card) => card.name === 'Total Water Sources')?.count || 0, icon: <FaWater size={20} />, color: '#1976d2', bgColor: '#e3f2fd' },
    { title: 'Total Toilet Facilities', value: filteredData.facilityCards?.find((card) => card.name === 'Total Toilet Facilities')?.count || 0, icon: <FaToilet size={20} />, color: '#7b1fa2', bgColor: '#f3e5f5' },
    { title: 'Total Gutters', value: filteredData.facilityCards?.find((card) => card.name === 'Total Gutters')?.count || 0, icon: <FaWater size={20} />, color: '#2e7d32', bgColor: '#c8e6c9' },
    { title: 'Total Soakaways', value: filteredData.facilityCards?.find((card) => card.name === 'Total Soakaways')?.count || 0, icon: <FaWater size={20} />, color: '#e91e63', bgColor: '#f8bbd0' },
    { title: 'Total Dumpsites', value: filteredData.facilityCards?.find((card) => card.name === 'Total Dumpsites')?.count || 0, icon: <FaTrash size={20} />, color: '#ed6c02', bgColor: '#ffe0b2' },
    { title: 'Total Open Defecation Sites', value: filteredData.facilityCards?.find((card) => card.name === 'Total Open Defecation Sites')?.count || 0, icon: <FaPoop size={20} />, color: '#d32f2f', bgColor: '#ffcdd2' },
    { title: 'Total Handwashing Facilities', value: filteredData.facilityCards?.find((card) => card.name === 'Total Handwashing Facilities')?.count || 0, icon: <FaHandHoldingDroplet size={20} />, color: '#2196F3', bgColor: '#bbdefb' },
  ];

  const washCards = [
    { title: 'Total Households', value: filteredData.washCards?.find((card) => card.name === 'Total Households')?.count || 0, icon: <FaHome size={20} />, color: '#25306B', bgColor: '#e8eaf6' },
    { title: 'Total Schools', value: filteredData.washCards?.find((card) => card.name === 'Total Schools')?.count || 0, icon: <FaSchool size={20} />, color: '#25306B', bgColor: '#e8eaf6' },
    { title: 'Health Facilities', value: filteredData.washCards?.find((card) => card.name === 'Health Facilities')?.count || 0, icon: <FaHeartPulse size={20} />, color: '#25306B', bgColor: '#e8eaf6' },
    { title: 'Tsangaya', value: filteredData.washCards?.find((card) => card.name === 'Tsangaya')?.count || 0, icon: <FaCity size={20} />, color: '#25306B', bgColor: '#e8eaf6' },
  ];

  // Water Analytics Data
  const waterData = [
    { name: 'Functional', value: filteredData.waterAnalytics?.functionalSources || 0 },
    { name: 'Non-Functional', value: filteredData.waterAnalytics?.nonFunctionalSources || 0 },
  ];

  // Sanitation Analytics Data
  const sanitationData = [
    { name: 'Maintained Toilets', value: filteredData.sanitationAnalytics?.toilets?.maintained || 0 },
    { name: 'Unmaintained Toilets', value: filteredData.sanitationAnalytics?.toilets?.unmaintained || 0 },
    { name: 'Maintained Gutters', value: filteredData.sanitationAnalytics?.gutters?.maintained || 0 },
    { name: 'Unmaintained Gutters', value: filteredData.sanitationAnalytics?.gutters?.unmaintained || 0 },
    { name: 'Open Dumpsites', value: filteredData.sanitationAnalytics?.dumpSites?.fencingStatus?.find((f) => f.name === 'Open')?.count || 0 },
    { name: 'Closed Dumpsites', value: filteredData.sanitationAnalytics?.dumpSites?.fencingStatus?.find((f) => f.name === 'Close')?.count || 0 },
  ];

  // Population data for the pie chart
  const populationData = [
    { name: 'Male', value: filteredData.populationAnalytics?.genderDistribution?.find((g) => g.name === 'Male')?.count || 0 },
    { name: 'Female', value: filteredData.populationAnalytics?.genderDistribution?.find((g) => g.name === 'Female')?.count || 0 },
  ];

  // Colors for the pie chart segments
  const COLORS = ['#1e3a8a', '#38bdf8'];

  // Custom Tooltip for the charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ backgroundColor: 'white', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <Typography variant="body2">{`${payload[0].name}: ${payload[0].value}`}</Typography>
        </Box>
      );
    }
    return null;
  };

  // Filter dropdown component
  const FilterDropdown = ({ label, value, onChange, options }) => {
    return (
      <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 120 }}>
        <InputLabel>{label}</InputLabel>
        <Select value={value} onChange={onChange} label={label} sx={{ height: 45 }}>
          {options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 1 }}>
          Dashboard
          <Typography variant="subtitle1" color="text.secondary">
            Overview of water, sanitation and hygiene facilities and population
          </Typography>
        </Typography>

        {/* Filter Dropdowns */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <FilterDropdown
              label="Ward"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              options={filterOptions.Ward}
            />
            <FilterDropdown
              label="Village"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              options={filterOptions.Village}
            />
            <FilterDropdown
              label="Hamlet"
              value={hamlet}
              onChange={(e) => setHamlet(e.target.value)}
              options={filterOptions.Hamlet}
            />
          </Stack>
        </Box>
      </Box>

      {/* Facilities Captured Section */}
      <Typography variant="h5" component="h2" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 2 }}>
        Facilities Captured
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {facilityCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', backgroundColor: card.bgColor, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: card.color }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: 'white', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* WASH Facilities Overview */}
      <Typography variant="h5" component="h2" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 2 }}>
        WASH Facilities Overview
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {washCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', backgroundColor: card.bgColor, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: card.color }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: 'white', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section - Arranged Horizontally */}
      <Typography variant="h5" component="h2" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 2 }}>
        Analytics Overview
      </Typography>
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Water Analytics */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
                Functional vs. Non-Functional Water Sources
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={waterData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {waterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip active={undefined} payload={undefined} />} />
                    <Legend
                      align="right"
                      verticalAlign="middle"
                      layout="vertical"
                      iconSize={10}
                      iconType="circle"
                      formatter={(value) => <Typography variant="body2">{value}</Typography>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* sani */}

        {/* Sanitation Analytics */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
          Toilets and Gutters Maintenance
              </Typography>
              <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sanitationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip active={undefined} payload={undefined} />} />
              <Bar dataKey="value" fill="#1e3a8a" />
            </BarChart>
          </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Population Analytics */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
                Gender Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={populationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {populationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip active={undefined} payload={undefined} />} />
                    <Legend
                      align="right"
                      verticalAlign="middle"
                      layout="vertical"
                      iconSize={10}
                      iconType="circle"
                      formatter={(value) => <Typography variant="body2">{value}</Typography>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;