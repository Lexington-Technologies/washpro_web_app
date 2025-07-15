import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Error as ErrorIcon, Home, ArrowBack } from '@mui/icons-material';

const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleGoHome = () => navigate('/');
  const handleGoBack = () => navigate(-1);
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8fafc',
        backgroundColor: '#F1F1F5',
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <ErrorIcon 
          sx={{ 
            fontSize: 64, 
            color: '#ef4444',
            mb: 2
          }} 
        />
        
        <Typography variant="h4" gutterBottom sx={{ color: '#1e293b', fontWeight: 'bold' }}>
          {isRouteErrorResponse(error) ? `Error ${error.status}` : 'Oops!'}
        </Typography>
        
        <Typography variant="h6" sx={{ color: '#64748b', mb: 3 }}>
          {isRouteErrorResponse(error) 
            ? error.statusText
            : 'Something unexpected went wrong'}
        </Typography>
        
        {isRouteErrorResponse(error) && error.data?.message && (
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4,
              color: '#94a3b8',
              bgcolor: '#f1f5f9',
              p: 2,
              borderRadius: 1
            }}
          >
            {error.data.message}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={handleGoHome}
            sx={{
              bgcolor: '#25306B',
              '&:hover': { bgcolor: '#1a1f4b' }
            }}
          >
            Back to Home
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
            sx={{
              color: '#25306B',
              borderColor: '#25306B',
              '&:hover': {
                borderColor: '#1a1f4b',
                bgcolor: 'rgba(37, 48, 107, 0.04)'
              }
            }}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ErrorBoundary; 