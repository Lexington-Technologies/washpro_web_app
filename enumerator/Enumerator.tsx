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

interface Enumerator {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

interface EnumeratorFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

const initialFormData: EnumeratorFormData = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
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

const EnumeratorPage: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEnumerator, setSelectedEnumerator] = useState<Enumerator | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [formData, setFormData] = useState<EnumeratorFormData>(initialFormData);
  const [enumerators, setEnumerators] = useState<Enumerator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setAlert } = useSnackStore();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, enumerator: Enumerator) => {
    setAnchorEl(event.currentTarget);
    setSelectedEnumerator(enumerator);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSuspendClick = () => {
    handleMenuClose();
    setConfirmDialog(true);
  };

  const handleSuspendConfirm = async () => {
    if (!selectedEnumerator) return;
    
    setIsLoading(true);
    try {
      await apiController.put(`/enumerator/${selectedEnumerator.id}/status`, {
        status: selectedEnumerator.status === 'active' ? 'inactive' : 'active'
      });
      
      setAlert({
        variant: 'success',
        message: `Enumerator ${selectedEnumerator.status === 'active' ? 'suspended' : 'activated'} successfully`
      });
      setConfirmDialog(false);
      setSelectedEnumerator(null);
      fetchEnumerators(); // Refresh the list
    } catch (error) {
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Operation failed'
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
      await apiController.post('/enumerator/register', formData);
      setAlert({
        variant: 'success',
        message: 'Enumerator added successfully'
      });
      setOpenAddModal(false);
      setFormData(initialFormData);
      fetchEnumerators(); // Refresh the list
    } catch (error) {
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to add enumerator'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEnumerators = async () => {
    setIsLoading(true);
    try {
      const response = await apiController.get<Enumerator[]>('/enumerator');
      setEnumerators(response);
    } catch (error) {
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600 }}>
          Enumerators
        </Typography>
        <Button
          variant="contained"
          startIcon={<FaPlus />}
          sx={{ bgcolor: '#25306B', '&:hover': { bgcolor: '#1a1f4b' } }}
          onClick={() => setOpenAddModal(true)}
        >
          Add Enumerator
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
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Last Login</TableCell>
              <TableCell sx={{ color: 'white' }}>Action</TableCell>
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
                <TableRow key={enumerator.id}>
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
                  <TableCell>
                    {formatLastLogin(enumerator.lastLogin)}
                  </TableCell>
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
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
      </Menu>

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
            onClick={handleSuspendConfirm} 
            color="primary" 
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pagination */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {enumerators.length} entries
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Button size="small" disabled>
            Previous
          </Button>
          <Chip label="1" color="primary" />
          <Button size="small">Next</Button>
        </Box>
      </Box>

      {/* Add Enumerator Modal */}
      <Modal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        aria-labelledby="add-enumerator-modal"
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
                  disabled={isLoading}
                  sx={{ bgcolor: '#25306B', '&:hover': { bgcolor: '#1a1f4b' } }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Add Enumerator'
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

export default EnumeratorPage;
