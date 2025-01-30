import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  useTheme,
  IconButton,
  alpha,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  WaterDrop,
  Sanitizer,
  Delete,
  Home,
  MoreVert,
  People,
  Church,
  School,
  LocationCity,
  Store,
  MoreHoriz,
} from '@mui/icons-material';

// Utility function to format large numbers
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toLocaleString();
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  color?: string;
}> = ({ title, value, icon, subtitle, color = 'primary.main' }) => (
  <Card 
    sx={{ 
      height: '100%', 
      background: 'white',
      transition: 'box-shadow 0.2s',
      '&:hover': {
        boxShadow: (theme) => theme.shadows[4],
      },
    }}
  >
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <Box
          sx={{
            backgroundColor: (theme) => alpha(color, 0.1),
            borderRadius: '8px',
            p: 1,
            mr: 2,
            display: 'flex',
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            sx: { color: color, fontSize: '1.5rem' },
          })}
        </Box>
        <Box>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Box>
      {subtitle && (
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            display: 'block'
          }}
        >
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        sx={{
          p: 1.5,
          boxShadow: 2,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: entry.color,
              }}
            />
            <Typography variant="body2">
              {entry.name}: {formatNumber(entry.value)}
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  }
  return null;
};

const ChartCard: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <Paper 
    sx={{ 
      p: 2, 
      height: '100%',
      background: 'white',
      transition: 'box-shadow 0.2s',
      '&:hover': {
        boxShadow: (theme) => theme.shadows[4],
      },
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      <IconButton size="small">
        <MoreVert />
      </IconButton>
    </Box>
    {children}
  </Paper>
);

const Dashboard: React.FC = () => {
  const theme = useTheme();

  // Updated toilet facility data from the provided statistics
  const toiletFacilityData = [
    { name: 'Pit Latrine', value: 1800 },
    { name: 'WC Squatting', value: 196 },
    { name: 'WC Sitting', value: 124 },
  ];

  // Updated soak away data from the provided statistics
  const soakAwayData = [
    { name: 'Maintained', value: 154, fill: '#4CAF50' },
    { name: 'Dilapidated', value: 49, fill: '#f44336' },
    { name: 'Unmaintained', value: 114, fill: '#ff9800' },
  ];

  // Updated dump site data from the provided statistics
  const dumpSiteData = [
    { name: 'Unimproved', value: 1193, fill: '#e57373' },
    { name: 'Improved', value: 266, fill: '#81c784' },
  ];

  // Updated ward data focusing on facilities
  const wardData = [
    {
      name: 'LIKORO',
      waterSources: 859,
      toilets: 1148,
      openDefecationSites: 79,
      soakAways: 155,
      dumpSites: 838,
      gutters: 827,
      households: 1125,
    },
    {
      name: 'S/GARI',
      waterSources: 805,
      toilets: 970,
      openDefecationSites: 115,
      soakAways: 161,
      dumpSites: 621,
      gutters: 596,
      households: 1047,
    },
  ];

  // Added gutter status data from the provided statistics
  const gutterData = [
    { name: 'Good', value: 144, fill: '#4CAF50' },
    { name: 'Fair', value: 573, fill: '#ff9800' },
    { name: 'Poor', value: 637, fill: '#f44336' },
    { name: 'Critical', value: 69, fill: '#d32f2f' },
  ];

  // Facility types data
  const facilityTypes = [
    { name: 'Household', count: 44, icon: <Home />, color: '#2196f3' },
    { name: 'Community', count: 62, icon: <People />, color: '#4caf50' },
    { name: 'Religious Facilities', count: 22, icon: <Church />, color: '#ff9800' },
    { name: 'Schools', count: 18, icon: <School />, color: '#9c27b0' },
    { name: 'Social Centers', count: 19, icon: <LocationCity />, color: '#00bcd4' },
    { name: 'Markets', count: 2, icon: <Store />, color: '#795548' },
    { name: 'Others', count: 27, icon: <MoreHoriz />, color: '#607d8b' },
  ];

  return (
    <Box sx={{ p: 2, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0.5 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Water and sanitation metrics summary
        </Typography>
      </Box>

      {/* Key Statistics */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Water Sources"
            value={formatNumber(1666)}
            icon={<WaterDrop />}
            subtitle="76 avg. dependents per source"
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Households"
            value={formatNumber(2173)}
            icon={<Home />}
            subtitle="17 avg. people per household"
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toilet Facilities"
            value={formatNumber(2120)}
            icon={<Sanitizer />}
            subtitle="Total across all types"
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Dump Sites"
            value={formatNumber(1459)}
            icon={<Delete />}
            subtitle="82% unimproved sites"
            color="#f44336"
          />
        </Grid>
      </Grid>

      {/* Facilities by Type */}
      <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
        Facilities by Type
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {facilityTypes.map((facility) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={facility.name}>
            <Card sx={{ 
              height: '100%',
              background: 'white',
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: (theme) => theme.shadows[4],
              },
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: alpha(facility.color, 0.1),
                      borderRadius: '8px',
                      p: 1,
                      mr: 2,
                    }}
                  >
                    {React.cloneElement(facility.icon as React.ReactElement, {
                      sx: { color: facility.color },
                    })}
                  </Box>
                  <Box>
                    <Typography variant="h6" component="div">
                      {formatNumber(facility.count)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {facility.name}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Ward Statistics */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Ward Statistics
      </Typography>
      <Grid container spacing={2}>
        {wardData.map((ward) => (
          <Grid item xs={12} md={6} key={ward.name}>
            <ChartCard 
              title={ward.name} 
              subtitle="Facilities breakdown"
            >
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Water Sources</Typography>
                    <Typography variant="h6">{formatNumber(ward.waterSources)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Toilets</Typography>
                    <Typography variant="h6">{formatNumber(ward.toilets)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Open Defecation Sites</Typography>
                    <Typography variant="h6">{formatNumber(ward.openDefecationSites)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Soak Aways</Typography>
                    <Typography variant="h6">{formatNumber(ward.soakAways)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Dump Sites</Typography>
                    <Typography variant="h6">{formatNumber(ward.dumpSites)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Gutters</Typography>
                    <Typography variant="h6">{formatNumber(ward.gutters)}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </ChartCard>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
        Detailed Analysis
      </Typography>
      <Grid container spacing={2}>
        {/* Toilet Facilities Distribution */}
        <Grid item xs={12} md={6} lg={3}>
          <ChartCard 
            title="Toilet Facilities" 
            subtitle="Distribution by type"
          >
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={toiletFacilityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {toiletFacilityData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={[theme.palette.primary.main, theme.palette.secondary.main, theme.palette.success.main][index]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="middle" 
                    align="right"
                    layout="vertical"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>

        {/* Soak Away Status */}
        <Grid item xs={12} md={6} lg={3}>
          <ChartCard 
            title="Soak Away Status" 
            subtitle="Maintenance distribution"
          >
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={soakAwayData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {soakAwayData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="middle" 
                    align="right"
                    layout="vertical"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>

        {/* Dump Site Status */}
        <Grid item xs={12} md={6} lg={3}>
          <ChartCard 
            title="Dump Site Status" 
            subtitle="Quality assessment"
          >
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dumpSiteData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dumpSiteData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="middle" 
                    align="right"
                    layout="vertical"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>

        {/* Gutter Status */}
        <Grid item xs={12} md={6} lg={3}>
          <ChartCard 
            title="Gutter Status" 
            subtitle="Condition assessment"
          >
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gutterData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {gutterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="middle" 
                    align="right"
                    layout="vertical"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 