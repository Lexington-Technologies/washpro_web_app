import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';

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
  columnHelper.accessor('picture', {
    header: 'Picture',
    cell: props => (
      <Avatar
        src={props.getValue()}
        alt="Dump Site"
        sx={{
          borderRadius: '100%',
        }}
      />
    ),
  }),
  columnHelper.accessor('ward', {
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('village', {
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('hamlet', {
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('spaceType', {
    header: 'Categories',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'Tags',
    cell: info => (
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip
          variant="outlined"
          label={info.row.original.evacuationSchedule}
          color={info.row.original.evacuationSchedule === 'None' ? 'success' : 'info'}
        />
        <Chip
          variant="outlined"
          label={info.row.original.fencing}
          color={info.row.original.fencing === 'close' ? 'warning' : 'error'}
        />
      </Stack>
    ),
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
  // Pagination and search state remain for the DataTable fetching.
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  
  // Static filter UI values that do not affect the displayed data.
  const [ward, setWard] = useState("All");
  const [village, setVillage] = useState("All");
  const [hamlet, setHamlet] = useState("All");

  // Fetch the full list of dump sites.
  const { data, isLoading } = useQuery<DumpSite[], Error>({
    queryKey: ['dump-sites', { limit, page, search }],
    queryFn: () => apiController.get<DumpSite[]>(`/dump-sites?limit=${limit}&page=${page}&search=${search}`),
  });

  // Instead of filtering, we now simply use the complete data set.
  const displayedData = data || [];

  // Dummy filter options for UI display.
  const dummyOptions = ["All"];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: { xs: 2, sm: 3 } }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
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
            {/* Filter UI is left intact for display only */}
            <FilterDropdown label="Ward" value={ward} options={dummyOptions} onChange={setWard} />
            <FilterDropdown label="Village" value={village} options={dummyOptions} onChange={setVillage} />
            <FilterDropdown label="Hamlet" value={hamlet} options={dummyOptions} onChange={setHamlet} />
          </Stack>
        </Box>
      </Box>

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
