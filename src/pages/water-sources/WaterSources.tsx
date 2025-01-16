import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  styled,
  IconButton,
  Card,
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  CircularProgress,
  Menu,
  MenuItem,
  DialogContentText,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  ErrorOutline,
  Info,
  MoreVert,
  Search,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { FaCheck, FaFaucet, FaFilter, FaTimes, FaWater } from 'react-icons/fa';
import { FaWrench } from 'react-icons/fa6';
import { GiWell } from 'react-icons/gi';
import { apiController } from '../../axios';
import { useSnackStore } from '../../store';

// Interfaces
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
}

interface MetricProps {
  value: number;
  label: string;
  color: string;
}

interface MaintenanceItem {
  type: string;
  time: string;
}

interface AlertItem {
  type: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface WaterSource {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  geolocation: {
    type: string;
    coordinates: number[];
  };
  quality: string;
  status: string;
  type: string;
  createdBy: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  geolocation: {
    type: string;
    coordinates: number[];
  };
  quality: string;
  status: string;
  type: string;
}

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  height: '100%',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
}));

const StyledMetricCircle = styled(Box)<{ bgcolor: string }>(({ bgcolor }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: bgcolor,
  margin: '0 auto',
}));

// Components
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor }) => (
  <StyledPaper>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
        <Typography variant="h4" sx={{ mt: 1, fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          bgcolor: bgColor,
          p: 1,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
    </Box>
  </StyledPaper>
);

const MetricItem: React.FC<MetricProps> = ({ value, label, color }) => (
  <Box sx={{ textAlign: 'center', px: 2 }}>
    <StyledMetricCircle bgcolor={color}>
      <Typography variant="h5" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </StyledMetricCircle>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
      {label}
    </Typography>
  </Box>
);

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => (
  <div hidden={value !== index}>
    {value === index && (
      <Box sx={{ pt: 3 }}>
        {children}
      </Box>
    )}
  </div>
);

const maintenanceItems: MaintenanceItem[] = [
  { type: 'Filter Replacement', time: '2 hours ago' },
  { type: 'Pump Maintenance', time: '1 day ago' },
  { type: 'Pump Maintenance', time: '1 day ago' },
  { type: 'Pump Maintenance', time: '1 day ago' },
];

const alertItems: AlertItem[] = [
  {
    type: 'Critical: Pump Failure',
    message: 'Borehole #247 requires immediate attention',
    severity: 'error',
  },
  {
    type: 'Maintenance Due',
    message: '5 sources require scheduled maintenance',
    severity: 'warning',
  },
  {
    type: 'Water Quality Check',
    message: 'Quality test pending for Well #128',
    severity: 'info',
  },
];

const metrics = [
  { value: 8.5, label: 'Clarity', color: '#DBEAFE' },
  { value: 9.0, label: 'Taste', color: '#DCFCE7' },
  { value: 7.5, label: 'Odor', color: '#FEF9C3' },
  { value: 8.0, label: 'Turbidity', color: '#F3E8FF' },
  { value: 8.8, label: 'Conductivity', color: '#E0E7FF' },
];

const getSeverityColor = (severity: AlertItem['severity']) => {
  switch (severity) {
    case 'error':
      return '#FEE2E2';
    case 'warning':
      return '#FEF3C7';
    case 'info':
      return '#E0F2FE';
    default:
      return '#F3F4F6';
  }
};

const getSeverityIcon = (severity: AlertItem['severity']) => {
  switch (severity) {
    case 'error':
      return <ErrorOutline color="error" />;
    case 'warning':
      return <Warning color="warning" />;
    case 'info':
      return <Info color="info" />;
    default:
      return null;
  }
};

const calculateAnalytics = (sources: WaterSource[]) => {
  return {
    totalSources: sources.length,
    functional: sources.filter(s => s.status === 'Functional').length,
    nonFunctional: sources.filter(s => s.status === 'Non-Functional').length,
    maintenanceDue: sources.filter(s => s.status === 'Maintenance Due').length,
    wells: sources.filter(s => s.type === 'Well').length,
    streams: sources.filter(s => s.type === 'Stream').length,
    handpumpBoreholes: sources.filter(s => s.type === 'Handpump Borehole').length,
    motorizedBoreholes: sources.filter(s => s.type === 'Motorized Borehole').length,
    nonMotorizedBoreholes: sources.filter(s => s.type === 'Non-Motorized Borehole').length,
  };
};

// Main Component
const WaterSourcesDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [waterSources, setWaterSources] = useState<WaterSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setAlert } = useSnackStore();
  const [selectedSource, setSelectedSource] = useState<WaterSource | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    picture: '',
    ward: '',
    village: '',
    hamlet: '',
    geolocation: {
      type: 'Point',
      coordinates: [0, 0]
    },
    quality: '',
    status: '',
    type: ''
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analytics, setAnalytics] = useState({
    totalSources: 0,
    functional: 0,
    nonFunctional: 0,
    maintenanceDue: 0,
    wells: 0,
    streams: 0,
    handpumpBoreholes: 0,
    motorizedBoreholes: 0,
    nonMotorizedBoreholes: 0,
  });

  const fetchWaterSources = async () => {
    setIsLoading(true);
    try {
      const data = await apiController.get<WaterSource[]>('/water-sources');
      setWaterSources(data || []);
      setAnalytics(calculateAnalytics(data || []));
    } catch (error) {
      console.error('Error fetching water sources:', error);
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch water sources'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterSources();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, source: WaterSource) => {
    setAnchorEl(event.currentTarget);
    setSelectedSource(source);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewSource = async (id: string) => {
    try {
      setLoading(true);
      const data = await apiController.get<WaterSource>(`/water-sources/${id}`);
      setSelectedSource(data);
      setOpenViewModal(true);
    } catch (error) {
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch source details'
      });
    } finally {
      setLoading(false);
    }
    handleMenuClose();
  };

  const handleEditClick = async (id: string) => {
    try {
      setLoading(true);
      const data  = await apiController.get<WaterSource>(`/water-sources/${id}`);
      setSelectedSource(data);
      setFormData({
        picture: data.picture,
        ward: data.ward,
        village: data.village,
        hamlet: data.hamlet,
        geolocation: data.geolocation,
        quality: data.quality,
        status: data.status,
        type: data.type,
      });
      setOpenEditModal(true);
    } catch (error) {
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch source details'
      });
    } finally {
      setLoading(false);
    }
    handleMenuClose();
  };

  const handleUpdateSource = async () => {
    if (!selectedSource?._id) return; // Ensure a source is selected
  
    try {
      setLoading(true); // Start loader
      const formDataToSend = new FormData();
  
      // Append image if a new one is selected
      if (selectedImage) {
        formDataToSend.append('picture', selectedImage);
      }
  
      // Append other form data fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'picture') {
          if (key === 'geolocation') {
            // Stringify geolocation object
            formDataToSend.append(key, JSON.stringify(value));
          } else {
            // Append other fields as strings
            formDataToSend.append(key, value as string);
          }
        }
      });
  
      // API call to update the water source
      await apiController.put(`/water-sources/${selectedSource._id}`, formDataToSend);
  
      // Success alert
      setAlert({
        variant: 'success',
        message: 'Water source updated successfully',
      });
  
      // Close modal and refresh data
      setOpenEditModal(false);
      fetchWaterSources();
    } catch (error) {
      // Error handling
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to update water source',
      });
    } finally {
      setLoading(false); // Stop loader
    }
  };
  
  const handleDeleteClick = (source: WaterSource) => {
    setSelectedSource(source);
    setOpenDeleteModal(true);
    handleMenuClose();
  };

  const handleDeleteSource = async () => {
    if (!selectedSource?._id) return;

    try {
      setLoading(true);
      await apiController.delete(`/water-sources/${selectedSource._id}`);
      setAlert({
        variant: 'success',
        message: 'Water source deleted successfully'
      });
      setOpenDeleteModal(false);
      fetchWaterSources();
    } catch (error) {
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete water source'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
            Water Sources
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed insights about your selected location
          </Typography>
        </Box>
        <Box>
          <Button startIcon={<FaFilter style={{color: "#000000"}} />} variant="outlined" sx={{ mr: 1, borderColor: '#000000' }}>
            <Typography variant="body1" color="#000000">Filter</Typography>
          </Button>
        </Box>
      </Box>

      {/* Main Stats */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { 
            title: 'Total Sources', 
            value: analytics.totalSources, 
            icon: <FaFaucet style={{ color: '#2563EB' }} />, 
            bgColor: '#DBEAFE' 
          },
          { 
            title: 'Functional', 
            value: analytics.functional, 
            icon: <FaCheck style={{ color: '#4CAF50' }} />, 
            bgColor: '#E8F5E9' 
          },
          { 
            title: 'Non-Functional', 
            value: analytics.nonFunctional, 
            icon: <FaTimes style={{ color: '#EF5350' }} />, 
            bgColor: '#FFEBEE' 
          },
          { 
            title: 'Maintenance Due', 
            value: analytics.maintenanceDue, 
            icon: <FaWrench style={{ color: '#FFA726' }} />, 
            bgColor: '#FFF3E0' 
          },
          { 
            title: 'Well', 
            value: analytics.wells, 
            icon: <GiWell style={{ color: '#16A34A' }} />, 
            bgColor: '#DCFCE7' 
          },
          { 
            title: 'Streams', 
            value: analytics.streams, 
            icon: <FaWater style={{ color: '#25306B' }} />, 
            bgColor: '#DBEAFE' 
          },
          { 
            title: 'Handpump Boreholes', 
            value: analytics.handpumpBoreholes, 
            icon: <FaFaucet style={{ color: '#2563EB' }} />, 
            bgColor: '#DBEAFE' 
          },
          { 
            title: 'Motorized Boreholes', 
            value: analytics.motorizedBoreholes, 
            icon: <FaCheck style={{ color: '#4CAF50' }} />, 
            bgColor: '#E8F5E9' 
          },
          { 
            title: 'Non-Motorized Boreholes', 
            value: analytics.nonMotorizedBoreholes, 
            icon: <FaTimes style={{ color: '#EF5350' }} />, 
            bgColor: '#FFEBEE' 
          },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Maintenance, progress and Alerts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
  <Grid item xs={12} md={4}>
    <StyledPaper>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, }}>
        Water Quality Index
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={85}
            size={120}
            thickness={4}
            sx={{ color: '#4CAF50' }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h4" sx={{ color: '#4CAF50' }}>
              85
            </Typography>
          </Box>
        </Box>
        <Typography variant="h6" sx={{ color: '#4CAF50', mt: 2 }}>
          Excellent
        </Typography>
      </Box>
      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ mt: 3 }}
      >
        <Tab label="Physical" />
        <Tab label="Chemical" />
        <Tab label="Microbiological" />
      </Tabs>
    </StyledPaper>
  </Grid>

  <Grid item xs={12} md={4}>
    <StyledPaper>
    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, }}>
    Recent Maintenance
      </Typography>
      <List>
        {maintenanceItems.map((item, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <CheckCircle sx={{ color: '#4CAF50' }} />
            </ListItemIcon>
            <ListItemText primary={item.type} secondary={item.time} />
          </ListItem>
        ))}
      </List>
    </StyledPaper>
  </Grid>

  <Grid item xs={12} md={4}>
    <StyledPaper>
    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, }}>
    Alert Notifications
      </Typography>
      <List>
        {alertItems.map((alert, index) => (
          <ListItem
            key={index}
            sx={{
              bgcolor: getSeverityColor(alert.severity),
              borderRadius: 1,
              mb: 1,
            }}
          >
            <ListItemIcon>{getSeverityIcon(alert.severity)}</ListItemIcon>
            <ListItemText primary={alert.type} secondary={alert.message} />
          </ListItem>
        ))}
      </List>
    </StyledPaper>
  </Grid>
      </Grid>

      {/* Water Quality Tabs */}
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
  <Tabs
    value={tabValue}
    onChange={handleTabChange}
    sx={{
      borderBottom: 1,
      borderColor: 'divider',
      '& .MuiTab-root': { minWidth: 'unset', px: 3 },
      '& .Mui-selected': { color: '#0EA5E9' },
      '& .MuiTabs-indicator': { backgroundColor: '#0EA5E9' },
    }}
  >
    <Tab label="Physical" />
    <Tab label="Chemical" />
    <Tab label="Microbiological" />
  </Tabs>

  <TabPanel value={tabValue} index={0}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflowX: 'auto',
        gap: 2,
        pt: 3,
      }}
    >
      {metrics.map((metric, index) => (
        <MetricItem key={index} value={metric.value} label={metric.label} color={metric.color} />
      ))}
    </Box>
  </TabPanel>

  <TabPanel value={tabValue} index={1}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflowX: 'auto',
        gap: 2,
        pt: 3,
      }}
    >
      {metrics.map((metric, index) => (
        <MetricItem
          key={index}
          value={metric.value}
          label={`${metric.label} (Chemical)`}
          color={metric.color}
        />
      ))}
    </Box>
  </TabPanel>

  <TabPanel value={tabValue} index={2}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflowX: 'auto',
        gap: 2,
        pt: 3,
      }}
    >
      {metrics.map((metric, index) => (
        <MetricItem
          key={index}
          value={metric.value}
          label={`${metric.label} (Microbiological)`}
          color={metric.color}
        />
      ))}
    </Box>
  </TabPanel>
