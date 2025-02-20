import { useState } from 'react';
import { 
  Avatar,
  Box, 
  CircularProgress, 
  Typography, 
  Grid, 
  Paper, 
  Stack,
  styled,
  TextField,
  Button,
  Modal
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { apiController } from '../../axios';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '../../components/Table/DataTable';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { FaUsers, FaClipboardList, FaPlus } from 'react-icons/fa';

// Interfaces
interface EnumeratorPerformance {
  id: string;
  fullName: string;
  totalRecords: number;
  waterSources: number;
  openDefecation: number;
  soakAways: number;
  toiletFacilities: number;
  dumpSites: number;
  gutters: number;
  lastLogin: string;
}

interface EnumeratorFormData {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
}

// Styled Components
const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.spacing(1)};
  height: 100%;
  box-shadow: 10;
`;

// Stat Card Component
const StatCard = ({ title, value, icon, bgColor }) => (
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
      <Box
        sx={{
          bgcolor: bgColor,
          p: 1,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
    </Box>
  </StyledPaper>
);

// Table Columns
const columnHelper = createColumnHelper<EnumeratorPerformance>();

const columns = [
  columnHelper.accessor('fullName', {
    header: 'Enumerators',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('totalRecords', {
    header: 'Total Records',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('waterSources', {
    header: 'Water Sources',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('openDefecation', {
    header: 'Open Defecation',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('soakAways', {
    header: 'Soak Aways',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('toiletFacilities', {
    header: 'Toilet Facilities',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('dumpSites', {
    header: 'Dump Sites',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('gutters', {
    header: 'Gutters',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('lastLogin', {
    header: 'Last Active',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),
];

const initialFormData: EnumeratorFormData = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
};

// Main Component
const Enumerators = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [formData, setFormData] = useState<EnumeratorFormData>(initialFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiController.post('/enumerator/register', {
        ...formData,
      });
      // Optionally refresh data or show success message
      setOpenAddModal(false);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error adding enumerator:', error);
      // Handle error (e.g., show error message)
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['enumerator-performance', { limit, page, search }],
    queryFn: () => 
      apiController.get(`/analytics/summary?limit=${limit}&page=${page}&search=${search}`),
  });
  

  // Analytics Calculations
  const enumeratorsData = data?.enumerators || [];
  const totalEnumerators = enumeratorsData.length;
  const activeEnumerators = enumeratorsData.filter(e => {
    const lastActive = new Date(e.lastLogin);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return lastActive > sevenDaysAgo;
  }).length;
  const totalCaptures = enumeratorsData.reduce((sum, e) => sum + e.totalRecords, 0);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">Error: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
            Enumerators Performance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of enumerator activities and contributions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<FaPlus />}
          sx={{ bgcolor: '#25306B', '&:hover': { bgcolor: '#1a1f4b' } }}
          onClick={() => setOpenAddModal(true)}
        >
          Add Enumerator
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2} mb={3}>
        {[
          { 
            title: 'Total Enumerators', 
            value: totalEnumerators.toLocaleString(), 
            icon: <FaUsers style={{ color: '#2563EB', fontSize: '2rem' }} />, 
            bgColor: '#DBEAFE' 
          },
          { 
            title: 'Active Enumerators', 
            value: activeEnumerators.toLocaleString(), 
            icon: <ArrowUp style={{ color: '#4CAF50', fontSize: '2rem' }} />, 
            bgColor: '#E8F5E9' 
          },
          { 
            title: 'Total Captures', 
            value: totalCaptures.toLocaleString(), 
            icon: <FaClipboardList style={{ color: '#FFA726', fontSize: '2rem' }} />, 
            bgColor: '#FFF3E0' 
          },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Data Table */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <DataTable 
          setSearch={setSearch} 
          setPage={setPage} 
          setLimit={setLimit} 
          isLoading={isLoading} 
          columns={columns} 
          data={enumeratorsData} 
        />
      </Paper>

      {/* Add Enumerator Modal */}
      <Modal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        aria-labelledby="add-enumerator-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Add New Enumerator
          </Typography>
          <form onSubmit={handleAddSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              {/* <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              /> */}
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => setOpenAddModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  sx={{ bgcolor: '#25306B', '&:hover': { bgcolor: '#1a1f4b' } }}
                >
                  Add Enumerator
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default Enumerators;