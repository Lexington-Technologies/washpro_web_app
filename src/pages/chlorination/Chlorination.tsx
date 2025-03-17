import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack
} from '@mui/material';
import React from 'react';
import { 
  FaWater, 
  FaFlask, 
  FaClipboardCheck,
  FaVial
} from 'react-icons/fa';

const ChlorinationDashboard = () => {
  // Mock data for water quality monitoring
  const waterQualityData = [
    {
      id: 1,
      source: 'Community Well #1',
      location: 'Kudan',
      testDate: '2023-10-15',
      chlorineLevel: 1.2,
      pH: 7.4,
      status: 'Compliant'
    },
    {
      id: 2,
      source: 'Public Tap #3',
      location: 'Sabon Gari',
      testDate: '2023-10-14',
      chlorineLevel: 0.8,
      pH: 7.2,
      status: 'Borderline'
    },
    {
      id: 3,
      source: 'School Water Tank',
      location: 'Doka',
      testDate: '2023-10-16',
      chlorineLevel: 1.5,
      pH: 7.6,
      status: 'Compliant'
    },
    {
      id: 4,
      source: 'Community Well #4',
      location: 'Kudan',
      testDate: '2023-10-13',
      chlorineLevel: 0.5,
      pH: 7.1,
      status: 'Non-compliant'
    }
  ];

  // Function to get chip color based on status
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'Compliant':
        return 'success';
      case 'Borderline':
        return 'warning';
      case 'Non-compliant':
        return 'error';
      default:
        return 'default';
    }
  };

  const FilterDropdown = ({ label, options }) => {
    const [selectedOption, setSelectedOption] = React.useState('');

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

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f5f5f9', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 1 }}>
        Chlorination Dashbaord
          <Typography variant="subtitle1" color="text.secondary">
          Water quality control, inventory management and compliance reporting
          </Typography>
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <FilterDropdown label="Ward" options={['All']} />
            <FilterDropdown label="Village" options={['All']} />
            <FilterDropdown label="Hamlet" options={['All']} />
          </Stack>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Water Sources Treated
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="h4" component="div" fontWeight="bold">
                  18
                </Typography>
                <FaWater size={24} style={{ color: '#2196f3' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Chlorine Stock (kg)
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="h4" component="div" fontWeight="bold">
                  245
                </Typography>
                <FaFlask size={24} style={{ color: '#9c27b0' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Compliance Rate
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="h4" component="div" fontWeight="bold">
                  92%
                </Typography>
                <FaClipboardCheck size={24} style={{ color: '#4caf50' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Quality Tests
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="h4" component="div" fontWeight="bold">
                  72
                </Typography>
                <FaVial size={24} style={{ color: '#ff9800' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Water Quality Monitoring Table */}
      <Box mb={3}>
        <Typography variant="h6" component="h2" fontWeight="bold" mb={2}>
          Water Quality Monitoring
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1a237e' }}>
                <TableCell sx={{ color: 'white' }}>Water Source</TableCell>
                <TableCell sx={{ color: 'white' }}>Location</TableCell>
                <TableCell sx={{ color: 'white' }}>Last Test Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Chlorine Level (ppm)</TableCell>
                <TableCell sx={{ color: 'white' }}>pH</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {waterQualityData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.source}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.testDate}</TableCell>
                  <TableCell>{row.chlorineLevel}</TableCell>
                  <TableCell>{row.pH}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      color={getStatusChipColor(row.status)} 
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ChlorinationDashboard;