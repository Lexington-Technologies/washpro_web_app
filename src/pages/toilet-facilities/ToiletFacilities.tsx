import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  styled,
  Alert,
  Container,
  Card,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Warning,
} from '@mui/icons-material';
import { FaDownload, FaFilter, FaHandSparkles, FaSink, FaWrench, FaCalendar, FaCalendarCheck } from 'react-icons/fa';
import { FaArrowTrendDown } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';
import { apiController } from '../../axios';
import LoadingAnimation from '../../components/LoadingAnimation';
import { DataTable } from '../../components/Table/DataTable';
import { createColumnHelper } from '@tanstack/react-table';

interface StatCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  bgColor?: string;
}

interface ToiletFacility {
  geolocation: {
    type: string;
    coordinates: [number, number, number];
  };
  publicSpace: string;
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  space: string;
  compactments: number;
  dependent: number;
  condition: string;
  status: string;
  type: string;
  safetyRisk: string[];
  handWashingFacility: string;
  daysSinceLastEvacuation: number;
  evacuationFrequency: string;
  createdBy: string;
  capturedAt: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
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
    <Alert severity="info">No toilet facility found</Alert>
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

const columnHelper = createColumnHelper<ToiletFacility>();

const columns = [
  columnHelper.accessor('picture', {
    header: 'Picture',
    cell: props => (
      <Avatar
        src={props.row.original.picture}
        alt="toilet facility"
        sx={{ 
          width: 40, 
          height: 40,
          borderRadius: '50%', // Make avatar round
          border: '2px solid #e5e7eb', // Add subtle border
        }}
      />
    ),
    size: 80,
  }),
  columnHelper.accessor('ward', {
    header: 'Ward',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('village', {
    header: 'Village',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('hamlet', {
    header: 'Hamlet',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('publicSpace', {
    header: 'publicSpace',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => {
      const status = info.getValue();
      let color;
      switch (status) {
        case 'Improved':
          color = 'success';
          break;
        case 'Unimproved':
          color = 'error';
          break;
        default:
          color = 'default';
      }
      return (
        <Chip label={status} color={color} />
      );
    },
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: info => info.getValue(),
  }),
];

const ToiletFacilities: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery<ToiletFacility[], Error>({
    queryKey: ['toilet-facilities', { limit, page, search }],
    queryFn: () => apiController.get<ToiletFacility[]>(`/toilet-facilities?limit=${limit}&page=${page}&search=${search}`),
  });

  if (isLoading) return <LoadingAnimation />;
  if (error instanceof Error) return <ErrorAlert message={error.message} />;
  if (!data || data.length === 0) return <NotFoundAlert />;

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

      {/* Table Section */}
      <Card sx={{ mt: 3, boxShadow: 5 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, }}>Toilet Facilities Overview</Typography>
          </Box>
          <DataTable setSearch={setSearch} setPage={setPage} setLimit={setLimit} isLoading={isLoading} columns={columns} data={data || []} />
        </Box>
      </Card>
    </Box>
  );
};

export default ToiletFacilities;