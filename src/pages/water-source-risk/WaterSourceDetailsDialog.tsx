import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Grid,
    Box,
    Avatar,
    Chip,
    Divider,
    Card,
  } from '@mui/material';
  import { Close as CloseIcon, LocationOn, Business, Home as HomeIcon, WaterDrop } from '@mui/icons-material';
  import { WaterSourceRiskData } from './types'; // Adjust the import path as needed
  
  interface WaterSourceDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    waterSource: WaterSourceRiskData;
    isImageOpen: boolean;
    onImageOpen: () => void;
    onImageClose: () => void;
  }
  
  const WaterSourceDetailsDialog: React.FC<WaterSourceDetailsDialogProps> = ({
    open,
    onClose,
    waterSource,
    onImageOpen,
  }) => {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2, bgcolor: '#f8f9fa' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Water Source Details
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: 'relative',
                    '&:hover .zoom-icon': { opacity: 1 },
                    height: '100%',
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80"
                    alt="Water source"
                    onClick={onImageOpen}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 2,
                      cursor: 'pointer',
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Risk Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, bgcolor: '#fee2e2', borderRadius: 1 }}>
                        <Typography variant="body2" color="error">
                          Critical Risks
                        </Typography>
                        <Typography variant="h4">
                          {waterSource.summary.toilets.critical}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, bgcolor: '#fef3c7', borderRadius: 1 }}>
                        <Typography variant="body2" color="warning.main">
                          Moderate Risks
                        </Typography>
                        <Typography variant="h4">
                          {waterSource.summary.toilets.moderate}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, bgcolor: '#dcfce7', borderRadius: 1 }}>
                        <Typography variant="body2" color="success.main">
                          Safe Facilities
                        </Typography>
                        <Typography variant="h4">
                          {waterSource.summary.toilets.good}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, bgcolor: '#dbeafe', borderRadius: 1 }}>
                        <Typography variant="body2" color="info.main">
                          Total Facilities
                        </Typography>
                        <Typography variant="h4">
                          {waterSource.summary.toilets.total}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}>
                <Box
                  sx={{
                    bgcolor: '#fff',
                    p: 3,
                    borderRadius: 2,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <WaterDrop sx={{ color: 'primary.main', fontSize: 28 }} />
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                      {waterSource.waterSourceType}
                    </Typography>
                  </Box>
  
                  <Divider sx={{ mb: 3 }} />
  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
                        <LocationOn sx={{ color: 'primary.main' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Ward
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="500">
                          {waterSource.location.ward}
                        </Typography>
                      </Box>
                    </Box>
  
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Avatar sx={{ bgcolor: 'success.light', width: 40, height: 40 }}>
                        <Business sx={{ color: 'success.main' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Village
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="500">
                          {waterSource.location.village}
                        </Typography>
                      </Box>
                    </Box>
  
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Avatar sx={{ bgcolor: 'warning.light', width: 40, height: 40 }}>
                        <HomeIcon color="warning" />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Hamlet
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="500">
                          {waterSource.location.hamlet}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
  
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      icon={<LocationOn />}
                      label={`${waterSource.location.coordinates[1].toFixed(6)}, ${waterSource.location.coordinates[0].toFixed(6)}`}
                      variant="outlined"
                      color="primary"
                      sx={{ width: '100%', justifyContent: 'flex-start', px: 1 }}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Nearby Facilities
                </Typography>
                <Grid container spacing={2}>
                  {['toilets', 'soakAways', 'openDefecation', 'gutters'].map((facilityType) => (
                    <Grid item xs={12} sm={6} md={3} key={facilityType}>
                      <Card sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ textTransform: 'capitalize' }}>
                          {facilityType.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                        <Typography variant="h5">
                          {waterSource.facilities[facilityType as keyof Facilities].length}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default WaterSourceDetailsDialog;