import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  Link,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiController } from "../../axios";
import { useAuthStore, useSnackStore } from "../../store";

interface LoginResponse {
  user: {
    id: string;
    name: string;
  };
  token: string;
  refreshToken: string;
}

const SignInPage: FC = function () {
  const navigate = useNavigate();
  const theme = useTheme();
  const { logIn } = useAuthStore();
  const { setAlert, setLoading } = useSnackStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Responsive hook for detecting screen size
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitting(true);

    // Trim whitespace from the email before submission
    const sanitizedFormData = {
      ...formData,
      email: formData.email.trim(),
    };

    try {
      const response = await apiController.post<LoginResponse>(
        "/user/login",
        sanitizedFormData
      );

      logIn(response.user, response.token, response.refreshToken);
      // setAlert({ variant: "success", message: "Login successful" });
      navigate("/");
    } catch (error) {
      setAlert({
        variant: "error",
        message: error instanceof Error ? error.message : "Login failed",
      });
    } finally {
      setLoading(false);
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
        flexDirection: isMobile ? "column" : "row",
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
              Welcome Back!
            </Typography>
            <Typography variant="body1" sx={{ color: "#fff", mt: 2 }}>
              To keep connected with us, please login with your personal info.
            </Typography>
          </Box>
          {/* Decorative Elements */}
          <img
            src="/public/svg/Polygon 2.svg"
            alt="Polygon"
            style={{
              width: 70,
              height: 89,
              position: "absolute",
              top: -10,
              left: 270,
            }}
          />
          <img
            src="/public/svg/Ellipse 5.svg"
            alt="Ellipse"
            style={{
              width: 105,
              height: 105,
              position: "absolute",
              top: 90,
              left: 380,
            }}
          />
        </Box>
      )}

      {/* Right Side */}
      <Box
        sx={{
          width: isMobile ? "100%" : "60%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#D5DAE1",
          p: isMobile ? 2 : 0,
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
          {/* Logo and Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <img
              src="/logo.png"
              alt="Logo"
              style={{ width: isMobile ? 200 : 300 }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Enter your details to access your account.
            </Typography>
          </Box>
          {/* Login Form */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Email"
              variant="standard"
              fullWidth
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              type="email"
            />
            <TextField
              label="Password"
              variant="standard"
              fullWidth
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={() => setShowPassword((prev) => !prev)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <FormControlLabel control={<Checkbox />} label="Remember me" />
              <Link href="/forgot-password" underline="hover">
                Forgot Password?
              </Link>
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              startIcon={isSubmitting && <CircularProgress size={20} />}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default SignInPage;
