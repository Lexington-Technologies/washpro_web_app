import {
  AccessibilityNew,
  AttachMoney,
  Category,
  DeleteOutline,
  Group,
  Home,
  Inventory,
  Landscape,
  LocalHospital,
  LocalShipping,
  LocationOn,
  People,
  Refresh,
  Sanitizer,
  School,
  ShoppingCart,
  Timeline,
  WaterDrop
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FaChartArea } from "react-icons/fa6";
import { LiaPoopSolid } from "react-icons/lia";
import { MdCleanHands } from "react-icons/md";
import { SiCcleaner } from "react-icons/si";
import { apiController } from '../../axios';
import StatsCard from '../../components/StatsCard';

const data = [
  { id: 0, value: 10, label: 'Category A' },
  { id: 1, value: 15, label: 'Category B' },
  { id: 2, value: 20, label: 'Category C' },
];

const cardData1 = [
  { icon: ShoppingCart, title: 'Total Sales', value: '$12,345', iconColor: '#3f51b5', bgColor: '#3f51b5' },
  { icon: People, title: 'Total Users', value: '1,234', iconColor: '#e91e63', bgColor: '#e91e63' },
  { icon: AttachMoney, title: 'Revenue', value: '$45,678', iconColor: '#4caf50', bgColor: '#4caf50' },
];

const cardData2 = [
  { icon: Inventory, title: 'Inventory', value: '456', iconColor: '#9c27b0', bgColor: '#9c27b0' },
  { icon: LocalShipping, title: 'Shipments', value: '78', iconColor: '#2196f3', bgColor: '#2196f3' },
  { icon: Category, title: 'Categories', value: '15', iconColor: '#f44336', bgColor: '#f44336' },
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
        ...props.sx,
      }}
    >
      {children}
    </Card>
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

interface Filter {
  property: string; // The property to filter by
  value: string | number;       // The value to compare against
}

