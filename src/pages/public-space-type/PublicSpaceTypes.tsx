import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Grid,
  LinearProgress,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ExploreIcon from "@mui/icons-material/Explore";
import Map from "/map.svg";

const PublicSpaceTypes = () => {
  const spaceTypes = ["Schools", "Parks", "Markets", "Community Centers"];
  const districts = ["District 1", "District 2", "District 3"];
  const statuses = ["Active", "Inactive", "Under Development"];
  const statistics: {
    label: string;
    value: number;
    color: "primary" | "success" | "warning" | "secondary";
  }[] = [
    { label: "Schools", value: 245, color: "primary" },
    { label: "Parks", value: 180, color: "success" },
    { label: "Markets", value: 120, color: "warning" },
    { label: "Community Centers", value: 95, color: "secondary" },
  ];

  return (
    <Box
      sx={{
        padding: 2,
        bgcolor: "#f8f9fc",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          marginBottom: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#444" }}>
            Public Space Types
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Detailed insights about your selected location
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            startIcon={<FilterAltIcon />}
            sx={{
              textTransform: "none",
              borderColor: "#ccc",
              color: "#666",
              "&:hover": { borderColor: "#aaa", backgroundColor: "#f0f0f0" },
              height: "48px",
            }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            sx={{
              textTransform: "none",
              bgcolor: "#00bcd4",
              "&:hover": { bgcolor: "#0097a7" },
              height: "48px",
            }}
          >
            + Add Space
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Grid
        container
        spacing={0.2}
        sx={{
          padding: 3,
          borderRadius: 2,
          bgcolor: "#ffffff",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          marginBottom: 4,
          ml: 0.2,
        }}
      >
        <Grid item xs={12} md={4}>
          <TextField
            select
            label="Space Type"
            fullWidth
            size="small"
            sx={{
              bgcolor: "#f6f7f9",
              height: "48px", // Ensures consistent height
            }}
          >
            {spaceTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            label="District"
            fullWidth
            size="small"
            sx={{
              bgcolor: "#f6f7f9",
              height: "48px", // Ensures consistent height
            }}
          >
            {districts.map((district) => (
              <MenuItem key={district} value={district}>
                {district}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            label="Status"
            fullWidth
            size="small"
            sx={{
              bgcolor: "#f6f7f9",
              height: "48px", // Ensures consistent height
            }}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Statistics Section */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              padding: 2,
              bgcolor: "#ffffff",
            }}
          >
            <CardContent>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", color: "#333", marginBottom: 2 }}
              >
                Distribution Statistics
              </Typography>
              {statistics.map((stat, index) => (
                <Box
                  key={index}
                  sx={{
                    marginBottom: index < statistics.length - 1 ? 3 : 0,
                    padding: 1.5,
                    borderRadius: 2,
                    bgcolor: "none",
                    borderStyle: "solid",
                    borderColor: "#E5E7EB",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "#666" }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: stat.color }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(stat.value / 300) * 100}
                    color={stat.color}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: "#e0e0e0",
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Location Distribution Section */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              height: "100%", // Ensure consistent height
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Location Distribution
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#2CBEEF", textTransform: "none" }}
                  >
                    <InsertDriveFileIcon sx={{ mr: 1 }} />
                    View Report
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ textTransform: "none", bgcolor: "#16A34A" }}
                  >
                    <ExploreIcon sx={{ mr: 1 }} />
                    Start Exploration
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  height: { xs: 200, md: 300 },
                  backgroundImage: `url(${Map})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 2,
                  position: "relative",
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PublicSpaceTypes;
