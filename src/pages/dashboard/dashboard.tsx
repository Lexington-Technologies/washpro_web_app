import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Dashboard = () => {
  return (
    <Box sx={{ p: 3, bgcolor: "#f9fafb" }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" color="primary">
          Key Metrics Overview
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Search for reports, locations, or metrics..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 400, bgcolor: "white" }}
        />
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="textSecondary">
                  Performance Score
                </Typography>
                <CheckCircleIcon color="success" />
              </Box>
              <Typography variant="h4" sx={{ mt: 1 }}>
                98.5%
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                12% increase from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="textSecondary">
                  Active Issues
                </Typography>
                <WarningIcon color="error" />
              </Box>
              <Typography variant="h4" sx={{ mt: 1 }}>
                23
              </Typography>
              <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                5 new issues this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="textSecondary">
                  Success Rate
                </Typography>
                <CheckCircleIcon color="primary" />
              </Box>
              <Typography variant="h4" sx={{ mt: 1 }}>
                94.2%
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                3.2% improvement
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Location Distribution Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="textPrimary">
          Location Distribution
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Button variant="contained" color="primary">
            View Report
          </Button>
          <Button variant="contained" color="success">
            Start Exploration
          </Button>
        </Box>
        <Box
          sx={{
            mt: 2,
            height: 300,
            backgroundImage: "url('https://via.placeholder.com/1112x300')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              bgcolor: "white",
              p: 1,
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Sample Points
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Density Areas
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Recent Reports Section */}
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="primary">
            Recent Reports
          </Typography>
          <Button endIcon={<ArrowForwardIcon />}>View All</Button>
        </Box>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Chip label="Completed" color="success" size="small" />
                  <Typography variant="body2" color="textSecondary">
                    2 hours ago
                  </Typography>
                </Box>
                <Typography variant="h6" color="textPrimary" sx={{ mt: 2 }}>
                  Q4 Performance Analysis
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Comprehensive analysis of Q4 2024 performance metrics and KPIs.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Chip label="In Progress" color="warning" size="small" />
                  <Typography variant="body2" color="textSecondary">
                    1 day ago
                  </Typography>
                </Box>
                <Typography variant="h6" color="textPrimary" sx={{ mt: 2 }}>
                  Regional Market Analysis
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Detailed breakdown of market performance across different regions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Chip label="Draft" color="info" size="small" />
                  <Typography variant="body2" color="textSecondary">
                    2 hours ago
                  </Typography>
                </Box>
                <Typography variant="h6" color="textPrimary" sx={{ mt: 2 }}>
                  Customer Satisfaction Survey
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Analysis of customer feedback and satisfaction metrics for Q1 2025.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
