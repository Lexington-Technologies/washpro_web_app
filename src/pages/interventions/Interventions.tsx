import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import {
  Business,
  LocationOn,
  People,
  AccessTime,
  MoreHoriz,
  TrendingUp,
  TrendingDown,
  Download,
  Add,
  ArrowForward
} from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change }) => (
  <Card>
    <CardContent>
      <Typography color="text.secondary" variant="body2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 500 }}>
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {Number(change) > 0 ? (
          <TrendingUp fontSize="small" color="success" sx={{ mr: 0.5 }} />
        ) : (
          <TrendingDown fontSize="small" color="error" sx={{ mr: 0.5 }} />
        )}
        <Typography
          variant="body2"
          color={Number(change) > 0 ? 'success.main' : 'error.main'}
        >
          {Math.abs(Number(change))}%
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const LocationOverview: React.FC = () => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Location Overview</Typography>
        <IconButton size="small">
          <MoreHoriz />
        </IconButton>
      </Box>
      <List sx={{ p: 0 }}>
        <ListItem sx={{ px: 0 }}>
          <ListItemIcon>
            <Business />
          </ListItemIcon>
          <ListItemText
            primary="Office Name"
            secondary="Kudan Local Government Secretariat"
          />
        </ListItem>
        <ListItem sx={{ px: 0 }}>
          <ListItemIcon>
            <LocationOn />
          </ListItemIcon>
          <ListItemText
            primary="Address"
            secondary="Town, Kudan LGA Area, Kaduna State."
          />
        </ListItem>
        <ListItem sx={{ px: 0 }}>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText
            primary="Total Employees"
            secondary="150+"
          />
        </ListItem>
        <ListItem sx={{ px: 0 }}>
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
);

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, title, description, time }) => (
  <Box sx={{ display: 'flex', py: 2 }}>
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'action.hover',
        mr: 2
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {description}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {time}
      </Typography>
    </Box>
  </Box>
);

const Interventions: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Interventions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detailed insights about your selected location
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="text">
              Compare with previous period
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              sx={{ bgcolor: '#00B8D9' }}
            >
              Export
            </Button>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Performance Metrics
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <MetricCard
              title="Cost of intervention funding"
              value="₦1.2M"
              change="+12.5"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MetricCard
              title="Expenditure incurred"
              value="₦436K"
              change="-3.2"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MetricCard
              title="Expected expenditure"
              value="₦150k"
              change="+5.3"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <LocationOverview />
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Location Distribution</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      sx={{ bgcolor: '#00B8D9' }}
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
                    height: 300,
                    bgcolor: 'action.hover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Map visualization would go here
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Recent Activity</Typography>
            <Button
              endIcon={<ArrowForward />}
              sx={{ color: '#00B8D9' }}
            >
              View All
            </Button>
          </Box>
          <Card>
            <CardContent>
              <ActivityItem
                icon={<People />}
                title="New Employee Onboarding"
                description="5 new employees joined the office"
                time="2 hours ago"
              />
              <ActivityItem
                icon={<TrendingUp />}
                title="Performance Review"
                description="Monthly performance metrics updated"
                time="1 day ago"
              />
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Interventions;