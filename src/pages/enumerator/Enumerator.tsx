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
import { MoreVert, Add, PersonAdd } from '@mui/icons-material';
import { apiController } from '../../axios';
import { useSnackStore } from '../../store';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns';

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
}

const initialEditFormData: EditEnumeratorFormData = {
  fullName: '',
  email: '',
  phone: '',
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

const EnumeratorPage: React.FC = () => {
  const [enumerators, setEnumerators] = useState<Enumerator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEnumerator, setSelectedEnumerator] = useState<Enumerator | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<EditEnumeratorFormData>(initialEditFormData);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newEnumerator, setNewEnumerator] = useState<NewEnumerator>({
    fullName: '',
    email: '',
    phone: ''
  });
  const { setAlert } = useSnackStore();

  const fetchEnumerators = async () => {
    setIsLoading(true);
    try {
      const data = await apiController.get('/enumerator');
      setEnumerators(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching enumerators:', error);
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch enumerators'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnumerators();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, enumerator: Enumerator) => {
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
      setAlert({
        variant: 'error',
        message: 'No enumerator selected'
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiController.put(`/enumerator/${selectedEnumerator._id}`, editFormData);
      
      setAlert({
        variant: 'success',
        message: 'Enumerator updated successfully'
      });
      
      setOpenEditModal(false);
      setSelectedEnumerator(null);
      setEditFormData(initialEditFormData);
      fetchEnumerators();
    } catch (error) {
      console.error('Error updating enumerator:', error);
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to update enumerator'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspendClick = () => {
    handleMenuClose();
    setConfirmDialog(true);
  };

  const handleStatusChange = async () => {
    if (!selectedEnumerator?._id) return;
    
    setIsLoading(true);
    try {
      await apiController.put(`/enumerator/activate/${selectedEnumerator._id}`, {
        status: selectedEnumerator.status === 'active' ? 'inactive' : 'active'
      });
      
      setAlert({
        variant: 'success',
        message: `Enumerator ${selectedEnumerator.status === 'active' ? 'suspended' : 'activated'} successfully`
      });
      
      setConfirmDialog(false);
      setSelectedEnumerator(null);
      fetchEnumerators();
    } catch (error) {
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to update status'
      });
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);

    try {
      const formData = {
        fullName: newEnumerator.fullName.trim(),
        email: newEnumerator.email.trim().toLowerCase(),
        phone: newEnumerator.phone.trim()
      };

      console.log('Sending registration data:', formData);
      const response = await apiController.post('/enumerator/register', formData);
      console.log('Registration response:', response);

      setAlert({
        variant: 'success',
        message: 'Enumerator registered successfully'
      });

      // Reset form and close modal
      setNewEnumerator({
        fullName: '',
        email: '',
        phone: ''
      });
      setOpenAddModal(false);
      
      // Refresh enumerators list
      fetchEnumerators();
    } catch (error: any) {
      console.error('Registration error:', error);
      setAlert({
        variant: 'error',
        message: error.response?.data?.message || 'Failed to register enumerator'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600 }}>
          Enumerators
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenAddModal(true)}
          sx={{ 
            bgcolor: '#25306B', 
            '&:hover': { bgcolor: '#1a1f4b' }
          }}
        >
          Add Enumerator
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#1a237e' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Full Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Email</TableCell>
              <TableCell sx={{ color: 'white' }}>Phone</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Last Login</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : enumerators.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No enumerators found
                </TableCell>
              </TableRow>
            ) : (
              enumerators.map((enumerator) => (
                <TableRow key={enumerator._id}>
                  <TableCell>{enumerator.fullName}</TableCell>
                  <TableCell>{enumerator.email}</TableCell>
                  <TableCell>{enumerator.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={enumerator.status}
                      size="small"
                      sx={{
                        bgcolor: enumerator.status === 'active' ? '#dcfce7' : '#fee2e2',
                        color: enumerator.status === 'active' ? '#16a34a' : '#dc2626',
                        textTransform: 'capitalize',
                      }}
                    />
                  </TableCell>
                  <TableCell>{formatLastLogin(enumerator.lastLogin || '')}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small"
                      onClick={(e) => handleMenuOpen(e, enumerator)}
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
        <MenuItem onClick={handleSuspendClick}>
          {selectedEnumerator?.status === 'active' ? 'Suspend' : 'Activate'}
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

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {selectedEnumerator?.status === 'active' ? 'suspend' : 'activate'} this enumerator?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleStatusChange} 
            color="primary" 
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? (
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
            phone: ''
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
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => setOpenAddModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained"
              disabled={isLoading || 
                !newEnumerator.fullName.trim() ||
                !newEnumerator.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ||
                !newEnumerator.phone.trim()
              }
              sx={{ 
                bgcolor: '#25306B', 
                '&:hover': { bgcolor: '#1a1f4b' }
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default EnumeratorPage;
