import { Snackbar, Alert } from "@mui/material";
import { useSnackStore } from "../store";

function SnackbarManager() {
    const { message, variant, setAlert } = useSnackStore();
  
    const handleClose = () => {
      setAlert({ message: "", variant: "success" });
    };
  
    return (
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {message && (
          <Alert onClose={handleClose} severity={variant || 'info'} variant="filled">
            {message}
          </Alert>
        )}
      </Snackbar>
    );
  }

  export default SnackbarManager;
  