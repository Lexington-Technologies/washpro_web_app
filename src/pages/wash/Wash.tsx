import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
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
  styled
} from '@mui/material';
import { Icon } from '@iconify/react';
import { LineChart, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, Bar, ResponsiveContainer } from 'recharts';

const StyledSelect = styled(Select)({
  minWidth: 120,
  marginRight: 8,
});

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  boxShadow: theme.shadows[5],
}));

// Sample data
const waterQualityData = [
  { date: 'Q4 2024', value: 45 },
  { date: 'Q1 2025', value: 85 },
];

const contaminationData = [
  { source: 'Source 1', '2022': 80, '2023': 65 },
  { source: 'Source 2', '2022': 60, '2023': 45 },
  { source: 'Source 3', '2022': 40, '2023': 30 },
  { source: 'Source 4', '2022': 70, '2023': 55 },
];

const sanitationFacilities = [
  {
    facilityName: "Community Borehole 1",
    location: "Angwuwan Sarki",
    condition: "Good",
    lastDate: "2024-01-05",
    nextDate: "2025-01-12"
  },
  {
    facilityName: "Waste Disposal Unit A",
    location: "Angwuwan Shanu",
    condition: "Fair",
    lastDate: "2024-01-03",
    nextDate: "2025-01-15"
  },
];

const hygienePrograms = [
  {
    date: "2025-01-02",
    trainerName: "Aliyu Abdullahi",
    participantCount: 25,
    feedbackSummary: "Participants appreciated practical demonstrations but suggested extended sessions"
  },
  {
    date: "2024-12-18",
    trainerName: "Musa Ibrahim",
    participantCount: 30,
    feedbackSummary: "Engaging session; participants requested additional follow-up training"
  },
];

interface MetricCardProps {
  icon: string;
  title: string;
  value: string | number;
  unit?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, unit }) => (
  <StyledCard>
    <CardContent>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Icon icon={icon} width={24} height={24} color="#1976d2" />
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4">
        {value}{unit}
      </Typography>
    </CardContent>
  </StyledCard>
);

const Wash: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">WASH </Typography>
        <Box display="flex" alignItems="center">
          {['LGA', 'Ward', 'Village', 'Hamlet'].map((item) => (
            <StyledSelect key={item} size="small" defaultValue={item}>
              <MenuItem value={item}>{item}</MenuItem>
            </StyledSelect>
          ))}
          <Button variant="contained" color="primary">
            View Report
          </Button>
        </Box>
      </Box>

      {/* Metrics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            icon="mdi:water"
            title="Water Quality Metrics"
            value="0-100"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            icon="mdi:recycle"
            title="Sanitation Activities"
            value="56"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            icon="mdi:hand-wash"
            title="Hygiene Facility Conditions"
            value="70"
            unit="%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            icon="mdi:account-group"
            title="Community and Feedback"
            value="130"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Historical Trends in Water Quality</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={waterQualityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Contamination Levels by Source</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contaminationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="2022" fill="#1976d2" />
                <Bar dataKey="2023" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Sanitation Facilities */}
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" mb={2}>Historical Trends in Water Quality</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={waterQualityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ height: '100%' }}>
            <Box sx={{ bgcolor: '#1a237e', p: 2 }}>
              <Typography variant="h6" color="white">Sanitation Facilities</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Facility Name</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Condition</TableCell>
                    <TableCell>Last Date</TableCell>
                    <TableCell>Next Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sanitationFacilities.map((facility, index) => (
                    <TableRow key={index}>
                      <TableCell>{facility.facilityName}</TableCell>
                      <TableCell>{facility.location}</TableCell>
                      <TableCell>
                        <Chip
                          label={facility.condition}
                          color={facility.condition === 'Good' ? 'success' : 
                                 facility.condition === 'Fair' ? 'warning' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{facility.lastDate}</TableCell>
                      <TableCell>{facility.nextDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>

      {/* Hygiene Programs */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ bgcolor: '#1a237e', p: 2 }}>
          <Typography variant="h6" color="white">Hygiene Programs</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Trainer Name</TableCell>
                <TableCell>Participant Count</TableCell>
                <TableCell>Feedback Summary</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hygienePrograms.map((program, index) => (
                <TableRow key={index}>
                  <TableCell>{program.date}</TableCell>
                  <TableCell>{program.trainerName}</TableCell>
                  <TableCell>{program.participantCount}</TableCell>
                  <TableCell>{program.feedbackSummary}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Progress Tracker */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" mb={2}>Progress Tracker</Typography>
        <Box sx={{ width: '100%', mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Chip label="Handwashing Awareness Campaign" color="primary" size="small" />
            <Typography variant="body2" color="primary">
              Safe Water Initiative
            </Typography>
          </Box>
          <Box sx={{ width: '100%', bgcolor: '#bbdefb', borderRadius: 1, height: 8 }}>
            <Box
              sx={{
                width: '45%',
                height: '100%',
                bgcolor: 'primary.main',
                borderRadius: 1
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Wash;