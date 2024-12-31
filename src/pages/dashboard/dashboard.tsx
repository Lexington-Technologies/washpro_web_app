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
  Paper,
  IconButton
} from '@mui/material';
import {
  Search,
  TrendingUp,
  Warning,
  CheckCircle,
  Download,
  Visibility,
  ArrowForward,
  Add
} from '@mui/icons-material';
import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
  changeColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, changeColor = "success.main" }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography color="text.secondary" variant="subtitle2">
          {title}
        </Typography>
        {icon}
      </Box>
      <Typography variant="h4" component="div" sx={{ mb: 1 }}>
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

const ReportCard: React.FC<ReportCardProps> = ({ status, time, title, description, author, icon }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Chip
          label={status}
          color={
            status === 'Completed' ? 'success' :
            status === 'In Progress' ? 'warning' :
            'info'
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
        <IconButton size="small">
          {icon}
        </IconButton>
      </Box>
    </CardContent>
  </Card>
);

const MetricsDashboard: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
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

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              Location Distribution
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" color="primary" startIcon={<Visibility />}>
                View Report
              </Button>
              <Button variant="contained" color="success" startIcon={<Add />}>
                Start Exploration
              </Button>
            </Box>
          </Box>
          <Paper sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">
              Map visualization would go here
            </Typography>
          </Paper>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Recent Reports
            </Typography>
            <Button
              endIcon={<ArrowForward />}
              color="primary"
            >
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
                icon={<Download />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ReportCard
                status="In Progress"
                time="1 day ago"
                title="Regional Market Analysis"
                description="Detailed breakdown of market performance across different regions."
                author="Muhammad Kabir"
                icon={<Visibility />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ReportCard
                status="Draft"
                time="2 hours ago"
                title="Customer Satisfaction Survey"
                description="Analysis of customer feedback and satisfaction metrics for Q1 2025."
                author="Basir Ibrahim"
                icon={<Download />}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default MetricsDashboard;