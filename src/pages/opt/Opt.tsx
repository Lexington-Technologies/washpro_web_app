import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

const EnterOtp = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f1f1f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "20px",
          left: "20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }}>
          Return
        </Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Enter OTP
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          An OTP has been sent to you, please enter it to reset your password.
        </Typography>

        <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          {["1", "2", "3", "4", "5", "6"].map((digit, index) => (
            <Grid item key={index}>
              <TextField
                variant="outlined"
                value={digit}
                inputProps={{
                  style: { textAlign: "center", fontSize: "24px" },
                }}
                sx={{
                  width: "56px",
                  height: "56px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    borderColor: index === 5 ? "primary.main" : "grey.300",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          color="primary"
          sx={{ width: "200px", height: "48px" }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default EnterOtp;