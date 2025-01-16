import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Menu,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { apiController } from '../../axios';
import { useSnackStore } from '../../store';
import { Search } from '@mui/icons-material';
import { FaFilter } from 'react-icons/fa';
import { useForm, Controller } from 'react-hook-form';

interface DumpSite {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  geolocation: {
    type: string;
    coordinates: number[];
  };
  condition: 'Period' | 'Temporary' | 'Permanent';
  status: 'Improved' | 'Unimproved';
  safetyRisk: 'Maintained' | 'Unmaintained' | 'High Risk';
  evacuationSchedule: 'opened' | 'closed' | 'pending';
  lastEvacuationDate: string;
  nextScheduledEvacuation: string;
  capturedAt: string;
}

const DumpSites = () => {
  const [dumpSites, setDumpSites] = useState<DumpSite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setAlert } = useSnackStore();
  const [selectedSite, setSelectedSite] = useState<DumpSite | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const { control, handleSubmit, reset } = useForm<DumpSite>();

  const fetchDumpSites = async () => {
    setIsLoading(true);
    try {
      const response = await apiController.get('/dump-sites');
      const data = response.data || response;
      setDumpSites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching dump sites:', error);
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch dump sites'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDumpSites();
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, site: DumpSite) => {
    setAnchorEl(event.currentTarget);
    setSelectedSite(site);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewSite = () => {
    setOpenViewModal(true);
    handleMenuClose();
  };

  const handleEditSite = () => {
    if (selectedSite) {
      reset(selectedSite);
    }
    setOpenEditModal(true);
    handleMenuClose();
  };

  const handleDeleteSite = async () => {
    if (!selectedSite?._id) return;

    try {
      setIsLoading(true);
      await apiController.delete(`/dump-sites/${selectedSite._id}`);
      setAlert({
        variant: 'success',
        message: 'Dump site deleted successfully'
      });
      setOpenDeleteModal(false);
      fetchDumpSites();
    } catch (error) {
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete dump site'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleUpdateSite = async (data: DumpSite) => {
    if (!data._id) return;
    try {
      setIsLoading(true);
      await apiController.put(`/dump-sites/${data._id}`, data);
      setAlert({
        variant: 'success',
        message: 'Dump site updated successfully',
      });
      setOpenEditModal(false);
      fetchDumpSites();
    } catch (error) {
      setAlert({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Failed to update dump site',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedSites = dumpSites.slice(startIndex, endIndex);
  const totalPages = Math.ceil(dumpSites.length / rowsPerPage);

  const notificationCards = [
    {
      title: "Critical Sites",
      count: "3 sites",
      countColor: "#D32F2F",
      items: [
        {
          label: "East End Facility",
          description: "Immediate attention required",
          leftIcon: <ErrorIcon sx={{ fontSize: 20, color: "#D32F2F" }} />,
          rightIcon: <CheckCircleIcon sx={{ fontSize: 20, color: "#4CAF50" }} />,
          bgcolor: "#ffebee",
        },
      ],
    },
    {
      title: "Maintenance Schedule",
      count: "Next 7 days",
      countColor: "#1E88E5",
      items: [
        {
          label: "South Gate Site",
          description: "Scheduled for tomorrow",
          leftIcon: <WarningAmberIcon sx={{ fontSize: 20, color: "#FFA000" }} />,
          rightIcon: <CheckCircleIcon sx={{ fontSize: 20, color: "#4CAF50" }} />,
          bgcolor: "#e3f2fd",
        },
      ],
    },
    {
      title: "Recent Reports",
      count: "Last 24h",
      countColor: "#666",
      items: [
        {
          label: "Capacity Report",
          description: "Generated at 09:00 AM",
          leftIcon: <CheckCircleIcon sx={{ fontSize: 20, color: "#4CAF50" }} />,
          rightIcon: <ErrorIcon sx={{ fontSize: 20, color: "#D32F2F" }} />,
          bgcolor: "#f5f5f5",
        },
      ],
    },
  ];

  return (
    <Box sx={{ padding: 4, bgcolor: "#f8f9fc" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#25306B" }}>
            Dump Sites
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Detailed insights about your selected location
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              height: 48,
              color: "#1F2937",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaFilter style={{ marginRight: 8 }} />
            Filter
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666' }}>Total Sites</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#25306B' }}>
                    {dumpSites.length}
                  </Typography>
                </Box>
                <Box sx={{
                  width: 48,
                  height: 48,
                  bgcolor: '#e3f2fd',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img src="/svg/pie.svg" alt="Total" style={{ width: 24, height: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666' }}>Maintained</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#25306B' }}>
                    {dumpSites.filter(site => site.safetyRisk === 'Maintained').length}
                  </Typography>
                </Box>
                <Box sx={{
                  width: 48,
                  height: 48,
                  bgcolor: '#e8f5e9',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircleIcon sx={{ fontSize: 24, color: '#16A34A' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666' }}>High Risk</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#25306B' }}>
                    {dumpSites.filter(site => site.safetyRisk === 'High Risk').length}
                  </Typography>
                </Box>
                <Box sx={{
                  width: 48,
                  height: 48,
                  bgcolor: '#ffebee',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ErrorIcon sx={{ fontSize: 24, color: '#D32F2F' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666' }}>Unmaintained</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#25306B' }}>
                    {dumpSites.filter(site => site.safetyRisk === 'Unmaintained').length}
                  </Typography>
                </Box>
                <Box sx={{
                  width: 48,
                  height: 48,
                  bgcolor: '#fffde7',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <WarningAmberIcon sx={{ fontSize: 24, color: '#EAB308' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search dump sites..."
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
        />
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>S/N</TableCell>
                <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>Ward</TableCell>
                <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>Village</TableCell>
                <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>Hamlet</TableCell>
                <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>Condition</TableCell>
                <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>Status</TableCell>
                <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>Safety Risk</TableCell>
                <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>Schedule</TableCell>
                <TableCell sx={{ bgcolor: '#25306B', color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : displayedSites.map((site, index) => (
                <TableRow key={site._id}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{site.ward}</TableCell>
                  <TableCell>{site.village}</TableCell>
                  <TableCell>{site.hamlet}</TableCell>
                  <TableCell>{site.condition}</TableCell>
                  <TableCell>
                    <Chip
                      label={site.status}
                      size="small"
                      sx={{
                        bgcolor: site.status === 'Improved' ? '#e8f5e9' : '#ffebee',
                        color: site.status === 'Improved' ? '#16A34A' : '#DC2626',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={site.safetyRisk}
                      size="small"
                      sx={{
                        bgcolor: 
                          site.safetyRisk === 'Maintained' ? '#e8f5e9' : 
                          site.safetyRisk === 'Unmaintained' ? '#fffde7' : '#ffebee',
                        color: 
                          site.safetyRisk === 'Maintained' ? '#16A34A' : 
                          site.safetyRisk === 'Unmaintained' ? '#EAB308' : '#DC2626',
                      }}
                    />
                  </TableCell>
                  <TableCell>{site.evacuationSchedule}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuClick(e, site)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewSite}>
          <Visibility sx={{ mr: 1 }} /> View
        </MenuItem>
        <MenuItem onClick={handleEditSite}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => setOpenDeleteModal(true)} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Dump Site</DialogTitle>
        <DialogContent>
          {selectedSite && (
            <form onSubmit={handleSubmit(handleUpdateSite)}>
              <Controller
                name="ward"
                control={control}
                defaultValue={selectedSite.ward}
                render={({ field }) => <TextField {...field} label="Ward" fullWidth margin="normal" />}
              />
              <Controller
                name="village"
                control={control}
                defaultValue={selectedSite.village}
                render={({ field }) => <TextField {...field} label="Village" fullWidth margin="normal" />}
              />
              <Controller
                name="hamlet"
                control={control}
                defaultValue={selectedSite.hamlet}
                render={({ field }) => <TextField {...field} label="Hamlet" fullWidth margin="normal" />}
              />
              <Controller
                name="condition"
                control={control}
                defaultValue={selectedSite.condition}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Condition"
                    select
                    fullWidth
                    margin="normal"
                  >
                    {['Period', 'Temporary', 'Permanent'].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="status"
                control={control}
                defaultValue={selectedSite.status}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Status"
                    select
                    fullWidth
                    margin="normal"
                  >
                    {['Improved', 'Unimproved'].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="safetyRisk"
                control={control}
                defaultValue={selectedSite.safetyRisk}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Safety Risk"
                    select
                    fullWidth
                    margin="normal"
                  >
                    {['Maintained', 'Unmaintained', 'High Risk'].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <TextField
                type="file"
                onChange={handleImageChange}
                fullWidth
                margin="normal"
                inputProps={{ accept: 'image/*' }}
              />
            </form>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button onClick={handleSubmit(handleUpdateSite)} color="primary" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Delete Dump Site</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this dump site?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
          <Button onClick={handleDeleteSite} color="error" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Dump Site Details</DialogTitle>
        <DialogContent>
          {selectedSite && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {selectedSite.picture && (
                <Grid item xs={12}>
                  <img 
                    src={selectedSite.picture} 
                    alt="Dump Site" 
                    style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 8 }} 
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Ward</Typography>
                <Typography>{selectedSite.ward}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Village</Typography>
                <Typography>{selectedSite.village}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Hamlet</Typography>
                <Typography>{selectedSite.hamlet}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Condition</Typography>
                <Typography>{selectedSite.condition}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Status</Typography>
                <Typography>{selectedSite.status}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Safety Risk</Typography>
                <Typography>{selectedSite.safetyRisk}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        {notificationCards.map((card, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ borderRadius: 2, boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "#25306B" }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: card.countColor }}
                  >
                    {card.count}
                  </Typography>
                </Box>

                {card.items.map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 2,
                      borderRadius: 2,
                      backgroundColor: item.bgcolor,
                      marginBottom: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {item.leftIcon}
                      <Box sx={{ marginLeft: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#25306B" }}
                        >
                          {item.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>

                    {item.rightIcon}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

    </Box>
  );
};

export default DumpSites;