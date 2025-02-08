import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tab,
  Tabs,
  useTheme,
  IconButton,
  Stack,
  Chip,
  alpha,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  CircularProgress,
} from '@mui/material';
import {
  WaterDrop,
  Home,
  Sanitizer,
  DeleteOutline,
  Timeline,
  LocationOn,
  Refresh,
  TrendingUp,
  TrendingDown,
  PieChart,
} from '@mui/icons-material';
import { Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { apiController } from '../../axios';

const SUMMARY_DATA = [
  { label: 'Total Households', value: '2,178', icon: Home, trend: '+12%', isPositive: true },
  { label: 'Total Hamlet', value: '57', icon: LocationOn, trend: '+5%', isPositive: true },
  { label: 'Total Villages', value: '8', icon: LocationOn, trend: '-2%', isPositive: true },
  { label: 'Total Wards', value: '3', icon: LocationOn, trend: '0%', isPositive: true },
];

const FACILITY_CARDS = [
  { title: 'Water Sources', count: '1,666', percentage: '23.2%', icon: WaterDrop, color: '#1976d2' },
  { title: 'Toilet Facilities', count: '2,124', percentage: '29.6%', icon: Sanitizer, color: '#7b1fa2' },
  { title: 'Dump Sites', count: '1,459', percentage: '20.3%', icon: DeleteOutline, color: '#ed6c02' },
  { title: 'Gutters', count: '1,423', percentage: '19.8%', icon: Home, color: '#2e7d32' },
  { title: 'Soak Aways', count: '317', percentage: '4.4%', icon: Home, color: '#e91e63' },
  { title: 'Open Defecation Sites', count: '194', percentage: '2.7%', icon: LocationOn, color: '#d32f2f' },
];

const CHART_DATA = {
  waterSources: [
    { name: 'Hand Pump Borehole', value: 10.2, color: '#4caf50' },
    { name: 'Protected Dug Well', value: 5.5, color: '#ff9800' },
    { name: 'Unprotected Dug Well', value: 3.0, color: '#9c27b0' },
    { name: 'Motorized Borehole', value: 2.5, color: '#03a9f4' },
    { name: 'Pipe Born Water', value: 2.0, color: '#e91e63' },
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

// Styled Components
const StyledCard = ({ children, ...props }) => {
  return (
    <Card
      {...props}
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

const StatCard = ({ label, value, icon: Icon, trend, isPositive }) => {
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
          <Chip
            icon={isPositive ? <TrendingUp /> : <TrendingDown />}
            label={trend}
            size="small"
            color={isPositive ? 'success' : 'error'}
            sx={{ height: 24 }}
          />
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

const FacilityCard = ({ title, count, percentage, icon: Icon, color }) => {
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
          <Typography variant="body2" color="text.secondary">
            {percentage}
          </Typography>
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

// const DistributionCharts = () => {
//   const wardData = [
//     { name: 'S/GARI', value: 3272 },
//     { name: 'LIKORO', value: 3906 }
//   ];

//   const villageData = [
//     { name: 'SIGARIN LILUNKIYI', value: 1098 },
//     { name: 'LIKORO', value: 3210 },
//     { name: 'KYAUDAI', value: 230 },
//     { name: 'JAJA', value: 331 },
//     { name: 'S / GARIN LIKORO', value: 696 },
//     { name: 'MUSAWA', value: 992 },
//     { name: 'KAURAN WALI', value: 621 }
//   ];

//   return (
//     <Grid container spacing={3}>
//       <Grid item xs={12} md={6}>
//           <CardContent>
//             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//               Ward-wise Distribution
//             </Typography>
//             <Box sx={{ height: 400 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={wardData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis domain={[0, 4000]} />
//                   <Bar dataKey="value" fill="#4F98FF" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </Box>
//           </CardContent>
//       </Grid>
//       <Grid item xs={12} md={6}>
//           <CardContent>
//             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//               Village-wise Distribution
//             </Typography>
//             <Box sx={{ height: 400 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={villageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
//                   <YAxis domain={[0, 4000]} />
//                   <Bar dataKey="value" fill="#4F98FF" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </Box>
//           </CardContent>
//       </Grid>
//     </Grid>
//   );
// };

// Interfaces
// interface EnumeratorPerformance {
//   id: string;
//   name: string;
//   totalFacilities: number;
//   lastActive: string;
//   villages: string[];
//   facilities: {
//     waterSources: number;
//     toiletFacilities: number;
//     dumpSites: number;
//     gutters: number;
//     soakAways: number;
//     openDefecationSites: number;
//   };
// }

// Define your row shape
// const columnHelper = createColumnHelper<EnumeratorPerformance>();

// Make some columns!
// const columns = [
//   columnHelper.accessor('fullName', {
//     header: 'Enumerator',
//     cell: info => info.getValue(),
//   }),
//   columnHelper.accessor('totalRecords', {
//     header: 'Total',
//     cell: info => info.getValue(),
//   }),
//   columnHelper.accessor('waterSources', {
//     header: 'W/s',
//     cell: info => info.getValue(),
//   }),
//   columnHelper.accessor('openDefecation', {
//     header: 'Odf',
//     cell: info => info.getValue(),
//   }),
//   columnHelper.accessor('soakAways', {
//     header: 'SoakAways',
//     cell: info => info.getValue(),
//   }),
//   columnHelper.accessor('toiletFacilities', {
//     header: 'ToiletFacilities',
//     cell: info => info.getValue(),
//   }),
//   columnHelper.accessor('dumpSites', {
//     header: 'DumpSites',
//     cell: info => info.getValue(),
//   }),
//   columnHelper.accessor('gutters', {
//     header: 'Gutters',
//     cell: info => info.getValue(),
//   }),
//   columnHelper.accessor('lastLogin', {
//     header: 'Last Active',
//     cell: info => new Date(info.getValue() as string).toLocaleString(),
//   }),
// ];

// Main Dashboard Component
const WashDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (e, newValue) => {
    setCurrentTab(newValue);
  };

  const { data, isLoading } = useQuery<[], Error>({
    queryKey: ['enumerator-performance'],
    queryFn: () => apiController.get(`/analytics/summary`),
  });

  // const enumrators = data?.enumarators;
  console.log("enu", data);


  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;

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

      {/* Main Content */}
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
              <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                <FilterDropdown label="Ward" options={['All']} />
                <FilterDropdown label="Village" options={['All']} />
                <FilterDropdown label="Hamlet" options={['All']} />
              </Grid>
              </Box>
              <Grid container spacing={3}>
                {FACILITY_CARDS.map((facility) => (
                  <Grid item xs={12} sm={6} md={4} key={facility.title}>
                    <FacilityCard {...facility} />
                  </Grid>
                ))}
              </Grid>
              {/* <Box sx={{ mt: 15 }}>
                <FacilityBarChart />
              </Box> */}
            </>
          )}
          {currentTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                <FilterDropdown label="Ward" options={['All']} />
                <FilterDropdown label="Village" options={['All']} />
                <FilterDropdown label="Hamlet" options={['All']} />
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
          {/* {currentTab === 3 && (
            <Card sx={{ mt: 3, boxShadow: 1 }}>
                <DataTable setSearch={setSearch} setPage={setPage} setLimit={setLimit} isLoading={isLoading} columns={columns} data={data?.enumerators || []} />
            </Card>
          )} */}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default WashDashboard;