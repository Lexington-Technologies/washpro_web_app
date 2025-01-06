import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
} from '@mui/material';
import {
  VerifiedUser,
  People,
  TrendingUp,
  Assignment,
} from '@mui/icons-material';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  prefix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, prefix }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        {icon}
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4">
        {prefix}{value}
      </Typography>
    </CardContent>
  </Card>
);

interface Intervention {
  name: string;
  location: string;
  category: string;
  startDate: string;
  endDate: string;
  status: 'In Progress' | 'Pending' | 'Completed';
}

const getStatusChipColor = (status: string) => {
  switch (status) {
    case 'In Progress':
      return 'info';
    case 'Pending':
      return 'warning';
    case 'Completed':
      return 'success';
    default:
      return 'default';
  }
};

const InterventionOverview: React.FC = () => {
  const stats = [
    {
      icon: <VerifiedUser color="primary" />,
      title: "Total Active Interventions",
      value: "364"
    },
    {
      icon: <People color="primary" />,
      title: "Communities Impacted",
      value: "37"
    },
    {
      icon: <TrendingUp color="primary" />,
      title: "Total Budget Utilized",
      value: "500K",
      prefix: "₦"
    },
    {
      icon: <Assignment color="primary" />,
      title: "Critical Tasks Pending",
      value: "56"
    }
  ];

  const interventions: Intervention[] = [
    {
      name: "Chlorination Initiative",
      location: "Hunkuyi",
      category: "Chlorination",
      startDate: "2025-01-05",
      endDate: "2025-01-12",
      status: "In Progress"
    },
    {
      name: "Waste Management Drive",
      location: "Kudan Toun",
      category: "Waste Disposal",
      startDate: "2025-01-03",
      endDate: "2025-01-10",
      status: "Pending"
    },
    {
      name: "Community Health Training",
      location: "Doka",
      category: "Community Training",
      startDate: "2024-12-15",
      endDate: "2024-12-20",
      status: "Completed"
    },
    {
      name: "Borehole Maintenance",
      location: "Likoro",
      category: "Chlorination",
      startDate: "2024-12-15",
      endDate: "2024-12-20",
      status: "Pending"
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Intervention Overview
        </Typography>
        <Box display="flex" gap={2}>
          <Select size="small" defaultValue="LGA">
            <MenuItem value="LGA">LGA</MenuItem>
          </Select>
          <Select size="small" defaultValue="Ward">
            <MenuItem value="Ward">Ward</MenuItem>
          </Select>
          <Select size="small" defaultValue="Village">
            <MenuItem value="Village">Village</MenuItem>
          </Select>
          <Select size="small" defaultValue="Hamlet">
            <MenuItem value="Hamlet">Hamlet</MenuItem>
          </Select>
          <Button variant="contained" color="primary">
            View Report
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#1a237e' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Intervention Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Location</TableCell>
              <TableCell sx={{ color: 'white' }}>Category</TableCell>
              <TableCell sx={{ color: 'white' }}>Start Date & End Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interventions.map((intervention, index) => (
              <TableRow key={index}>
                <TableCell>{intervention.name}</TableCell>
                <TableCell>{intervention.location}</TableCell>
                <TableCell>{intervention.category}</TableCell>
                <TableCell>
                  {`${intervention.startDate} - ${intervention.endDate}`}
                </TableCell>
                <TableCell>
                  <Chip
                    label={intervention.status}
                    color={getStatusChipColor(intervention.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" color="primary">
                    Action
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography variant="body2" color="text.secondary">
          Showing 1 to 3 of 3 entries
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Button size="small" disabled>
            Previous
          </Button>
          <Chip label="1" color="primary" />
          <Button size="small">
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InterventionOverview;