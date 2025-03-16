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
  IconButton} from '@mui/material';
import { 
  MdAdd, 
  MdKeyboardArrowDown, 
  MdPeople,
  MdAssignmentLate,
  MdArrowDropDown
} from 'react-icons/md';
import { BsCheckCircleFill } from 'react-icons/bs';

const InterventionOverview = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
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
      
      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 2, p: 1, borderRadius: 1, border: '2px solid #2c3e50', display: 'flex', alignItems: 'center' }}>
                <BsCheckCircleFill size={30} color="#2c3e50" />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Active Interventions
                </Typography>
              </Box>
            </Box>
            <Typography variant="h3" fontWeight="bold" color="#2c3e50">
              364
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 2, p: 1 }}>
                <MdPeople size={34} color="#2c3e50" />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Communities Impacted
                </Typography>
              </Box>
            </Box>
            <Typography variant="h3" fontWeight="bold" color="#2c3e50">
              37
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 2, p: 1 }}>
                <MdAssignmentLate size={34} color="#2c3e50" />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Critical Tasks Pending
                </Typography>
              </Box>
            </Box>
            <Typography variant="h3" fontWeight="bold" color="#2c3e50">
              56
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Maintenance Schedule */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 1 }}>
        <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
          Maintenance Schedule
        </Typography>
        
        <Box>
          <Box sx={{ 
            py: 2, 
            borderBottom: '1px solid #e0e0e0', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                Water Pump Station
              </Typography>
              <Typography variant="body2" color="text.secondary">
                North District
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                2024-02-15
              </Typography>
              <Chip 
                label="High Priority" 
                size="small" 
                sx={{ 
                  bgcolor: '#ffebee', 
                  color: '#d32f2f',
                  fontWeight: 'medium',
                  fontSize: '0.75rem'
                }} 
              />
            </Box>
          </Box>
          
          <Box sx={{ 
            py: 2, 
            borderBottom: '1px solid #e0e0e0', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                Treatment Plant
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Central Area
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                2024-02-20
              </Typography>
              <Chip 
                label="Medium Priority" 
                size="small" 
                sx={{ 
                  bgcolor: '#fff8e1', 
                  color: '#f57c00',
                  fontWeight: 'medium',
                  fontSize: '0.75rem'
                }} 
              />
            </Box>
          </Box>
          
          <Box sx={{ 
            py: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                Distribution Network
              </Typography>
              <Typography variant="body2" color="text.secondary">
                South District
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                2024-02-25
              </Typography>
              <Chip 
                label="Low Priority" 
                size="small" 
                sx={{ 
                  bgcolor: '#e8f5e9', 
                  color: '#2e7d32',
                  fontWeight: 'medium',
                  fontSize: '0.75rem'
                }} 
              />
            </Box>
          </Box>
        </Box>
      </Paper>
      
      {/* Interventions Table */}
      <Paper sx={{ p: 3, borderRadius: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="medium">
              Interventions
            </Typography>
            <IconButton size="small">
              <MdArrowDropDown />
            </IconButton>
          </Box>
          
          {/* Dropdown Menu */}
          {/* <Box>
            <Button
              id="select-button"
              aria-controls={open ? 'select-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              sx={{ 
                bgcolor: '#fff', 
                border: '1px solid #e0e0e0',
                boxShadow: 'none',
                color: '#000',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  boxShadow: 'none'
                }
              }}
              endIcon={<MdKeyboardArrowDown />}
            >
              SELECT
            </Button>
            <Menu
              id="select-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} selected sx={{ bgcolor: '#e3f2fd', color: '#2196f3' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                  <Typography>Intervention</Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Typography>Projects</Typography>
              </MenuItem>
            </Menu>
          </Box> */}
        </Box>
        
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#1a237e' }}>
              <TableRow>
                <TableCell sx={{ color: '#fff', fontWeight: 'medium' }}>Ward</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'medium' }}>Hamlet</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'medium' }}>Space Type</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'medium' }}>Status</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'medium' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Hunkuyi</TableCell>
                <TableCell>Chlorination</TableCell>
                <TableCell>2025-01-05 - 2025-01-12</TableCell>
                <TableCell>
                  <Chip 
                    label="In Progress" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#e3f2fd', 
                      color: '#1976d2',
                      fontWeight: 'medium'
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    variant="text" 
                    sx={{ 
                      color: '#1976d2',
                      textTransform: 'none'
                    }}
                  >
                    Action
                  </Button>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>Kudan Toun</TableCell>
                <TableCell>Waste Disposal</TableCell>
                <TableCell>2025-01-03 - 2025-01-10</TableCell>
                <TableCell>
                  <Chip 
                    label="Pending" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#fff8e1', 
                      color: '#f57c00',
                      fontWeight: 'medium'
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    variant="text" 
                    sx={{ 
                      color: '#1976d2',
                      textTransform: 'none'
                    }}
                  >
                    Action
                  </Button>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>Doka</TableCell>
                <TableCell>Community Training</TableCell>
                <TableCell>2024-12-15 - 2024-12-20</TableCell>
                <TableCell>
                  <Chip 
                    label="Completed" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#e8f5e9', 
                      color: '#2e7d32',
                      fontWeight: 'medium'
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    variant="text" 
                    sx={{ 
                      color: '#1976d2',
                      textTransform: 'none'
                    }}
                  >
                    Action
                  </Button>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>Likoro</TableCell>
                <TableCell>Chlorination</TableCell>
                <TableCell>2024-12-15 - 2024-12-20</TableCell>
                <TableCell>
                  <Chip 
                    label="Pending" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#fff8e1', 
                      color: '#f57c00',
                      fontWeight: 'medium'
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    variant="text" 
                    sx={{ 
                      color: '#1976d2',
                      textTransform: 'none'
                    }}
                  >
                    Action
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing 1 to 3 of 3 entries
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              sx={{ 
                color: '#9e9e9e',
                textTransform: 'none'
              }}
              disabled
            >
              Previous
            </Button>
            
            <Button 
              sx={{ 
                color: '#fff',
                bgcolor: '#1a237e',
                minWidth: '36px',
                p: 0,
                mx: 1,
                '&:hover': {
                  bgcolor: '#0d1752'
                }
              }}
            >
              1
            </Button>
            
            <Button 
              sx={{ 
                color: '#1976d2',
                textTransform: 'none'
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default InterventionOverview;