import React, { useState } from 'react';
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
  Stack,
  Pagination
} from '@mui/material';
import { 
  FaExclamationTriangle, 
  FaVial, 
  FaSkull, 
} from 'react-icons/fa';
import { IoWarning } from 'react-icons/io5';

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

const MetricCard = ({ title, value, subItems, icon, color }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1, p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography variant="subtitle1" fontWeight="600">{title}</Typography>
        <Box sx={{ color, fontSize: 24 }}>{icon}</Box>
      </Box>
      <Box>
        {subItems.map((item, index) => (
          <Box key={index} display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">{item.label}</Typography>
            <Typography variant="body1" fontWeight="600" color={color}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </CardContent>
  </Card>
);  

const CholeraOutbreakDashboard = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [timeRange, setTimeRange] = useState('24h');

  const locationData = [
    { location: 'Kudan', suspected: 50, confirmed: 20, deaths: 3, communitiesAffected: 5, population: 10000, status: 'Moderate Risk', trend: 'Increasing' },
    { location: 'Sabon Gari', suspected: 30, confirmed: 10, deaths: 1, communitiesAffected: 3, population: 8000, status: 'High Risk', trend: 'Stable' },
    { location: 'Doka', suspected: 15, confirmed: 5, deaths: 0, communitiesAffected: 2, population: 5000, status: 'Low Risk', trend: 'Decreasing' },
  ];

  const metrics = [
    { 
      title: 'Suspected Cases', 
      icon: <FaExclamationTriangle />, 
      color: '#ef5350',
      subItems: [
        { label: 'Children <5 Years', value: 97 },
        { label: 'Children ≥5 Years', value: 79 }
      ]
    },
    {
      title: 'Rapid Diagnostic Test',
      icon: <FaExclamationTriangle />,
      color: '#ffa726',
      subItems: [
        { label: 'Tested', value: 86 },
        { label: 'Positives', value: 97 }
      ]
    },
    {
      title: 'Laboratory Testing',
      icon: <FaExclamationTriangle />,
      color: '#42a5f5',
      subItems: [
        { label: 'Conducted', value: 4 },
        { label: 'Confirmed', value: '12 (+5%)' }
      ]
    },
    {
      title: 'Mortality',
      icon: <FaExclamationTriangle />,
      color: '#78909c',
      subItems: [
        { label: 'Facility Deaths', value: 3 },
        { label: 'Community Deaths', value: 2 }
      ]
    }
  ];

  const metrics2 = [
    { 
      title: 'Severity & Spread', 
      icon: <FaExclamationTriangle />, 
      color: '#ef5350',
      subItems: [
        { label: 'Attack Rate', value: '8%' },
        { label: 'Case Fatality Rate', value: '8%' }
      ]
    },
    {
      title: 'Ongoing Cases',
      icon: <FaExclamationTriangle />,
      color: '#ffa726',
      subItems: [
        { label: 'Active Cases', value: 12 },
        { label: 'Currently Hospitalised', value: 8 }
      ]
    },
    {
      title: 'Recoveries',
      icon: <FaExclamationTriangle />,
      color: '#42a5f5',
      subItems: [
        { label: 'Recovered', value: 4 },
        { label: 'Recovery Rate', value: '12 (+5%)' }
      ]
    },
    {
      title: 'Communities',
      icon: <FaExclamationTriangle />,
      color: '#78909c',
      subItems: [
        { label: 'Affected', value: 3 },
        { label: 'Most Affected Ward', value: 2 }
      ]
    }
  ];


  const handlePageChange = (event, newPage) => setPage(newPage - 1);

  return (
    <Box sx={{ 
      maxWidth: 1440, 
      mx: 'auto', 
      p: 3, 
      bgcolor: 'background.default', 
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" fontWeight="700" gutterBottom>
            Cholera Outbreak Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-Time Outbreak Tracking and Analytics
          </Typography>
        </Box>
        <FilterDropdown 
          label="Time Range" 
          options={['Last 24 Hours', 'Last 7 Days', 'Last 30 Days']}
        />
      </Box>

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard value={undefined} {...metric} />
          </Grid>
        ))}
      </Grid>
      
        {/* Metrics Grid */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics2.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard value={undefined} {...metric} />
          </Grid>
        ))}
      </Grid>

      {/* Data Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#25306B' }}>
            <TableRow>
              {['Location', 'Suspected', 'Confirmed', 'Deaths', 'Communities', 'Population', 'Status', 'Trend'].map((header) => (
                <TableCell key={header} sx={{ color: 'common.white', fontWeight: 600 }}>
                  {header}
                </TableCell>
              ))}
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
                        row.status === 'High Risk' ? 'error' : 
                        row.status === 'Moderate Risk' ? 'warning' : 'success'
                      } 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.trend} 
                      color={
                        row.trend === 'Increasing' ? 'error' : 
                        row.trend === 'Stable' ? 'warning' : 'success'
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ 
        mt: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="body2" color="text.secondary">
          Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, locationData.length)} of {locationData.length} entries
        </Typography>
        <Pagination
          count={Math.ceil(locationData.length / rowsPerPage)}
          page={page + 1}
          onChange={handlePageChange}
          shape="rounded"
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default CholeraOutbreakDashboard;