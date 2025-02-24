import {
  DeleteOutline,
  Group,
  Home,
  Landscape,
  LocationOn,
  Sanitizer,
  Timeline,
  WaterDrop,
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
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { IoWater } from 'react-icons/io5';
import { apiController } from '../../axios';
import StatsCard from '../../components/StatsCard';

// Styled Components
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

// Main Dashboard Component
const WashDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');

  const handleTabChange = (e, newValue) => {
    setCurrentTab(newValue);
  };

  // Fetch all data once (without filters)
  const { data: waterSource, isLoading: isWaterSourceLoading } = useQuery({
    queryKey: ['waterSource'],
    queryFn: () => apiController.get('/water-sources'),
  });

  const { data: toiletFacilities, isLoading: isToiletFacilitiesLoading } = useQuery({
    queryKey: ['toiletFacilities'],
    queryFn: () => apiController.get('/toilet-facilities'),
  });

  const { data: dumpSite, isLoading: isDumpSitesLoading } = useQuery({
    queryKey: ['dumpSites'],
    queryFn: () => apiController.get('/dump-sites'),
  });

  const { data: gutters, isLoading: isGuttersLoading } = useQuery({
    queryKey: ['gutters'],
    queryFn: () => apiController.get('/gutters'),
  });

  const { data: soakAways, isLoading: isSoakAwaysLoading } = useQuery({
    queryKey: ['soakAways'],
    queryFn: () => apiController.get('/soak-aways'),
  });

  const { data: openDefecations, isLoading: isOpenDefecationsLoading } = useQuery({
    queryKey: ['openDefecations'],
    queryFn: () => apiController.get('/open-defecations'),
  });

  // Generate filter options
  const wardOptions = useMemo(() => [...new Set(waterSource?.map((item) => item?.ward) || [])], [waterSource]);
  const villageOptions = useMemo(() => [...new Set(waterSource?.map((item) => item?.village) || [])], [waterSource]);
  const hamletOptions = useMemo(() => [...new Set(waterSource?.map((item) => item?.hamlet) || [])], [waterSource]);

  // Client-side filtering using useMemo
  const filteredWaterSource = useMemo(() => {
    if (!waterSource) return [];
    return waterSource.filter(
      (item) =>
        (!ward || item.ward === ward) &&
        (!village || item.village === village) &&
        (!hamlet || item.hamlet === hamlet)
    );
  }, [waterSource, ward, village, hamlet]);

  const filteredToiletFacilities = useMemo(() => {
    if (!toiletFacilities) return [];
    return toiletFacilities.filter(
      (item) =>
        (!ward || item.ward === ward) &&
        (!village || item.village === village) &&
        (!hamlet || item.hamlet === hamlet)
    );
  }, [toiletFacilities, ward, village, hamlet]);

  const filteredDumpSites = useMemo(() => {
    if (!dumpSite) return [];
    return dumpSite.filter(
      (item) =>
        (!ward || item.ward === ward) &&
        (!village || item.village === village) &&
        (!hamlet || item.hamlet === hamlet)
    );
  }, [dumpSite, ward, village, hamlet]);

  const filteredGutters = useMemo(() => {
    if (!gutters) return [];
    return gutters.filter(
      (item) =>
        (!ward || item.ward === ward) &&
        (!village || item.village === village) &&
        (!hamlet || item.hamlet === hamlet)
    );
  }, [gutters, ward, village, hamlet]);

  const filteredSoakAways = useMemo(() => {
    if (!soakAways) return [];
    return soakAways.filter(
      (item) =>
        (!ward || item.ward === ward) &&
        (!village || item.village === village) &&
        (!hamlet || item.hamlet === hamlet)
    );
  }, [soakAways, ward, village, hamlet]);

  const filteredOpenDefecations = useMemo(() => {
    if (!openDefecations) return [];
    return openDefecations.filter(
      (item) =>
        (!ward || item.ward === ward) &&
        (!village || item.village === village) &&
        (!hamlet || item.hamlet === hamlet)
    );
  }, [openDefecations, ward, village, hamlet]);

  // Water Source Metrics
  const waterSourceMetrics = {
    functional: filteredWaterSource.filter((source) => source.status === 'Functional').length,
    nonFunctional: filteredWaterSource.filter((source) => source.status === 'Non Functional').length,
    drinkable: filteredWaterSource.filter((source) => source.quality === 'Drinkable').length,
    nonDrinkable: filteredWaterSource.filter((source) => source.quality === 'Non Drinkable').length,
  };

  // Facilities Overview Metrics
  const facilitiesMetrics = {
    totalWaterSources: filteredWaterSource.length,
    totalToiletFacilities: filteredToiletFacilities.length,
    totalDumpSites: filteredDumpSites.length,
    totalGutters: filteredGutters.length,
    totalSoakAways: filteredSoakAways.length,
    totalOpenDefecations: filteredOpenDefecations.length,
  };

  // Chart Data
  const facilitiesPieChartData = [
    { id: 0, value: facilitiesMetrics.totalWaterSources, label: 'WaterSources', color: '#1976d2' },
    { id: 1, value: facilitiesMetrics.totalToiletFacilities, label: 'Toilet', color: '#7b1fa2' },
    { id: 2, value: facilitiesMetrics.totalDumpSites, label: 'DumpSites', color: '#ed6c02' },
    { id: 3, value: facilitiesMetrics.totalGutters, label: 'Gutters', color: '#2e7d32' },
    { id: 4, value: facilitiesMetrics.totalSoakAways, label: 'SoakAways', color: '#e91e63' },
    { id: 5, value: facilitiesMetrics.totalOpenDefecations, label: 'Open Defecations', color: '#d32f2f' },
  ];

  // Summary Data
  const SUMMARY_DATA = [
    {
      label: 'Total Households',
      value: filteredWaterSource.length.toLocaleString() || 0,
      icon: Home,
      iconColor: '#25306B',
      bgColor: '#fff',
    },
    {
      label: 'Total Hamlets',
      value: hamletOptions.length.toLocaleString(),
      icon: Group,
      iconColor: '#25306B',
      bgColor: '#fff',
    },
    {
      label: 'Total Villages',
      value: villageOptions.length.toLocaleString(),
      icon: Landscape,
      iconColor: '#25306B',
      bgColor: '#fff',
    },
    {
      label: 'Total Wards',
      value: wardOptions.length.toLocaleString(),
      icon: LocationOn,
      iconColor: '#25306B',
      bgColor: '#fff',
    },
  ];

  const FACILITY_CARDS = [
    {
      label: 'Water Sources',
      value: filteredWaterSource.length.toLocaleString() || 0,
      icon: WaterDrop,
      iconColor: '#1976d2',
      bgColor: '#1976d2',
    },
    {
      label: 'Toilet Facilities',
      value: filteredToiletFacilities.length.toLocaleString() || 0,
      icon: Sanitizer,
      iconColor: '#7b1fa2',
      bgColor: '#7b1fa2',
    },
    {
      label: 'Dump Sites',
      value: filteredDumpSites.length.toLocaleString() || 0,
      icon: DeleteOutline,
      iconColor: '#ed6c02',
      bgColor: '#ed6c02',
    },
    {
      label: 'Gutters',
      value: filteredGutters.length.toLocaleString() || 0,
      icon: Home,
      iconColor: '#2e7d32',
      bgColor: '#2e7d32',
    },
    {
      label: 'Soak Aways',
      value: filteredSoakAways.length.toLocaleString() || 0,
      icon: Home,
      iconColor: '#e91e63',
      bgColor: '#e91e63',
    },
    {
      label: 'Open Defecation Sites',
      value: filteredOpenDefecations.length.toLocaleString() || 0,
      icon: LocationOn,
      iconColor: '#d32f2f',
      bgColor: '#d32f2f',
    },
  ];

  // Pie Chart Data
  const pieChartData = [
    { id: 0, value: waterSourceMetrics.functional, label: 'Functional', color: '#4CAF50' },
    { id: 1, value: waterSourceMetrics.nonFunctional, label: 'Non-Functional', color: '#F44336' },
  ];

  // Bar Chart Data
  const WATER_SOURCE_METRICS = [
    {
      label: 'Functional Water Sources',
      value: waterSourceMetrics.functional.toLocaleString(),
      icon: WaterDrop,
      iconColor: '#4CAF50',
      bgColor: '#4CAF50',
    },
    {
      label: 'Non-Functional Water Sources',
      value: waterSourceMetrics.nonFunctional.toLocaleString(),
      icon: WaterDrop,
      iconColor: '#F44336',
      bgColor: '#F44336',
    },
    {
      label: 'Drinkable Water Sources',
      value: waterSourceMetrics.drinkable.toLocaleString(),
      icon: WaterDrop,
      iconColor: '#2196F3',
      bgColor: '#2196F3',
    },
    {
      label: 'Non-Drinkable Water Sources',
      value: waterSourceMetrics.nonDrinkable.toLocaleString(),
      icon: WaterDrop,
      iconColor: '#FF9800',
      bgColor: '#FF9800',
    },
  ];

  // Loading state
  const isLoading =
    isWaterSourceLoading ||
    isToiletFacilitiesLoading ||
    isDumpSitesLoading ||
    isGuttersLoading ||
    isSoakAwaysLoading ||
    isOpenDefecationsLoading;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
        <Stack direction="row" spacing={2}>
          <FilterDropdown
            label="Ward"
            options={wardOptions}
            value={ward}
            onChange={setWard}
            disabled={isLoading}
          />
          <FilterDropdown
            label="Village"
            options={villageOptions}
            value={village}
            onChange={setVillage}
            disabled={isLoading}
          />
          <FilterDropdown
            label="Hamlet"
            options={hamletOptions}
            value={hamlet}
            onChange={setHamlet}
            disabled={isLoading}
          />
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
              iconColor={iconColor}
              bgColor={bgColor}
              sx={{
                boxShadow: 20,
                borderRadius: 2,
              }}
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
            <Tab icon={<IoWater />} label="Water Source Overview" iconPosition="start" key="Water Source Overview" />
            {/* <Tab icon={<SiCcleaner />} label="Toilet Overview" iconPosition="start" key="Toilet" />
            <Tab icon={<MdCleanHands style={{ fontSize: 15 }} />} label="Hygiene" iconPosition="start" key="Hygiene" />
            <Tab icon={<LiaPoopSolid />} label="Open Defecation" iconPosition="start" key="Open Defecation" /> */}
          </Tabs>
        </Box>

        <CardContent>
          {currentTab === 0 && (
            <Box>
              <Grid container spacing={3}>
                {FACILITY_CARDS.map(({ label, value, icon, iconColor, bgColor }, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <StatsCard
                      title={label}
                      value={value}
                      icon={icon}
                      iconColor={iconColor}
                      bgColor={bgColor}
                    />
                  </Grid>
                ))}
              </Grid>
              {/* Charts Section */}
              <Grid container spacing={3} sx={{ mt: 2, mb: 3 }}>
                {/* Pie Chart */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ 
                    textAlign: 'center', 
                    mb: 9, 
                    fontWeight: 'bold',
                    color: '#2d3436',
                    fontSize: '1.25rem',
                    position: 'relative',
                    '&:after': {
                      content: '""',
                      display: 'block',
                      width: '60px',
                      height: '3px',
                      backgroundColor: '#1976d2',
                      margin: '8px auto 0',
                      borderRadius: '2px'
                    }
                  }}>
                    Facility Distribution
                    <Typography variant="subtitle2" sx={{ 
                      color: '#636e72', 
                      fontSize: '0.875rem',
                      mt: 0.5 
                    }}>
                      Percentage breakdown by facility type
                    </Typography>
                  </Typography>
                  <PieChart
                    series={[{
                      data: facilitiesPieChartData,
                      arcLabel: (item) => {
                        const total = facilitiesPieChartData.reduce((sum, d) => sum + d.value, 0);
                        return total > 0 ? `${Math.round((item.value / total) * 100)}%` : '0%';
                      },
                      outerRadius: 140,
                      innerRadius: 50,
                      cornerRadius: 4,
                      paddingAngle: 2,
                      highlightScope: { highlighted: 'item', faded: 'global' },
                    }]}
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
                        }
                      }
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
                      }
                    }}
                    margin={{ top: 40, right: 40, bottom: 100, left: 40 }}
                  />
                </Grid>
                {/* Bar Chart */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ 
                    textAlign: 'center', 
                    mb: 2, 
                    fontWeight: 'bold',
                    color: '#2d3436',
                    fontSize: '1.25rem',
                    position: 'relative',
                    '&:after': {
                      content: '""',
                      display: 'block',
                      width: '60px',
                      height: '3px',
                      backgroundColor: '#1976d2',
                      margin: '8px auto 0',
                      borderRadius: '2px'
                    }
                  }}>
                    Facility Count by Type
                    <Typography variant="subtitle2" sx={{ 
                      color: '#636e72', 
                      fontSize: '0.875rem',
                      mt: 0.5 
                    }}>
                      Distribution breakdown by facility type
                    </Typography>
                  </Typography>
                  <BarChart
                    xAxis={[{
                      scaleType: 'band',
                      data: facilitiesPieChartData.map(d => d.label),
                      tickLabelProps: () => ({
                        fontSize: 14,
                        fontWeight: 'bold',
                        fill: '#333',
                      }),
                    }]}
                    series={[{
                      data: facilitiesPieChartData.map(d => d.value),
                      label: 'Facilities',
                      color: '#2196F3', // Blue color
                      barThickness: 40,
                    }]}
                    grid={{ vertical: false, horizontal: true }}
                    width={600}
                    height={400}
                    margin={{ top: 50, right: 30, left: 40, bottom: 50 }}
                    legend={{ 
                      position: 'bottom', 
                      itemTextStyle: { 
                        fontSize: 12, 
                        fontWeight: 'bold' 
                      } 
                    }}
                    tooltip={{ enabled: true }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          {currentTab === 1 && (
            <Box>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {WATER_SOURCE_METRICS.map(({ label, value, icon, iconColor, bgColor }, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <StatsCard
                      title={label}
                      value={value}
                      icon={icon}
                      iconColor={iconColor}
                      bgColor={bgColor}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Charts Section */}
              <Grid container spacing={3}>
                {/* Pie Chart */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ 
                    textAlign: 'center', 
                    mb: 4, 
                    fontWeight: 'bold',
                    color: '#2d3436',
                    fontSize: '1.25rem',
                    position: 'relative',
                    '&:after': {
                      content: '""',
                      display: 'block',
                      width: '60px',
                      height: '3px',
                      backgroundColor: '#1976d2',
                      margin: '10px auto 0',
                      borderRadius: '2px'
                    }
                  }}>
                    Water Source Status
                    <Typography variant="subtitle2" sx={{ 
                      color: '#636e72', 
                      fontSize: '0.875rem',
                      mt: 0.5 
                    }}>
                      Functional vs Non-Functional Distribution
                    </Typography>
                  </Typography>
                  <PieChart
                    series={[{
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
                    }]}
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
                        }
                      }
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
                      }
                    }}
                    margin={{ top: 40, right: 40, bottom: 100, left: 40 }}
                  />
                </Grid>

                {/* Bar Chart - Drinkable vs Non-Drinkable */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ 
                    textAlign: 'center', 
                    mb: 2, 
                    fontWeight: 'bold',
                    color: '#2d3436',
                    fontSize: '1.25rem',
                    position: 'relative',
                    '&:after': {
                      content: '""',
                      display: 'block',
                      width: '60px',
                      height: '3px',
                      backgroundColor: '#1976d2',
                      margin: '8px auto 0',
                      borderRadius: '2px'
                    }
                  }}>
                    Water Source Distribution
                    <Typography variant="subtitle2" sx={{ 
                      color: '#636e72', 
                      fontSize: '0.875rem',
                      mt: 0.5 
                    }}>
                      Drinkable vs Non-Drinkable Water Sources
                    </Typography>
                  </Typography>

                  <BarChart
                    xAxis={[{
                      scaleType: 'band',
                      data: ['Drinkable/Non-Drinkable',],
                      tickLabelProps: () => ({
                        fontSize: 14,
                        fontWeight: 'bold',
                        fill: '#333',
                      }),
                    }]}
                    series={[
                      {
                        data: [waterSourceMetrics.drinkable],
                        label: 'Drinkable',
                        color: '#2196F3', // Blue color
                        barThickness: 40,
                      },
                      {
                        data: [waterSourceMetrics.nonDrinkable],
                        label: 'Non-Drinkable',
                        color: '#FF9800', // Orange color
                        barThickness: 40,
                      },
                    ]}
                    grid={{ vertical: false, horizontal: true }}
                    width={600}
                    height={400}
                    margin={{ top: 50, right: 30, left: 40, bottom: 50 }}
                    legend={{ 
                      position: 'bottom', 
                      itemTextStyle: { 
                        fontSize: 12, 
                        fontWeight: 'bold' 
                      } 
                    }}
                    tooltip={{ enabled: true }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          {/* Add other tabs (Toilet, Hygiene, Open Defecation) here */}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default WashDashboard;