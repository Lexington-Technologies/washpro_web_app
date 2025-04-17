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
  Container,
  SelectChangeEvent,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Divider,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaHospital,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaPlus,
  FaTimes,
} from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';

// Type Definitions
interface LocationData {
  id: number;
  location: string;
  suspected: number;
  confirmed: number;
  deaths: number;
  communitiesAffected: number;
  population: number;
  status: 'High Risk' | 'Moderate Risk' | 'Low Risk';
  trend: 'Increasing' | 'Stable' | 'Decreasing';
}

interface MetricItem {
  label: string;
  value: number | string;
}

interface Metric {
  title: string;
  icon: JSX.Element;
  color: string;
  subItems: MetricItem[];
}

interface DashboardData {
  locationData: LocationData[];
  metrics: Metric[];
  metrics2: Metric[];
}

// Add new interfaces for report and analysis
interface CaseReport {
  id: number;
  date: string;
  location: string;
  patientAge: number;
  patientGender: string;
  symptoms: string[];
  testResults: string;
  status: 'Suspected' | 'Confirmed' | 'Recovered' | 'Deceased';
}

interface AnalysisData {
  date: string;
  cases: number;
  deaths: number;
  recoveryRate: number;
}

// Mock API Endpoint
const fetchData = async (): Promise<DashboardData> => {
  const data: DashboardData = {
    locationData: [
      // {
      //   id: 1,
      //   location: 'KUDAN',
      //   suspected: 45,
      //   confirmed: 28,
      //   deaths: 3,
      //   communitiesAffected: 5,
      //   population: 12000,
      //   status: 'High Risk',
      //   trend: 'Increasing'
      // },
      // {
      //   id: 2,
      //   location: 'DOKA',
      //   suspected: 32,
      //   confirmed: 18,
      //   deaths: 1,
      //   communitiesAffected: 3,
      //   population: 8500,
      //   status: 'Moderate Risk',
      //   trend: 'Stable'
      // },
      // {
      //   id: 3,
      //   location: 'HUNKUYI',
      //   suspected: 15,
      //   confirmed: 8,
      //   deaths: 0,
      //   communitiesAffected: 2,
      //   population: 5000,
      //   status: 'Low Risk',
      //   trend: 'Decreasing'
      // },
      // {
      //   id: 4,
      //   location: 'TABA',
      //   suspected: 28,
      //   confirmed: 15,
      //   deaths: 2,
      //   communitiesAffected: 4,
      //   population: 9500,
      //   status: 'Moderate Risk',
      //   trend: 'Increasing'
      // },
      // {
      //   id: 5,
      //   location: 'ZABI',
      //   suspected: 12,
      //   confirmed: 6,
      //   deaths: 0,
      //   communitiesAffected: 2,
      //   population: 6000,
      //   status: 'Low Risk',
      //   trend: 'Decreasing'
      // },
      // {
      //   id: 6,
      //   location: 'K/WALI NORTH',
      //   suspected: 25,
      //   confirmed: 12,
      //   deaths: 1,
      //   communitiesAffected: 3,
      //   population: 7500,
      //   status: 'Moderate Risk',
      //   trend: 'Stable'
      // },
      // {
      //   id: 7,
      //   location: 'K/WALI SOUTH',
      //   suspected: 20,
      //   confirmed: 10,
      //   deaths: 1,
      //   communitiesAffected: 3,
      //   population: 7000,
      //   status: 'Moderate Risk',
      //   trend: 'Stable'
      // },
      {
        id: 1,
        location: 'LIKORO',
        suspected: 10,
        confirmed: 2,
        deaths: 1,
        communitiesAffected: 2,
        population: 21982,
        status: 'Moderate Risk',
        trend: 'Stable'
      },
      {
        id: 2,
        location: 'LIKORO',
        suspected: 2,
        confirmed: 1,
        deaths: 0,
        communitiesAffected: 1,
        population: 15581,
        status: 'Low Risk',
        trend: 'Decreasing'
      }
    ],
    metrics: [
      {
        title: 'Suspected Cases',
        icon: <FaExclamationTriangle />,
        color: '#ef5350',
        subItems: [
          { label: 'Children <5 Years', value: 45 },
          { label: 'Children ≥5 Years', value: 87 },
        ],
      },
      {
        title: 'Rapid Diagnostic Test',
        icon: <FaExclamationTriangle />,
        color: '#ffa726',
        subItems: [
          { label: 'Tested', value: 132 },
          { label: 'Positives', value: 75 },
        ],
      },
      {
        title: 'Laboratory Testing',
        icon: <FaExclamationTriangle />,
        color: '#42a5f5',
        subItems: [
          { label: 'Conducted', value: 98 },
          { label: 'Confirmed', value: '75 (76.5%)' },
        ],
      },
      {
        title: 'Mortality',
        icon: <FaExclamationTriangle />,
        color: '#78909c',
        subItems: [
          { label: 'Facility Deaths', value: 4 },
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
          { label: 'Attack Rate', value: '2.3%' },
          { label: 'Case Fatality Rate', value: '1.5%' },
        ],
      },
      {
        title: 'Ongoing Cases',
        icon: <FaExclamationTriangle />,
        color: '#ffa726',
        subItems: [
          { label: 'Active Cases', value: 86 },
          { label: 'Currently Hospitalised', value: 42 },
        ],
      },
      {
        title: 'Recoveries',
        icon: <FaExclamationTriangle />,
        color: '#42a5f5',
        subItems: [
          { label: 'Recovered', value: 48 },
          { label: 'Recovery Rate', value: '48 (55.8%)' },
        ],
      },
      {
        title: 'Communities',
        icon: <FaExclamationTriangle />,
        color: '#78909c',
        subItems: [
          { label: 'Affected', value: 16 },
          { label: 'Most Affected Ward', value: 'Central Ward' },
        ],
      },
    ],
  };
  return new Promise((resolve) => setTimeout(() => resolve(data), 1000)); // Simulate network delay
};

