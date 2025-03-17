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
import { FaHandsWash } from 'react-icons/fa';
import { 
  FaPeopleGroup, 
  FaBoxOpen, 
  FaChartLine 
} from 'react-icons/fa6';

const ActivitesDashboard = () => {
  // Mock data
  const activities = [
    {
      id: 1,
      activity: 'Hand Washing Workshop',
      type: 'Hygiene Promotion',
      location: 'Kudan Community Center',
      date: '2023-10-15',
      participants: 45,
      status: 'Completed'
    },
    {
      id: 2,
      activity: 'Soap Distribution',
      type: 'Resource Distribution',
      location: 'Sabon Gari',
      date: '2023-10-12',
      participants: 120,
      status: 'Completed'
    },
    {
      id: 3,
      activity: 'Community Meeting',
      type: 'Community Engagement',
      location: 'Doka Village Hall',
      date: '2023-10-10',
      participants: 32,
      status: 'Completed'
    },
    {
      id: 4,
      activity: 'School Hygiene Program',
      type: 'Behavioral Change',
      location: 'Kudan Primary School',
      date: '2023-10-20',
      participants: 85,
      status: 'Scheduled'
    }
  ];

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
        Activities Dashboard
          <Typography variant="subtitle1" color="text.secondary">
          Manage hygiene promotion, community engagement, and resource distribution
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
                Hygiene Sessions
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="h4" component="div" fontWeight="bold">
                  24
                </Typography>
                <FaHandsWash size={24} style={{ color: '#4caf50' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Community Engagements
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="h4" component="div" fontWeight="bold">
                  18
                </Typography>
                <FaPeopleGroup size={24} style={{ color: '#2196f3' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Resources Distributed
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="h4" component="div" fontWeight="bold">
                  156
                </Typography>
                <FaBoxOpen size={24} style={{ color: '#9c27b0' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Behavior Change Initiatives
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="h4" component="div" fontWeight="bold">
                  7
                </Typography>
                <FaChartLine size={24} style={{ color: '#ff9800' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities Table */}
      <Box mb={3}>
        <Typography variant="h6" component="h2" fontWeight="bold" mb={2}>
          Recent Activities
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1a237e' }}>
                <TableCell sx={{ color: 'white' }}>Activity</TableCell>
                <TableCell sx={{ color: 'white' }}>Type</TableCell>
                <TableCell sx={{ color: 'white' }}>Location</TableCell>
                <TableCell sx={{ color: 'white' }}>Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Participants</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.activity}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.participants}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      color={row.status === 'Completed' ? 'success' : 'warning'} 
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

export default ActivitesDashboard;