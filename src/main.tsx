import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { Alert, CssBaseline, Snackbar } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from "./theme";
import App from './App';
import { useSnackStore } from './store';
import LoadingAnimation from './components/LoadingAnimation';

// Create a Query Client instance
const queryClient = new QueryClient();

function SnackbarManager() {
  const { message, variant, setAlert } = useSnackStore();

  const handleClose = () => {
    setAlert({ message: "", variant: "success" });
  };

  return (
    <Snackbar 
      open={!!message} 
      autoHideDuration={6000} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {message ? (
        <Alert onClose={handleClose} severity={variant || 'info'} variant="filled">
          {message}
        </Alert>
      ) : <></>}
    </Snackbar>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <React.Suspense fallback={<LoadingAnimation />}>

    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarManager />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
    </React.Suspense>
  </React.StrictMode>,
);