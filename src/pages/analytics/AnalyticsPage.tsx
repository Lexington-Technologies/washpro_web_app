import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  WaterDrop,
  Sanitizer,
  Delete,
  Warning,
  Home,
  LocationCity,
} from '@mui/icons-material';

// Utility function to format large numbers
const formatNumber = (num: number) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num;
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
}> = ({ title, value, icon, subtitle }) => (
  <Card sx={{ height: '100%', boxShadow: 3 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            backgroundColor: 'primary.main',
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            mr: 2,
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            sx: { color: 'white' },
          })}
        </Box>
        <Box>
          <Typography variant="h6" component="div">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AnalyticsPage: React.FC = () => {
  const theme = useTheme();

  // Prepare data for charts
  const toiletFacilityData = [
    { name: 'WC Squatting', value: 196 },
    { name: 'Pit Latrine', value: 1800 },
    { name: 'WC Sitting', value: 124 },
  ];

  const soakAwayData = [
    { name: 'Maintained', value: 154 },
    { name: 'Dilapidated', value: 49 },
    { name: 'Unmaintained', value: 114 },
  ];

  const dumpSiteData = [
    { name: 'Unimproved', value: 1193 },
    { name: 'Improved', value: 266 },
  ];

  const gutterData = [
    { name: 'Poor', value: 637 },
    { name: 'Critical', value: 69 },
    { name: 'Fair', value: 573 },
    { name: 'Good', value: 144 },
  ];

  const wardData = [
    {
      name: 'LIKORO',
      waterSources: 859,
      toilets: 1148,
      households: 1125,
      population: 21971,
    },
    {
      name: 'S/GARI',
      waterSources: 805,
      toilets: 970,
      households: 1047,
      population: 15509,
    },
  ].sort((a, b) => b.population - a.population);

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82CA9D',
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: '#F1F1F5', minHeight: '100vh' }}>
      {/* Header Section */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        Analytics Dashboard
      </Typography>

      {/* Key Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Water Sources"
            value="1,666"
            icon={<WaterDrop />}
            subtitle="Avg. 76 dependents per source"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Households"
            value="2,173"
            icon={<Home />}
            subtitle="Avg. 17 people per household"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Toilet Facilities"
            value="2,120"
            icon={<Sanitizer />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Dump Sites"
            value="1,459"
            icon={<Delete />}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Toilet Facilities Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Toilet Facilities Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={toiletFacilityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {toiletFacilityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gutter Conditions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Gutter Conditions
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gutterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  fill={theme.palette.primary.main}
                  name="Number of Gutters"
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Ward Statistics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Ward Statistics Comparison
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="waterSources"
                  fill="#0088FE"
                  name="Water Sources"
                  stackId="a"
                />
                <Bar
                  dataKey="toilets"
                  fill="#00C49F"
                  name="Toilets"
                  stackId="b"
                />
                <Bar
                  dataKey="households"
                  fill="#FFBB28"
                  name="Households"
                  stackId="c"
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Soak Away Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Soak Away Status
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={soakAwayData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {soakAwayData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Dump Site Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Dump Site Status
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dumpSiteData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dumpSiteData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage; 