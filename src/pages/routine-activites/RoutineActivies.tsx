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
  Warning as WarningIcon,
  Flag as FlagIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { FaClipboardCheck, FaClock, FaEdit, FaFilter } from 'react-icons/fa';

interface MonitoringActivity {
  location: string;
  type: string;
  status: 'Functional' | 'Non-Functional';
  lastUpdate: string;
}

const RoutineActivies: React.FC = () => {
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
    'reports/report1.png',
    'reports/report2.png',
    'reports/report3.png',
    'reports/report4.png',
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600 }}>
            Field Monitoring
          </Typography>
          <Button
            startIcon={<FaFilter />}
            variant="contained"
            sx={{
              bgcolor: 'white',
              color: 'text.primary',
              boxShadow: 1,
              '&:hover': { bgcolor: 'grey.100' },
              textTransform: 'none',
            }}
          >
            Filter
          </Button>
        </Box>

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
            icon={<FaClipboardCheck style={{ fontSize: '20px' }} />}
            color="success"
          />
          <StatsCard
            title="Pending Reviews"
            value={18}
            icon={<FaClock style={{ fontSize: '20px' }} />}
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
              <Typography variant="body1" fontWeight={600}>
                Site Monitoring Map
              </Typography>
              <ButtonGroup variant="outlined" size="small" sx={{ gap: 1 }}>
                <Button>Zone A</Button>
                <Button>Zone B</Button>
                <Button>Zone C</Button>
              </ButtonGroup>
            </Box>
            <Box
              sx={{
                height: 400,
                bgcolor: '#D1D5DB',
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

        {/* Activities Table */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Monitoring Activities</Typography>
              <Box>
                <Button
                  startIcon={<FaFilter />}
                  sx={{
                    mr: 1,
                    color: '#000000',
                    textTransform: 'none',
                  }}
                  variant="outlined"
                >
                  Filter
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    bgcolor: '#2CBEEF',
                    '&:hover': {
                      bgcolor: '#249FCC',
                    },
                  }}
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
                            bgcolor:
                              activity.status === 'Functional' ? '#DCFCE7' : '#FEE2E2',
                            color: activity.status === 'Functional' ? 'success.dark' : 'error.dark',
                          }}
                        >
                          {activity.status}
                        </Box>
                      </TableCell>
                      <TableCell>{activity.lastUpdate}</TableCell>
                      <TableCell>
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <FaEdit style={{ color: '#2CBEEF' }} />
                        </IconButton>
                        <IconButton size="small">
                          <FlagIcon sx={{ color: '#DC2626' }} />
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
                <ImageListItem key={`${photo}-${index}`}>
                  <img
                    src={photo}
                    alt={`Monitoring photo ${index + 1}`}
                    style={{ borderRadius: 8 }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

// Stats Card Component
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
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Box sx={{ color: `${color}.main` }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

export default RoutineActivies;
