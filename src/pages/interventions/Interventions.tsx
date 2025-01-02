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
  IconButton,
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  MoreHoriz,
  TrendingUp,
  TrendingDown,
  ArrowForward,
} from '@mui/icons-material';
import { FaDownload, FaBuilding, FaCompass, FaFileAlt, FaUserPlus, FaUsers } from 'react-icons/fa';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  sx?: object;
}

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
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
        mr: 2,
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

const LocationOverview: React.FC = () => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Location Overview</Typography>
        <IconButton size="small">
          <MoreHoriz />
        </IconButton>
      </Box>
      <List>
        {[
          { icon: <FaBuilding />, primary: 'Office Name', secondary: 'Kudan Local Government Secretariat' },
          { icon: <LocationOn />, primary: 'Address', secondary: 'Town, Kudan LGA Area, Kaduna State.' },
          { icon: <FaUsers />, primary: 'Total Employees', secondary: '150+' },
          { icon: <AccessTime />, primary: 'Time Zone', secondary: 'West Africa Time (WAT), UTC +1' },
        ].map((item, index) => (
          <ListItem key={index} sx={{ px: 0 }}>
            <ListItemIcon sx={{ color: '#1F2937', fontSize: '24px' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.primary} secondary={item.secondary} />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

const Interventions: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#25306B' }}>
              Interventions
            </Typography>
            <Typography variant="body2" sx={{ color: '#374151' }}>
              Detailed insights about your selected location
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#374151', mt: 1 }}>
              Compare with previous period
            </Typography>
            <Button
              variant="contained"
              startIcon={<FaDownload />}
              sx={{ bgcolor: '#2CBEEF', borderRadius: 2 }}
            >
              Export
            </Button>
          </Box>
        </Box>

        {/* Metrics */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: '#1F2937' }}>
          Performance Metrics
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: 'Cost of intervention funding', value: '₦1.2M', change: '+12.5' },
            { title: 'Expenditure incurred', value: '₦436K', change: '-3.2' },
            { title: 'Expected expenditure', value: '₦150k', change: '+5.3' },
          ].map((metric, index) => (
            <Grid key={index} item xs={12} md={4}>
              <MetricCard {...metric} />
            </Grid>
          ))}
        </Grid>

        {/* Location Overview and Map */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <LocationOverview />
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Location Distribution
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" startIcon={<FaFileAlt />} sx={{ bgcolor: '#2CBEEF', borderRadius: 2.5 }}>
                      View Report
                    </Button>
                    <Button variant="contained" startIcon={<FaCompass />} sx={{ bgcolor: '#16A34A' }}>
                      Start Exploration
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ height: 300, bgcolor: 'action.hover', borderRadius: 2 }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d150598.46582809655!2d7.648291125907573!3d11.296615180519947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11b27fc3df7cf997%3A0x7f813ac2a29bec28!2sKudan%2C%20Kaduna!5e0!3m2!1sen!2sng!4v1735721268833!5m2!1sen!2sng"
                    style={{ border: 0, width: '100%', height: '100%' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Recent Activity</Typography>
            <Button endIcon={<ArrowForward />} sx={{ color: '#25306B' }}>
              View All
            </Button>
          </Box>
          <Card>
            <CardContent>
              {[
                {
                  icon: <FaUserPlus color="#25306B" />,
                  title: 'New Employee Onboarding',
                  description: '5 new employees joined the office',
                  time: '2 hours ago',
                },
                {
                  icon: <TrendingUp sx={{ color: 'success.main' }} />,
                  title: 'Performance Review',
                  description: 'Monthly performance metrics updated',
                  time: '1 day ago',
                },
              ].map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Interventions;
