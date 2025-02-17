import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface MapOverlayCardProps {
  latitude: number;
  longitude: number;
  village: string;
  hamlet: string;
  ward: string;
}

const MapOverlayCard: React.FC<MapOverlayCardProps> = ({ latitude, longitude, village, hamlet, ward }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        minWidth: 200,
      }}
    >
      <Typography variant="subtitle1" fontWeight="500" gutterBottom>
        Location Details
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Latitude: {latitude.toFixed(6)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Longitude: {longitude.toFixed(6)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Village: {village}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Hamlet: {hamlet}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ward: {ward}
        </Typography>
      </Box>
    </Paper>
  );
};

export default MapOverlayCard;