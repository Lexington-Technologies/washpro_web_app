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
  } from "@mui/material";
  import FilterAltIcon from "@mui/icons-material/FilterAlt";
  import DownloadIcon from "@mui/icons-material/Download";
  import CheckCircleIcon from "@mui/icons-material/CheckCircle";
  import ErrorIcon from "@mui/icons-material/Error";
  
  const metricCards = [
    {
      title: "Total Units",
      value: "85",
      image: "/svg/well.svg",
      bgColor: "#e3f2fd",
    },
    {
      title: "Functional",
      value: "77",
      image: "/svg/hand.svg",
      bgColor: "#e8f5e9",
    },
    {
      title: "Under Repair",
      value: "7",
      image: "/svg/fix.svg",
      bgColor: "#fffde7",
    },
  ];
  
  const tableData = [
    { type: "Western Style", count: 50, status: "Operational" },
    { type: "Eastern Style", count: 30, status: "Maintenance" },
    { type: "Accessible", count: 20, status: "Operational" },
  ];
  
  const maintenanceStatus = [
    {
      label: "Well Maintained",
      value: "75%",
      color: "#e8f5e9",
      icon: <CheckCircleIcon sx={{ color: "#16A34A" }} />,
    },
    {
      label: "Needs Attention",
      value: "25%",
      color: "#ffebee",
      icon: <ErrorIcon sx={{ color: "#D32F2F" }} />,
    },
  ];

  const quickActions = [
    { label: "Report Issue", color: "#e3f2fd", image: "/svg/caution.svg" },
    { label: "Schedule Cleaning", color: "#f3e8ff", image: "/svg/calan.svg" },
    { label: "Maintenance Log", color: "#e8f5e9", image: "/svg/calac.svg" },
    { label: "View Analytics", color: "#fff7e6", image: "/svg/fix.svg" },
  ];
  
  
  const ToiletFacilities = () => {
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
              Toilet Facilities
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
                borderColor: "#ccc",
                color: "#666",
                "&:hover": {
                  borderColor: "#aaa",
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              Filter
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{
                bgcolor: "#2CBEEF",
                "&:hover": { bgcolor: "#1993b6" },
              }}
            >
              Export Report
            </Button>
          </Box>
        </Box>
  
        {/* Metric Cards */}
        <Grid container spacing={3} sx={{ marginBottom: 4 }}>
          {metricCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                    borderRadius: "12px",
                    bgcolor: card.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    style={{
                      width: "70%",
                      height: "auto",
                    }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
  
        {/* Table and Maintenance Status */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
                  Toilet Types Overview
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Count</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.type}</TableCell>
                          <TableCell>{row.count}</TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                padding: "4px 8px",
                                borderRadius: "12px",
                                backgroundColor:
                                  row.status === "Operational" ? "#e8f5e9" : "#fffde7",
                                color:
                                  row.status === "Operational" ? "#16A34A" : "#EAB308",
                                fontWeight: "bold",
                                fontSize: "12px",
                                display: "inline-block",
                              }}
                            >
                              {row.status}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
                  Maintenance Status
                </Typography>
                {maintenanceStatus.map((status, index) => (
                  <Box
                    key={index}
                    sx={{
                      padding: 2,
                      borderRadius: 2,
                      bgcolor: status.color,
                      marginBottom: index < maintenanceStatus.length - 1 ? 2 : 0,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {status.label}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "#25306B" }}>
                      {status.value}
                    </Typography>
                    {status.icon}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
  
        {/* Quick Actions */}
        <Card sx={{ marginTop: 4 }}>
  <CardContent>
    <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
      Quick Actions
    </Typography>
    <Grid container spacing={3}>
      {quickActions.map((action, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: 2,
              borderRadius: 2,
              bgcolor: action.color,
              textAlign: "center",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              "&:hover": {
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <img
              src={action.image}
              alt={action.label}
              style={{
                width: "24px",
                height: "24px",
                marginRight: "8px",
              }}
            />
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#25306B" }}
            >
              {action.label}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  </CardContent>
</Card>      </Box>
    );
  };
  
  export default ToiletFacilities;
  