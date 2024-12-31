import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Chip,
  styled,
} from '@mui/material';
import {
  FilterList,
  Download,
  Warning,
  CheckCircle,
  Timeline,
  Schedule,
  Report,
  LibraryBooks,
} from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  bgColor?: string;
}

interface ToiletTypeRow {
  type: string;
  count: number;
  status: 'Operational' | 'Maintenance';
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
}));

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor = '#E3F2FD' }) => (
  <StyledPaper>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
        <Typography variant="h4" sx={{ mt: 1, fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
      {icon && (
        <Box sx={{ 
          bgcolor: bgColor, 
          p: 1, 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center' 
        }}>
          {icon}
        </Box>
      )}
    </Box>
  </StyledPaper>
);

const ActionButton = styled(Button)(({ theme }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  textTransform: 'none',
}));

const ToiletFacilities: React.FC = () => {
  const toiletTypes: ToiletTypeRow[] = [
    { type: 'Western Style', count: 50, status: 'Operational' },
    { type: 'Eastern Style', count: 30, status: 'Maintenance' },
    { type: 'Accessible', count: 20, status: 'Operational' },
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#F9FAFB', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#1E293B', fontWeight: 600 }}>
            Toilet Facilities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed insights about your selected location
          </Typography>
        </Box>
        <Box>
          <Button
            startIcon={<FilterList />}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Filter
          </Button>
          <Button
            startIcon={<Download />}
            variant="contained"
            sx={{ bgcolor: '#0EA5E9' }}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Handwashing Facilities
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StatCard title="Total Units" value={85} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Functional" value={77} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Under Repair" value={7} />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StatCard title="Latrines" value={34} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Squatting" value={18} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="WC" value={20} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Toilet Types Overview
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>TYPE</TableCell>
                    <TableCell>COUNT</TableCell>
                    <TableCell>STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {toiletTypes.map((row) => (
                    <TableRow key={row.type}>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.count}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          color={row.status === 'Operational' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Maintenance Status
            </Typography>
            <Box sx={{ mb: 4, p: 2, bgcolor: '#F0FDF4', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Well Maintained</Typography>
                <CheckCircle color="success" />
              </Box>
              <Typography variant="h4" color="success.main" sx={{ mt: 1 }}>
                75%
              </Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: '#FEF2F2', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Needs Attention</Typography>
                <Warning color="error" />
              </Box>
              <Typography variant="h4" color="error.main" sx={{ mt: 1 }}>
                25%
              </Typography>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>

      <StyledPaper sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ActionButton
              variant="outlined"
              color="primary"
              startIcon={<Report />}
            >
              Report Issue
            </ActionButton>
          </Grid>
          <Grid item xs={12} md={6}>
            <ActionButton
              variant="outlined"
              color="secondary"
              startIcon={<Schedule />}
            >
              Schedule Cleaning
            </ActionButton>
          </Grid>
          <Grid item xs={12} md={6}>
            <ActionButton
              variant="outlined"
              color="success"
              startIcon={<LibraryBooks />}
            >
              Maintenance Log
            </ActionButton>
          </Grid>
          <Grid item xs={12} md={6}>
            <ActionButton
              variant="outlined"
              color="info"
              startIcon={<Timeline />}
            >
              View Analytics
            </ActionButton>
          </Grid>
        </Grid>
      </StyledPaper>
    </Box>
  );
};

export default ToiletFacilities;