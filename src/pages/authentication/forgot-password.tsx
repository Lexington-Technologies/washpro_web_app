import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";

const ForgotPassword = () => {
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          padding: 4,
          backgroundColor: "#ffffff",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Visby Round CF, Helvetica",
            fontWeight: 700,
            color: "rgba(61, 67, 74, 1)",
          }}
        >
          Forgot Password?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Visby Round CF, Helvetica",
            fontWeight: 500,
            color: "rgba(171, 172, 168, 1)",
            textAlign: "center",
            maxWidth: 342,
          }}
        >
          Enter your email address or phone number, to which the reset password
          link would be sent.
        </Typography>
        <TextField
          label="Email or Phone Number"
          defaultValue="email@example.com"
          variant="outlined"
          fullWidth
          sx={{
            maxWidth: 320,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              backgroundColor: "#ffffff",
              boxShadow: "0px 1px 2px #0000000d",
            },
            "& .MuiInputLabel-root": {
              fontFamily: "Poppins, Helvetica",
              fontWeight: 500,
              color: "rgba(61, 67, 74, 1)",
            },
            "& .MuiInputBase-input": {
              fontFamily: "Poppins, Helvetica",
              fontWeight: 400,
              color: "rgba(98, 98, 96, 1)",
            },
          }}
        />
        <Button
          variant="contained"
          sx={{
            width: 327,
            height: 48,
            backgroundColor: "rgba(44, 190, 239, 1)",
            borderRadius: 2,
            textTransform: "none",
            fontFamily: "Poppins, Helvetica",
            fontWeight: 500,
            fontSize: 16,
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "rgba(34, 160, 210, 1)",
            },
            "&:active": {
              backgroundColor: "rgba(24, 130, 180, 1)",
            },
          }}
        >
          Submit
        </Button>
      </Box>
      <IconButton
        aria-label="Return"
        sx={{
          position: "absolute",
          top: 12,
          left: 14,
        }}
      >
        <ArrowBackIcon
          sx={{
            color: "rgba(98, 98, 96, 1)",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Visby Round CF, Helvetica",
            fontWeight: 700,
            color: "rgba(98, 98, 96, 1)",
            marginLeft: 1,
          }}
        >
          Return
        </Typography>
      </IconButton>
    </Box>
  );
};

export default ForgotPassword;
