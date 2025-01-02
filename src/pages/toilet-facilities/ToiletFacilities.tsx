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
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { FaDownload, FaFilter, FaHandSparkles, FaSink, FaWrench, FaCalendar, FaCalendarCheck } from 'react-icons/fa';
import { BsExclamationCircleFill } from 'react-icons/bs';
import { FaArrowTrendDown } from 'react-icons/fa6';

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
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
            Toilet Facilities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed insights about your selected location
          </Typography>
        </Box>
        <Box>
          <Button
            startIcon={<FaFilter style={{color: "#1F2937"}} />}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            <Typography variant="body1" color="#1F2937">Filter</Typography>
          </Button>
          <Button
            startIcon={<FaDownload />}
            variant="contained"
            sx={{ bgcolor: '#2CBEEF' }}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      <Typography variant="h6" color='#1F2937' sx={{ mb: 2  }}>
        Handwashing Facilities
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
  <Grid item xs={12} md={4}>
    <StatCard
      title="Total Units"
      value={85}
      icon={<FaSink style={{ color: '#0EA5E9' }} />}
      bgColor="#E3F2FD"
    />
  </Grid>
  <Grid item xs={12} md={4}>
    <StatCard
      title="Functional"
      value={77}
      icon={<FaHandSparkles style={{ color: '#4CAF50' }} />}
      bgColor="#E8F5E9"
    />
  </Grid>
  <Grid item xs={12} md={4}>
    <StatCard
      title="Under Repair"
      value={7}
      icon={<FaWrench style={{ color: '#FF9800' }} />}
      bgColor="#FFF3E0"
    />
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ mb: 3 }}>
  <Grid item xs={12} md={4}>
    <StatCard
      title="Latrines"
      value={34}
      icon={<FaSink style={{ color: '#0EA5E9' }} />}
      bgColor="#E3F2FD"
    />
  </Grid>
  <Grid item xs={12} md={4}>
    <StatCard
      title="Squatting"
      value={18}
      icon={<FaSink style={{ color: '#0EA5E9' }} />}
      bgColor="#E3F2FD"
    />
  </Grid>
  <Grid item xs={12} md={4}>
    <StatCard
      title="WC"
      value={20}
      icon={<FaSink style={{ color: '#0EA5E9' }} />}
      bgColor="#E3F2FD"
    />
  </Grid>
</Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
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
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
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
                <BsExclamationCircleFill color="#FF0000" />
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
              sx={{ backgroundColor: "#EFF6FF", color: "#1E3A8A" }}
              startIcon={<Warning />}
            >
              Report Issue
            </ActionButton>
            </Grid>
          <Grid item xs={12} md={6}>
            <ActionButton
              variant="outlined"
              sx={{ backgroundColor: "#FAF5FF", color: "#7E22CE" }}
              startIcon={<FaCalendar />}
            >
              Schedule Cleaning
            </ActionButton>
          </Grid>
          <Grid item xs={12} md={6}>
            <ActionButton
              variant="outlined"
              sx={{ backgroundColor: "#F0FDF4", color: "#15803D" }}
              startIcon={<FaCalendarCheck />}
            >
              Maintenance Log
            </ActionButton>
          </Grid>
          <Grid item xs={12} md={6}>
            <ActionButton
              variant="outlined"
              sx={{ backgroundColor: "#FFF7ED", color:"#C2410C" }}
              startIcon={<FaArrowTrendDown />}
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