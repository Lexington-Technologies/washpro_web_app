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
  IconButton,
  Paper,
} from '@mui/material';
import {
  Icon as IconifyIcon
} from '@iconify/react';
import {
  WaterDrop,
  Sanitizer,
  People,
  LocalHospital,
  Assessment,
  Groups
} from '@mui/icons-material';

interface KPICardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
}

const KPICard: React.FC<KPICardProps> = ({ icon, title, value, unit }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={1}>
        {icon}
      </Box>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" component="div">
        {value}{unit}
      </Typography>
    </CardContent>
  </Card>
);

interface Report {
  title: string;
  timeAgo: string;
  description: string;
  author: string;
}

const ReportCard: React.FC<{ report: Report }> = ({ report }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary">
        {report.timeAgo}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {report.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {report.description}
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          {report.author}
        </Typography>
        <Box>
          <IconButton size="small">
            <IconifyIcon icon="mdi:eye-outline" />
          </IconButton>
          <IconButton size="small">
            <IconifyIcon icon="mdi:download" />
          </IconButton>
          <IconButton size="small">
            <IconifyIcon icon="mdi:share" />
          </IconButton>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const kpis = [
    {
      icon: <WaterDrop color="primary" />,
      title: "Water Quality Metrics",
      value: "0-100"
    },
    {
      icon: <Sanitizer color="primary" />,
      title: "Hygiene Facility Conditions",
      value: 70,
      unit: "%"
    },
    {
      icon: <Assessment color="primary" />,
      title: "Program Progress",
      value: 66,
      unit: "%"
    },
    {
      icon: <IconifyIcon icon="mdi:hand-wash" />,
      title: "Sanitation Activities",
      value: 56
    },
    {
      icon: <People color="primary" />,
      title: "Community and Feedback",
      value: 130
    },
    {
      icon: <LocalHospital color="primary" />,
      title: "Risk and Critical Areas",
      value: 65
    },
    {
      icon: <Assessment color="primary" />,
      title: "Data Collection Status",
      value: 48,
      unit: "%"
    },
    {
      icon: <Groups color="primary" />,
      title: "User and Team Performance",
      value: 36
    }
  ];

  const reports: Report[] = [
    {
      title: "Performance Analysis",
      timeAgo: "2 hours ago",
      description: "Comprehensive analysis of Q4 2024 performance metrics and KPIs.",
      author: "Usman Hussaini Galadima"
    },
    {
      title: "Water Sources",
      timeAgo: "1 day ago",
      description: "Detailed breakdown of market performance across different regions.",
      author: "Muhammad Kabir"
    },
    {
      title: "Toilet Facilities",
      timeAgo: "2 hours ago",
      description: "Analysis of customer feedback and satisfaction metrics for Q1 2025.",
      author: "Basir Ibrahim"
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Key Performance Indicators (KPIs)
      </Typography>

      <Grid container spacing={3} mb={4}>
        {kpis.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <KPICard {...kpi} />
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Location Distribution</Typography>
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

        <Box
          sx={{
            height: '400px',
            bgcolor: '#F8FAFC',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d150598.46582809655!2d7.648291125907573!3d11.296615180519947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11b27fc3df7cf997%3A0x7f813ac2a29bec28!2sKudan%2C%20Kaduna!5e0!3m2!1sen!2sng!4v1735721268833!5m2!1sen!2sng"
            style={{
              border: 0,
              width: '100%',
              height: '100%',
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Box>
      </Paper>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Reports</Typography>
        <Button color="primary">View All</Button>
      </Box>

      <Grid container spacing={3}>
        {reports.map((report, index) => (
          <Grid item xs={12} md={4} key={index}>
            <ReportCard report={report} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
