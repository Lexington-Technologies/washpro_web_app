import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    IconButton,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
  } from "@mui/material";
  import LocationOnIcon from "@mui/icons-material/LocationOn";
  import BusinessIcon from "@mui/icons-material/Business";
  import PeopleIcon from "@mui/icons-material/People";
  import AccessTimeIcon from "@mui/icons-material/AccessTime";
  import TrendingUpIcon from "@mui/icons-material/TrendingUp";
  import TrendingDownIcon from "@mui/icons-material/TrendingDown";
  import Map from "/map.svg";
  import GetAppIcon from "@mui/icons-material/GetApp";
  import { MoreHoriz, InsertDriveFile as InsertDriveFileIcon, Explore as ExploreIcon, PersonAdd as PersonAddIcon } from "@mui/icons-material";
  
  const LocationInfo = () => {
    return (
      <Box sx={{ p: 3, bgcolor: "#f8f9fc" }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="#25306B">
                Location Information
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Detailed insights about your selected location
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2" color="textSecondary" sx={{ mr: 2 }}>
                Compare with previous period
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#17c1e8",
                  textTransform: "none",
                  boxShadow: "none",
                }}
                startIcon={<GetAppIcon />}
              >
                Export
              </Button>
            </Box>
          </Box>
        </Box>
  
        {/* Performance Metrics Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontSize={20} color="#1F2937" sx={{ mb: 2 }}>
            Performance Metrics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    Funding
                  </Typography>
                  <Typography fontWeight="bold" variant="h5" sx={{ mt: 2 }}>
                    ₦1.2M
                  </Typography>
                  <Typography
                    variant="body2"
                    color="success.main"
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    <TrendingUpIcon fontSize="small" sx={{ mr: 1 }} />
                    12.5% increase
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    Expenses
                  </Typography>
                  <Typography fontWeight="bold" variant="h5" sx={{ mt: 2 }}>
                    ₦436K
                  </Typography>
                  <Typography
                    variant="body2"
                    color="error.main"
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    <TrendingDownIcon fontSize="small" sx={{ mr: 1 }} />
                    3.2% decrease
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    Utilization
                  </Typography>
                  <Typography fontWeight="bold" variant="h5" sx={{ mt: 2 }}>
                    46%
                  </Typography>
                  <Typography
                    variant="body2"
                    color="success.main"
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    <TrendingUpIcon fontSize="small" sx={{ mr: 1 }} />
                    5.3% increase
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
  
        {/* Location Overview Section */}
        <Box sx={{ mb: 4}}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} > 
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 7.5,
                    }}
                  >
                    <Typography variant="body1">Location Overview</Typography>
                    <IconButton>
                      <MoreHoriz />
                    </IconButton>
                  </Box>
  
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <BusinessIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      Kudan Local Government Secretariat
                    </Typography>
                  </Box>
  
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      Town, Kudan LGA Area, Kaduna State.
                    </Typography>
                  </Box>
  
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <PeopleIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      150+ employees
                    </Typography>
                  </Box>
  
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      West Africa Time (WAT), UTC +1
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
  
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="body1">Location Distribution</Typography>
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
                      height: { xs: 150, md: 200 },
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
  
        {/* Recent Activity Section */}
        <Box sx={{ mb: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: "hidden" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Recent Activity</Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: "pointer" }}
                >
                  View All
                </Typography>
              </Box>
              <List>
                <ListItem
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.light" }}>
                      <PersonAddIcon sx={{ color: "#DBE1FF", fontSize: 30 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="New Employee Onboarding"
                      secondary="5 new employees joined the office"
                      primaryTypographyProps={{ variant: "body1" }}
                      secondaryTypographyProps={{
                        variant: "body2",
                        color: "textSecondary",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    2 hours ago
                  </Typography>
                </ListItem>
  
                <ListItem
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#16A34A" }}>
                      <TrendingUpIcon sx={{ color: "success" }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Performance Review"
                      secondary="Monthly performance metrics updated"
                      primaryTypographyProps={{ variant: "body1" }}
                      secondaryTypographyProps={{
                        variant: "body2",
                        color: "textSecondary",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    1 day ago
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  };
  
  export default LocationInfo;
  