// Custom Hook to Fetch Data with TanStack Query
const useDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ['choleraOutbreakData'],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });
};

// Filter Dropdown Component
interface FilterDropdownProps {
  label: string;
  options: string[];
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  return (
    <FormControl variant="outlined" sx={{ minWidth: 180 }}>
      <InputLabel sx={{ fontSize: '0.875rem' }}>{label}</InputLabel>
      <Select
        value={selectedOption}
        onChange={(e: SelectChangeEvent) => setSelectedOption(e.target.value)}
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
interface MetricCardProps {
  title: string;
  value?: string | number;
  subItems: MetricItem[];
  icon: JSX.Element;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, subItems, icon, color }) => (
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
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(8);
  const [tabValue, setTabValue] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }
  // if (error) return <Typography>Error loading data</Typography>;
  if (!data) return <Typography>No data available</Typography>;

  const { locationData, metrics, metrics2 } = data;

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => setPage(newPage - 1);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
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
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaPlus />}
            onClick={() => setOpenModal(true)}
            sx={{
              backgroundColor: '#1e3a8a',
              '&:hover': {
                backgroundColor: '#152c5e',
              },
            }}
          >
            Report New Case
          </Button>
          <FilterDropdown label="Time Range" options={['Last 24 Hours', 'Last 7 Days', 'Last 30 Days']} />
        </Box>
      </Box>

      {/* Report Case Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#1e3a8a', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
          px: 3,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)', 
              p: 1, 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaHospital size={20} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Report New Case
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setOpenModal(false)}
            aria-label="close"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ 
                  color: '#1e3a8a',
                  fontWeight: 600,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <FaUser size={16} />
                  Patient Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Patient Name"
                  variant="outlined"
                  size="small"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1e3a8a',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  variant="outlined"
                  size="small"
                  InputProps={{ inputProps: { min: 0, max: 120 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Gender</InputLabel>
                  <Select 
                    label="Gender"
                    sx={{
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1e3a8a',
                      },
                    }}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Location</InputLabel>
                  <Select 
                    label="Location"
                    sx={{
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1e3a8a',
                      },
                    }}
                  >
                    <MenuItem value="kudan">Kudan</MenuItem>
                    <MenuItem value="k_wali_north">K/Wali North</MenuItem>
                    <MenuItem value="k_wali_south">K/Wali South</MenuItem>
                    <MenuItem value="hunkuyi">Hunkuyi</MenuItem>
                    <MenuItem value="likoro">Likoro</MenuItem>
                    <MenuItem value="sabon_gari">Sabon Gari</MenuItem>
                    <MenuItem value="taba">Taba</MenuItem>
                    <MenuItem value="zabi">Zabi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ 
                  color: '#1e3a8a',
                  fontWeight: 600,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <FaExclamationTriangle size={16} />
                  Symptoms & Test Results
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    borderRadius: 1,
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>
                    Select all symptoms present
                  </Typography>
                  <FormGroup>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel 
                          control={<Checkbox />} 
                          label="Diarrhea" 
                          sx={{ 
                            '& .MuiCheckbox-root': {
                              color: '#1e3a8a',
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel 
                          control={<Checkbox />} 
                          label="Vomiting"
                          sx={{ 
                            '& .MuiCheckbox-root': {
                              color: '#1e3a8a',
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel 
                          control={<Checkbox />} 
                          label="Dehydration"
                          sx={{ 
                            '& .MuiCheckbox-root': {
                              color: '#1e3a8a',
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel 
                          control={<Checkbox />} 
                          label="Fever"
                          sx={{ 
                            '& .MuiCheckbox-root': {
                              color: '#1e3a8a',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    borderRadius: 1,
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>
                    Test Results
                  </Typography>
                  <RadioGroup>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <FormControlLabel 
                          value="positive" 
                          control={<Radio />} 
                          label="Positive"
                          sx={{ 
                            '& .MuiRadio-root': {
                              color: '#1e3a8a',
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControlLabel 
                          value="negative" 
                          control={<Radio />} 
                          label="Negative"
                          sx={{ 
                            '& .MuiRadio-root': {
                              color: '#1e3a8a',
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControlLabel 
                          value="pending" 
                          control={<Radio />} 
                          label="Pending"
                          sx={{ 
                            '& .MuiRadio-root': {
                              color: '#1e3a8a',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </RadioGroup>
                </Paper>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        }}>
          <Button
            variant="outlined"
            onClick={() => setOpenModal(false)}
            sx={{ 
              mr: 1,
              px: 3,
              borderColor: '#1e3a8a',
              color: '#1e3a8a',
              '&:hover': {
                borderColor: '#152c5e',
                backgroundColor: 'rgba(30, 58, 138, 0.04)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaHospital />}
            sx={{
              px: 3,
              backgroundColor: '#1e3a8a',
              '&:hover': {
                backgroundColor: '#152c5e',
              },
            }}
          >
            Submit Case Report
          </Button>
        </DialogActions>
      </Dialog>

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

      {/* Split Layout: Tabs on the Left, Table on the Right */}
      <Grid container spacing={3}>
        {/* Left Side: Tabs */}
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
              {/* <Tab label="Report Case" /> */}
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
                      <Typography variant="body1">A23</Typography>
                      <Chip label="Warning" color="warning" size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      10.3m from nearest water source
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Attends islamiyya with 1 water source and 200 pupils
                    </Typography>

                    {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">K/WALI NORTH</Typography>
                      <Chip label="Warning" color="warning" size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      15m from sanitation risk
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">ZABI</Typography>
                      <Chip label="Clear" color="success" size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      45m from nearest risk
                    </Typography> */}
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
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#25306B' }}>
                    Outbreak Analysis
                  </Typography>
                  
                  {/* Case Trend Analysis */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Case Trend Analysis
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FaChartLine style={{ color: '#42a5f5', marginRight: 8 }} />
                      <Typography variant="body2" color="text.secondary">
                        Last 7 Days
                      </Typography>
                    </Box>
                    <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                      {[20, 35, 45, 30, 25, 40, 35].map((value, index) => (
                        <Box
                          key={index}
                          sx={{
                            flex: 1,
                            height: `${value}%`,
                            bgcolor: '#42a5f5',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.75rem',
                            paddingBottom: 1,
                          }}
                        >
                          {value}
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Geographic Distribution */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Geographic Distribution
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FaMapMarkerAlt style={{ color: '#ef5350', marginRight: 8 }} />
                      <Typography variant="body2" color="text.secondary">
                        Cases by Location
                      </Typography>
                    </Box>
                    <Box>
                    {[
                        { location: 'KUDAN', cases: 45, percentage: 35 },
                        { location: 'DOKA', cases: 32, percentage: 25 },
                        { location: 'HUNKUYI', cases: 15, percentage: 12 },
                        { location: 'TABA', cases: 28, percentage: 22 },
                        { location: 'ZABI', cases: 12, percentage: 6 },
                        { location: 'K/WALI NORTH', cases: 25, percentage: 20 },
                        { location: 'K/WALI SOUTH', cases: 20, percentage: 15 }
                      ].map((item, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2">{item.location}</Typography>
                            <Typography variant="body2">{item.cases} cases</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={item.percentage}
                            sx={{
                              height: 8,
                              borderRadius: 1,
                              backgroundColor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#ef5350',
                              },
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Recovery Analysis */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Recovery Analysis
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FaChartPie style={{ color: '#4caf50', marginRight: 8 }} />
                      <Typography variant="body2" color="text.secondary">
                        Recovery Status
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                          variant="determinate"
                          value={75}
                          size={100}
                          thickness={4}
                          sx={{ color: '#4caf50' }}
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
                          <Typography variant="caption" component="div" color="text.secondary">
                            75%
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="body2">Recovered: 75%</Typography>
                        <Typography variant="body2">Active: 20%</Typography>
                        <Typography variant="body2">Deceased: 5%</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Right Side: Table */}
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
                  .map((row: any, index: number) => (
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
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
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
      </Grid>
    </Container>
  );
};

export default CholeraOutbreakDashboard;