// Main Dashboard Component
const WashDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (e, newValue) => {
    setCurrentTab(newValue);
  };

  const { data: analysis} = useQuery({
    queryKey: ['analysis'],
    queryFn: () => apiController.get(`/analysis`),
  });

  console.log("analysis", analysis);


  const { data: houseHolds, isLoading: houseLoading } = useQuery({
    queryKey: ['households'],
    queryFn: () => apiController.get(`/households`),
  });

  const { data: waterSource } = useQuery({
    queryKey: ['waterSource'],
    queryFn: () => apiController.get(`/water-sources`),
  });

  const { data: toiletFacilities } = useQuery({
    queryKey: ['toiletFacilities'],
    queryFn: () => apiController.get(`/toilet-facilities`),
  });

  const { data: dumpSites } = useQuery({
    queryKey: ['dumpSites'],
    queryFn: () => apiController.get(`/dump-sites`),
  });

  const { data: gutters } = useQuery({
    queryKey: ['gutters'],
    queryFn: () => apiController.get(`/gutters`),
  });

  const { data: soakAways} = useQuery({
    queryKey: ['soakAways'],
    queryFn: () => apiController.get(`/soak-aways`),
  });

  const { data: openDefecations } = useQuery({
    queryKey: ['openDefecations'],
    queryFn: () => apiController.get(`/open-defecations`),
  });

  const countByProperties = <T extends Record<string, string | number>>(
    data: T[] | null | undefined,
    filters: Filter[]
  ): number => {
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
    {
      label: 'Population using improved water source within 500m',
      value: '85%',
      icon: WaterDrop,
      color: '#d32f2f'
    },
    {
      label: 'Schools with improved water source on-premises',
      value: '72%',
      icon: School,
      color: '#d32f2f'
    },
    {
      label: 'Health facilities with improved water sources',
      value: '68%',
      icon: LocalHospital,
      color: '#d32f2f'
    },
    {
      label: 'Almajiri schools with improved water source',
      value: '45%',
      icon: School,
      color: '#d32f2f'
    }
  ];

  const SANITATION = [
    {
      label: 'Households with improved non-shared latrines',
      value: '60%',
      icon: Home,
      color: '#d32f2f'
    },
    {
      label: 'Schools with basic sanitation facilities',
      value: '55%',
      icon: School,
      color: '#d32f2f'
    },
    {
      label: 'Ratio of functional school latrines to students',
      value: '1:50',
      icon: AccessibilityNew,
      color: '#d32f2f'
    },
  ];

  const SANITATION2 = [
    {
      label: 'Health facilities with improved sanitation',
      value: '70%',
      icon: LocalHospital,
      color: '#d32f2f'
    },
    {
      label: 'Almajiri schools with basic sanitation',
      value: '40%',
      icon: School,
      color: '#d32f2f'
    },
    {
      label: 'Almajiri students per functional latrine',
      value: '1:75',
      icon: AccessibilityNew,
      color: '#d32f2f'
    },
  ];

  const HYGIENE = [
    {
      label: 'Households with basic handwashing facilities',
      value: '65%',
      icon: Sanitizer,
      color: '#d32f2f'
    },
    {
      label: 'Schools with basic handwashing facilities',
      value: '58%',
      icon: School,
      color: '#d32f2f'
    },
    {
      label: 'Health facilities with basic handwashing',
      value: '75%',
      icon: LocalHospital,
      color: '#d32f2f'
    },
    {
      label: 'Almajiri schools with basic handwashing',
      value: '35%',
      icon: School,
      color: '#d32f2f'
    },
  ];

  const ODF = [
    {
      label: 'Open Defication Free communities',
      value: '80%',
      icon: Home,
      color: '#d32f2f'
    },
    {
      label: 'Communities regressed from ODF status',
      value: '10%',
      icon: Home,
      color: '#d32f2f'
    },
  ];

  const FACILITY_CARDS = [
    { label: 'Water Sources', value: waterSource?.length, icon: WaterDrop, color: '#1976d2' },
    { label: 'Toilet Facilities', value: toiletFacilities?.length, icon: Sanitizer, color: '#7b1fa2' },
    { label: 'Dump Sites', value: dumpSites?.length, icon: DeleteOutline, color: '#ed6c02' },
    { label: 'Gutters', value: gutters?.length, icon: Home, color: '#2e7d32' },
    { label: 'Soak Aways', value: soakAways?.length, icon: Home, color: '#e91e63' },
    { label: 'Open Defecation Sites', value: openDefecations?.length, icon: LocationOn, color: '#d32f2f' },
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

  if (houseLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;

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
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {SUMMARY_DATA.map(({ label, value, icon}, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard title={label} value={value} icon={icon} />
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
            <Tab icon={<FaChartArea />} label="Distribution Analysis" iconPosition="start" key="Distribution Analysis" />
            <Tab icon={<SiCcleaner />} label="Sanitation Overview" iconPosition="start" key="Sanitation" />
            <Tab icon={<MdCleanHands style={{fontSize: 15}} />} label="Hygiene" iconPosition="start" key="Hygiene" />
            <Tab icon={<LiaPoopSolid />} label="Open Defecation" iconPosition="start" key="Open Defecation" />
          </Tabs>
        </Box>

        <CardContent>
          {currentTab === 0 && (
            <>
              <Box>
                <Grid container spacing={3}>
                  {FACILITY_CARDS.map(({ label, value, icon, color}, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <StatsCard
                        title={label}
                        value={value}
                        icon={icon}
                        iconColor={color}
                        bgColor={color}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          )}
          {currentTab === 1 && (
            <Grid container spacing={3}>
              <Box sx={{padding: 3}}>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" mb={2}>Toilet Facility Types</Typography>
                    <PieChart
                      series={[
                        {
                          arcLabel: (item) => `${item.value}%`,
                          arcLabelMinAngle: 30,
                          arcLabelRadius: '50%',
                          data: [
                            { id: 0, value: 10, label: 'series A' },
                            { id: 1, value: 15, label: 'series B' },
                            { id: 2, value: 20, label: 'series C' },
                            { id: 3, value: 15, label: 'series D' },
                            { id: 4, value: 20, label: 'series F' },
                            { id: 5, value: 15, label: 'series G' }
                          ],
                          // innerRadius: 5,
                          outerRadius: 140,
                          // paddingAngle: 3,
                          // cornerRadius: 5,
                        }
                      ]}
                      width={500}
                      height={350}
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
                          arcLabel: (item) => `${item.value}`,
                          arcLabelMinAngle: 35,
                          arcLabelRadius: '60%',
                          data: [
                            { id: 0, value: 10, label: 'series A' },
                            { id: 1, value: 15, label: 'series B' },
                            { id: 2, value: 20, label: 'series C' }
                          ],
                          innerRadius: 10,
                          outerRadius: 140,
                          paddingAngle: 0,
                          cornerRadius: 0,
                          startAngle: -45,
                          endAngle: 225,
                        }
                      ]}
                      width={550}
                      height={350}
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

              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" mb={2}>Toilet Facility Types</Typography>
                    <BarChart
                      xAxis={[{
                        scaleType: 'band',
                        data: ['group A', 'group B', 'group C'],
                      }]}
                      series={[
                        { data: [4, 3, 5], label: 'Part 1' },
                        { data: [1, 6, 3], label: 'Part 2' },
                        { data: [2, 5, 6], label: 'Part 3' }]}
                      width={600}
                      height={350}
                      borderRadius={7}
                      barLabel="value"
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" mb={2}>Hand Washing Facility</Typography>
                    <PieChart
                      series={[
                        {
                          arcLabel: (item) => `${item.value}`,
                          arcLabelMinAngle: 35,
                          arcLabelRadius: '60%',
                          data: [
                            { id: 0, value: 10, label: 'series A' },
                            { id: 1, value: 15, label: 'series B' },
                            { id: 2, value: 20, label: 'series C' }
                          ],
                          innerRadius: 0,
                          outerRadius: 140,
                          paddingAngle: 0,
                          cornerRadius: 0,
                        }
                      ]}
                      width={550}
                      height={350}
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
              </Box>

            </Grid>
          )}
          {currentTab === 2 && (
          <Box>
              <Box display="flex" p={4}>
                {/* Pie Chart on the Left */}
                <Box flex={1.5} pr={2}>
                  {/* <Typography variant="h6">
                    Sales Distribution
                  </Typography> */}
                  <PieChart
                    series={[
                      {
                        data,
                        innerRadius: 0,
                        outerRadius: 140
                      },
                    ]}
                    width={460}
                    height={350}
                  />
                </Box>

                {/* Two Stacks of Cards on the Right */}
                <Box flex={2} display="flex" pl={2}>
                  {/* First Stack of Cards */}
                  <Box flex={1} pr={1}>
                    <Stack spacing={2}>
                      {SANITATION.map((card, index) => (
                        <StatsCard
                          key={index}
                          title={card.label}
                          value={card.value}
                          icon={card.icon}
                          iconColor={card.color}
                          bgColor={card.color}
                        />
                      ))}
                    </Stack>
                  </Box>

                  {/* Second Stack of Cards */}
                  <Box flex={1} pl={1}>
                    <Stack spacing={2}>
                      {SANITATION2.map((card, index) => (
                        <StatsCard
                          key={index}
                          title={card.label}
                          value={card.value}
                          icon={card.icon}
                          iconColor={card.color}
                          bgColor={card.color}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Box>
              </Box>
          </Box>
          )}
          {currentTab === 3 && (
          <Box>
            <Grid container spacing={3}>
            {HYGIENE.map(({ label, value, icon, color}, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatsCard title={label} value={value} icon={icon} iconColor={color} bgColor={color} />
              </Grid>
            ))}
            </Grid>
          </Box>
          )}
          {currentTab === 4 && (
          <Box>
            <Grid container spacing={3}>
              {ODF.map(({ label, value, icon, color}, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <StatsCard title={label} value={value} icon={icon} iconColor={color} bgColor={color} />
                </Grid>
              ))}
            </Grid>
          </Box>
          )}
        </CardContent>
      </StyledCard>

    </Box>
  );
};

export default WashDashboard;