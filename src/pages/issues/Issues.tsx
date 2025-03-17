import React from 'react';
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
import { 
  FaExclamationTriangle, 
  FaExclamationCircle, 
  FaCheckCircle, 
  FaChartBar 
} from 'react-icons/fa';

const IssuesLogDashboard = () => {
  // Mock data for issues
  const issuesData = [
    {
      id: 'ISS-1023',
      issue: 'Water source contamination',
      location: 'Kudan Well #2',
      reportedDate: '2023-10-15',
      severity: 'High',
      status: 'In Progress'
    },
    {
      id: 'ISS-1022',
      issue: 'Broken latrine door',
      location: 'Sabon Gari School',
      reportedDate: '2023-10-12',
      severity: 'Medium',
      status: 'Resolved'
    },
    {
      id: 'ISS-1021',
      issue: 'Chlorine supply shortage',
      location: 'Doka Distribution Center',
      reportedDate: '2023-10-10',
      severity: 'High',
      status: 'Resolved'
    },
    {
      id: 'ISS-1020',
      issue: 'Drainage blockage',
      location: 'Kudan Market Area',
      reportedDate: '2023-10-08',
      severity: 'Medium',
      status: 'In Progress'
    }
  ];

  // Function to get chip color based on severity
  const getSeverityChipColor = (severity) => {
    switch (severity) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'info';
      default:
        return 'default';
    }
  };

  // Function to get chip color based on status
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Open':
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
        Issues Log
          <Typography variant="subtitle1" color="text.secondary">
        Incident reporting, tracking and resolution management
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
                Total Issues
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="h4" component="div" fontWeight="bold">
                  38
                </Typography>
                <FaExclamationTriangle size={24} style={{ color: '#ffc107' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Open Issues
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="h4" component="div" fontWeight="bold" color="#f44336">
                  12
                </Typography>
                <FaExclamationCircle size={24} style={{ color: '#f44336' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Resolved Issues
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="h4" component="div" fontWeight="bold">
                  26
                </Typography>
                <FaCheckCircle size={24} style={{ color: '#4caf50' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Resolution Rate
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="h4" component="div" fontWeight="bold">
                  68%
                </Typography>
                <FaChartBar size={24} style={{ color: '#3f51b5' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Issues Table */}
      <Box mb={3}>
        <Typography variant="h6" component="h2" fontWeight="bold" mb={2}>
          Recent Issues
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1a237e' }}>
                <TableCell sx={{ color: 'white' }}>ID</TableCell>
                <TableCell sx={{ color: 'white' }}>Issue</TableCell>
                <TableCell sx={{ color: 'white' }}>Location</TableCell>
                <TableCell sx={{ color: 'white' }}>Reported Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Severity</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issuesData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.issue}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.reportedDate}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.severity} 
                      color={getSeverityChipColor(row.severity)} 
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
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

export default IssuesLogDashboard;