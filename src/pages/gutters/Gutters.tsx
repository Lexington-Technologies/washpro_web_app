import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    LinearProgress,
    IconButton,
    Pagination,
    ToggleButton,
    ToggleButtonGroup,
  } from "@mui/material";
  import FilterAltIcon from "@mui/icons-material/FilterAlt";
  import AddIcon from "@mui/icons-material/Add";
  import MoreVertIcon from "@mui/icons-material/MoreVert";
  
  const metricCards = [
    { 
      title: "Total Site", 
      value: "24", 
      icon: <img src="/svg/pie.svg" alt="Total Site" style={{ width: 20, height: 20 }} />, 
      bgColor: "#e3f2fd" 
    },
    { 
      title: "Maintained", 
      value: "14", 
      icon: <img src="/svg/check2.svg" alt="Maintained" style={{ width: 20, height: 20 }} />, 
      bgColor: "#e8f5e9" 
    },
    { 
      title: "Overfilled", 
      value: "3", 
      icon: <img src="/svg/caution4.svg" alt="Overfilled" style={{ width: 20, height: 20 }} />, 
      bgColor: "#ffebee" 
    },
    { 
      title: "Unmaintained", 
      value: "7", 
      icon: <img src="/svg/caution3.svg" alt="Unmaintained" style={{ width: 20, height: 20 }} />, 
      bgColor: "#fffde7" 
    },
  ];
    
  const gutterTypeData = [
    { label: "Constructed", value: 245, color: "#2CBEEF" },
    { label: "Surface", value: 180, color: "#16A34A" },
    { label: "Dug", value: 120, color: "#EAB308" },
  ];
  
  const tableData = [
    { site: "North Valley Site", location: "North District", type: "Constructed", status: "Maintained", lastUpdate: "2 hours ago" },
    { site: "East End Facility", location: "East Zone", type: "Surface", status: "Needs Attention", lastUpdate: "1 day ago" },
  ];
  
  const Gutters = () => {
    return (
      <Box sx={{ padding: 4, bgcolor: "#f8f9fc" }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#25306B" }}>
              Gutters
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Detailed insights about your selected location
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterAltIcon sx={{ color: "#1F2937" }} />}
              sx={{
                textTransform: "none",
                height: 48,
                color: "#1F2937",
                borderColor: "#ccc",
                "&:hover": { borderColor: "#aaa", backgroundColor: "#f0f0f0" },
              }}
            >
              Filter
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                bgcolor: "#2CBEEF",
                height: 48,
                "&:hover": { bgcolor: "#1993b6" },
              }}
            >
              Add New Site
            </Button>
          </Box>
        </Box>
  
        {/* Metric Cards */}
        <Grid container spacing={3} sx={{ marginBottom: 4 }}>
          {metricCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  bgcolor: "#fff",
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#25306B" }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: card.bgColor,
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  {card.icon}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
  
        {/* Main Content */}
        <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              padding: 1,
              bgcolor: "#ffffff",
            }}
          >
            <CardContent>
            <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Typography variant="h6">Gutter <br /> Type Distribution</Typography>
                <ToggleButtonGroup exclusive>
                  <ToggleButton value="monthly">Monthly</ToggleButton>
                  <ToggleButton value="yearly">Yearly</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              {gutterTypeData.map((stat, index) => (
                <Box
                  key={index}
                  sx={{
                    marginBottom: index < gutterTypeData.length - 1 ? 2 : 0,
                    padding: 1,
                    borderRadius: 1,
                    bgcolor: "#f8f9fc",
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
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: stat.color,
                      },
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
              height: "100%",
            }}
          >
            <CardContent>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", marginBottom: 2 }}
              >
                Location Distribution
              </Typography>
              <Box
                sx={{
                    height: { xs: 200, md: 300 },
                    borderRadius: 2,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                >
                <img
                    src="/map.svg"
                    alt="Map"
                    style={{
                    width: "w-full",
                    height: "h-full"
                    }}
                />
                </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
  
        {/* Maintenance Status */}
        <Card sx={{ marginBottom: 4 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Maintenance Status
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
          <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                height: 48,
                color: "#1F2937",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="/svg/filter.svg"
                alt="Export"
                style={{ width: 20, height: 20, marginRight: 8 }}
              />
              Filter
            </Button>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                height: 48,
                color: "#1F2937",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="/svg/dload.svg"
                alt="Export"
                style={{ width: 20, height: 20, marginRight: 8 }}
              />
              Export
            </Button>
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>IC</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Maintenance</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.site}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor:
                          row.status === "Maintained"
                            ? "#e8f5e9"
                            : "#fffde7",
                        color:
                          row.status === "Maintained"
                            ? "#16A34A"
                            : "#EAB308",
                      }}
                    >
                      {row.status}
                    </Box>
                  </TableCell>
                  <TableCell>{row.lastUpdate}</TableCell>
                  <TableCell>
                    <IconButton>
                    <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "#666" }}>
            Showing 1 to 2 of 1,234 entries
          </Typography>
          <Pagination count={3} variant="outlined" shape="rounded" />
        </Box>
      </CardContent>
    </Card>
</Box>
    );
  };
  
  export default Gutters;
  