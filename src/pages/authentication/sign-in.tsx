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
import { useSnackbar } from "notistack";

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
          <Box sx={{ textAlign: "center", px: 6 /* Add padding for better text spacing */ }}>
            <Typography variant="h2" sx={{ color: "#fff", fontWeight: "bold", mb: 3 /* Add margin bottom */ }}>
              Welcome to WashPro
            </Typography>
            <Typography variant="h6" sx={{ color: "#fff", mt: 2, lineHeight: 1.7, opacity: 0.9 /* Slightly increased line height and reduced opacity for subtext */ }}>
              Empowering communities through improved water, sanitation, and hygiene. WashPro provides essential tools and insights for managing and monitoring programme impact effectively.
            </Typography>
          </Box>
          {/* Decorative Elements - Refined for a cleaner look */}
          <img
            src={Polygon2}
            alt="Decorative Polygon"
            style={{
              width: "60px", // Fixed size for better control
              height: "auto",
              position: "absolute",
              top: "15%", // Adjusted position
              left: "10%", // Adjusted position
              opacity: 0.2, // Reduced opacity
            }}
          />
          <Box
            component="img"
            src={Ellipse2}
            alt="Decorative Ellipse"
            style={{
              width: "80px", // Fixed size
              height: "auto",
              position: "absolute",
              bottom: "20%", // Adjusted position
              right: "15%", // Adjusted position
              opacity: 0.2, // Reduced opacity
            }}
          />
          <Box
            component="img"
            src={Polygon}
            alt="Decorative Polygon"
            style={{
              width: "100px", // Fixed size
              height: "auto",
              position: "absolute",
              top: "30%", // Adjusted position
              right: "5%", // Adjusted position
              opacity: 0.15, // Reduced opacity
            }}
          />
          <Box
            component="img"
            src={Rectangle}
            alt="Decorative Rectangle"
            style={{
              width: "70px", // Fixed size
              height: "auto",
              position: "absolute",
              bottom: "10%", // Adjusted position
              left: "20%", // Adjusted position
              opacity: 0.2, // Reduced opacity
            }}
          />
          <Box
            component="img"
            src={Ellipse}
            alt="Decorative Ellipse"
            style={{
              width: "150px", // Fixed size
              height: "auto",
              position: "absolute",
              top: "60%", // Adjusted position
              left: "-50px", // Adjusted to be partially off-screen
              opacity: 0.25, // Reduced opacity
            }}
          />
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
          backgroundColor: isMobile ? "#ffffff" : "#F8F9FA", // White background for mobile, light gray for desktop
          p: isMobile ? 4 : 6, // Increased padding
        }}
      >
        <Box
          component="form"
          onSubmit={(e) => { e.preventDefault(); handleZitadelLogin(); }}
          sx={{
            width: "100%",
            maxWidth: isMobile ? "100%" : "450px", // Full width on mobile, slightly larger max-width on desktop
            backgroundColor: "#ffffff",
            padding: isMobile ? "32px" : "48px", // Increased padding
            borderRadius: "16px", // Larger border radius
            boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.1)", // Softer, more pronounced shadow
          }}
        >
          {/* Logo and Header */}
          <Box sx={{ textAlign: "center", mb: 5 /* Increased margin bottom */ }}>
            <Box
              component="img"
              src={Logo}
              alt="Logo"
              style={{ width: isMobile ? "150px" : "180px", marginBottom: "24px" /* Added margin bottom to logo */ }}
            />
            <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold", color: "text.primary" }}>
              Welcome Back!
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Sign in securely using your organizational account.
            </Typography>
          </Box>
          {/* Login Button */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 /* Increased gap */ }}>
            <Button
              type="button"
              onClick={handleZitadelLogin}
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{
                py: 1.8, // Increased padding Y
                fontSize: "1.1rem", // Slightly larger font size
                textTransform: "none",
                borderRadius: "10px", // Larger border radius for button
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for button
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