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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";

const metricCards = [
  { title: "Total Site", value: "24", icon: "/svg/pie.svg", bgColor: "#e3f2fd" },
  { title: "Maintained", value: "14", icon: <CheckCircleIcon sx={{ fontSize: 15, color: "#16A34A" }} />, bgColor: "#e8f5e9" },
  { title: "Overfilled", value: "3", icon: <ErrorIcon sx={{ fontSize: 15, color: "#D32F2F" }} />, bgColor: "#ffebee" },
  { title: "Unmaintained", value: "7", icon: <WarningAmberIcon sx={{ fontSize: 15, color: "#EAB308" }} />, bgColor: "#fffde7" },
];

const tableData = [
  { site: "North Valley Site", location: "North District", status: "Maintained", capacity: 75, lastUpdate: "2 hours ago" },
  { site: "East End Facility", location: "East Zone", status: "Overfilled", capacity: 95, lastUpdate: "1 day ago" },
  { site: "North Valley Site", location: "North District", status: "Maintained", capacity: 60, lastUpdate: "2 hours ago" },
  { site: "East End Facility", location: "East Zone", status: "Overfilled", capacity: 100, lastUpdate: "1 day ago" },
];

const notificationCards = [
  {
    title: "Critical Sites",
    count: "3 sites",
    countColor: "#D32F2F", 
    items: [
      {
        label: "East End Facility",
        description: "Immediate attention required",
        leftIcon: <img src="/svg/caution2.svg" alt="Critical" style={{ width: 20, height: 20 }} />,
        rightIcon: <img src="/svg/arrowr.svg" alt="Forward" style={{ width: 20, height: 20 }} />,
        bgcolor: "#ffebee",
      },
    ],
  },
  {
    title: "Maintenance Schedule",
    count: "Next 7 days",
    countColor: "#1E88E5",
    items: [
      {
        label: "South Gate Site",
        description: "Scheduled for tomorrow",
        leftIcon: <img src="/svg/clock.svg" alt="Calendar" style={{ width: 20, height: 20 }} />,
        rightIcon: <img src="/svg/calanda.svg" alt="Calendar" style={{ width: 20, height: 20 }} />,
        bgcolor: "#e3f2fd",
      },
    ],
  },
  {
    title: "Recent Reports",
    count: "Last 24h",
    countColor: "#666",
    items: [
      {
        label: "Capacity Report",
        description: "Generated at 09:00 AM",
        leftIcon: <img src="/svg/doc.svg" alt="Report" style={{ width: 20, height: 20 }} />,
        rightIcon: <img src="/svg/dload.svg" alt="Download" style={{ width: 20, height: 20 }} />,
        bgcolor: "#f5f5f5",
      },
    ],
  },
];

const DumpSites = () => {
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
            Dump Sites
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Detailed insights about your selected location
          </Typography>
        </Box>
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
                {typeof card.icon === "string" ? (
                  <img
                    src={card.icon}
                    alt={card.title}
                    style={{
                      width: "30%",
                      height: "auto",
                    }}
                  />
                ) : (
                  card.icon
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Table Section */}
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
              Dump Site Overview
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
                  <TableCell>Site Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Last Update</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.site}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          display: "inline-block",
                          backgroundColor:
                            row.status === "Maintained" ? "#e8f5e9" : "#ffebee",
                          color:
                            row.status === "Maintained" ? "#16A34A" : "#D32F2F",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {row.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <LinearProgress
                        variant="determinate"
                        value={row.capacity}
                        sx={{
                          height: 8,
                          borderRadius: "4px",
                          backgroundColor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor:
                              row.capacity >= 80 ? "#D32F2F" : "#16A34A",
                          },
                        }}
                      />
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
          <Typography variant="body2" sx={{ color: "#25306B" }}>
            Showing 1 to 2 of 1,234 entries
          </Typography>
          <Pagination
            count={3}
            variant="outlined"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#25306B", // Default color
              },
              "& .Mui-selected": {
                backgroundColor: "#2563EB", // Active page background color
                color: "#ffffff", // Active page text color
                "&:hover": {
                  backgroundColor: "#1D4ED8", // Darker shade on hover
                },
              },
            }}
          />
        </Box>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        {notificationCards.map((card, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ borderRadius: 2, boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
              <CardContent>
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "#25306B" }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: card.countColor }}
                  >
                    {card.count}
                  </Typography>
                </Box>

                {/* Items */}
                {card.items.map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 2,
                      borderRadius: 2,
                      backgroundColor: item.bgcolor,
                      marginBottom: 1,
                    }}
                  >
                    {/* Left Icon and Content */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {item.leftIcon}
                      <Box sx={{ marginLeft: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#25306B" }}
                        >
                          {item.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Right Icon */}
                    {item.rightIcon}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DumpSites;