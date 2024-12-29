import { 
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  LocationOn,
  Business,
  People,
  AccessTime,
  MoreHoriz,
  Visibility,
  Add,
} from '@mui/icons-material';

const LocationDashboard = () => {
  const activities = [
    {
      title: 'New Employee Onboarding',
      description: '5 new employees joined the office',
      time: '2 hours ago',
      icon: <People sx={{ bgcolor: '#e3f2fd', borderRadius: '50%', p: 1 }} />
    },
    {
      title: 'Performance Review',
      description: 'Monthly performance metrics updated',
      time: '1 day ago',
      icon: <Visibility sx={{ bgcolor: '#e8f5e9', borderRadius: '50%', p: 1 }} />
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: '#f8f9fa' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="600" color="primary.dark" gutterBottom>
            Location Information
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed insights about your selected location
          </Typography>
        </Box>
        <Box>
          <Button variant="text" sx={{ mr: 2 }}>
            Compare with previous period
          </Button>
          <Button
            variant="contained"
            color="info"
            startIcon={<Add />}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Funding
              </Typography>
              <Typography variant="h4" component="div" gutterBottom>
                ₦1.2M
              </Typography>
              <Typography color="success.main" variant="body2">
                +12.5%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Expenses
              </Typography>
              <Typography variant="h4" component="div" gutterBottom>
                ₦436K
              </Typography>
              <Typography color="error.main" variant="body2">
                -3.2%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Utilization
              </Typography>
              <Typography variant="h4" component="div" gutterBottom>
                46%
              </Typography>
              <Typography color="success.main" variant="body2">
                +5.3%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Location Details and Map */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Location Overview</Typography>
                <MoreHoriz />
              </Box>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Business />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Office Name"
                    secondary="Kudan Local Government Secretariat"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Address"
                    secondary="Town, Kudan LGA Area, Kaduna State."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <People />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Total Employees"
                    secondary="150+"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Time Zone"
                    secondary="West Africa Time (WAT), UTC +1"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Location Distribution</Typography>
                <Box>
                  <Button 
                    variant="contained" 
                    color="info"
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
              <Box 
                sx={{ 
                  height: 300, 
                  bgcolor: '#f5f5f5', 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography color="text.secondary">Map View</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Recent Activity</Typography>
        <Button color="primary">View All</Button>
      </Box>
      <Card>
        <List>
          {activities.map((activity, index) => (
            <ListItem key={index} sx={{ borderBottom: index < activities.length - 1 ? 1 : 0, borderColor: 'divider' }}>
              <ListItemIcon>
                {activity.icon}
              </ListItemIcon>
              <ListItemText
                primary={activity.title}
                secondary={activity.description}
              />
              <Typography variant="body2" color="text.secondary">
                {activity.time}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Card>
    </Container>
  );
};

export default LocationDashboard;