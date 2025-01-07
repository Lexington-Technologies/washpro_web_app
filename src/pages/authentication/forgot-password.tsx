import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiController } from "../../axios";
import { useSnackStore } from "../../store";

const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setAlert } = useSnackStore();
  const isMobile = useMediaQuery("(max-width:768px)");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailOrPhone.trim()) {
      setAlert({
        variant: "error",
        message: "Please enter your email or phone number."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiController.post("/user/reset-password", {
        emailOrPhone: emailOrPhone.trim()
      });

      setAlert({
        variant: "success",
        message: "Reset password link has been sent to your email or phone."
      });
      navigate("/login");
    } catch (error) {
      setAlert({
        variant: "error",
        message: error instanceof Error ? error.message : "Failed to send reset password link"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {!isMobile && (
        <Box
          sx={{
            width: "40%",
            backgroundColor: "#25306b",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" sx={{ color: "#fff", fontWeight: "bold" }}>
              Forgot Password?
            </Typography>
            <Typography variant="body1" sx={{ color: "#fff", mt: 2 }}>
              Don't worry! It happens. Please enter your email or phone number.
            </Typography>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          width: isMobile ? "100%" : "60%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#D5DAE1",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#fff",
            padding: "32px",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <img
              src="/logo.svg"
              alt="Logo"
              style={{ width: "225.28px", height: "55px" }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Enter your email address or phone number to reset your password.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Email or Phone Number"
              variant="standard"
              fullWidth
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
            />
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{ 
                borderRadius: 2,
                height: 48,
                bgcolor: "#25306B",
                "&:hover": { bgcolor: "#1a1f4b" }
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit"
              )}
            </Button>

            <Button
              onClick={() => navigate("/login")}
              variant="text"
              fullWidth
              sx={{ mt: 2 }}
            >
              Back to Login
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
