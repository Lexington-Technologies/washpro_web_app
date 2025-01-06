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

const AccountSetUp = () => {
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
        <Grid container direction="column" spacing={3} alignItems="center">
          <Grid item>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", color: "greysg-6" }}
            >
              Account Set Up
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
              placeholder="enter password"
              type="password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
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
              placeholder="enter password again"
              type="password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
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
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1, color: "greysg-5" }}>
          Return
        </Typography>
      </Box>
    </Box>
  );
};

export default AccountSetUp;