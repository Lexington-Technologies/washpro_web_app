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
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ExploreIcon from '@mui/icons-material/Explore';
import Map from '../../assets/map.svg';
import VisibilityIcon from "@mui/icons-material/Visibility";
import GetAppIcon from "@mui/icons-material/GetApp";

const Dashboard = () => {
  const reports = [
    {
      title: "Q4 Performance Analysis",
      description: "Comprehensive analysis of Q4 2024 performance metrics and KPIs.",
      status: "Completed",
      statusColor: "success" as const,
      time: "2 hours ago",
      author: "Usman Hussaini Galadima",
      icon: <GetAppIcon />,
    },
    {
      title: "Regional Market Analysis",
      description: "Detailed breakdown of market performance across different regions.",
      status: "In Progress",
      statusColor: "warning" as const,
      time: "1 day ago",
      author: "Muhammad Kabir",
      icon: <VisibilityIcon />,
    },
    {
      title: "Customer Satisfaction Survey",
      description: "Analysis of customer feedback and satisfaction metrics for Q1 2025.",
      status: "Draft",
      statusColor: "info" as const,
      time: "2 hours ago",
      author: "Basir Ibrahim",
      icon: <GetAppIcon />,
    },
  ];
  
  return (
    <Box sx={{ p: 3, bgcolor: "#E5E7EB" }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 , }}>
        <Typography variant="h5" color="#25306B" sx={{font: "9px"}}>
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
                <TrendingUpIcon color="success" />
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
      <Box sx={{ mt: 4, bgcolor: "#FFFFFF", p: 3,  borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 2,
          }}
        >
      <Typography variant="h6" color="#111827">
        Location Distribution
      </Typography>
      <Box>
        <Button variant="contained" sx={{ backgroundColor: '#2CBEEF' }}>
          <InsertDriveFileIcon sx={{ mr: 1 }} />
          View Report
        </Button>
        <Button variant="contained" color="success" sx={{ ml: 2 }}>
          <ExploreIcon sx={{ mr: 1 }} />
          Start Exploration
        </Button>
      </Box>
    </Box>

  <Box
    sx={{
      mt: 2,
      height: 200,
      backgroundImage: `url(${Map})`,
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
      <Box sx={{ mt: 3,  borderRadius: 2 }}>
      <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" color="#25306B">
            Recent Reports
          </Typography>
          <Button endIcon={<ArrowForwardIcon />}>View All</Button>
        </Box>
      
      <Grid container spacing={3}>
        {reports.map((report, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ boxShadow: 1, borderRadius: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Chip label={report.status} color={report.statusColor} size="small" />
                  <Typography variant="body2" color="textSecondary">
                    {report.time}
                  </Typography>
                </Box>
                
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {report.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {report.description}
                </Typography>
                
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 3,
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {report.author}
                  </Typography>
                  <IconButton size="small">{report.icon}</IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    </Box>
  );
};

export default Dashboard;
