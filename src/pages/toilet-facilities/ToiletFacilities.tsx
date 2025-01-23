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
  styled,
  Alert,
  Container,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { FaDownload, FaFilter, FaHandSparkles, FaSink, FaWrench, FaCalendar, FaCalendarCheck } from 'react-icons/fa';
import { BsExclamationCircleFill } from 'react-icons/bs';
import { FaArrowTrendDown } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';
import { apiController } from '../../axios';
import LoadingAnimation from '../../components/LoadingAnimation';

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

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.spacing(1)};
  box-shadow: 5;
`;


// Error Alert Component
const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
  <Container maxWidth="md" sx={{ mt: 3 }}>
    <Alert severity="error">{message}</Alert>
  </Container>
);

// Not Found Component
const NotFoundAlert: React.FC = () => (
  <Container maxWidth="md" sx={{ mt: 3 }}>
    <Alert severity="info">No water source found</Alert>
  </Container>
);


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
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
}));

const ToiletFacilities: React.FC = () => {
  const { data: toiletFacilities, isLoading, error } = useQuery({
    queryKey: ['toiletFacilities'],
    queryFn: () => apiController.get<ToiletTypeRow[]>('/toilet-facilities'),
    staleTime: 5 * 60 * 1000,
  });

  // Add this aggregation function
  const getAggregatedToiletTypes = (facilities: ToiletTypeRow[]) => {
    const groupedFacilities = facilities.reduce((acc, facility) => {
      // Extract the base type (WC, Pit Latrine, etc.)
      const baseType = facility.type.split(' ')[0];
      if (!acc[baseType]) {
        acc[baseType] = {
          type: baseType,
          count: 0,
          operational: 0
        };
      }
      acc[baseType].count += facility.count;
      if (facility.status === 'Operational') {
        acc[baseType].operational += facility.count;
      }
      return acc;
    }, {} as Record<string, { type: string; count: number; operational: number }>);

    return Object.values(groupedFacilities);
  };

  // Add this helper function for safe percentage calculation
  const calculatePercentage = (operational: number, total: number): string => {
    if (total === 0) return '0%';
    const percentage = Math.round((operational / total) * 100);
    return `${percentage}%`;
  };

  if (isLoading) return <LoadingAnimation />;
  if (error instanceof Error) return <ErrorAlert message={error.message} />;
  if (!toiletFacilities || toiletFacilities.length === 0) return <NotFoundAlert />;

  const aggregatedTypes = getAggregatedToiletTypes(toiletFacilities);

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
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
                    <TableCell>TOTAL COUNT</TableCell>
                    <TableCell>OPERATIONAL</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {aggregatedTypes.map((row, index) => (
                    <TableRow key={`${row.type}-${index}`}>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.count}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              display: 'inline-block',
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              bgcolor: 'success.main',
                            }}
                          />
                          {`${row.operational} (${calculatePercentage(row.operational, row.count)})`}
                        </Box>
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