import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
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
import { MoreVert } from '@mui/icons-material';
import { FaPlus } from 'react-icons/fa';
import { apiController } from '../../axios';
import { useSnackStore } from '../../store';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns';
import {
  FaUsers,
  FaUserPlus,
  FaUserCheck,
  FaUserTimes,
} from 'react-icons/fa'; // Example icons
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table';
import { DataTable } from '../../components/Table/DataTable';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  role?: string;
  lastLogin?: string;
}

interface UserFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

interface EditUserFormData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

const initialFormData: UserFormData = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  role: '',
};

const columnHelper = createColumnHelper<User>();

const UserPage: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setAlert } = useSnackStore();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<EditUserFormData>({
    fullName: '',
    email: '',
    phone: '',
    role: '',
  });

  // Memoized analytics calculations
  const totalUsers = useMemo(() => users.length, [users]);
  const activeUsers = useMemo(() => users.filter(user => user.status === 'active').length, [users]);
  const inactiveUsers = useMemo(() => users.filter(user => user.status === 'inactive').length, [users]);
  const adminUsers = useMemo(() => users.filter(user => user.role === 'admin').length, [users]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSuspendClick = () => {
    handleMenuClose();
    setConfirmDialog(true);
  };

  const handleStatusChange = async () => {
    if (!selectedUser?._id) {
      setAlert({
        variant: 'error',
        message: 'No user selected',
      });
      return;
    }

    setIsLoading(true);

    try {
      await apiController.put(`/user/activate/${selectedUser._id}`, {
        status: selectedUser.status === 'active' ? 'inactive' : 'active',
      });

      setAlert({
        variant: 'success',
        message: `User ${selectedUser.status === 'active' ? 'suspended' : 'activated'} successfully`,
      });

      setConfirmDialog(false);
      setSelectedUser(null);
      handleMenuClose();
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to update user status',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiController.post('/user/register', formData);
      setAlert({
        variant: 'success',
        message: 'User added successfully',
      });
      setOpenAddModal(false);
      setFormData(initialFormData);
      fetchUsers(); // Refresh the list
    } catch (error) {
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to add user',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiController.get<User[]>('/user');
      setUsers(response);
    } catch (error) {
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch users',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = () => {
    if (!selectedUser) return;

    setEditFormData({
      fullName: selectedUser.fullName,
      email: selectedUser.email,
      phone: selectedUser.phone,
      role: selectedUser.role || '',
    });

    handleMenuClose();
    setOpenEditModal(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser?._id) {
      setAlert({
        variant: 'error',
        message: 'No user selected',
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiController.put(`/user/${selectedUser._id}`, editFormData);

      setAlert({
        variant: 'success',
        message: 'User updated successfully',
      });

      setOpenEditModal(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user:', error);
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to update user',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatLastLogin = (lastLogin: string) => {
    try {
      const date = parseISO(lastLogin);
      if (!isValid(date)) return 'Never';
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Never';
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('fullName', {
        header: () => 'Full Name',
      }),
      columnHelper.accessor('email', {
        header: () => 'Email',
      }),
      columnHelper.accessor('role', {
        header: () => 'Role',
      }),
      columnHelper.accessor('phone', {
        header: () => 'Phone',
      }),
      columnHelper.accessor('status', {
        header: () => 'Status',
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
      columnHelper.accessor('lastLogin', {
        header: () => 'Last Login',
        cell: info => formatLastLogin(info.getValue() || ''),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => 'Action',
        cell: info => (
          <Box
          onClick={(e) => handleMenuOpen(e, info.row.original)}
          sx={{ display: 'flex', gap: 1, cursor: 'pointer' }}>
          <IconButton
            size="small"
            color='primary'
            >
            <MoreVert />
          </IconButton>
            </Box>
        ),
      }),
    ],
    [handleMenuOpen, formatLastLogin]
  );

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600 }}>
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<FaPlus />}
          sx={{ bgcolor: '#25306B', '&:hover': { bgcolor: '#1a1f4b' } }}
          onClick={() => setOpenAddModal(true)}
        >
          Add User
        </Button>
      </Box>

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Users"
            value={totalUsers}
            icon={<FaUsers />}
            iconColor="#3f51b5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Users"
            value={activeUsers}
            icon={<FaUserCheck />}
            iconColor="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Inactive Users"
            value={inactiveUsers}
            icon={<FaUserTimes />}
            iconColor="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Admin Users"
            value={adminUsers}
            icon={<FaUserPlus />}
            iconColor="#ff9800"
          />
        </Grid>
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={handleSuspendClick}
          sx={{
            color: selectedUser?.status === 'active' ? '#dc2626' : '#16a34a',
          }}
        >
          {selectedUser?.status === 'active' ? 'Suspend' : 'Activate'}
        </MenuItem>
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
      </Menu>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {selectedUser?.status === 'active' ? 'suspend' : 'activate'} {selectedUser?.fullName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStatusChange}
            color="primary"
            variant="contained"
            disabled={isLoading}
            sx={{
              bgcolor: selectedUser?.status === 'active' ? '#dc2626' : '#16a34a',
              '&:hover': {
                bgcolor: selectedUser?.status === 'active' ? '#b91c1c' : '#15803d',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              selectedUser?.status === 'active' ? 'Suspend' : 'Activate'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        onFetchData={fetchUsers}
        pageCount={1}
        pageSize={10}
        showPagination={false}  
        />

      {/* Add User Modal */}
      <Modal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        aria-labelledby="add-user-modal"
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
            Add New User
          </Typography>
          <form onSubmit={handleAddSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                variant="standard"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Email"
                variant="standard"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Phone"
                variant="standard"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Role"
                variant="standard"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                select
              >
                {[
                  { value: 'admin', label: 'Admin' },
                  { value: 'profiler', label: 'Profiler' },
                  { value: 'reviewer', label: 'Reviewer' },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
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
                  disabled={isLoading}
                  sx={{ bgcolor: '#25306B', '&:hover': { bgcolor: '#1a1f4b' } }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Add User'
                  )}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Modal>

      {/* Add Edit User Modal */}
      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="edit-user-modal"
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
            Edit User
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
              <TextField
                fullWidth
                label="Role"
                name="role"
                variant="standard"
                value={editFormData.role}
                onChange={handleEditInputChange}
                required
                select
              >
                {[
                  { value: 'admin', label: 'Admin' },
                  { value: 'profiler', label: 'Profiler' },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setOpenEditModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{ bgcolor: '#25306B', '&:hover': { bgcolor: '#1a1f4b' } }}
                >
                  {isLoading ? (
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

export default UserPage;
