import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Paper,
  Button,
  Container,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import { apiController } from '../../axios';

interface WaterSource {
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  geolocation: {
    type: string;
    coordinates: number[];
  };
  quality: string;
  status: string;
  type: string;
  _id: string;
  createdBy: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
}



const WaterSourceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: waterSource, isLoading, error } = useQuery({
    queryKey: ['waterSource', id],
    queryFn: () => apiController.get<WaterSource[]>(`/water-sources/${id}`),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Back button component
  const BackButton = () => (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        top: 16,
        left: 16,
        zIndex: 1000,
        borderRadius: 2,
      }}
    >
      <IconButton
        color="primary"
        onClick={() => navigate(-1)}
        sx={{ p: 1 }}
      >
        <ArrowBackIcon />
      </IconButton>
    </Paper>
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error instanceof Error) {
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Alert severity="error">
          {error.message}
        </Alert>
      </Container>
    );
  }

  if (!waterSource) {
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Alert severity="info">No water source found</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <BackButton />
      
      <Container maxWidth="lg">
        <Card elevation={3}>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="300"
              image={waterSource.picture || '/api/placeholder/800/400'}
              alt={`Water source at ${waterSource.village}`}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                display: 'flex',
                gap: 1,
              }}
            >
              <Chip
                label={waterSource.status}
                color={waterSource.status === 'Functional' ? 'success' : 'error'}
                sx={{ bgcolor: 'white' }}
              />
              <Chip
                label={waterSource.quality}
                color={waterSource.quality === 'Drinkable' ? 'primary' : 'warning'}
                sx={{ bgcolor: 'white' }}
              />
            </Box>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Location Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Location Details
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Ward:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{waterSource.ward}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Village:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{waterSource.village}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Hamlet:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{waterSource.hamlet}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Technical Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Technical Details
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Type:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{waterSource.type}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">Coordinates:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>
                        {waterSource.geolocation.coordinates.join(', ')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Timeline Information */}
            <Typography variant="h5" gutterBottom>
              Timeline
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <Typography color="text.secondary">Captured At:</Typography>
                <Typography>{formatDate(waterSource.capturedAt)}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography color="text.secondary">Created At:</Typography>
                <Typography>{formatDate(waterSource.createdAt)}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography color="text.secondary">Last Updated:</Typography>
                <Typography>{formatDate(waterSource.updatedAt)}</Typography>
              </Grid>
            </Grid>

            {/* Actions */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => {/* Implement download functionality */}}
              >
                Download Report
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default WaterSourceDetails;