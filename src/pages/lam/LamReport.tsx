import {
  Box,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputAdornment,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  FormGroup,
  IconButton,
  InputLabel,
  Stack
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import React from 'react';

const LAMReportingDashboard = () => {
  // Mock data for reporting history
  const reportingHistory = [
    {
      id: 1,
      location: 'Kudan',
      functionality: 'Functional',
      maintenanceType: 'Pump Repair',
      materials: 'Pipes, Pump parts',
      timeline: '2023-10-05',
      status: 'Urgent'
    },
    {
      id: 2,
      location: 'Sabon Gari',
      functionality: 'Non-Functional',
      maintenanceType: 'Pump Repair, Pipe Replacement',
      materials: 'Pipes',
      timeline: '2023-10-12',
      status: 'Urgent'
    },
    {
      id: 3,
      location: 'Doka',
      functionality: 'Partially Functional',
      maintenanceType: 'Water Quality Treatment',
      materials: 'Chlorine tablets',
      timeline: '2023-10-08',
      status: 'In Progress'
    },
    {
      id: 4,
      location: 'Zabi',
      functionality: 'Functional',
      maintenanceType: 'Electrical Repair',
      materials: 'Wires, switches',
      timeline: '2023-09-30',
      status: 'Completed'
    }
  ];

  // Function to get chip color based on status
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Urgent':
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
        LAM Reporting
        <Typography variant="subtitle1" color="text.secondary">
        Location, Assessment and Maintenance reporting for water facilities
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
      {/* Reporting Form */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" component="h2" fontWeight="bold" mb={2}>
          LAM Reporting Form
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body2" mb={1}>Location</Typography>
            <FormControl fullWidth>
              <Select
                defaultValue=""
                displayEmpty
                renderValue={(selected) => selected || "Select Location"}
              >
                <MenuItem value="">
                  <em>Select Location</em>
                </MenuItem>
                <MenuItem value="kudan">Kudan</MenuItem>
                <MenuItem value="sabon-gari">Sabon Gari</MenuItem>
                <MenuItem value="doka">Doka</MenuItem>
                <MenuItem value="zabi">Zabi</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2" mb={1}>Functionality of Borehole</Typography>
            <RadioGroup row>
              <FormControlLabel value="functional" control={<Radio />} label="Functional" />
              <FormControlLabel value="partially" control={<Radio />} label="Partially" />
              <FormControlLabel value="non-functional" control={<Radio />} label="Non-Functional" />
            </RadioGroup>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2" mb={1}>Type of Maintenance Need</Typography>
            <FormGroup>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel control={<Checkbox />} label="Pump Repair" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel control={<Checkbox />} label="Pipe Replacement" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel control={<Checkbox />} label="Water Quality Treatment" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel control={<Checkbox />} label="Structural Repair" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel control={<Checkbox />} label="Electrical Repair" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel control={<Checkbox />} label="Preventive Maintenance" />
                </Grid>
              </Grid>
            </FormGroup>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2" mb={1}>Materials to be Procured</Typography>
            <TextField
              fullWidth
              placeholder="Enter materials needed"
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2" mb={1}>Maintenance Timeline</Typography>
            <TextField
              fullWidth
              placeholder="mm/dd/yyyy"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              fullWidth 
              sx={{ 
                mt: 2, 
                backgroundColor: '#1a237e',
                height: 48,
                '&:hover': {
                  backgroundColor: '#0d1642',
                }
              }}
            >
              Submit Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Reporting History */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2" fontWeight="bold">
            Reporting History
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search reports..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 200 }}
            />
            <IconButton>
              <FilterIcon />
            </IconButton>
          </Box>
        </Box>
        
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1a237e' }}>
                <TableCell sx={{ color: 'white' }}>Location</TableCell>
                <TableCell sx={{ color: 'white' }}>Functionality</TableCell>
                <TableCell sx={{ color: 'white' }}>Maintenance Type</TableCell>
                <TableCell sx={{ color: 'white' }}>Materials</TableCell>
                <TableCell sx={{ color: 'white' }}>Timeline</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportingHistory.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.functionality}</TableCell>
                  <TableCell>{row.maintenanceType}</TableCell>
                  <TableCell>{row.materials}</TableCell>
                  <TableCell>{row.timeline}</TableCell>
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
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing 1 to 5 of 8 entries
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined" disabled>
              Previous
            </Button>
            <Button size="small" variant="contained" sx={{ backgroundColor: '#1a237e' }}>
              1
            </Button>
            <Button size="small" variant="outlined">
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LAMReportingDashboard;