</Paper>

      {/* Table Section */}
      <Card sx={{ mt: 3 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{fontWeight:600,}}>Water Sources Overview</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                size="small"
                placeholder="Search sources..."
                InputProps={{ startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} /> }}
              />
              <Button startIcon={<FaFilter style={{ color: "#1F2937" }} />}>
                <Typography variant="body1" color="#1F2937">
                  Filter
                </Typography>
              </Button>
            </Box>
          </Box>
          
          <TableContainer sx={{ 
            maxHeight: '500px',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            },
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>S/N</TableCell>
                  <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>Type</TableCell>
                  <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>Ward</TableCell>
                  <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>Village</TableCell>
                  <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>Hamlet</TableCell>
                  <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>Quality</TableCell>
                  <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>Status</TableCell>
                  <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>Captured At</TableCell>
                  <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : waterSources.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                      No water sources found
                    </TableCell>
                  </TableRow>
                ) : (
                  waterSources.map((source, index) => (
                    <TableRow key={source._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{source.type}</TableCell>
                      <TableCell>{source.ward}</TableCell>
                      <TableCell>{source.village}</TableCell>
                      <TableCell>{source.hamlet}</TableCell>
                      <TableCell>{source.quality}</TableCell>
                      <TableCell>
                        <Chip
                          label={source.status}
                          size="small"
                          sx={{
                            bgcolor: source.status === 'Functional' ? '#dcfce7' : '#fee2e2',
                            color: source.status === 'Functional' ? '#16a34a' : '#dc2626',
                            textTransform: 'capitalize',
                          }}
                        />
                      </TableCell>
                      <TableCell>{new Date(source.capturedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleMenuClick(e, source)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing 1 to 2 of 1,234 entries
            </Typography>
            <Pagination count={10} shape="rounded" />
          </Box>
        </Box>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedSource && handleViewSource(selectedSource._id)}>
          <Visibility sx={{ mr: 1 }} /> View
        </MenuItem>
        <MenuItem onClick={() => selectedSource && handleEditClick(selectedSource._id)}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem 
          onClick={() => selectedSource && handleDeleteClick(selectedSource)}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)} maxWidth="md" fullWidth>
        
        <DialogTitle>Water Source Details</DialogTitle>
        <DialogContent>
          {selectedSource && (
            <Box sx={{ mt: 2 }}>
              {selectedSource.picture && (
                <Box sx={{ mb: 2 }}>
                  <img 
                    src={selectedSource.picture} 
                    alt="Water Source" 
                    style={{ 
                      width: '100%', 
                      maxHeight: '300px', 
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }} 
                  />
                </Box>
              )}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Hamlet</Typography>
                  <Typography>{selectedSource.hamlet}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Ward</Typography>
                  <Typography>{selectedSource.ward}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Village</Typography>
                  <Typography>{selectedSource.village}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Type</Typography>
                  <Typography>{selectedSource.type}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Quality</Typography>
                  <Typography>{selectedSource.quality}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Status</Typography>
                  <Chip
                    label={selectedSource.status}
                    size="small"
                    sx={{
                      bgcolor: selectedSource.status === 'Functional' ? '#dcfce7' : '#fee2e2',
                      color: selectedSource.status === 'Functional' ? '#16a34a' : '#dc2626',
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Water Source</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Current Image Preview */}
            {formData.picture && (
              <Box sx={{ mb: 2 }}>
                <img 
                  src={formData.picture} 
                  alt="Current" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }} 
                />
              </Box>
            )}
            
            {/* Image Upload */}
            <TextField
              type="file"
              onChange={handleImageChange}
              InputProps={{
                inputProps: { accept: 'image/*' }
              }}
            />

            {/* Form Fields */}
            <TextField
              fullWidth
              label="Ward"
              name="ward"
              value={formData.ward}
              onChange={handleFormChange}
            />

            <TextField
              fullWidth
              label="Village"
              name="village"
              value={formData.village}
              onChange={handleFormChange}
            />

            <TextField
              fullWidth
              label="Hamlet"
              name="hamlet"
              value={formData.hamlet}
              onChange={handleFormChange}
            />

            <TextField
              select
              fullWidth
              label="Type"
              name="type"
              value={formData.type || ''}
              onChange={handleFormChange}
            >
              <MenuItem value="Well">Well</MenuItem>
              <MenuItem value="Stream">Stream</MenuItem>
              <MenuItem value="Handpump Borehole">Handpump Borehole</MenuItem>
              <MenuItem value="Motorized Borehole">Motorized Borehole</MenuItem>
              <MenuItem value="Non-Motorized Borehole">Non-Motorized Borehole</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="Quality"
              name="quality"
              value={formData.quality || ''}
              onChange={handleFormChange}
            >
              <MenuItem value="Good">Good</MenuItem>
              <MenuItem value="Fair">Fair</MenuItem>
              <MenuItem value="Poor">Poor</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status || ''}
              onChange={handleFormChange}
            >
              <MenuItem value="Functional">Functional</MenuItem>
              <MenuItem value="Non-Functional">Non-Functional</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateSource} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Delete Water Source</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this water source? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteSource} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WaterSourcesDashboard;