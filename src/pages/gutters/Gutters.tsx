import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { FaDumpster } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { apiController } from "../../axios";
import { DataTable } from "../../components/Table/DataTable";

interface DumpSite {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  fencing: string;
  spaceType: string;
  type: string;
  geolocation: {
    type: string;
    coordinates: [number, number, number];
  };
  condition: string;
  status: string;
  safetyRisk: string;
  evacuationSchedule: string;
  lastEvacuationDate: string;
  nextScheduledEvacuation: string;
  publicSpace: string;
  capturedAt: string;
}

const columnHelper = createColumnHelper<DumpSite>();

const columns = [
  columnHelper.accessor("picture", {
    header: "Picture",
    cell: (props) => (
      <Avatar
        src={props.getValue()}
        alt="Dump Site"
        sx={{
          borderRadius: "100%",
        }}
      />
    ),
  }),
  columnHelper.accessor("ward", {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("village", {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("hamlet", {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("spaceType", {
    header: "Categories",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("type", {
    header: "Tags",
    cell: (info) => {
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            variant="outlined"
            label={info.row.original.evacuationSchedule}
            color={
              info.row.original.evacuationSchedule === "None"
                ? "success"
                : "info"
            }
          />
          <Chip
            variant="outlined"
            label={info.row.original.fencing}
            color={info.row.original.fencing === "close" ? "warning" : "error"}
          />
        </Stack>
      );
    },
  }),
];

const FilterDropdown = ({ label, value, options, onChange }) => (
  <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 210 }}>
    <InputLabel>{label}</InputLabel>
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label={label}
      sx={{ height: 45 }}
    >
      <MenuItem value="">{`All ${label}`}</MenuItem>
      {options.map((option, index) => (
        <MenuItem key={index} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

const DumpSites = () => {
  // State for pagination and search (used for API fetching)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // Dummy filter UI states (now static; selections do not affect the displayed data)
  const [ward, setWard] = useState("All");
  const [village, setVillage] = useState("All");
  const [hamlet, setHamlet] = useState("All");

  const { data, isLoading } = useQuery<DumpSite[], Error>({
    queryKey: ["dump-sites", { limit, page, search }],
    queryFn: () =>
      apiController.get<DumpSite[]>(
        `/dump-sites?limit=${limit}&page=${page}&search=${search}`
      ),
  });

  // Instead of computing filter options from data, we use dummy static options
  const dummyOptions = ["All"];

  // Use the full dataset for display (no filtering is applied)
  const displayedData = data || [];

  // Dummy metric card values (can be replaced with real values when needed)
  const metricCards = [
    {
      title: "Total Dump Site",
      value: displayedData.length.toLocaleString(),
      icon: <FaDumpster style={{ fontSize: "1.8rem", color: "#00B4D8" }} />,
      bgColor: "#e3f2fd",
    },
    {
      title: "Maintained",
      value: "0",
      icon: <CheckCircleIcon sx={{ fontSize: "1.8rem", color: "#16A34A" }} />,
      bgColor: "#e8f5e9",
    },
    {
      title: "Unmaintained",
      value: "0",
      icon: <IoWarning style={{ fontSize: "1.8rem", color: "#EAB308" }} />,
      bgColor: "#ffebee",
    },
    {
      title: "Overfilled",
      value: "0",
      icon: <ErrorIcon sx={{ fontSize: "1.8rem", color: "#D32F2F" }} />,
      bgColor: "#fffde7",
    },
  ];

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f0f0f0", minHeight: "100vh", p: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexDirection: { xs: "column", sm: "row" },
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
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2}>
            {/* Filter UI stays for display purposes only */}
            <FilterDropdown label="Ward" value={ward} options={dummyOptions} onChange={setWard} />
            <FilterDropdown label="Village" value={village} options={dummyOptions} onChange={setVillage} />
            <FilterDropdown label="Hamlet" value={hamlet} options={dummyOptions} onChange={setHamlet} />
          </Stack>
        </Box>
      </Box>

      {/* Metric Cards UI (static dummy values) */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderRadius: 2,
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

      {/* Table Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Dump Site Overview
            </Typography>
          </Box>
          <DataTable
            setSearch={setSearch}
            setPage={setPage}
            setLimit={setLimit}
            isLoading={isLoading}
            columns={columns}
            data={displayedData}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default DumpSites;
