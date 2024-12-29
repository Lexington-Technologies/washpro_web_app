import { 
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  TextField,
  IconButton,
  Paper,
  Button,
} from '@mui/material';
import {
  Search,
  Warning,
  CheckCircle,
  ArrowUpward,
  Visibility,
  Download,
  Add
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const SearchTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '12px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
}));

const Dashboard = () => {
  const recentReports = [
    {
      status: 'Completed',
      timeAgo: '2 hours ago',
      title: 'Q4 Performance Analysis',
      description: 'Comprehensive analysis of Q4 2024 performance metrics and KPIs.',
      author: 'Usman Hussaini Galadima'
    },
    {
      status: 'In Progress',
      timeAgo: '1 day ago',
      title: 'Regional Market Analysis',
      description: 'Detailed breakdown of market performance across different regions.',
      author: 'Muhammad Kabir'
    },
    {
      status: 'Draft',
      timeAgo: '2 hours ago',
      title: 'Customer Satisfaction Survey',
      description: 'Analysis of customer feedback and satisfaction metrics for Q1 2025.',
      author: 'Basir Ibrahim'
    }
  ];

  const StatusChip = styled('span')(({ status }) => ({
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '0.875rem',
    backgroundColor: 
      status === 'Completed' ? '#e8f5e9' :
      status === 'In Progress' ? '#fff3e0' : '#f3e5f5',
    color:
      status === 'Completed' ? '#2e7d32' :
      status === 'In Progress' ? '#e65100' : '#6a1b9a',
  }));

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight="600" color="primary">
          Key Metrics Overview
        </Typography>
        <SearchTextField
          placeholder="Search for reports, locations, or metrics..."
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
          sx={{ width: 300 }}
        />
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Performance Score</Typography>
                <CheckCircle color="success" />
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                98.5%
              </Typography>
              <Typography color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpward fontSize="small" sx={{ mr: 0.5 }} />
                12% increase from last month
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Active Issues</Typography>
                <Warning color="warning" />
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                23
              </Typography>
              <Typography color="error.main" sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpward fontSize="small" sx={{ mr: 0.5 }} />
                5 new issues this week
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Success Rate</Typography>
                <CheckCircle color="primary" />
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                94.2%
              </Typography>
              <Typography color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpward fontSize="small" sx={{ mr: 0.5 }} />
                3.2% improvement
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Location Distribution */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Location Distribution</Typography>
          <Box>
            <Button 
              variant="contained" 
              startIcon={<Visibility />}
              sx={{ mr: 1 }}
            >
              View Report
            </Button>
            <Button 
              variant="contained" 
              color="success"
              startIcon={<Add />}
            >
              Start Exploration
            </Button>
          </Box>
        </Box>
        {/* Map placeholder */}
        <Box 
          sx={{ 
            height: 200, 
            bgcolor: '#f5f5f5', 
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography color="text.secondary">Map View</Typography>
        </Box>
      </Paper>

      {/* Recent Reports */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Recent Reports</Typography>
        <Button color="primary">View All</Button>
      </Box>
      <Grid container spacing={3}>
        {recentReports.map((report, index) => (
          <Grid item xs={12} md={4} key={index}>
            <StyledCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <StatusChip status={report.status}>{report.status}</StatusChip>
                  <Typography variant="body2" color="text.secondary">
                    {report.timeAgo}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {report.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {report.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">{report.author}</Typography>
                  <IconButton size="small">
                    <Download />
                  </IconButton>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;