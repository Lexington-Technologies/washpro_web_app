import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Chip,
  Grid,
  LinearProgress,
  Pagination,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { MoreVert, FilterList, FullscreenOutlined, MoreHoriz } from '@mui/icons-material';

const GutterDashboard = () => {
  const [timeframe, setTimeframe] = React.useState('monthly');

  const distributionData = [
    { type: 'Constructed', value: 245, color: '#00bcd4' },
    { type: 'Surface', value: 180, color: '#4caf50' },
    { type: 'Dug', value: 120, color: '#ffc107' }
  ];

  const maintenanceData = [
    { 
      id: 'North Valley Site',
      location: 'North District',
      type: 'Constructed',
      status: 'Maintained',
      lastMaintenance: '2 hours ago'
    },
    {
      id: 'East End Facility',
      location: 'East Zone',
      type: 'Surface',
      status: 'Needs Attention',
      lastMaintenance: '1 day ago'
    }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <div>
          <Typography variant="h5" sx={{ mb: 1 }}>Gutters</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Detailed insights about your selected location
          </Typography>
        </div>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button startIcon={<FilterList />} variant="outlined">
            Filter
          </Button>
          <Button variant="contained" sx={{ bgcolor: '#00bcd4' }}>
            + Add New Site
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Total Site</Typography>
              <Typography variant="h4">24</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Maintained</Typography>
              <Typography variant="h4" sx={{ color: '#4caf50' }}>14</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Overfilled</Typography>
              <Typography variant="h4" sx={{ color: '#f44336' }}>3</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Unmaintained</Typography>
              <Typography variant="h4" sx={{ color: '#ff9800' }}>7</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Gutter Type Distribution</Typography>
                <ToggleButtonGroup
                  size="small"
                  value={timeframe}
                  exclusive
                  onChange={(e, value) => setTimeframe(value)}
                >
                  <ToggleButton value="monthly">Monthly</ToggleButton>
                  <ToggleButton value="yearly">Yearly</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              {distributionData.map((item) => (
                <Box key={item.type} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{item.type}</Typography>
                    <Typography color="text.secondary">{item.value}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(item.value / 245) * 100}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: `${item.color}20`,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: item.color
                      }
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Gutter Location Map</Typography>
                <Box>
                  <IconButton>
                    <FullscreenOutlined />
                  </IconButton>
                  <IconButton>
                    <MoreHoriz />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ height: '300px', bgcolor: '#f5f5f5', borderRadius: 1, p: 2 }}>
                <Typography color="text.secondary">Map Component Placeholder</Typography>
                <Box sx={{ position: 'absolute', bottom: '40px', left: '40px' }}>
                  <Paper sx={{ p: 1 }}>
                    <Typography variant="body2">⬤ Sample Points</Typography>
                    <Typography variant="body2">▢ Density Areas</Typography>
                  </Paper>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Maintenance Status</Typography>
          <Box>
            <Button startIcon={<FilterList />}>Filter</Button>
            <Button>Export</Button>
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>IC</TableCell>
                <TableCell>LOCATION</TableCell>
                <TableCell>TYPE</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell>LAST MAINTENANCE</TableCell>
                <TableCell>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maintenanceData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === 'Maintained' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{row.lastMaintenance}</TableCell>
                  <TableCell>
                    <IconButton>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing 1 to 2 of 1,234 entries
          </Typography>
          <Pagination count={3} color="primary" />
        </Box>
      </Paper>
    </Box>
  );
};

export default GutterDashboard;