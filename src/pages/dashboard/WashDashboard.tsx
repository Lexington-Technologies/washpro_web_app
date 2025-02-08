import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tab,
  Tabs,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
} from '@mui/material';
import {
  WaterDrop,
  Sanitizer,
  DeleteOutline,
  Timeline,
  Refresh,
  PieChart,
} from '@mui/icons-material';
import { Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { apiController } from '../../axios';

// Constants
const FACILITY_CARDS = [
  { title: 'Water Sources', count: '1,666', percentage: 23.2, icon: WaterDrop, color: '#1976d2' },
  { title: 'Toilet Facilities', count: '2,124', percentage: 29.6, icon: Sanitizer, color: '#7b1fa2' },
  { title: 'Dump Sites', count: '1,459', percentage: 20.3, icon: DeleteOutline, color: '#ed6c02' },
];

const CHART_DATA = {
  waterSources: [
    { name: 'Hand Pump Borehole', value: 10.2, color: '#4caf50' },
    { name: 'Protected Dug Well', value: 5.5, color: '#ff9800' },
    { name: 'Unprotected Dug Well', value: 3.0, color: '#9c27b0' },
    { name: 'Motorized Borehole', value: 2.5, color: '#03a9f4' },
    { name: 'Pipe Born Water', value: 2.0, color: '#e91e63' },
  ],
};

// Styled Card Component
const StyledCard = ({ children, ...props }) => (
  <Card sx={{ borderRadius: 4, boxShadow: 2, p: 2 }} {...props}>
    {children}
  </Card>
);

// Facility Card Component
const FacilityCard = ({ title, count, percentage, icon: Icon, color }) => (
  <StyledCard>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box
          sx={{
            backgroundColor: alpha(color, 0.1),
            borderRadius: '12px',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{ color }} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {percentage}%
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
        {count}
      </Typography>
      <Typography color="text.secondary" variant="body2">
        {title}
      </Typography>
    </CardContent>
  </StyledCard>
);

// Pie Chart with Values Displayed
const FacilityPieChart = ({ title, data }) => (
  <StyledCard sx={{ textAlign: 'center', p: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      {title}
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  </StyledCard>
);

// Dropdown Component
const FilterDropdown = ({ label, options }) => {
  const [selectedOption, setSelectedOption] = useState('');

  return (
    <FormControl variant="outlined" sx={{ mb: 2, minWidth: 120 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} label={label}>
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Dashboard Component
const WashDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ['enumerator-performance'],
    queryFn: () => apiController.get(`/analytics/summary`),
  });

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ bgcolor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
          Analytics Dashboard
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="small" aria-label="refresh">
            <Refresh />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date().toLocaleString()}
          </Typography>
        </Stack>
      </Box>

      {/* Tabs */}
      <StyledCard>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} variant="scrollable">
          <Tab icon={<Timeline />} label="Facilities Overview" />
          <Tab icon={<PieChart />} label="Distribution Analysis" />
        </Tabs>
        <CardContent>
          {currentTab === 0 && (
            <Grid container spacing={3}>
              {FACILITY_CARDS.map((facility) => (
                <Grid item xs={12} sm={6} md={4} key={facility.title}>
                  <FacilityCard {...facility} />
                </Grid>
              ))}
            </Grid>
          )}
          {currentTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                <FilterDropdown label="Ward" options={['All']} />
                <FilterDropdown label="Village" options={['All']} />
                <FilterDropdown label="Hamlet" options={['All']} />
              </Grid>
              <Grid item xs={12} md={6}>
                <FacilityPieChart title="Water Source Types" data={CHART_DATA.waterSources} />
              </Grid>
            </Grid>
          )}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default WashDashboard; 