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
  Button,
  Alert,
  Stack,
} from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaExclamationTriangle, FaFileDownload, FaFilter, FaHandsWash, FaPlus, FaToilet } from 'react-icons/fa';
import { FaScrewdriverWrench } from 'react-icons/fa6';

const Sanitation: React.FC = () => {
  // Sample data for charts
  const statusData = [
    { name: 'Functional', value: 1890 },
    { name: 'Needs Repair', value: 566 },
  ];

  const facilitiesData = [
    { name: 'Public Toilets', value: 45 },
    { name: 'Community Toilets', value: 30 },
    { name: 'Household Toilets', value: 25 },
  ];

  const COLORS = ['#4CAF50', '#FFC107', '#2196F3'];

  const locationData = [
    {
      location: 'North Ward',
      totalFacilities: 245,
      functional: 198,
      status: 'Good',
    },
    {
      location: 'South Ward',
      totalFacilities: 189,
      functional: 145,
      status: 'Needs Attention',
    },
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#F3F4F6', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600 }}>
            Sanitation
          </Typography>
          <Button
            startIcon={<FaFilter />}
            variant="contained"
            sx={{
              bgcolor: 'white',
              color: 'text.primary',
              boxShadow: 1,
              '&:hover': { bgcolor: '#E5E7EB' },
              textTransform: 'none',
            }}
          >
            Filter
          </Button>
        </Box>

        {/* Stats Cards */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <StatsCard
            title="Total Toilets"
            value="2,456"
            icon={<FaToilet style={{ color: '#2196F3', fontSize: "20px" }} />}
          />
          <StatsCard
            title="Maintained Toilets"
            value="1,890"
            icon={<FaScrewdriverWrench style={{ color: '#4CAF50',fontSize: "20px" }} />}
          />
          <StatsCard
            title="Handwashing Facilities"
            value="78%"
            icon={<FaHandsWash style={{ color: '#9C27B0', fontSize: "20px" }} />}
          />
          <StatsCard
            title="Open Defecation Status"
            value="12%"
            icon={<FaExclamationTriangle style={{ color: '#f44336',fontSize: "20px" }} />}
          />
        </Stack>

        {/* Charts Section */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Facility Status Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Facility Types Overview
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={facilitiesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {facilitiesData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Location Table */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Location-wise Sanitation Data
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Location</TableCell>
                    <TableCell>Total Facilities</TableCell>
                    <TableCell>Functional</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locationData.map((row) => (
                    <TableRow key={row.location}>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.totalFacilities}</TableCell>
                      <TableCell>{row.functional}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: row.status === 'Good' ? '#DCFCE7' : '#FEF9C3',
                            color: row.status === 'Good' ? '#166534' : '#854D0E',
                          }}
                        >
                          {row.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Critical Alerts</Typography>
              <Box>
                <Button startIcon={<FaFileDownload />} variant="contained" sx={{ mr: 1, bgcolor: "#2CBEEF" }}>
                  Download Report
                </Button>
                <Button startIcon={<FaPlus />} variant="contained" sx={{ mr: 1, bgcolor: "#16A34A" }}>
                  Propose Maintenance
                </Button>
              </Box>
            </Box>
            <Alert
              severity="error"
              icon={<FaExclamationTriangle  style={{ color: '#f44336', fontSize: '24px' }} />} // Font Awesome Exclamation Icon
              sx={{
                display: 'flex',
                alignItems: 'center',
                '.MuiAlert-message': {
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                },
              }}
            >
              <span>East Ward Facility #23 needs urgent repair</span>
              <Box
                sx={{
                  bgcolor: '#FEF2F2',
                  color: 'error.dark',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                High Priority
              </Box>
            </Alert>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => (
  <Card sx={{ flex: 1 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        {icon}
      </Box>
    </CardContent>
  </Card>
);

export default Sanitation;
