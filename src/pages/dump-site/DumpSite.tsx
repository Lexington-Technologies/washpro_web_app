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
  InputLabel,
  Grid,
  Stack,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { FaDumpster } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';

interface DumpSite {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
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

const notificationCards = [
  {
    title: "Critical Sites",
    count: "3 sites",
    countColor: "#D32F2F",
    items: [
      {
        label: "East End Facility",
        description: "Immediate attention required",
        leftIcon: <img src="/img/svg/caution2.svg" alt="Critical" style={{ width: 20, height: 20 }} />,
        rightIcon: <img src="/img/svg/arrowr.svg" alt="Forward" style={{ width: 20, height: 20 }} />,
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
        leftIcon: <img src="/img/svg/clock.svg" alt="Calendar" style={{ width: 20, height: 20 }} />,
        rightIcon: <img src="/img/svg/calanda.svg" alt="Calendar" style={{ width: 20, height: 20 }} />,
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
        leftIcon: <img src="/img/svg/doc.svg" alt="Report" style={{ width: 20, height: 20 }} />,
        rightIcon: <img src="/img/svg/dload.svg" alt="Download" style={{ width: 20, height: 20 }} />,
        bgcolor: "#F1F1F5",
      },
    ],
  },
];

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
  columnHelper.accessor('publicSpace', {
    header: 'Categories',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'Tags',
    cell: info => {
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            variant='outlined'
            label={info.row.original.evacuationSchedule}
            color={info.row.original.evacuationSchedule === 'Periodic' ? 'success' : 'error'}
          />
          <Chip
            variant='outlined'
            label={info.row.original.status}
            color={info.row.original.status === 'Improved' ? 'success' : 'warning'}
          />
          <Chip
            variant='outlined'
            label={info.row.original.condition}
            color={info.row.original.condition === 'Maintained' ? 'success' : 'error'}
          />
          <Chip
            variant='outlined'
            label={info.row.original.safetyRisk}
            color={info.row.original.safetyRisk === 'Closed' ? 'success' : 'error'}
          />
        </Stack>
      )
    },
  }),
];

const FilterDropdown = ({ label, value, options, onChange }) => (
  <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 210 }}>
    <InputLabel>{label}</InputLabel>
    <Select value={value} onChange={(e) => onChange(e.target.value)} label={label} sx={{ height: 45 }}>
      <MenuItem value="">All {label}</MenuItem>
      {options.map((option, index) => (
        <MenuItem key={index} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

const DumpSites = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');

  const { data, isLoading } = useQuery<DumpSite[], Error>({
    queryKey: ['dump-sites', { limit, page, search }],
    queryFn: () => apiController.get<DumpSite[]>(`/dump-sites?limit=${limit}&page=${page}&search=${search}`),
  });

  // Generate filter options
  const wardOptions = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map(item => item.ward))];
  }, [data]);

  const villageOptions = useMemo(() => {
    if (!data) return [];
    const filteredVillages = data
      .filter(item => !ward || item.ward === ward)
      .map(item => item.village);
    return [...new Set(filteredVillages)];
  }, [data, ward]);

  const hamletOptions = useMemo(() => {
    if (!data) return [];
    const filteredHamlets = data
      .filter(item => (!ward || item.ward === ward) && (!village || item.village === village))
      .map(item => item.hamlet);
    return [...new Set(filteredHamlets)];
  }, [data, ward, village]);

  // Filtered data
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(item =>
      (!ward || item.ward === ward) &&
      (!village || item.village === village) &&
      (!hamlet || item.hamlet === hamlet) &&
      (!search || 
        item.ward.toLowerCase().includes(search.toLowerCase()) ||
        item.village.toLowerCase().includes(search.toLowerCase()) ||
        item.hamlet.toLowerCase().includes(search.toLowerCase()) ||
        item.publicSpace.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, ward, village, hamlet, search]);

  const countByProperty = <T extends object>(
    data: T[] | undefined,
    property: keyof T,
    value: T[keyof T]
  ): number => {
    return data?.filter(item => item[property] !== undefined && item[property] === value).length.toLocaleString() || 0;
  };

  const metricCards = [
    {
      title: "Total Dump Site",
      value: filteredData.length.toLocaleString(),
      icon: <FaDumpster style={{ fontSize: '1.8rem', color: '#00B4D8' }}/>,
      bgColor: "#e3f2fd"
    },
    {
      title: "Maintained",
      value: countByProperty(filteredData, 'condition', 'Maintained'),
      icon: <CheckCircleIcon sx={{ fontSize: '1.8rem', color: "#16A34A" }} />,
      bgColor: "#e8f5e9"
    },
    {
      title: "Unmaintained", value: countByProperty(filteredData, 'condition', 'Unmaintained'),
      icon: <IoWarning style={{ fontSize: '1.8rem', color: "#EAB308" }} />, bgColor: "#ffebee"
    },
    {
      title: "Overfilled", value: countByProperty(filteredData, 'condition', 'Overfilled'),
      icon: <ErrorIcon sx={{ fontSize: '1.8rem', color: "#D32F2F" }} />, bgColor: "#fffde7"
    },
  ];

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
            <FilterDropdown label="Ward" value={ward} options={wardOptions} onChange={setWard} />
            <FilterDropdown label="Village" value={village} options={villageOptions} onChange={setVillage} />
            <FilterDropdown label="Hamlet" value={hamlet} options={hamletOptions} onChange={setHamlet} />
          </Stack>
        </Box>
      </Box>

      {/* Metric Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ marginBottom: 4 }}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
                borderRadius: 2,
                boxShadow: 2,
                bgcolor: "#fff",
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  {card.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#25306B" }}>
                  {card.value || 0}
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
          <DataTable setSearch={setSearch} setPage={setPage} setLimit={setLimit} isLoading={isLoading} columns={columns} data={filteredData || []} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default DumpSites;