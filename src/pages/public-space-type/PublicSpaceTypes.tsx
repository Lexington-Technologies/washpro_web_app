import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import {
  FilterAlt,
  Add,
  Visibility,
} from '@mui/icons-material';

const PublicSpaces = () => {
  const distributionData = [
    { type: 'Schools', count: 245, color: '#40BFFF' },
    { type: 'Parks', count: 180, color: '#4CAF50' },
    { type: 'Markets', count: 120, color: '#FF9800' },
    { type: 'Community Centers', count: 95, color: '#9C27B0' },
  ];

  const CustomLinearProgress = ({ value, color }) => (
    <LinearProgress
      variant="determinate"
      value={(value / 245) * 100} // Using max value (245) as reference
      sx={{
        height: 8,
        borderRadius: 4,
        backgroundColor: '#f0f0f0',
        '& .MuiLinearProgress-bar': {
          backgroundColor: color,
          borderRadius: 4,
        },
      }}
    />
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: '#f8f9fa' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="600" color="primary.dark" gutterBottom>
            Public Space Types
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed insights about your selected location
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterAlt />}
            sx={{ mr: 2 }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            color="info"
          >
            Add Space
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" gutterBottom>Space Type</Typography>
            <FormControl fullWidth>
              <Select
                displayEmpty
                variant="outlined"
                size="small"
              >
                <MenuItem value="">Select space type</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" gutterBottom>District</Typography>
            <FormControl fullWidth>
              <Select
                displayEmpty
                variant="outlined"
                size="small"
              >
                <MenuItem value="">Select district</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" gutterBottom>Status</Typography>
            <FormControl fullWidth>
              <Select
                displayEmpty
                variant="outlined"
                size="small"
              >
                <MenuItem value="">Select status</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Distribution Statistics */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Distribution Statistics
            </Typography>
            <Box sx={{ mt: 3 }}>
              {distributionData.map((item) => (
                <Box key={item.type} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.type}</Typography>
                    <Typography variant="body2" color="primary" fontWeight="500">
                      {item.count}
                    </Typography>
                  </Box>
                  <CustomLinearProgress value={item.count} color={item.color} />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Map Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Location Distribution</Typography>
              <Box>
                <Button
                  variant="contained"
                  startIcon={<Visibility />}
                  color="info"
                  sx={{ mr: 1 }}
                >
                  View Report
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  color="success"
                >
                  Start Exploration
                </Button>
              </Box>
            </Box>
            <Box 
              sx={{ 
                height: 400, 
                bgcolor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography color="text.secondary">Map View</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PublicSpaces;