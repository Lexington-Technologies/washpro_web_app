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
  Stack,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import React, { useState } from 'react';

const LAMReportingDashboard = () => {
  // State for modal
  const [openModal, setOpenModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    location: '',
    functionality: '',
    maintenanceType: [],
    materials: '',
    timeline: ''
  });
  
  // Mock data for reporting history with 3 initial entries
  const [reportingHistory, setReportingHistory] = useState([
    {
      id: 1,
      location: 'Kudan',
      functionality: 'Functional',
      maintenanceType: 'Preventive Maintenance',
      materials: 'Filters, Lubricant',
      timeline: '05/15/2025',
      status: 'Completed'
    },
    {
      id: 2,
      location: 'Sabon Gari',
      functionality: 'Partially',
      maintenanceType: 'Pipe Replacement, Pump Repair',
      materials: 'PVC Pipes, Gaskets, Pump Parts',
      timeline: '04/22/2025',
      status: 'In Progress'
    },
    {
      id: 3,
      location: 'Zabi',
      functionality: 'Non-Functional',
      maintenanceType: 'Electrical Repair, Structural Repair',
      materials: 'Wiring, Circuit Board, Cement, Steel Bars',
      timeline: '04/30/2025',
      status: 'Urgent'
    }
  ]);

  // Function to handle modal open/close
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  
  // Function to handle form input changes
  const handleInputChange = (event:any) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Function to handle checkbox changes
  const handleCheckboxChange = (event:any) => {
    const { value, checked } = event.target;
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          maintenanceType: [...prev.maintenanceType, value]
        };
      } else {
        return {
          ...prev,
          maintenanceType: prev.maintenanceType.filter(type => type !== value)
        };
      }
    });
  };
  
  // Function to handle form submission
  const handleSubmit = (event:any) => {
    event.preventDefault();
    
    // Create new report entry
    const newReport = {
      id: reportingHistory.length + 1,
      location: formData.location,
      functionality: formData.functionality,
      maintenanceType: formData.maintenanceType.join(', '),
      materials: formData.materials,
      timeline: formData.timeline,
      status: 'In Progress' // Default status for new entries
    };
    
    // Add to reporting history
    setReportingHistory([...reportingHistory, newReport]);
    
    // Reset form and close modal
    setFormData({
      location: '',
      functionality: '',
      maintenanceType: [],
      materials: '',
      timeline: ''
    });
    handleModalClose();
  };

  // Function to get chip color based on status
  const getStatusChipColor = (status:any) => {
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
    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (event:any) => {
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
      
      {/* Add Report Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleModalOpen}
          sx={{ 
            backgroundColor: '#1a237e',
            '&:hover': {
              backgroundColor: '#0d1642',
            }
          }}
        >
          New Report
        </Button>
      </Box>

      {/* Reporting Modal Form */}
      <Dialog 
        open={openModal} 
        onClose={handleModalClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div" fontWeight="bold">
            LAM Reporting Form
          </Typography>
          <IconButton onClick={handleModalClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body2" mb={1}>Location</Typography>
                <FormControl fullWidth>
                  <Select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    displayEmpty
                    renderValue={(selected) => selected || "Select Location"}
                  >
                    <MenuItem value="">
                      <em>Select Location</em>
                    </MenuItem>
                    <MenuItem value="Kudan">Kudan</MenuItem>
                    <MenuItem value="Sabon Gari">Sabon Gari</MenuItem>
                    <MenuItem value="Doka">Doka</MenuItem>
                    <MenuItem value="Zabi">Zabi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" mb={1}>Functionality of Borehole</Typography>
                <RadioGroup 
                  row
                  name="functionality"
                  value={formData.functionality}
                  onChange={handleInputChange}
                >
                  <FormControlLabel value="Functional" control={<Radio />} label="Functional" />
                  <FormControlLabel value="Partially" control={<Radio />} label="Partially" />
                  <FormControlLabel value="Non-Functional" control={<Radio />} label="Non-Functional" />
                </RadioGroup>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" mb={1}>Type of Maintenance Need</Typography>
                <FormGroup>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel 
                        control={<Checkbox 
                          checked={formData.maintenanceType.includes('Pump Repair')}
                          onChange={handleCheckboxChange}
                          value="Pump Repair"
                        />} 
                        label="Pump Repair" 
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel 
                        control={<Checkbox 
                          checked={formData.maintenanceType.includes('Pipe Replacement')}
                          onChange={handleCheckboxChange}
                          value="Pipe Replacement"
                        />} 
                        label="Pipe Replacement" 
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel 
                        control={<Checkbox 
                          checked={formData.maintenanceType.includes('Water Quality Treatment')}
                          onChange={handleCheckboxChange}
                          value="Water Quality Treatment"
                        />} 
                        label="Water Quality Treatment" 
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel 
                        control={<Checkbox 
                          checked={formData.maintenanceType.includes('Structural Repair')}
                          onChange={handleCheckboxChange}
                          value="Structural Repair"
                        />} 
                        label="Structural Repair" 
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel 
                        control={<Checkbox 
                          checked={formData.maintenanceType.includes('Electrical Repair')}
                          onChange={handleCheckboxChange}
                          value="Electrical Repair"
                        />} 
                        label="Electrical Repair" 
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel 
                        control={<Checkbox 
                          checked={formData.maintenanceType.includes('Preventive Maintenance')}
                          onChange={handleCheckboxChange}
                          value="Preventive Maintenance"
                        />} 
                        label="Preventive Maintenance" 
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" mb={1}>Materials to be Procured</Typography>
                <TextField
                  fullWidth
                  name="materials"
                  value={formData.materials}
                  onChange={handleInputChange}
                  placeholder="Enter materials needed"
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" mb={1}>Maintenance Timeline</Typography>
                <TextField
                  fullWidth
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
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
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleModalClose} variant="outlined">Cancel</Button>
          <Button 
            onClick={handleSubmit}
            variant="contained" 
            sx={{ 
              backgroundColor: '#1a237e',
              '&:hover': {
                backgroundColor: '#0d1642',
              }
            }}
          >
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>

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
              {reportingHistory.length > 0 ? (
                reportingHistory.map((row) => (
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">No data available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing 1 to {reportingHistory.length} of {reportingHistory.length} entries
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