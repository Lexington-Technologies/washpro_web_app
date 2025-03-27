import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Modal,
  Stack,
  CircularProgress,
  Grid,
  Card,
} from '@mui/material';
import { MoreVert, Add, PersonAdd } from '@mui/icons-material';
import { apiController } from '../../axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { DataTable } from '../../components/Table/DataTable2';
import { createColumnHelper } from '@tanstack/react-table';

interface Enumerator {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
}

interface EditEnumeratorFormData {
  fullName: string;
  email: string;
  phone: string;
}

interface NewEnumerator {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

const initialEditFormData: EditEnumeratorFormData = {
  fullName: '',
  email: '',
  phone: '',
};

const columnHelper = createColumnHelper<Enumerator>();

const EnumeratorPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEnumerator, setSelectedEnumerator] = useState<Enumerator | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<EditEnumeratorFormData>(initialEditFormData);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newEnumerator, setNewEnumerator] = useState<NewEnumerator>({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  // Fetch enumerators with TanStack Query
  const { data: enumerators = [], isLoading } = useQuery<Enumerator[]>({
    queryKey: ['enumerators'],
    queryFn: async () => {
      const response = await apiController.get('/enumerator');
      return response || [];
    },
    onError: (error: Error) => {
      enqueueSnackbar({
        variant: 'error',
        message: error.message || 'Failed to fetch enumerators'
      });
    }
  });

  // Memoized analytics calculations
  const totalUsers = enumerators.length;
  const activeUsers = enumerators.filter(user => user.status === 'active').length;
  const inactiveUsers = enumerators.filter(user => user.status === 'disable').length;

  // Mutation for updating enumerator
  const updateEnumeratorMutation = useMutation({
    mutationFn: async (data: { id: string; data: EditEnumeratorFormData }) => {
      await apiController.put(`/enumerator/${data.id}`, data.data);
    },
    onSuccess: () => {
      enqueueSnackbar({
        variant: 'success',
        message: 'Enumerator updated successfully'
      });
      queryClient.invalidateQueries(['enumerators']);
    },
    onError: (error: Error) => {
      enqueueSnackbar({
        variant: 'error',
        message: error.message || 'Failed to update enumerator'
      });
    }
  });

  // Mutation for status change
  const statusChangeMutation = useMutation({
    mutationFn: async (id: string) => {
      const enumerator = enumerators.find(e => e._id === id);
      if (!enumerator) throw new Error('Enumerator not found');
      
      const endpoint = enumerator.status === 'active' 
        ? `/enumerator/deactivate/${id}` 
        : `/enumerator/activate/${id}`;
      
      await apiController.put(endpoint);
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(['enumerators']);

      // Snapshot the previous value
      const previousEnumerators = queryClient.getQueryData<Enumerator[]>(['enumerators']);

      // Optimistically update to the new value
      if (previousEnumerators) {
        queryClient.setQueryData<Enumerator[]>(['enumerators'], old => 
          old?.map(enumerator => 
            enumerator._id === id 
              ? { ...enumerator, status: enumerator.status === 'active' ? 'inactive' : 'active' } 
              : enumerator
          ) || []
        );
      }

      return { previousEnumerators };
    },
    onError: (err, id, context) => {
      // Rollback to the previous value if error occurs
      if (context?.previousEnumerators) {
        queryClient.setQueryData(['enumerators'], context.previousEnumerators);
      }
      enqueueSnackbar({
        variant: 'error',
        message: err instanceof Error ? err.message : 'Failed to update status'
      });
    },
    onSuccess: () => {
      enqueueSnackbar({
        variant: 'success',
        message: 'Enumerator status updated successfully'
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(['enumerators']);
    }
  });

  // Mutation for adding enumerator
  const addEnumeratorMutation = useMutation({
    mutationFn: async (data: NewEnumerator) => {
      const formData = {
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        password: data.password.trim()
      };
      await apiController.post('/enumerator/register-admin', formData);
    },
    onSuccess: () => {
      enqueueSnackbar({
        variant: 'success',
        message: 'Enumerator registered successfully'
      });
      setNewEnumerator({
        fullName: '',
        email: '',
        phone: '',
        password: ''
      });
      setOpenAddModal(false);
      queryClient.invalidateQueries(['enumerators']);
    },
    onError: (error: any) => {
      enqueueSnackbar({
        variant: 'error',
        message: error.response?.data?.message || 'Failed to register enumerator'
      });
    }
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, enumerator: Enumerator) => {
    event.stopPropagation(); // Prevent event bubbling
    setAnchorEl(event.currentTarget);
    setSelectedEnumerator(enumerator);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    if (!selectedEnumerator) return;

    setEditFormData({
      fullName: selectedEnumerator.fullName,
      email: selectedEnumerator.email,
      phone: selectedEnumerator.phone
    });
    
    handleMenuClose();
    setOpenEditModal(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEnumerator?._id) {
      enqueueSnackbar({
        variant: 'error',
        message: 'No enumerator selected'
      });
      return;
    }

    updateEnumeratorMutation.mutate({
      id: selectedEnumerator._id,
      data: editFormData
    });
    
    setOpenEditModal(false);
    setSelectedEnumerator(null);
    setEditFormData(initialEditFormData);
  };

  const handleSuspendClick = () => {
    handleMenuClose();
    setConfirmDialog(true);
  };

  const handleStatusChange = async () => {
    if (!selectedEnumerator?._id) return;
    
    try {
      await statusChangeMutation.mutateAsync(selectedEnumerator._id);
      setConfirmDialog(false);
      setSelectedEnumerator(null);
      // The query will automatically invalidate and refetch due to the mutation settings
    } catch (error) {
      // Error is already handled by the mutation
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEnumerator(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEnumerator = async (e: React.FormEvent) => {
    e.preventDefault();
    addEnumeratorMutation.mutate(newEnumerator);
  };

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Never';
    try {
      const date = parseISO(lastLogin);
      if (!isValid(date)) return 'Never';
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Never';
    }
  };

  const columns = [
    columnHelper.accessor('fullName', {
      header: 'Full Name',
    }),
    columnHelper.accessor('email', {
      header: 'Email',
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <Chip
          label={info.getValue()}
          size="small"
          sx={{
            bgcolor: info.getValue() === 'active' ? '#dcfce7' : '#fee2e2',
            color: info.getValue() === 'active' ? '#16a34a' : '#dc2626',
            textTransform: 'capitalize',
          }}
        />
      ),
    }),
    columnHelper.accessor(row => row.lastLogin, {
      id: 'lastLogin',
      header: 'Last Login',
      cell: info => formatLastLogin(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <IconButton 
          size="small"
          onClick={(e) => handleMenuOpen(e, row.original)}
        >
          <MoreVert />
        </IconButton>
      ),
    }),
  ];

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600 }}>
          Enumerators
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ bgcolor: '#25306B', '&:hover': { bgcolor: '#1a1f4b' } }}
          onClick={() => setOpenAddModal(true)}
        >
          Add Enumerator
        </Button>
      </Box>

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatsCard
        title="Total Enumerators"
        value={totalUsers}
        icon={<PersonAdd />}
        iconColor="#3f51b5"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatsCard
        title="Active Enumerators"
        value={activeUsers}
        icon={<PersonAdd />}
        iconColor="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatsCard
        title="Inactive Enumerators"
        value={inactiveUsers}
        icon={<PersonAdd />}
        iconColor="#f44336"
          />
        </Grid>
      </Grid>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={enumerators}
        isLoading={isLoading}
        // onRowClick={(enumerator) => {
        //   // Navigate to enumerator detail page
        //   navigate(`/enumerators/${enumerator._id}`);
        // }}
        // viewButtonText="View Details"
      />
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            marginLeft: '91%',
            marginTop: '35%',
            '& .MuiMenuItem-root': {
              fontSize: '0.875rem',
              padding: '8px 16px',
            },
          },
        }}
      >
        <MenuItem onClick={handleSuspendClick}>
          {selectedEnumerator?.status === 'active' ? 'Deactivate' : 'Activate'}
        </MenuItem>
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
      </Menu>
      
      {/* Edit Modal */}
      <Modal
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setEditFormData(initialEditFormData);
          setSelectedEnumerator(null);
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Edit Enumerator
          </Typography>
          <form onSubmit={handleEditSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                variant="standard"
                value={editFormData.fullName}
                onChange={handleEditInputChange}
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                variant="standard"
                value={editFormData.email}
                onChange={handleEditInputChange}
                required
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                variant="standard"
                value={editFormData.phone}
                onChange={handleEditInputChange}
                required
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => setOpenEditModal(false)}
                  disabled={updateEnumeratorMutation.isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  disabled={updateEnumeratorMutation.isLoading}
                  sx={{ bgcolor: '#25306B', '&:hover': { bgcolor: '#1a1f4b' } }}
                >
                  {updateEnumeratorMutation.isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Modal>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {selectedEnumerator?.status === 'active' ? 'deactivate' : 'activate'} this enumerator?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleStatusChange} 
            color="primary" 
            variant="contained"
            disabled={statusChangeMutation.isLoading}
          >
            {statusChangeMutation.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Confirm'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Enumerator Modal */}
      <Dialog
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          setNewEnumerator({
            fullName: '',
            email: '',
            phone: '',
            password: ''
          });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAdd />
            <Typography variant="h6">Add New Enumerator</Typography>
          </Box>
        </DialogTitle>
        <form onSubmit={handleAddEnumerator}>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={newEnumerator.fullName}
                onChange={handleInputChange}
                required
                error={newEnumerator.fullName.trim() === ''}
                helperText={newEnumerator.fullName.trim() === '' ? 'Full name is required' : ''}
                autoFocus
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newEnumerator.email}
                onChange={handleInputChange}
                required
                error={Boolean(newEnumerator.email && !newEnumerator.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))}
                helperText={
                  newEnumerator.email && !newEnumerator.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) 
                    ? 'Enter a valid email address' 
                    : ''
                }
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={newEnumerator.phone}
                onChange={handleInputChange}
                required
                error={newEnumerator.phone.trim() === ''}
                helperText={newEnumerator.phone.trim() === '' ? 'Phone number is required' : ''}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={newEnumerator.password}
                onChange={handleInputChange}
                required
                error={newEnumerator.password.trim() === ''}
                helperText={newEnumerator.password.trim() === '' ? 'Password is required' : ''}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => setOpenAddModal(false)}
              disabled={addEnumeratorMutation.isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained"
              disabled={addEnumeratorMutation.isLoading || 
                !newEnumerator.fullName.trim() ||
                !newEnumerator.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ||
                !newEnumerator.phone.trim() ||
                !newEnumerator.password.trim()
              }
              sx={{ 
                bgcolor: '#25306B', 
                '&:hover': { bgcolor: '#1a1f4b' }
              }}
            >
              {addEnumeratorMutation.isLoading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number | undefined;
  icon: React.ReactElement;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, iconColor }) => (
  <Card sx={{ flex: 1, p: 2, borderRadius: 2 }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
      <Box
        sx={{
          bgcolor: `${iconColor}15`,
          p: 1,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {React.cloneElement(icon, { sx: { color: iconColor } })}
      </Box>
    </Box>
  </Card>
);

export default EnumeratorPage;