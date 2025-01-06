import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f8fafc",
      }}
    >
      <ErrorIcon sx={{ fontSize: 100, color: "#ef4444", mb: 2 }} />
      <Typography variant="h1" sx={{ fontSize: "6rem", fontWeight: "bold", color: "#1e293b", mb: 2 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ color: "#64748b", mb: 4 }}>
        Oops! Page not found
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: "#25306B",
            "&:hover": { bgcolor: "#1a1f4b" },
          }}
        >
          Go Back
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{
            color: "#25306B",
            borderColor: "#25306B",
            "&:hover": {
              borderColor: "#1a1f4b",
              bgcolor: "rgba(37, 48, 107, 0.04)",
            },
          }}
        >
          Go Home
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound; 