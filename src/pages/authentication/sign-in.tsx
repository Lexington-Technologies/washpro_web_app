import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useAuthStore, useSnackStore } from "../../store";
import { Ellipse, Ellipse2, Polygon, Polygon2, Rectangle, Logo } from "../../assets/svg/index";

const SignInPage: FC = function () {
  const theme = useTheme();
  const { zitadel } = useAuthStore();
  const { 
    setAlert,
    setLoading 
  } = useSnackStore() as { 
    setAlert: (alert: { variant: string; message: string }) => void; 
    setLoading: (loading: boolean) => void; 
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Responsive hook for detecting screen size
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // We might not need to call authorize on load if we have a button
    // If direct navigation to Zitadel is desired on page load, this can be kept.
    // For now, let's assume login is initiated by button click.
    // zitadel?.authorize(); 
  }, [zitadel]);

  const handleZitadelLogin = async () => {
    setIsSubmitting(true);
    setLoading(true); // Assuming setLoading is still desired from useSnackStore
    try {
      await zitadel?.authorize();
      // Navigation or further actions after authorize might be handled by Zitadel callbacks
      // or might need to be added here if authorize itself doesn't redirect.
    } catch (error) {
      setAlert({ // Assuming setAlert is still desired from useSnackStore
        variant: "error",
        message: error instanceof Error ? error.message : "Login failed",
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false); // Assuming setLoading is still desired from useSnackStore
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
              Welcome to WashPro
            </Typography>
            <Typography variant="body1" sx={{ color: "#fff", mt: 2, px: 4, lineHeight: 1.6 }}>
              Empowering communities through improved water, sanitation, and hygiene. WashPro provides essential tools and insights for managing and monitoring programme impact effectively.
            </Typography>
          </Box>
          {/* Decorative Elements - made more subtle */}
          <img
            src={Polygon2}
            alt="Decorative Polygon"
            style={{
              width: "8%", // Slightly smaller
              height: "auto",
              position: "absolute",
              top: "8%",
              left: "30%",
              opacity: 0.3, // More subtle
            }}
          />
          <img
            src={Ellipse2}
            alt="Decorative Ellipse"
            style={{
              width: "12%", // Slightly smaller
              height: "auto",
              position: "absolute",
              top: "22%",
              left: "70%",
              opacity: 0.3, // More subtle
            }}
          />
          <img
            src={Polygon}
            alt="Decorative Polygon"
            style={{
              width: "15%", // Slightly smaller
              height: "auto",
              position: "absolute",
              top: "18%",
              left: "55%",
              opacity: 0.3, // More subtle
            }}
          />
          <img
            src={Rectangle}
            alt="Decorative Rectangle"
            style={{
              width: "8%", // Slightly smaller
              height: "auto",
              position: "absolute",
              top: "45%",
              left: "25%",
              opacity: 0.3, // More subtle
            }}
          />
          <img
            src={Ellipse}
            alt="Decorative Ellipse"
            style={{
              width: "35%", // Slightly smaller
              height: "auto",
              position: "absolute",
              top: "75%",
              left: "-5%", // Adjusted position slightly
              opacity: 0.3, // More subtle
            }}
          />
          <Typography variant="h6" sx={{ mt: 2, mb: 3, color: 'text.secondary', fontWeight: 500 }}>
            Sign in securely using your organizational account.
          </Typography>
        </Box>
      )}

      {/* Right Side */}
      <Box
        sx={{
          width: isMobile ? "100%" : "60%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8F9FA",
          p: isMobile ? 3 : 4,
        }}
      >
        <Box
          component="form"
          onSubmit={(e) => { e.preventDefault(); handleZitadelLogin(); }}
          sx={{
            width: "100%",
            maxWidth: "420px",
            backgroundColor: "#ffffff",
            padding: isMobile ? "24px" : "40px",
            borderRadius: "12px",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Logo and Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <img
              src={Logo}
              alt="Logo"
              style={{ width: isMobile ? "50%" : "60%" }}
            />
            <Typography variant="h6" sx={{ mt: 2, mb: 3, color: 'text.secondary', fontWeight: 500 }}>
              Sign in securely using your organizational account.
            </Typography>
          </Box>
          {/* Login Button */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              type="button"
              onClick={handleZitadelLogin}
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{ 
                py: 1.5,
                fontSize: "1.05rem",
                textTransform: "none",
                borderRadius: "8px",
              }}
              startIcon={isSubmitting && <CircularProgress size={24} color="inherit" />}
            >
              {isSubmitting ? "Redirecting..." : "Sign In with SSO"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SignInPage;