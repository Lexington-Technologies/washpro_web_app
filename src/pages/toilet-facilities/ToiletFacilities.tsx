import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Grid,
  Paper,
  styled,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { FaDownload, FaFilter, FaToilet } from 'react-icons/fa';
import { GiHole } from "react-icons/gi";
import { LuToilet } from "react-icons/lu";
import { PiToiletFill } from "react-icons/pi";
import { apiController } from '../../axios';

import { DataTable } from '../../components/Table/DataTable';

interface StatCardProps {
  title: string;
  value: number| void;
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
    header: 'Categories',
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
  const [toilets, setToilets] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery<ToiletFacility[], Error>({
    queryKey: ['toilet-facilities', { limit, page, search }],
    queryFn: () => apiController.get<ToiletFacility[]>(`/toilet-facilities?limit=${limit}&page=${page}&search=${search}`),
  });

  useEffect(() => {
    if (data) {
      setToilets(data)
    }
  }, [data]);

  const countByProperty = <T extends object>(
    data: T[] | undefined,
    property: keyof T,
    value: T[keyof T]
  ): number => {
    return data?.filter(item => item[property] !== undefined && item[property] === value).length || 0;
  };


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
        Overview
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Toilet Facility"
            value={data?.length}
            icon={<LuToilet style={{ color: '#2563EB', fontSize: '2rem' }} />}
            bgColor="#E3F2FD"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Pit Latrine"
            value={countByProperty(data, 'type', 'Pit Latrine')}
            icon={<GiHole style={{ color: '#4CAF50', fontSize: '1.8rem' }} />}
            bgColor="#E8F5E9"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="WC Sitting"
            value={countByProperty(data, 'type', 'WC Sitting')}
            icon={<FaToilet style={{ color: '#FF9800', fontSize: '2rem' }} />}
            bgColor="#FFF3E0"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="WC Squatting"
            value={countByProperty(data, 'type', 'WC Squatting')}
            icon={<PiToiletFill style={{ color: '#0EA5E9', fontSize: '2rem' }} />}
            bgColor="#E3F2FD"
          />
        </Grid>
      </Grid>

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