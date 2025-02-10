import {
  DeleteOutline,
  Group,
  Home,
  Landscape,
  LocationOn,
  PieChart,
  Refresh,
  Sanitizer,
  Timeline,
  WaterDrop
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  Tab,
  Tabs,
  Typography,
  useTheme
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { apiController } from '../../axios';

// Constants

const FACILITY_DATA = [
  { name: 'Water Sources', count: 1666 },
  { name: 'Toilet Facilities', count: 2124 },
  { name: 'Dump Sites', count: 1459 },
  { name: 'Gutters', count: 1423 },
  { name: 'Soak Aways', count: 317 },
  { name: 'Open Defecation', count: 194 },
];

// Styled Components
const StyledCard = ({ children, ...props }) => {
  const theme = useTheme();
  return (
    <Card
      {...props}
      sx={{
        height: '100%',
        boxShadow: theme.shadows[2],
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
        },
        ...props.sx,
      }}
    >
      {children}
    </Card>
  );
};

const ProfessionalCard = styled(Card)(({ theme }) => ({
  borderRadius: 4,
  boxShadow: theme.shadows[1],
}));

const ChartCard = ({ children }) => (
  <ProfessionalCard sx={{ p: 3, mt: 3 }}>
    {children}
  </ProfessionalCard>
);

const StatCard = ({ label, value, icon: Icon }) => {
  const theme = useTheme();

  return (
    <StyledCard>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: '12px',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ color: theme.palette.primary.main }} />
          </Box>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {value}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {label}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

const FacilityCard = ({ title, count, icon: Icon, color }) => {
  return (
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
          {/* <Typography variant="body2" color="text.secondary">
            {percentage}
          </Typography> */}
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {count}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

const FilterDropdown = ({ label, options }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 120 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={selectedOption} onChange={handleChange} label={label} sx={{ height: 45 }}>
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const FacilityBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={FACILITY_DATA}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#1976d2" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const FacilityPieChart = ({ title, data }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </Box>
  );
};

const DistributionCharts = () => {
  const wardData = [
    { name: 'S/GARI', value: 3272 },
    { name: 'LIKORO', value: 3906 }
  ];

  const villageData = [
    { name: 'SIGARIN LILUNKIYI', value: 1098 },
    { name: 'LIKORO', value: 3210 },
    { name: 'KYAUDAI', value: 230 },
    { name: 'JAJA', value: 331 },
    { name: 'S / GARIN LIKORO', value: 696 },
    { name: 'MUSAWA', value: 992 },
    { name: 'KAURAN WALI', value: 621 }
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Ward-wise Distribution
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wardData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 4000]} />
                  <Bar dataKey="value" fill="#4F98FF" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
      </Grid>
      <Grid item xs={12} md={6}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Village-wise Distribution
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={villageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 4000]} />
                  <Bar dataKey="value" fill="#4F98FF" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
      </Grid>
    </Grid>
  );
};

