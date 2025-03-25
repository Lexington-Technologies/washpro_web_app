import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiController } from "../../axios";
import { useSnackStore } from "../../store";
import { useSnackbar } from "notistack";

const AccountSetUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { enqueueSnackbar } = useSnackbar()
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Add password validation rules
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("Password must be at least 8 characters long");
    if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number");
    if (!/[!@#$%^&*]/.test(password)) errors.push("Password must contain at least one special character (!@#$%^&*)");
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate token
    if (!token) {
      enqueueSnackbar({
        variant: "error",
        message: "Invalid or missing setup token"
      });
      return;
    }

    // Validate password requirements
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      enqueueSnackbar({
        variant: "error",
        message: passwordErrors[0] // Show first error message
      });
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      enqueueSnackbar({
        variant: "error",
        message: "Passwords do not match"
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiController.post("/user/activate-account", {
        token,
        password: formData.password
      });

      enqueueSnackbar({
        variant: "success",
        message: "Account setup successful"
      });
      
      // Redirect to login
      navigate("/login");
    } catch (error) {
      enqueueSnackbar({
        variant: "error",
        message: error instanceof Error ? error.message : "Account setup failed"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "#f1f1f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{ bgcolor: "#ffffff", borderRadius: 2, p: 4, boxShadow: 3 }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container direction="column" spacing={3} alignItems="center">
            <Grid item>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: "bold", color: "greysg-6" }}
              >
                Account Set Up
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="body1"
                sx={{ color: "greysg-3", textAlign: "center" }}
              >
                Please enter your new password.
              </Typography>
            </Grid>
            <Grid item sx={{ width: "100%" }}>
              <TextField
                fullWidth
                name="password"
                label="Password"
                placeholder="enter password"
                type={showPassword.password ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('password')}
                        edge="end"
                      >
                        {showPassword.password ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item sx={{ width: "100%" }}>
              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                placeholder="enter password again"
                type={showPassword.confirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                        edge="end"
                      >
                        {showPassword.confirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item sx={{ width: "100%" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isLoading}
                sx={{ 
                  borderRadius: 2,
                  height: 48,
                  bgcolor: "#25306B",
                  "&:hover": { bgcolor: "#1a1f4b" }
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton onClick={() => navigate("/login")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1, color: "greysg-5" }}>
          Return to Login
        </Typography>
      </Box>
    </Box>
  );
};

export default AccountSetUp;