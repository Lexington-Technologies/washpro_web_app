import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { FaPlus } from 'react-icons/fa';
import { apiController } from '../../axios';
import { useSnackStore } from '../../store';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns';

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

const formatLastLogin = (lastLogin: string) => {
  try {
    const date = parseISO(lastLogin);
    if (!isValid(date)) return 'Invalid date';
    
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

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
    role: ''
  });

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
        message: 'No user selected'
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
      [name]: value
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiController.post('/user/register', formData);
      setAlert({
        variant: 'success',
        message: 'User added successfully'
      });
      setOpenAddModal(false);
      setFormData(initialFormData);
      fetchUsers(); // Refresh the list
    } catch (error) {
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to add user'
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
        message: error instanceof Error ? error.message : 'Failed to fetch users'
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
      role: selectedUser.role || ''
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
    
    if (!selectedUser?._id) {
      setAlert({
        variant: 'error',
        message: 'No user selected'
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiController.put(`/user/${selectedUser._id}`, editFormData);
      
      setAlert({
        variant: 'success',
        message: 'User updated successfully'
      });
      
      setOpenEditModal(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user:', error);
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to update user'
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
  

  return (
    <Box sx={{ p: 3 }}>
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

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#1a237e' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Full Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Email</TableCell>
              <TableCell sx={{ color: 'white' }}>Phone</TableCell>
              <TableCell sx={{ color: 'white' }}>Role</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Last Login</TableCell>
              <TableCell sx={{ color: 'white' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      sx={{
                        bgcolor: user.status === 'active' ? '#dcfce7' : '#fee2e2',
                        color: user.status === 'active' ? '#16a34a' : '#dc2626',
                        textTransform: 'capitalize',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {formatLastLogin(user.lastLogin || '')}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small"
                      onClick={(e) => handleMenuOpen(e, user)}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          onClick={handleSuspendClick}
          sx={{ 
            color: selectedUser?.status === 'active' ? '#dc2626' : '#16a34a'
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
                bgcolor: selectedUser?.status === 'active' ? '#b91c1c' : '#15803d'
              }
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

      {/* Pagination */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {users.length} entries
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Button size="small" disabled>
            Previous
          </Button>
          <Chip label="1" color="primary" />
          <Button size="small">Next</Button>
        </Box>
      </Box>

      {/* Add User Modal */}
      <Modal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        aria-labelledby="add-user-modal"
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
                InputProps={{
                  readOnly: true,
                }}
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

export default UserPage;
