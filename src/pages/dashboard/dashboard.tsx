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

  const toiletFacilityData = [
    { name: 'WC Squatting', value: 196 },
    { name: 'Pit Latrine', value: 1800 },
    { name: 'WC Sitting', value: 124 },
  ];

  const soakAwayData = [
    { name: 'Maintained', value: 154, fill: '#4CAF50' },
    { name: 'Dilapidated', value: 49, fill: '#f44336' },
    { name: 'Unmaintained', value: 114, fill: '#ff9800' },
  ];

  const dumpSiteData = [
    { name: 'Unimproved', value: 1193, fill: '#e57373' },
    { name: 'Improved', value: 266, fill: '#81c784' },
  ];

  const wardData = [
    {
      name: 'LIKORO',
      waterSources: 859,
      toilets: 1148,
      households: 1125,
    },
    {
      name: 'S/GARI',
      waterSources: 805,
      toilets: 970,
      households: 1047,
    },
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
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Dump Sites"
            value={formatNumber(1459)}
            icon={<Delete />}
            color="#f44336"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={2}>
        {/* Ward Statistics */}
        <Grid item xs={12}>
          <ChartCard 
            title="Ward Statistics" 
            subtitle="Comparison across wards"
          >
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wardData} barGap={8} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#666"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#666"
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="waterSources"
                    fill="#2196f3"
                    radius={[4, 4, 0, 0]}
                    name="Water Sources"
                  />
                  <Bar
                    dataKey="toilets"
                    fill="#4caf50"
                    radius={[4, 4, 0, 0]}
                    name="Toilets"
                  />
                  <Bar
                    dataKey="households"
                    fill="#ff9800"
                    radius={[4, 4, 0, 0]}
                    name="Households"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>

        {/* Toilet Facilities Distribution */}
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={4}>
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
      </Grid>
    </Box>
  );
};

export default Dashboard; 