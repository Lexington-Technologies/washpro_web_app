import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Pagination,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";

const data = [
  { name: "Hand Pump Boreholes", Count: 65.72, Percentage: 25.52 },
  { name: "Motorized Boreholes", Count: 102.28, Percentage: 81.84 },
  { name: "Wells (Covered & Open)", Count: 53.04, Percentage: 49.23 },
  { name: "Surface Water Points", Count: 38.81, Percentage: 29.38 },
  { name: "Other Sources", Count: 25, Percentage: 18.25 },
];

const metricCards = [
  {
    title: "Total Sources",
    value: "1,234",
    image: "/svg/tap.svg",
    bgColor: "#e3f2fd",
  },
  {
    title: "Functional",
    value: "987",
    image: "/svg/check.svg",
    bgColor: "#e8f5e9",
  },
  {
    title: "Non-Functional",
    value: "247",
    image: "/svg/cross.svg",
    bgColor: "#ffebee",
  },
  {
    title: "Maintenance Due",
    value: "89",
    image: "/svg/fix.svg",
    bgColor: "#fffde7",
  },
];

const alerts = [
  {
    title: "Critical: Pump Failure",
    description: "Borehole #247 requires immediate attention",
    icon: <ErrorOutlineIcon sx={{ color: "#EF4444" }} />,
    bgcolor: "#ffe5e5",
  },
  {
    title: "Maintenance Due",
    description: "5 sources require scheduled maintenance",
    icon: <WarningAmberIcon sx={{ color: "#EAB308" }} />,
    bgcolor: "#fffde7",
  },
  {
    title: "Water Quality Check",
    description: "Quality test pending for Well #128",
    icon: <InfoOutlinedIcon sx={{ color: "#3B82F6" }} />,
    bgcolor: "#e3f2fd",
  },
];

const rows = [
  {
    id: "#WS-001",
    type: "Hand Pump",
    location: "North District",
    status: "Functional",
    lastUpdated: "2025-03-15",
  },
  {
    id: "#WS-002",
    type: "Borehole",
    location: "East Region",
    status: "Non-Functional",
    lastUpdated: "2025-03-14",
  },
];

const WaterSourceInfo = () => {
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
            Water Source Information
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Detailed insights about your selected location
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterAltIcon sx={{ color: "#2CBEEF" }} />}
            sx={{ textTransform: "none", height: 48, color: "#E5E7EB" }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              bgcolor: "#2CBEEF",
              height: 48,
              "&:hover": { bgcolor: "#1993b6" },
            }}
          >
            + Add Space
          </Button>
        </Box>
      </Box>

      {/* Metrics Section */}
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
                height: "100%",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#666" }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
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

      {/* Chart Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#25306B" }}>
                  Water Source Distribution
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button variant="outlined" startIcon={<DownloadIcon />}>
                    Export
                  </Button>
                  <Button variant="outlined" startIcon={<FilterAltIcon />}>
                    Filter
                  </Button>
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} barGap={8}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Count" fill="#EA580C" name="Count">
                    <LabelList dataKey="Count" position="top" />
                  </Bar>
                  <Bar dataKey="Percentage" fill="#2CBEEF" name="Percentage">
                    <LabelList dataKey="Percentage" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts Section */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              {alerts.map((alert, index) => (
                <Box
                  key={index}
                  sx={{
                    marginBottom: 2,
                    bgcolor: alert.bgcolor,
                    padding: 2,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {alert.icon}
                  <Box sx={{ marginLeft: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold", color: alert.icon.props.sx.color }}>
                      {alert.title}
                    </Typography>
                    <Typography variant="body2">{alert.description}</Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

{/* Table Section */}
<Box sx={{ marginTop: 4 }}>
  <Card>
    <CardContent>
      {/* Header with Title, Search Field, and Filter Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
          flexWrap: "wrap", // Ensures responsiveness
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            marginBottom: { xs: 1, md: 0 },
          }}
        >
          Water Sources Overview
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            placeholder="Search sources..."
            sx={{ flexGrow: 1 }} // Makes the search bar expand
          />
          <Button
            variant="outlined"
            startIcon={<FilterAltIcon />}
            sx={{
              textTransform: "none",
              whiteSpace: "nowrap", // Prevents text from wrapping
            }}
          >
            Filter
          </Button>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Source ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      display: "inline-block",
                      backgroundColor:
                        row.status === "Functional"
                          ? "#e8f5e9"
                          : "#ffebee",
                      color:
                        row.status === "Functional"
                          ? "#2e7d32"
                          : "#d32f2f",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    {row.status}
                  </Typography>
                </TableCell>
                <TableCell>{row.lastUpdated}</TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
{/* Pagination Section */}
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
  <Pagination
    count={3}
    variant="outlined"
    shape="rounded"
    sx={{
      "& .Mui-selected": {
        backgroundColor: "#2563EB",
        color: "#ffffff", // Ensure the text is readable
        fontWeight: "bold",
      },
    }}
  />
</Box>
    </CardContent>
  </Card>
</Box>
    </Box>
  );
};

export default WaterSourceInfo;
