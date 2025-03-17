import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Pagination,
  Tabs,
  Tab,
} from '@mui/material';
import {
  FaExclamationTriangle,
} from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';

// Mock API Endpoint
const fetchData = async () => {
  const data = {
    locationData: [
      {
        location: 'Kudan',
        suspected: 50,
        confirmed: 20,
        deaths: 3,
        communitiesAffected: 5,
        population: 10000,
        status: 'Moderate Risk',
        trend: 'Increasing',
      },
      {
        location: 'Sabon Gari',
        suspected: 30,
        confirmed: 10,
        deaths: 1,
        communitiesAffected: 3,
        population: 8000,
        status: 'High Risk',
        trend: 'Stable',
      },
      {
        location: 'Doka',
        suspected: 15,
        confirmed: 5,
        deaths: 0,
        communitiesAffected: 2,
        population: 5000,
        status: 'Low Risk',
        trend: 'Decreasing',
      },
      {
        location: 'Doka',
        suspected: 15,
        confirmed: 5,
        deaths: 0,
        communitiesAffected: 2,
        population: 5000,
        status: 'Low Risk',
        trend: 'Decreasing',
      },
      {
        location: 'Doka',
        suspected: 15,
        confirmed: 5,
        deaths: 0,
        communitiesAffected: 2,
        population: 5000,
        status: 'Low Risk',
        trend: 'Decreasing',
      },
      {
        location: 'Doka',
        suspected: 15,
        confirmed: 5,
        deaths: 0,
        communitiesAffected: 2,
        population: 5000,
        status: 'Low Risk',
        trend: 'Decreasing',
      },
      {
        location: 'Doka',
        suspected: 15,
        confirmed: 5,
        deaths: 0,
        communitiesAffected: 2,
        population: 5000,
        status: 'Low Risk',
        trend: 'Decreasing',
      },



    ],
    metrics: [
      {
        title: 'Suspected Cases',
        icon: <FaExclamationTriangle />,
        color: '#ef5350',
        subItems: [
          { label: 'Children <5 Years', value: 97 },
          { label: 'Children ≥5 Years', value: 79 },
        ],
      },
      {
        title: 'Rapid Diagnostic Test',
        icon: <FaExclamationTriangle />,
        color: '#ffa726',
        subItems: [
          { label: 'Tested', value: 86 },
          { label: 'Positives', value: 97 },
        ],
      },
      {
        title: 'Laboratory Testing',
        icon: <FaExclamationTriangle />,
        color: '#42a5f5',
        subItems: [
          { label: 'Conducted', value: 4 },
          { label: 'Confirmed', value: '12 (+5%)' },
        ],
      },
      {
        title: 'Mortality',
        icon: <FaExclamationTriangle />,
        color: '#78909c',
        subItems: [
          { label: 'Facility Deaths', value: 3 },
          { label: 'Community Deaths', value: 2 },
        ],
      },
    ],
    metrics2: [
      {
        title: 'Severity & Spread',
        icon: <FaExclamationTriangle />,
        color: '#ef5350',
        subItems: [
          { label: 'Attack Rate', value: '8%' },
          { label: 'Case Fatality Rate', value: '8%' },
        ],
      },
      {
        title: 'Ongoing Cases',
        icon: <FaExclamationTriangle />,
        color: '#ffa726',
        subItems: [
          { label: 'Active Cases', value: 12 },
          { label: 'Currently Hospitalised', value: 8 },
        ],
      },
      {
        title: 'Recoveries',
        icon: <FaExclamationTriangle />,
        color: '#42a5f5',
        subItems: [
          { label: 'Recovered', value: 4 },
          { label: 'Recovery Rate', value: '12 (+5%)' },
        ],
      },
      {
        title: 'Communities',
        icon: <FaExclamationTriangle />,
        color: '#78909c',
        subItems: [
          { label: 'Affected', value: 3 },
          { label: 'Most Affected Ward', value: 2 },
        ],
      },
    ],
  };
  return new Promise((resolve) => setTimeout(() => resolve(data), 1000)); // Simulate network delay
};

// Custom Hook to Fetch Data with TanStack Query
const useDashboardData = () => {
  return useQuery({
    queryKey: ['choleraOutbreakData'],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });
};

