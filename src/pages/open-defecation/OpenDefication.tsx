import React from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import InfoIcon from '@mui/icons-material/Info';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const timeDistributionData = [
  {
    name: 'Count',
    'Motorized Boreholes': 25,
    'Wells (Covered & Open)': 60,
    'Surface Water Points': 35,
  },
  {
    name: 'Percentage',
    'Motorized Boreholes': 80,
    'Wells (Covered & Open)': 25,
    'Surface Water Points': 15,
  },
];

const OpenDefication = () => {
  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 0.5 }}>
            Open Defecation Observation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed insights about your selected location
          </Typography>
        </Box>
        <Button
          startIcon={<FilterAltIcon />}
          variant="contained"
          sx={{
            bgcolor: 'white',
            color: 'text.primary',
            boxShadow: 1,
            '&:hover': { bgcolor: 'grey.100' },
            textTransform: 'none'
          }}
        >
          Filter
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <StatsCard
          title="Total Observations"
          value="1,234"
          icon={<VisibilityIcon />}
          iconColor="#2196f3"
        />
        <StatsCard
          title="High Risk Areas"
          value="28"
          icon={<WarningIcon />}
          iconColor="#f44336"
        />
        <StatsCard
          title="Average Daily Cases"
          value="42"
          icon={<AccessTimeIcon />}
          iconColor="#ff9800"
        />
        <StatsCard
          title="Active Monitors"
          value="15"
          icon={<GroupIcon />}
          iconColor="#4caf50"
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {/* Geographic Distribution */}
        <Paper sx={{ flex: 1, p: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Geographic Distribution</Typography>
            <Box>
              <IconButton size="small"><FullscreenIcon /></IconButton>
              <IconButton size="small"><InfoIcon /></IconButton>
            </Box>
          </Box>
          <Box
            component="img"
            src="/api/placeholder/600/300"
            alt="Geographic distribution map"
            sx={{ 
              width: '100%',
              height: 300,
              objectFit: 'cover',
              borderRadius: 1
            }}
          />
        </Paper>

        {/* Time Distribution */}
        <Paper sx={{ flex: 1, p: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Time Distribution</Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="Motorized Boreholes" fill="#8884d8" />
                <Bar dataKey="Wells (Covered & Open)" fill="#82ca9d" />
                <Bar dataKey="Surface Water Points" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>

      {/* Recent Observations Table */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Recent Observations</Typography>
          <Box>
            <Button startIcon={<FilterAltIcon />} sx={{ mr: 1 }}>Filter</Button>
            <Button startIcon={<FileDownloadIcon />}>Export</Button>
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Location</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Demographics</TableCell>
                <TableCell>Risk Level</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <ObservationRow
                location="Sector 7, Block B"
                date="08:30 AM"
                demographics="Child"
                riskLevel="high"
              />
              <ObservationRow
                location="Sector 4, Block A"
                date="09:15 AM"
                demographics="Adult Male"
                riskLevel="medium"
              />
              <ObservationRow
                location="Sector 2, Block D"
                date="10:45 AM"
                demographics="Adult Female"
                riskLevel="low"
              />
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing 3 of 50 entries
          </Typography>
          <Pagination count={3} shape="rounded" />
        </Box>
      </Paper>
    </Box>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, iconColor }) => (
  <Card sx={{ flex: 1, p: 2, borderRadius: 2 }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
      <Box sx={{ 
        bgcolor: `${iconColor}15`, 
        p: 1, 
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {React.cloneElement(icon, { sx: { color: iconColor } })}
      </Box>
    </Box>
  </Card>
);

// Observation Row Component
interface ObservationRowProps {
  location: string;
  date: string;
  demographics: string;
  riskLevel: 'high' | 'medium' | 'low';
}

const ObservationRow: React.FC<ObservationRowProps> = ({ location, date, demographics, riskLevel }) => {
  const getRiskColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  return (
    <TableRow>
      <TableCell>{location}</TableCell>
      <TableCell>{date}</TableCell>
      <TableCell>{demographics}</TableCell>
      <TableCell>
        <Box
          sx={{
            display: 'inline-block',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            bgcolor: `${getRiskColor(riskLevel)}15`,
            color: getRiskColor(riskLevel),
            fontWeight: 500,
          }}
        >
          {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
        </Box>
      </TableCell>
      <TableCell>
        <IconButton size="small">
          <MoreVertIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default OpenDefication;