import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Tab,
  Tabs,
  styled,
  Card,
  TextField,
  Avatar,
} from '@mui/material';
import {
  Search,
} from '@mui/icons-material';
import { FaCheck, FaFaucet, FaFilter, FaTimes, FaWater } from 'react-icons/fa';
import { FaWrench } from 'react-icons/fa6';
import { GiWell } from 'react-icons/gi';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { RiWaterFlashFill } from 'react-icons/ri';

// Interfaces
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
}

interface MetricProps {
  value: number;
  label: string;
  color: string;
}



interface WaterSource {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  geolocation: {
    type: string;
    coordinates: number[];
  };
  quality: string;
  status: string;
  type: string;
  createdBy: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
  publicSpace: string;
  dependent: number;
  space: string;
  qualityTest: {
    clearness: number;
    odor: number;
    ph: number;
    salinity: number;
    conductivity: number;
    capturedAt: string;
    createdBy: string;
    updatedAt: string;
    _id: string;
  }[];
}


// StyledComponents
const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.spacing(1)};
  height: 100%;
  box-shadow: 10;
`;

const StyledMetricCircle = styled(Box)<{ bgcolor: string }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ bgcolor }) => bgcolor};
  margin: 0 auto;
  box-shadow: 10;
`;

// Components
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor }) => (
  <StyledPaper>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
        <Typography variant="h4" sx={{ mt: 1, fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          bgcolor: bgColor,
          p: 1,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
    </Box>
  </StyledPaper>
);

const MetricItem: React.FC<MetricProps> = ({ value, label, color }) => (
  <Box sx={{ textAlign: 'center', px: 2 }}>
    <StyledMetricCircle bgcolor={color}>
      <Typography variant="h5" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </StyledMetricCircle>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
      {label}
    </Typography>
  </Box>
);

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => (
  <div hidden={value !== index}>
    {value === index && (
      <Box sx={{ pt: 3 }}>
        {children}
      </Box>
    )}
  </div>
);



const metrics = [
  { value: 8.5, label: 'Clarity', color: '#DBEAFE' },
  { value: 9.0, label: 'Taste', color: '#DCFCE7' },
  { value: 7.5, label: 'Odor', color: '#FEF9C3' },
  { value: 8.0, label: 'Turbidity', color: '#F3E8FF' },
  { value: 8.8, label: 'Conductivity', color: '#E0E7FF' },
];



// Define your row shape


const columnHelper = createColumnHelper<WaterSource>()

// Make some columns!
const columns = [
  columnHelper.accessor((_, index) => index + 1, {
    id: 'index',
    header: 'S/N',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('picture', {
    header: 'Picture',
    cell: props => (
      <Avatar
        src={props.row.original.picture}
        alt="water source"
        sx={{ width: 50, height: 50 }}
      />
    ),
  }),
  columnHelper.accessor('ward', {
    header: 'Ward',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('village', {
    header: 'Village',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('hamlet', {
    header: 'Hamlet',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: info => info.getValue(),
  }),
  // columnHelper.accessor('actions', {
  //   id: 'actions',
  //   cell: props => <Button>{props.row.original._id}</Button>
  // }),
]
// Main Component
const WaterSourcesDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [analytics, setAnalytics] = useState({
    totalSources: 0,
    functional: 0,
    nonFunctional: 0,
    maintenanceDue: 0,
    wells: 0,
    streams: 0,
    handpumpBoreholes: 0,
    motorizedBoreholes: 0,
    nonMotorizedBoreholes: 0,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery<WaterSource[], Error>({
    queryKey: ['water-sources', { limit, page, search }],
    queryFn: () => apiController.get<WaterSource[]>(`/water-sources?limit=${limit}&page=${page}&search=${search}`),
  });

  useEffect(() => {
    if (data) {
      const totalSources = data.length;
      const functional = data.filter(source => source.status === 'Functional').length;
      const nonFunctional = data.filter(source => source.status === 'Non Functional').length;
      const maintenanceDue = data.filter(source => source.status === 'Maintenance Due').length;
      const wells = data.filter(source => source.type === 'protected Dug Wells' || source.type === 'Unprotected Dug Wells').length;
      const streams = data.filter(source => source.type === 'Stream').length;
      const handpumpBoreholes = data.filter(source => source.type === 'Hand Pump Boreholes').length;
      const motorizedBoreholes = data.filter(source => source.type === 'Motorized Boreholes').length;
      const nonMotorizedBoreholes = data.filter(source => source.type === 'Non Motorized Boreholes').length;

      console.log("watersource", {data});

      setAnalytics({
        totalSources,
        functional,
        nonFunctional,
        maintenanceDue,
        wells,
        streams,
        handpumpBoreholes,
        motorizedBoreholes,
        nonMotorizedBoreholes,
      });
    }
  }, [data]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
            Water Sources
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed insights about your selected location
          </Typography>
        </Box>
        <Box>
          <Button startIcon={<FaFilter style={{ color: "#000000" }} />} variant="outlined" sx={{ mr: 1, borderColor: '#000000' }}>
            <Typography variant="body1" color="#000000">Filter</Typography>
          </Button>
        </Box>
      </Box>

      {/* Main Stats */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          {
        title: 'Total Sources',
        value: analytics.totalSources,
        icon: <RiWaterFlashFill style={{ color: '#2563EB', fontSize: '2rem' }} />,
        bgColor: '#DBEAFE'
          },
          {
        title: 'Functional',
        value: analytics.functional,
        icon: <FaCheck style={{ color: '#4CAF50', fontSize: '2rem' }} />,
        bgColor: '#E8F5E9'
          },
          {
        title: 'Non-Functional',
        value: analytics.nonFunctional,
        icon: <FaTimes style={{ color: '#EF5350', fontSize: '2rem' }} />,
        bgColor: '#FFEBEE'
          },
          {
        title: 'Due for Maintenance',
        value: analytics.maintenanceDue,
        icon: <FaWrench style={{ color: '#FFA726', fontSize: '2rem' }} />,
        bgColor: '#FFF3E0'
          },
          {
        title: 'Well',
        value: analytics.wells,
        icon: <GiWell style={{ color: '#16A34A', fontSize: '2rem' }} />,
        bgColor: '#DCFCE7'
          },
          {
        title: 'Handpump Boreholes',
        value: analytics.handpumpBoreholes,
        icon: <FaFaucet style={{ color: '#2563EB', fontSize: '2rem' }} />,
        bgColor: '#DBEAFE'
          },
          {
        title: 'Motorized Boreholes',
        value: analytics.motorizedBoreholes,
        icon: <FaCheck style={{ color: '#4CAF50', fontSize: '2rem' }} />,
        bgColor: '#E8F5E9'
          },
          {
        title: 'Non-Motorized Boreholes',
        value: analytics.nonMotorizedBoreholes,
        icon: <FaTimes style={{ color: '#EF5350', fontSize: '2rem' }} />,
        bgColor: '#FFEBEE'
          },
          {
        title: 'Streams',
        value: analytics.streams,
        icon: <FaWater style={{ color: '#25306B', fontSize: '2rem' }} />,
        bgColor: '#DBEAFE'
          },
          {
        title: 'Non Streams',
        value: analytics.streams,
        icon: <FaWater style={{ color: '#25306B', fontSize: '2rem' }} />,
        bgColor: '#DBEAFE'
          },

        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
        <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Water Quality Tabs */}
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3, boxShadow: 5 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { minWidth: 'unset', px: 3 },
            '& .Mui-selected': { color: '#0EA5E9' },
            '& .MuiTabs-indicator': { backgroundColor: '#0EA5E9' },
          }}
        >
          <Tab label="Physical" />
          <Tab label="Chemical" />
          <Tab label="Microbiological" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              overflowX: 'auto',
              gap: 2,
              pt: 3,
            }}
          >
            {metrics.map((metric, index) => (
              <MetricItem key={index} value={metric.value} label={metric.label} color={metric.color} />
            ))}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              overflowX: 'auto',
              gap: 2,
              pt: 3,
            }}
          >
            {metrics.map((metric, index) => (
              <MetricItem
                key={index}
                value={metric.value}
                label={`${metric.label} (Chemical)`}
                color={metric.color}
              />
            ))}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              overflowX: 'auto',
              gap: 2,
              pt: 3,
            }}
          >
            {metrics.map((metric, index) => (
              <MetricItem
                key={index}
                value={metric.value}
                label={`${metric.label} (Microbiological)`}
                color={metric.color}
              />
            ))}
          </Box>
        </TabPanel>
      </Paper>

      {/* Table Section */}
      <Card sx={{ mt: 3, boxShadow: 5 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, }}>Water Sources Overview</Typography>
            <Box sx={{ display: 'flex', gap: 2, }}>
              <TextField
                size="small"
                placeholder="Search sources..."
                InputProps={{ startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} /> }}
              />
              <Button startIcon={<FaFilter style={{ color: "#1F2937" }} />}>
                <Typography variant="body1" color="#1F2937">
                  Filter
                </Typography>
              </Button>
            </Box>
          </Box>
            <DataTable  setSearch={setSearch} setPage={setPage} setLimit={setLimit} isLoading={isLoading} columns={columns} data={data || []} />
        </Box>
      </Card>
    </Box>
  );
};

export default WaterSourcesDashboard;