// Filter Dropdown Component
const FilterDropdown = ({ label, options }) => {
  const [selectedOption, setSelectedOption] = useState('');

  return (
    <FormControl variant="outlined" sx={{ minWidth: 180 }}>
      <InputLabel sx={{ fontSize: '0.875rem' }}>{label}</InputLabel>
      <Select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        label={label}
        sx={{ height: 40 }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option} sx={{ fontSize: '0.875rem' }}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, subItems, icon, color }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1, p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography variant="subtitle1" fontWeight="600">
          {title}
        </Typography>
        <Box sx={{ color, fontSize: 24 }}>{icon}</Box>
      </Box>
      <Box>
        {subItems.map((item, index) => (
          <Box key={index} display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              {item.label}
            </Typography>
            <Typography variant="body1" fontWeight="600" color={color}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </CardContent>
  </Card>
);

// Main Dashboard Component
const CholeraOutbreakDashboard = () => {
  const { data, isLoading, error } = useDashboardData();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [tabValue, setTabValue] = useState(0); // State for Tabs

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading data</Typography>;

  const { locationData, metrics, metrics2 } = data;

  const handlePageChange = (event, newPage) => setPage(newPage - 1);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        maxWidth: 1440,
        mx: 'auto',
        p: 3,
        bgcolor: '#F1F1F5',
        minHeight: '100vh',
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" component="h2" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 2 }}>
            Cholera Outbreak Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-Time Outbreak Tracking and Analytics
          </Typography>
        </Box>
        <FilterDropdown label="Time Range" options={['Last 24 Hours', 'Last 7 Days', 'Last 30 Days']} />
      </Box>

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics2.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      {/* Split Layout: Table on the Left, Tabs on the Right */}
      <Grid container spacing={3}>
        {/* Left Side: Table */}
        <Grid item xs={12} md={9}>
          <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#25306B' }}>
                <TableRow>
                  {['Location', 'Suspected', 'Confirmed', 'Deaths', 'Communities', 'Population', 'Status', 'Trend'].map(
                    (header) => (
                      <TableCell key={header} sx={{ color: 'common.white', fontWeight: 600 }}>
                        {header}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {locationData
                  .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.suspected}</TableCell>
                      <TableCell>{row.confirmed}</TableCell>
                      <TableCell>{row.deaths}</TableCell>
                      <TableCell>{row.communitiesAffected}</TableCell>
                      <TableCell>{row.population.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          color={
                            row.status === 'High Risk'
                              ? 'error'
                              : row.status === 'Moderate Risk'
                              ? 'warning'
                              : 'success'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.trend}
                          color={
                            row.trend === 'Increasing'
                              ? 'error'
                              : row.trend === 'Stable'
                              ? 'warning'
                              : 'success'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {page * rowsPerPage + 1} to{' '}
              {Math.min((page + 1) * rowsPerPage, locationData.length)} of {locationData.length} entries
            </Typography>
            <Pagination
              count={Math.ceil(locationData.length / rowsPerPage)}
              page={page + 1}
              onChange={handlePageChange}
              shape="rounded"
              color="primary"
            />
          </Box>
        </Grid>

      {/* Right Side: Tabs */}
      <Grid item xs={12} md={3}>
      <Paper sx={{ boxShadow: 3 }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          bgcolor: '#25306B', // Background color for tabs
          '& .MuiTabs-indicator': {
            backgroundColor: '#42a5f5', // Color for the active tab indicator
          },
          '& .MuiTab-root': {
            color: '#9e9e9e', // Default text color for inactive tabs
            '&:hover': {
              color: '#ffffff', // Text color on hover
              backgroundColor: 'rgba(255, 255, 255, 0.1)', // Background color on hover
            },
            '&.Mui-selected': {
              color: '#ffffff', // Text color for active tab
              fontWeight: 'bold', // Bold text for active tab
            },
          },
        }}
      >
        <Tab label="Overview" />
        <Tab label="Report Case" />
        <Tab label="Analysis Case" />
      </Tabs>
      

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {tabValue === 0 && (
              <Box>
                {/* Recent Alerts Section */}
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#25306B' }}>
                  Recent Alerts
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Site A23</Typography>
                    <Chip label="Critical" color="error" size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    3.2m from dump site
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Site B15</Typography>
                    <Chip label="Warning" color="warning" size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    15m from sanitation risk
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Site C08</Typography>
                    <Chip label="Clear" color="success" size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    45m from nearest risk
                  </Typography>
                </Box>

                {/* Risk Legend Section */}
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#25306B' }}>
                  Risk Legend
                </Typography>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#ef5350', mr: 1 }} /> {/* Critical Risk Color */}
                    <Typography variant="body1">Critical Risk (&lt;10m)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#ffa726', mr: 1 }} /> {/* Moderate Risk Color */}
                    <Typography variant="body1">Moderate Risk (10-30m)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#42a5f5', mr: 1 }} /> {/* Safe Distance Color */}
                    <Typography variant="body1">Safe Distance (&gt;30m)</Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {tabValue === 1 && (
              <Typography variant="body1">
                Report Case content goes here. This section allows users to report new cases.
              </Typography>
            )}

            {tabValue === 2 && (
              <Typography variant="body1">
                Analysis Case content goes here. This section provides detailed analysis of the outbreak.
              </Typography>
            )}
          </Box>
    </Paper>
      </Grid>
      </Grid>
    </Box>
  );
};

export default CholeraOutbreakDashboard;