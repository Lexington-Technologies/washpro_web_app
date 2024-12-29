import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  IconButton,
  Alert,
  Pagination,
} from '@mui/material';
import {
  FilterAlt,
  Add,
  Download,
  Search,
  Visibility,
  MoreVert,
  LocalDrink,
  CheckCircle,
  Cancel,
  Build,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const WaterSourceDashboard = () => {
  const chartData = [
    {
      name: 'Hand Pump Boreholes',
      count: 62,
      percentage: 25,
    },
    {
      name: 'Motorized Boreholes',
      count: 27,
      percentage: 81.84,
    },
    {
      name: 'Wells (Covered & Open)',
      count: 55,
      percentage: 40.23,
    },
    {
      name: 'Surface Water Points',
      count: 33,
      percentage: 29.38,
    },
    {
      name: 'Other Sources',
      count: 25,
      percentage: 15.52,
    },
  ];

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

  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: '#f8f9fa' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="600" color="primary.dark" gutterBottom>
            Water Source Information
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed insights about your selected location
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterAlt />}
            sx={{ mr: 2 }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            color="info"
          >
            Add Space
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>Total Sources</Typography>
                <Typography variant="h4">1,234</Typography>
              </Box>
              <LocalDrink sx={{ color: 'primary.main' }} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>Functional</Typography>
                <Typography variant="h4">987</Typography>
              </Box>
              <CheckCircle sx={{ color: 'success.main' }} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>Non-Functional</Typography>
                <Typography variant="h4">247</Typography>
              </Box>
              <Cancel sx={{ color: 'error.main' }} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>Maintenance Due</Typography>
                <Typography variant="h4">89</Typography>
              </Box>
              <Build sx={{ color: 'warning.main' }} />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Chart and Notifications */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Water Source Distribution</Typography>
              <Box>
                <Button startIcon={<Download />} sx={{ mr: 1 }}>Export</Button>
                <Button startIcon={<FilterAlt />}>Filter</Button>
              </Box>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="percentage" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Alert Notifications</Typography>
            <Box sx={{ mt: 2 }}>
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Critical: Pump Failure</Typography>
                <Typography variant="body2">Borehole #247 requires immediate attention</Typography>
              </Alert>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Maintenance Due</Typography>
                <Typography variant="body2">5 sources require scheduled maintenance</Typography>
              </Alert>
              <Alert severity="info">
                <Typography variant="subtitle2">Water Quality Check</Typography>
                <Typography variant="body2">Quality test pending for Well #128</Typography>
              </Alert>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Table */}
      <Card>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Water Sources Overview</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                size="small"
                placeholder="Search sources..."
                InputProps={{
                  startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              />
              <Button startIcon={<FilterAlt />}>Filter</Button>
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
                        <Visibility />
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
    </Container>
  );
};

export default WaterSourceDashboard;