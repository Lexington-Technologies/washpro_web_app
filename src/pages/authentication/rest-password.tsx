import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiController } from "../../axios"; // Adjust import as needed
import { useSnackStore } from "../../store"; // Assuming you have a snack store for alerts

const ResetPassword = () => {
  const navigate = useNavigate();
  const { setAlert } = useSnackStore() as {
    setAlert: (alert: { variant: string; message: string }) => void;
  };
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setAlert({ variant: "error", message: "Passwords do not match!" });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiController.post("/user/reset-password", {
        password: formData.password,
      });

      setAlert({ variant: "success", message: "Password reset successfully!" });
      navigate("/login"); // Redirect to login page
    } catch (error) {
      setAlert({
        variant: "error",
        message: error instanceof Error ? error.message : "Failed to reset password. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
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
                Reset Password?
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
            <Grid item>
              <TextField
                fullWidth
                label="Password"
                placeholder="Enter password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                label="Confirm Password"
                placeholder="Enter password again"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ borderRadius: 2 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
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
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1, color: "greysg-5" }}>
          Return
        </Typography>
      </Box>
    </Box>
  );
};

export default ResetPassword;
