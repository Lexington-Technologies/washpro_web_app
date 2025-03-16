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
  IconButton,
} from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiController } from "../../axios";
import { useAuthStore, useSnackStore } from "../../store";
import { Ellipse, Ellipse2, Polygon, Polygon2, Rectangle, Logo } from "../../assets/svg/index";

interface LoginResponse {
  user: { id: string; name: string };
  token: string;
  refreshToken: string;
}

const SignInPage: FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { logIn } = useAuthStore();
  const { setAlert, setLoading } = useSnackStore();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Handle input changes efficiently
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitting(true);

    try {
      const { data } = await apiController.post<LoginResponse>("/user/login", {
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      logIn(data.user, data.token, data.refreshToken);
      navigate("/");
    } catch (error: any) {
      setAlert({
        message: error.response?.data?.message || "Login failed",
        variant: "error",
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {!isMobile && (
        <Box sx={{ width: "40%", backgroundColor: "#25306b", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" sx={{ color: "#fff", fontWeight: "bold" }}>Welcome Back!</Typography>
            <Typography variant="body1" sx={{ color: "#fff", mt: 2 }}>To keep connected with us, please login with your personal info.</Typography>
          </Box>
        </Box>
      )}

      <Box sx={{ width: isMobile ? "100%" : "60%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#D5DAE1" }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: "400px", backgroundColor: "#fff", padding: "32px", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <img src={Logo} alt="Logo" style={{ width: isMobile ? "50%" : "60%" }} />
            <Typography variant="h6" sx={{ mt: 2 }}>Enter your details to access your account.</Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField name="email" label="Email" variant="standard" fullWidth value={formData.email} onChange={handleChange} required />
            <TextField
              name="password"
              label="Password"
              variant="standard"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? <Visibility /> : <VisibilityOff />}</IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} startIcon={isSubmitting && <CircularProgress size={20} />}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default SignInPage;
