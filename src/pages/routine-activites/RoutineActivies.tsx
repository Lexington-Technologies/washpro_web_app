import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Card,
  CardContent,
  ImageList,
  ImageListItem,
} from '@mui/material';
import {
  MdLocationOn,
  MdKeyboardArrowDown,
  MdSchedule,
  MdVisibility,
  MdNavigateBefore,
  MdNavigateNext,
} from 'react-icons/md';
import { GoAlert } from 'react-icons/go';
import { HiClipboardList } from 'react-icons/hi';
import { Report1, Report2, Report3, Report4 } from '../../assets/report';

const RoutineActivities = () => {
  const stats = [
    { title: 'Total Sites', value: '2,456', icon: MdLocationOn, color: '#1E3A8A' },
    { title: 'Active Surveys', value: '1,890', icon: HiClipboardList, color: '#1E3A8A' },
    { title: 'Pending Reviews', value: '78%', icon: MdSchedule, color: '#1E3A8A' },
    { title: 'Critical Alerts', value: '12%', icon: GoAlert, color: '#DC2626' },
  ];

  const locations = [
    { name: 'Kudan', type: 'Water Facility', lastUpdate: '2 hours ago', status: 'Functional', statusColor: '#10B981' },
    { name: 'Doka', type: 'Sanitation', lastUpdate: '2 hours ago', status: 'Non-Functional', statusColor: '#EF4444' },
    { name: 'Kauru', type: 'Water Facility', lastUpdate: '2 hours ago', status: 'Functional', statusColor: '#10B981' },
    { name: 'Hunkuyi', type: 'Sanitation', lastUpdate: '2 hours ago', status: 'On Repair', statusColor: '#F59E0B' },
  ];

  const recentPhotos = [Report1, Report2, Report3, Report4];

  const getStatusChip = (status, color) => (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: color === '#10B981' ? '#ECFDF5' : color === '#EF4444' ? '#FEF2F2' : '#FFFBEB',
        color: color,
        fontSize: '0.75rem',
        fontWeight: 'medium',
      }}
    />
  );

  return (
    <Box sx={{ p: 3, bgcolor: '#F3F4F6', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="#1E3A8A">Routine Activities</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['LGA', 'Ward', 'Village', 'Hamlet'].map((type) => (
            <Button
              key={type}
              variant="outlined"
              endIcon={<MdKeyboardArrowDown />}
              sx={{
                borderColor: '#D1D5DB',
                color: '#374151',
                bgcolor: 'white',
                textTransform: 'none',
                '&:hover': { borderColor: '#9CA3AF' },
              }}
            >
              {type}
            </Button>
          ))}
          <Button
            variant="contained"
            sx={{
              bgcolor: '#3B82F6',
              '&:hover': { bgcolor: '#2563EB' },
              textTransform: 'none',
            }}
          >
            View Report
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Box
                  sx={{
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    bgcolor: '#F3F4F6',
                  }}
                >
                  <stat.icon size={24} color={stat.color} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color={stat.title === 'Critical Alerts' ? '#DC2626' : '#1E3A8A'}>
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Map Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>Site Monitoring Map</Typography>
        <Paper sx={{ p: 0, height: 300, position: 'relative', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {/* Google Maps iframe */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d144.9537353153166!3d-37.816279742021665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d2a7c5e4a7c1!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1633023222539!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
          {/* Map Legend */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              bgcolor: 'white',
              borderRadius: 1,
              p: 1,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MdLocationOn color="#DC2626" size={16} />
              <Typography variant="caption">Sample Points</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 0.5,
                  bgcolor: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #EF4444',
                }}
              />
              <Typography variant="caption">Density Areas</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Locations Table */}
      <Box sx={{ mb: 3 }}>
        <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#25306B' }}>
                <TableCell sx={{ fontWeight: 'medium', color: '#FFFFFF' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'medium', color: '#FFFFFF' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'medium', color: '#FFFFFF' }}>Last Update</TableCell>
                <TableCell sx={{ fontWeight: 'medium', color: '#FFFFFF' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'medium', color: '#FFFFFF' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locations.map((row) => (
                <TableRow key={row.name} hover>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.lastUpdate}</TableCell>
                  <TableCell>{getStatusChip(row.status, row.statusColor)}</TableCell>
                  <TableCell>
                    <IconButton size="small" sx={{ color: '#3B82F6' }}>
                      <MdVisibility />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#3B82F6' }}>
                      ⋮
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderTop: '1px solid #E5E7EB',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing 1 to 3 of 3 entries
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<MdNavigateBefore />}
                sx={{
                  borderColor: '#D1D5DB',
                  color: '#374151',
                  '&:hover': { borderColor: '#9CA3AF' },
                }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: '#1E3A8A',
                  '&:hover': { bgcolor: '#1E40AF' },
                  minWidth: 'auto',
                  px: 2,
                }}
              >
                1
              </Button>
              <Button
                variant="outlined"
                size="small"
                endIcon={<MdNavigateNext />}
                sx={{
                  borderColor: '#D1D5DB',
                  color: '#374151',
                  '&:hover': { borderColor: '#9CA3AF' },
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        </TableContainer>
      </Box>

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
  );
};

export default RoutineActivities;