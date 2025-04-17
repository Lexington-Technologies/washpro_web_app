import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText} from '@mui/material';
import { 
  MdAdd, 
  MdKeyboardArrowDown, 
  MdPeople,
  MdAssignmentLate,
  MdArrowDropDown
} from 'react-icons/md';
import { BsCheckCircleFill } from 'react-icons/bs';
import { Autorenew, Build, CalendarMonth, CheckCircle, Healing, People, PriorityHigh, Schedule, Warning } from '@mui/icons-material';
import React from 'react';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`intervention-maintenance-tabpanel-${index}`}
      aria-labelledby={`intervention-maintenance-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Tab props
function a11yProps(index) {
  return {
    id: `intervention-maintenance-tab-${index}`,
    'aria-controls': `intervention-maintenance-tabpanel-${index}`,
  };
}

// Summary Cards Component
function SummaryCards() {
  const stats = [
    {
      title: "Total Active Interventions",
      value: "14",
      icon: Healing,
      color: "#1E3A8A"
    },
    {
      title: "Communities Impacted",
      value: "7",
      icon: People,
      color: "#1E3A8A"
    },
    {
      title: "Critical Tasks Pending",
      value: "4",
      icon: PriorityHigh,
      color: "#DC2626"
    }
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <Box
                sx={{
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  bgcolor: '#F3F4F6',
                }}
              >
                {React.createElement(stat.icon, { style: { color: stat.color }, fontSize: "medium" })}
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
                <Typography 
                  variant="h5" 
                  fontWeight="bold" 
                  color={stat.title === 'Critical Tasks Pending' ? '#DC2626' : '#1E3A8A'}
                >
                  {stat.value}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

const InterventionOverview = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <Box sx={{ p: 3, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="#2c3e50">
          Intervention Overview
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Filters */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="project-label">Project</InputLabel>
            <Select
              labelId="project-label"
              id="project-select"
              label="Project"
              defaultValue=""
              sx={{ bgcolor: '#fff' }}
              endAdornment={<MdKeyboardArrowDown />}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="water">Water</MenuItem>
              <MenuItem value="sanitation">Sanitation</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="ward-label">Ward</InputLabel>
            <Select
              labelId="ward-label"
              id="ward-select"
              label="Ward"
              defaultValue=""
              sx={{ bgcolor: '#fff' }}
              endAdornment={<MdKeyboardArrowDown />}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="north">North</MenuItem>
              <MenuItem value="south">South</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="village-label">Village</InputLabel>
            <Select
              labelId="village-label"
              id="village-select"
              label="Village"
              defaultValue=""
              sx={{ bgcolor: '#fff' }}
              endAdornment={<MdKeyboardArrowDown />}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="hunkuyi">Hunkuyi</MenuItem>
              <MenuItem value="doka">Doka</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="hamlet-label">Hamlet</InputLabel>
            <Select
              labelId="hamlet-label"
              id="hamlet-select"
              label="Hamlet"
              defaultValue=""
              sx={{ bgcolor: '#fff' }}
              endAdornment={<MdKeyboardArrowDown />}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="sector1">Sector 1</MenuItem>
              <MenuItem value="sector2">Sector 2</MenuItem>
            </Select>
          </FormControl>
          
          {/* Add Intervention Button */}
          <Button 
            variant="contained" 
            startIcon={<MdAdd />} 
            sx={{ 
              bgcolor: '#27ae60', 
              '&:hover': { bgcolor: '#219653' },
              borderRadius: '4px',
              textTransform: 'none',
              fontWeight: 'medium'
            }}
          >
            Add Intervention
          </Button>
        </Box>
      </Box>

      <SummaryCards />
        
      {/* Tabs */}
      <Box sx={{ width: '100%' }}>
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              variant="standard" 
              indicatorColor="primary"
              textColor="primary"
              aria-label="intervention and maintenance tabs"
            >
              <Tab 
                icon={<Healing />} 
                iconPosition="start" 
                label="Intervention" 
                {...a11yProps(0)} 
              />
              <Tab 
                icon={<Build />} 
                iconPosition="start" 
                label="Maintenance" 
                {...a11yProps(1)} 
              />
            </Tabs>
          </Box>

                   {/* Intervention Tab Content */}
                   <TabPanel value={value} index={0}>
            <Typography variant="h6" gutterBottom>
              Recent Interventions
            </Typography>
            
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" color="primary" fontWeight="bold">
                    Water Supply Intervention #1290
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    April 12, 2025
                  </Typography>
                </Box>
                
                <Typography variant="body2" gutterBottom>
                  Community water pump failure in KUDAN. Emergency repair and water supply restoration completed within 4 hours.
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <CheckCircle color="success" fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="success.main">
                    Resolved
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" color="primary" fontWeight="bold">
                    Sanitation Facility #1288
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    April 10, 2025
                  </Typography>
                </Box>
                
                <Typography variant="body2" gutterBottom>
                  Public toilet facility in DOKA requires urgent repairs and maintenance. Drainage system blockage resolved.
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <CheckCircle color="success" fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="success.main">
                    Resolved
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" color="primary" fontWeight="bold">
                    Water Source Repair #1285
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    April 8, 2025
                  </Typography>
                </Box>
                
                <Typography variant="body2" gutterBottom>
                  Community borehole in HUNKUYI showing low water pressure. Requires pump assessment and potential replacement.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Warning color="warning" fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="warning.main">
                    In Progress
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Maintenance Tab Content */}
          <TabPanel value={value} index={1}>
            <Typography variant="h6" gutterBottom>
              Maintenance Schedule
            </Typography>
            
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" color="primary" fontWeight="bold">
                    Quarterly HVAC Maintenance
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarMonth fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      Due: April 25, 2025
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2" gutterBottom>
                  Full inspection and preventive maintenance of all HVAC systems across the facility.
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Autorenew color="info" fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="info.main">
                    Recurring (Quarterly)
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" color="primary" fontWeight="bold">
                    Monthly Elevator Maintenance
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarMonth fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      Due: April 20, 2025
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2" gutterBottom>
                  Standard maintenance check on all elevators including safety systems and mechanical components.
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Autorenew color="info" fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="info.main">
                    Recurring (Monthly)
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" color="primary" fontWeight="bold">
                    Annual Fire Safety Equipment Check
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarMonth fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      Due: May 15, 2025
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2" gutterBottom>
                  Comprehensive inspection and certification of all fire safety equipment including extinguishers, alarms, and sprinkler systems.
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Autorenew color="info" fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="info.main">
                    Recurring (Annually)
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            
          </TabPanel>
        </Paper>
      </Box>


    </Box>
  );
};

export default InterventionOverview;