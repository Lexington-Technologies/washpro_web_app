import React, { useState } from 'react';
import {
  Box,
  Card,
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
  ToggleButton,
  ToggleButtonGroup,
  Pagination
} from '@mui/material';
import {
  MoreVert,
  FilterList,
  Fullscreen,
  MoreHoriz,
  PieChart,
  CheckCircle,
  Error,
  Warning
} from '@mui/icons-material';

const GutterDashboard = () => {
  const [timeframe, setTimeframe] = useState('monthly');

  const gutterTypes = [
    { type: 'Constructed', value: 245, color: '#00B4D8' },
    { type: 'Surface', value: 180, color: '#4CAF50' },
    { type: 'Dug', value: 120, color: '#FFC107' }
  ];

  const maintenanceData = [
    {
      ic: 'North Valley Site',
      location: 'North District',
      type: 'Constructed',
      status: 'Maintained',
      lastMaintenance: '2 hours ago'
    },
    {
      ic: 'East End Facility',
      location: 'East Zone',
      type: 'Surface',
      status: 'Needs Attention',
      lastMaintenance: '1 day ago'
    }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#2C3E50', fontWeight: 600, mb: 0.5 }}>
            Gutters
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Detailed insights about your selected location
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<FilterList />}
            variant="outlined"
            sx={{ 
              color: '#64748B',
              borderColor: '#E2E8F0',
              bgcolor: '#F8FAFC',
              '&:hover': { bgcolor: '#F1F5F9', borderColor: '#CBD5E1' }
            }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            sx={{ 
              bgcolor: '#0EA5E9',
              '&:hover': { bgcolor: '#0284C7' }
            }}
          >
            + Add New Site
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography color="text.secondary">Total Site</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>24</Typography>
          </Box>
          <PieChart sx={{ color: '#3B82F6', opacity: 0.2, ml: 'auto' }} />
        </Card>
        <Card sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography color="text.secondary">Maintained</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#4CAF50' }}>14</Typography>
          </Box>
          <CheckCircle sx={{ color: '#4CAF50', opacity: 0.2, ml: 'auto' }} />
        </Card>
        <Card sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography color="text.secondary">Overfilled</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#EF4444' }}>3</Typography>
          </Box>
          <Error sx={{ color: '#EF4444', opacity: 0.2, ml: 'auto' }} />
        </Card>
        <Card sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography color="text.secondary">Unmaintained</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#F59E0B' }}>7</Typography>
          </Box>
          <Warning sx={{ color: '#F59E0B', opacity: 0.2, ml: 'auto' }} />
        </Card>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {/* Distribution */}
        <Card sx={{ flex: '0 0 320px', p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Gutter <br /> Type Distribution</Typography>
            <ToggleButtonGroup
              size="small"
              value={timeframe}
              exclusive
              onChange={(e, value) => value && setTimeframe(value)}
              sx={{ height: 32 }}
            >
              <ToggleButton value="monthly" sx={{ px: 2 }}>Monthly</ToggleButton>
              <ToggleButton value="yearly" sx={{ px: 2 }}>Yearly</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          {gutterTypes.map((item) => (
            <Box key={item.type} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>{item.type}</Typography>
                <Typography sx={{ color: item.color }}>{item.value}</Typography>
              </Box>
              <Box
                sx={{
                  height: 8,
                  bgcolor: '#F1F5F9',
                  borderRadius: 4,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    width: `${(item.value / 245) * 100}%`,
                    height: '100%',
                    bgcolor: item.color,
                    borderRadius: 4
                  }}
                />
              </Box>
            </Box>
          ))}
        </Card>

        {/* Map */}
        <Card sx={{ flex: 1, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Gutter Location Map</Typography>
            <Box>
              <IconButton>
                <Fullscreen />
              </IconButton>
              <IconButton>
                <MoreHoriz />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ height: 400, bgcolor: '#F8FAFC', borderRadius: 1 }}>
            {/* Map placeholder */}
            <Typography sx={{ p: 2, color: '#94A3B8' }}>Map Component Placeholder</Typography>
          </Box>
        </Card>
      </Box>

      {/* Maintenance Table */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Maintenance Status</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
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
                <TableCell align="right">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maintenanceData.map((row) => (
                <TableRow key={row.ic}>
                  <TableCell>{row.ic}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        bgcolor: row.status === 'Maintained' ? '#4CAF5020' : '#F59E0B20',
                        color: row.status === 'Maintained' ? '#4CAF50' : '#F59E0B',
                        fontWeight: 500,
                        borderRadius: 1
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.lastMaintenance}</TableCell>
                  <TableCell align="right">
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
          <Pagination count={3} shape="rounded" />
        </Box>
      </Paper>
    </Box>
  );
};

export default GutterDashboard;