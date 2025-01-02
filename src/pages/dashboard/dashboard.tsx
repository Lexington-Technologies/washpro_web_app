import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  TextField,
  Grid,
  Button,
  Chip,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Search,
  TrendingUp,
  Warning,
  CheckCircle,
  Visibility,
  ArrowForward,
  Fullscreen,
  MoreHoriz,
} from '@mui/icons-material';
import { ReactNode } from 'react';
import { FaDownload } from 'react-icons/fa';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
  changeColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  changeColor = 'success.main',
}) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography color="text.secondary" variant="subtitle2">
          {title}
        </Typography>
        {icon}
      </Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {value}
      </Typography>
      <Typography sx={{ color: changeColor }} variant="body2">
        {change}
      </Typography>
    </CardContent>
  </Card>
);

interface ReportCardProps {
  status: string;
  time: string;
  title: string;
  description: string;
  author: string;
  icon: ReactNode;
}

const ReportCard: React.FC<ReportCardProps> = ({
  status,
  time,
  title,
  description,
  author,
  icon,
}) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Chip
          label={status}
          color={
            status === 'Completed'
              ? 'success'
              : status === 'In Progress'
              ? 'warning'
              : 'info'
          }
          size="small"
        />
        <Typography color="text.secondary" variant="body2">
          {time}
        </Typography>
      </Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
        {description}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2">{author}</Typography>
        <IconButton size="small">{icon}</IconButton>
      </Box>
    </CardContent>
  </Card>
);

const MetricsDashboard: React.FC = () => (
  <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#25306B' }}>
          Key Metrics Overview
        </Typography>
        <TextField
          placeholder="Search for reports, locations, or metrics..."
          variant="outlined"
          size="small"
          sx={{ width: 320 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Performance Score"
            value="98.5%"
            change="↑ 12% increase from last month"
            icon={<TrendingUp color="success" />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Active Issues"
            value="23"
            change="↑ 5 new issues this week"
            icon={<Warning color="warning" />}
            changeColor="warning.main"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Success Rate"
            value="94.2%"
            change="↑ 3.2% improvement"
            icon={<CheckCircle color="info" />}
            changeColor="info.main"
          />
        </Grid>
      </Grid>

      {/* Map Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Location Distribution</Typography>
            <Box>
              <IconButton>
                <Fullscreen />
              </IconButton>
              <IconButton>
                <MoreHoriz />
              </IconButton>
            </Box>
          </Box>
          <Box
            sx={{
              height: 400,
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
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Recent Reports
          </Typography>
          <Button endIcon={<ArrowForward />} sx={{ color: '#25306B' }}>
            View All
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ReportCard
              status="Completed"
              time="2 hours ago"
              title="Q4 Performance Analysis"
              description="Comprehensive analysis of Q4 2024 performance metrics and KPIs."
              author="Usman Hussaini Galadima"
              icon={<FaDownload style={{ color: '#25306B' }} />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ReportCard
              status="In Progress"
              time="1 day ago"
              title="Regional Market Analysis"
              description="Detailed breakdown of market performance across different regions."
              author="Muhammad Kabir"
              icon={<Visibility sx={{ color: '#25306B' }} />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ReportCard
              status="Draft"
              time="2 hours ago"
              title="Customer Satisfaction Survey"
              description="Analysis of customer feedback and satisfaction metrics for Q1 2025."
              author="Basir Ibrahim"
              icon={<FaDownload style={{ color: '#25306B' }} />}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  </Box>
);

export default MetricsDashboard;
