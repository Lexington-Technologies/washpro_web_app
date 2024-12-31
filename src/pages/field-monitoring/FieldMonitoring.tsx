import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  ButtonGroup,
  Stack,
  ImageList,
  ImageListItem,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Assignment as AssignmentIcon,
  PendingActions as PendingIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Flag as FlagIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

interface MonitoringActivity {
  location: string;
  type: string;
  status: 'Functional' | 'Non-Functional';
  lastUpdate: string;
}

const Monitoring: React.FC = () => {
  const activities: MonitoringActivity[] = [
    {
      location: 'Ward A Site',
      type: 'Water Facility',
      status: 'Functional',
      lastUpdate: '2 hours ago',
    },
    {
      location: 'Ward B Site',
      type: 'Sanitation',
      status: 'Non-Functional',
      lastUpdate: '5 hours ago',
    },
  ];

  const recentPhotos = [
    '/api/placeholder/300/200',
    '/api/placeholder/300/200',
    '/api/placeholder/300/200',
    '/api/placeholder/300/200',
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Stats Cards */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <StatsCard 
          title="Total Sites"
          value={248}
          icon={<LocationIcon />}
          color="primary"
        />
        <StatsCard 
          title="Active Surveys"
          value={42}
          icon={<AssignmentIcon />}
          color="success"
        />
        <StatsCard 
          title="Pending Reviews"
          value={18}
          icon={<PendingIcon />}
          color="warning"
        />
        <StatsCard 
          title="Critical Alerts"
          value={5}
          icon={<WarningIcon />}
          color="error"
        />
      </Stack>

      {/* Map Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Site Monitoring Map</Typography>
            <ButtonGroup variant="outlined" size="small">
              <Button>Zone A</Button>
              <Button>Zone B</Button>
              <Button>Zone C</Button>
            </ButtonGroup>
          </Box>
          <Box 
            sx={{ 
              height: 400, 
              bgcolor: '#f5f5f5', 
              borderRadius: 1,
              position: 'relative',
            }}
          >
            {/* Map component would go here */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                bgcolor: 'background.paper',
                p: 1,
                borderRadius: 1,
                boxShadow: 1,
              }}
            >
              <Stack direction="row" spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon color="error" />
                  <Typography variant="body2">Sample Points</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: 'error.light', borderRadius: '50%' }} />
                  <Typography variant="body2">Density Areas</Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Activities Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Monitoring Activities</Typography>
            <Box>
              <Button
                startIcon={<FilterIcon />}
                sx={{ mr: 1 }}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
              >
                Add New
              </Button>
            </Box>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Update</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.location}>
                    <TableCell>{activity.location}</TableCell>
                    <TableCell>{activity.type}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: activity.status === 'Functional' ? 'success.light' : 'error.light',
                          color: activity.status === 'Functional' ? 'success.dark' : 'error.dark',
                        }}
                      >
                        {activity.status}
                      </Box>
                    </TableCell>
                    <TableCell>{activity.lastUpdate}</TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small">
                        <FlagIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Recent Photos */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Recent Photos</Typography>
            <Button>View All</Button>
          </Box>
          <ImageList cols={4} gap={16}>
            {recentPhotos.map((photo, index) => (
              <ImageListItem key={index}>
                <img
                  src={photo}
                  alt={`Monitoring photo ${index + 1}`}
                  loading="lazy"
                  style={{ borderRadius: 8 }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </CardContent>
      </Card>
    </Box>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'error';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => (
  <Card sx={{ flex: 1 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">
            {value}
          </Typography>
        </Box>
        <Box sx={{ color: `${color}.main` }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default Monitoring;