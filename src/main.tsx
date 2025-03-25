import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from "./theme";
import App from './App';
import LoadingAnimation from './components/LoadingAnimation';
import { SnackbarProvider } from 'notistack';

// Create a Query Client instance
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <React.Suspense fallback={<LoadingAnimation />}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider maxSnack={1} anchorOrigin={{horizontal:'center', vertical:'top'}}>
            <App />
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.Suspense>
  </React.StrictMode>,
);