import { FC, useState } from "react";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiController } from "../../axios";
import { useAuthStore, useSnackStore } from "../../store";

interface LoginResponse {
  user: {
    id: string;
    name: string;
    // add other user properties as needed
  };
  token: string;
  refreshToken: string;
}

const SignInPage: FC = function () {
  const navigate = useNavigate();
  const { logIn } = useAuthStore();
  const { setAlert, setLoading } = useSnackStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiController.post<LoginResponse>("/user/login", formData);
      
      logIn(response.user, response.token, response.refreshToken);
      setAlert({ variant: "success", message: "Login successful" });
      navigate("/");
    } catch (error) {
      setAlert({
        variant: "error",
        message: error instanceof Error ? error.message : "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Left Side */}
        <div
          style={{
            width: "40%",
            backgroundColor: "#25306b",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Text Content */}
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h3" style={{ color: "#fff", fontWeight: "bold" }}>
              Welcome Back!
            </Typography>
            <Typography variant="body1" style={{ color: "#fff", marginTop: "16px" }}>
              To keep connected with us, please login with your personal info.
            </Typography>
          </div>
          {/* Decorative Circles */}
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
            alt="Polygon"
            style={{
              width: 105,
              height: 105,
              position: "fixed",
              top: 90,
              left: 380,
            }}
          />
          <img
            src="/public/svg/Polygon 1.svg"
            alt="Polygon"
            style={{
              width: 200,
              height: 150,
              position: "fixed",
              top: 175,
              left: 230,
            }}
          />
          <img
            src="/public/svg/Rectangle 4.svg"
            alt="Polygon"
            style={{
              width: 100,
              height: 50,
              position: "fixed",
              top: 400,
              left: 230,
            }}
          />
          <img
            src="/public/svg/Ellipse 2.svg"
            alt="Polygon"
            style={{
              width: 200,
              height: 250,
              position: "fixed",
              top: 400,
              left: 0,
            }}
          />
        </div>

        {/* Right Side */}
        <div
          style={{
            width: "60%",
            display: "flex",
            backgroundColor: "#D5DAE1",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form 
            onSubmit={handleSubmit}
            style={{ 
              width: "400px",
              backgroundColor: "#fff",
              padding: "32px",
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Logo and Header */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <img
                src="/logo.svg"
                alt="Logo"
                style={{ width: "225.28px", height: "55px" }}
              />
              <Typography variant="h6" style={{ marginTop: "16px" }}>
                Enter your details to access your account.
              </Typography>
            </div>
            {/* Login Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <VisibilityOff />
                    </InputAdornment>
                  ),
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <FormControlLabel control={<Checkbox />} label="Remember me" />
                <Link href="/forgot-password" underline="hover">
                  Forgot Password?
                </Link>
              </div>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