// Main Dashboard Component
const WashDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const handleTabChange = (e, newValue) => {
    setCurrentTab(newValue);
  };

  const { data: houseHolds, isLoading: houseLoading } = useQuery({
    queryKey: ['households'],
    queryFn: () => apiController.get(`/households`),
  });

  const { data: waterSource, isLoading: waterLoading } = useQuery({
    queryKey: ['waterSource'],
    queryFn: () => apiController.get(`/water-sources`),
  });

  const { data: toiletFacilities, isLoading: toiletLoading } = useQuery({
    queryKey: ['toiletFacilities'],
    queryFn: () => apiController.get(`/toilet-facilities`),
  });

  const { data: dumpSites, isLoading: dumpLoading } = useQuery({
    queryKey: ['dumpSites'],
    queryFn: () => apiController.get(`/dump-sites`),
  });

  const { data: gutters, isLoading: guttLoading } = useQuery({
    queryKey: ['gutters'],
    queryFn: () => apiController.get(`/gutters`),
  });

  const { data: soakAways , isLoading: soakLoading} = useQuery({
    queryKey: ['soakAways'],
    queryFn: () => apiController.get(`/soak-aways`),
  });

  const { data: openDefecations, isLoading: openLoading } = useQuery({
    queryKey: ['openDefecations'],
    queryFn: () => apiController.get(`/open-defecations`),
  });

  const countByProperties = (data, filters) => {
    if (!data) return 0;

    return data.filter(item =>
      filters.every(filter => item[filter.property] === filter.value)
    ).length;
  };

  const SUMMARY_DATA = [
    {
      label: 'Total Households',
      value: houseHolds?.length,
      icon: Home
    },
    { label: 'Total Hamlets', value: '57', icon: Group },
    { label: 'Total Villages', value: '8', icon: Landscape},
    { label: 'Total Wards', value: '3', icon: LocationOn },
  ];

  const FACILITY_CARDS = [
    { title: 'Water Sources', count: waterSource?.length, icon: WaterDrop, color: '#1976d2' },
    { title: 'Toilet Facilities', count: toiletFacilities?.length, icon: Sanitizer, color: '#7b1fa2' },
    { title: 'Dump Sites', count: dumpSites?.length, icon: DeleteOutline, color: '#ed6c02' },
    { title: 'Gutters', count: gutters?.length, icon: Home, color: '#2e7d32' },
    { title: 'Soak Aways', count: soakAways?.length, icon: Home, color: '#e91e63' },
    { title: 'Open Defecation Sites', count: openDefecations?.length, icon: LocationOn, color: '#d32f2f' },
  ];

  const CHART_DATA = {
    waterSources: [
      {
        name: 'Hand Pump Borehole',
        value: countByProperties(waterSource, [
          { property: 'type', value: 'Hand Pump Boreholes' }
        ]),
        color: '#4caf50'
      },
      {
        name: 'Protected Dug Well',
        value: countByProperties(waterSource, [
          { property: 'type', value: 'Protected Dug Wells' }
        ]),
        color: '#ff9800'
      },
      {
        name: 'Unprotected Dug Well',
        value: countByProperties(waterSource, [
          { property: 'type', value: 'Unprotected Dug Wells' }
        ]),
        color: '#9c27b0'
      },
      {
        name: 'Motorized Borehole',
        value: countByProperties(waterSource, [
          { property: 'type', value: 'Motorized Boreholes' }
        ]),
        color: '#03a9f4'
      },
    ],
    waterSourceConditions: [
      { name: 'Functional', value: 18.0, color: '#4caf50' },
      { name: 'Non-Functional', value: 5.2, color: '#f44336' },
    ],
    toiletFacilities: [
      { name: 'Pit Latrine', value: 15.0, color: '#4caf50' },
      { name: 'WC Squatting', value: 8.0, color: '#ff9800' },
      { name: 'WC Sitting', value: 6.6, color: '#9c27b0' },
    ],
    toiletConditions: [
      { name: 'Improved', value: 18.0, color: '#4caf50' },
      { name: 'With Hand Wash', value: 5.2, color: '#f44336' },
      { name: 'Basic', value: 5.2, color: '#ff9800' },
    ],
    dumpsiteStatus: [
      { name: 'Maintained', value: 18.0, color: '#4caf50' },
      { name: 'Needs Evacuation', value: 5.2, color: '#f44336' },
    ],
    gutterCondition: [
      { name: 'Clean', value: 18.0, color: '#4caf50' },
      { name: 'Blocked', value: 5.2, color: '#f44336' },
    ],
    soakawayCondition: [
      { name: 'Functional', value: 18.0, color: '#4caf50' },
      { name: 'Non-Functional', value: 5.2, color: '#f44336' },
    ],
    openDefecationStatus: [
      { name: 'Active', value: 18.0, color: '#4caf50' },
      { name: 'Inactive', value: 5.2, color: '#f44336' },
    ],
  };

  if (houseLoading || waterLoading || toiletLoading || dumpLoading || guttLoading|| openLoading || soakLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ bgcolor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive WASH facilities overview
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="small" aria-label="refresh">
            <Refresh />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date().toLocaleString()}
          </Typography>
        </Stack>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {SUMMARY_DATA.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

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

            <Tab icon={<Timeline />} label="Facilities Overview" iconPosition="start" key="Facilities Overview" />
            <Tab icon={<PieChart />} label="Distribution Analysis" iconPosition="start" key="Distribution Analysis" />
            {/* <Tab icon={<LocationOn />} label="Geographic Analysis" iconPosition="start" key="Geographic Analysis" /> */}
            {/* <Tab icon={<Assessment />} label="Enumerator Performance" iconPosition="start" key="Enumerator Performance" /> */}
          </Tabs>
        </Box>

        <CardContent>
          {currentTab === 0 && (
            <>
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2}>
                  <FilterDropdown label="Ward" options={['All', 'Ward 1', 'Ward 2', 'Ward 3']} />
                  <FilterDropdown label="Village" options={['All', 'Village 1', 'Village 2']} />
                  <FilterDropdown label="Hamlet" options={['All', 'Hamlet 1', 'Hamlet 2']} />
                </Stack>
              </Box>

              <Grid container spacing={3}>
                {FACILITY_CARDS.map((facility) => (
                <Grid item xs={12} sm={6} md={4} key={facility.title}>
                  <FacilityCard {...facility} />
                </Grid>
              ))}
              </Grid>
            </>
          )}
          {currentTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                <FilterDropdown label="Ward" options={['Option 1', 'Option 2', 'Option 3']} />
                <FilterDropdown label="Village" options={['Option 1', 'Option 2', 'Option 3']} />
                <FilterDropdown label="Hamlet" options={['Option 1', 'Option 2', 'Option 3']} />
              </Grid>

              <Grid item xs={12} md={6}>
                <ChartCard>
                  <FacilityPieChart title="Water Source Types" data={CHART_DATA.waterSources} />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <FacilityPieChart title="Water Source Conditions" data={CHART_DATA.waterSourceConditions} />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <FacilityPieChart title="Toilet Facility Types" data={CHART_DATA.toiletFacilities} />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <FacilityPieChart title="Toilet Facility Conditions" data={CHART_DATA.toiletConditions} />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <FacilityPieChart title="Dumpsite by Status" data={CHART_DATA.dumpsiteStatus} />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <FacilityPieChart title="Gutter by Condition" data={CHART_DATA.gutterCondition} />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <FacilityPieChart title="Soakaway by Condition" data={CHART_DATA.soakawayCondition} />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <FacilityPieChart title="Open Defecation by Status" data={CHART_DATA.openDefecationStatus} />
                </ChartCard>
              </Grid>
            </Grid>
          )}
          {/* {currentTab === 2 &&
            <DistributionCharts />
          } */}
        </CardContent>
      </StyledCard>

    </Box>
  );
};

export default WashDashboard;