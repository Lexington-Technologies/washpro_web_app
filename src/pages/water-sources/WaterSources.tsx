import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Add,
  CheckCircle,
  Warning,
  ErrorOutline,
  Info,
  MoreVert,
  Search,
  Visibility,
} from '@mui/icons-material';
import { FaCheck, FaFaucet, FaFilter, FaTimes, FaWater } from 'react-icons/fa';
import { FaWrench } from 'react-icons/fa6';
import { GiWell } from 'react-icons/gi';

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

// Dummy Data
const tableData = [
  {
    id: '#WS-001',
    type: 'Hand Pump',
    location: 'North District',
    status: 'Functional',
    lastUpdated: '2025-03-15',
  },
  {
    id: '#WS-002',
    type: 'Borehole',
    location: 'East Region',
    status: 'Non-Functional',
    lastUpdated: '2025-03-14',
  },
];

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

// Main Component
const WaterSourcesDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
          <Button startIcon={<Add />} variant="contained" sx={{ bgcolor: '#2CBEEF' }}>
            Add Source
          </Button>
        </Box>
      </Box>

      {/* Main Stats */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { title: 'Total Sources', value: '1,234', icon: <FaFaucet style={{  color: '#2563EB' }} />, bgColor: '#DBEAFE' },
          { title: 'Functional', value: '987', icon: <FaCheck style={{  color: '#4CAF50' }} />, bgColor: '#E8F5E9' },
          { title: 'Non-Functional', value: '247', icon: <FaTimes style={{  color: '#EF5350' }} />, bgColor: '#FFEBEE' },
          { title: 'Maintenance Due', value: '89', icon: <FaWrench style={{  color: '#FFA726' }} />, bgColor: '#FFF3E0' },
          { title: 'Well', value: '1,234', icon: <GiWell style={{  color: '#16A34A' }} />, bgColor: '#DCFCE7' },
          { title: 'Streams', value: '89', icon: <FaWater style={{  color: '#25306B' }} />, bgColor: '#DBEAFE' },
          { title: 'Handpump Boreholes', value: '987', icon: <FaFaucet style={{  color: '#2563EB' }} />, bgColor: '#DBEAFE' },
          { title: 'Motorized Boreholes', value: '247', icon: <FaCheck style={{  color: '#4CAF50' }} />, bgColor: '#E8F5E9' },
          { title: 'Non-Motorized Boreholes', value: '89', icon: <FaTimes style={{  color: '#EF5350' }} />, bgColor: '#FFEBEE' },
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SOURCE ID</TableCell>
                  <TableCell>TYPE</TableCell>
                  <TableCell>LOCATION</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell>LAST UPDATED</TableCell>
                  <TableCell>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={row.status === 'Functional' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{row.lastUpdated}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <Visibility style={{ color: "#2CBEEF" }}/>
                      </IconButton>
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
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
    </Box>
  );
};

export default WaterSourcesDashboard;
