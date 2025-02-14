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
  InputLabel,
  MenuItem,
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
import { IoWater } from "react-icons/io5";
import { LiaPoopSolid } from "react-icons/lia";
import { MdCleanHands } from "react-icons/md";
import { SiCcleaner } from "react-icons/si";
import { apiController } from '../../axios';
import StatsCard from '../../components/StatsCard';


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


  const SUMMARY_DATA = [
    {
      label: 'Total Households',
      value: houseHolds?.length,
      icon: Home,
      iconColor: '#25306B', // Add icon color
      bgColor: '#fff',   // Add background color
    },
    {
      label: 'Total Hamlets',
      value: '57',
      icon: Group,
      iconColor: '#25306B', // Add icon color
      bgColor: '#fff',   // Add background color
    },
    {
      label: 'Total Villages',
      value: '8',
      icon: Landscape,
      iconColor: '#25306B', // Add icon color
      bgColor: '#fff',   // Add background color
    },
    {
      label: 'Total Wards',
      value: '3',
      icon: LocationOn,
      iconColor: '#25306B', // Add icon color
      bgColor: '#fff',   // Add background color
    },
  ];
  const WATER = [
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
          <Box sx={{ mb: 1 }}>
            <Stack direction="row" spacing={2}>
              <FilterDropdown
                label="Ward"
                options={['All']}
              />
              <FilterDropdown
                label="Village"
                options={['All']}
              />
              <FilterDropdown
                label="Hamlet"
                options={['All']}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {SUMMARY_DATA.map(({ label, value, icon, iconColor, bgColor }, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard
              title={label}
              value={value}
              icon={icon}
              iconColor={iconColor} // Pass icon color
              bgColor={bgColor}     // Pass background color
            />
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
            {/* <Tab icon={<FaChartArea />} label="Distribution Analysis" iconPosition="start" key="Distribution Analysis" /> */}
            <Tab icon={<IoWater />} label="Water Source Overview" iconPosition="start" key="Water Source Overview" />
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
          {/* {currentTab === 1 && (
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
          )} */}
          {currentTab === 1 && (
            <Box>
            <Grid container spacing={3}>
              {WATER.map(({ label, value}, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <StatsCard
                    key={index}
                    title={label}
                    value={value}
                    icon={WaterDrop}
                    iconColor={'#1976d2'}
                    bgColor={'#1976d2'}
                  />
                </Grid>
              ))}
            </Grid>
            <Grid container spacing={3} mb={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {/* <Paper sx={{ p: 2, mt: 3, width: "100%", maxWidth: 600, textAlign: "center" }}> */}
                  {/* <Typography variant="h6" mb={2}>Toilet Facility Types</Typography> */}
                  <PieChart
                    series={[{
                      arcLabel: (item) => `${item.value}%`,
                      arcLabelMinAngle: 30,
                      arcLabelRadius: '50%',
                      data: [
                        { id: 0, value: 10, label: 'Household' },
                        { id: 1, value: 15, label: 'Schools' },
                        { id: 2, value: 20, label: 'Health' },
                        { id: 3, value: 15, label: 'Almajiri' }
                      ],
                      outerRadius: 140,
                    }]}
                    width={500}
                    height={350}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fontWeight: 'bold',
                        fill: 'white',
                      },
                    }}
                  />
                {/* </Paper> */}
              </Grid>
            </Grid>

        </Box>
          )}
          {currentTab === 2 && (
            <Box>
              <Grid container spacing={3}>
                {SANITATION.map(({ label, value}, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <StatsCard
                      key={index}
                      title={label}
                      value={value}
                      icon={SiCcleaner}
                      iconColor={'#7b1fa2'}
                      bgColor={'#7b1fa2'}
                    />
                  </Grid>
                ))}
                {SANITATION2.map(({ label, value}, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <StatsCard
                      key={index}
                      title={label}
                      value={value}
                      icon={SiCcleaner}
                      iconColor={'#7b1fa2'}
                      bgColor={'#7b1fa2'}
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid container spacing={3} mb={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 4 }}>
              <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <BarChart
                  xAxis={[{
                    scaleType: 'band',
                    data: ['Households', 'Schools', 'Health facilities', 'Almajiri'],
                  }]}
                    series={[
                      {
                    data: [4, 3, 5, 10],
                    label: 'Improved',
                    color: '#4CAF50', // Green color for Improved
                  },
                  {
                    data: [1, 6, 3, 6],
                    label: 'Unimproved',
                    color: '#F44336', // Red color for Unimproved
                  },
                  ]}
                  width={900}
                  height={350}
                  borderRadius={7}
                  barLabel="value"
                />
              </Grid>
            </Grid>
          </Box>
          )}
          {currentTab === 3 && (
          <Box>
            <Grid container spacing={3}>
            {HYGIENE.map(({ label, value, icon}, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatsCard title={label} value={value} icon={icon} iconColor={'#e91e63'} bgColor={'#e91e63'} />
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