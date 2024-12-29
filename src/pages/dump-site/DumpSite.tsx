import React from "react";
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
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DownloadIcon from "@mui/icons-material/Download";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const metricCards = [
  { title: "Total Site", value: "24", icon: "/images/site.svg", bgColor: "#e3f2fd" },
  { title: "Maintained", value: "14", icon: <CheckCircleIcon sx={{ color: "#16A34A" }} />, bgColor: "#e8f5e9" },
  { title: "Overfilled", value: "3", icon: <ErrorIcon sx={{ color: "#D32F2F" }} />, bgColor: "#ffebee" },
  { title: "Unmaintained", value: "7", icon: <WarningAmberIcon sx={{ color: "#EAB308" }} />, bgColor: "#fffde7" },
];

const tableData = [
  { site: "North Valley Site", location: "North District", status: "Maintained", capacity: 75, lastUpdate: "2 hours ago" },
  { site: "East End Facility", location: "East Zone", status: "Overfilled", capacity: 95, lastUpdate: "1 day ago" },
  { site: "North Valley Site", location: "North District", status: "Maintained", capacity: 60, lastUpdate: "2 hours ago" },
  { site: "East End Facility", location: "East Zone", status: "Overfilled", capacity: 100, lastUpdate: "1 day ago" },
];

const notifications = [
  {
    title: "Critical Sites",
    count: "3 sites",
    items: [
      { site: "East End Facility", description: "Immediate attention required", icon: <ErrorIcon sx={{ color: "#D32F2F" }} /> },
    ],
  },
  {
    title: "Maintenance Schedule",
    count: "Next 7 days",
    items: [
      { site: "South Gate Site", description: "Scheduled for tomorrow", icon: <WarningAmberIcon sx={{ color: "#EAB308" }} /> },
    ],
  },
  {
    title: "Recent Reports",
    count: "Last 24h",
    items: [
      { site: "Capacity Report", description: "Generated at 09:00 AM", icon: <DownloadIcon sx={{ color: "#2563EB" }} /> },
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
          <Button variant="outlined" startIcon={<FilterAltIcon />}>
            Filter
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "#2563EB",
              "&:hover": { bgcolor: "#1E40AF" },
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
                  borderRadius: "12px",
                  bgcolor: card.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {typeof card.icon === "string" ? (
                  <img
                    src={card.icon}
                    alt={card.title}
                    style={{ width: "70%", height: "auto" }}
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
              <Button variant="outlined" startIcon={<FilterAltIcon />}>
                Filter
              </Button>
              <Button variant="outlined" startIcon={<DownloadIcon />}>
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
            <Typography variant="body2" sx={{ color: "#666" }}>
              Showing 1 to 2 of 1,234 entries
            </Typography>
            <Pagination count={3} variant="outlined" shape="rounded" />
          </Box>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Grid container spacing={3}>
        {notifications.map((notification, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="body2" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                  {notification.title} <span style={{ float: "right" }}>{notification.count}</span>
                </Typography>
                {notification.items.map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 1,
                      padding: 1,
                      borderRadius: 2,
                      bgcolor: "#f8f9fc",
                    }}
                  >
                    {item.icon}
                    <Box sx={{ marginLeft: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {item.site}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {item.description}
                      </Typography>
                    </Box>
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
