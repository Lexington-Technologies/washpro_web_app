import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Paper,
  styled,
  Typography
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { FaCheck, FaFilter, FaTimes } from 'react-icons/fa';
import { FaWrench } from 'react-icons/fa6';
import { RiWaterFlashFill } from 'react-icons/ri';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';

// Interfaces
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
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
    publicSpace: string;
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

// Define your row shape


const columnHelper = createColumnHelper<WaterSource>()

// Make some columns!
const columns = [
  // columnHelper.accessor((_, index) => index + 1, {
  //   id: 'index',
  //   header: 'S/N',
  //   cell: info => info.getValue(),
  //   size: 50,
  // }),
  columnHelper.accessor('picture', {
    header: 'Picture',
    cell: props => (
      <Avatar
        src={props.row.original.picture}
        alt="water source"
        sx={{
          width: 40,
          height: 40,
          borderRadius: '20%', // Make avatar round
          border: '2px solid #e5e7eb', // Add subtle border
        }}
      />
    ),
    size: 80,
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
  columnHelper.accessor('publicSpace', {
    header: 'Category',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: info => {
      return (
        <span>{`${info.row.original.type}, ${info.row.original.status}`}</span>
      )
    },
  }),
]
// Main Component
const WaterSourcesDashboard: React.FC = () => {
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
    functionalWells: 0,
    nonFunctionalWells: 0,
    maintenanceDueWells: 0,
    functionalStreams: 0,
    nonFunctionalStreams: 0,
    maintenanceDueStreams: 0,
    functionalHandpumpBoreholes: 0,
    nonFunctionalHandpumpBoreholes: 0,
    maintenanceDueHandpumpBoreholes: 0,
    functionalMotorizedBoreholes: 0,
    nonFunctionalMotorizedBoreholes: 0,
    maintenanceDueMotorizedBoreholes: 0,
    functionalNonMotorizedBoreholes: 0,
    nonFunctionalNonMotorizedBoreholes: 0,
    maintenanceDueNonMotorizedBoreholes: 0,
  });
  const [waterSource, setWaterSource] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery<WaterSource[], Error>({
    queryKey: ['water-sources', { limit, page, search }],
    queryFn: () => apiController.get<WaterSource[]>(`/water-sources?limit=${limit}&page=${page}&search=${search}`),
  });

  useEffect(() => {
    if (data) {
      setWaterSource(data);
      const totalSources = data.length;
      const functional = data.filter(source => source.status === 'Functional').length;
      const nonFunctional = data.filter(source => source.status === 'Non Functional').length;
      const maintenanceDue = data.filter(source => source.status === 'Maintenance Due').length;
      const wells = data.filter(source => source.type === 'protected Dug Wells' || source.type === 'Unprotected Dug Wells').length;
      const streams = data.filter(source => source.type === 'Stream').length;
      const handpumpBoreholes = data.filter(source => source.type === 'Hand Pump Boreholes').length;
      const motorizedBoreholes = data.filter(source => source.type === 'Motorized Boreholes').length;
      const nonMotorizedBoreholes = data.filter(source => source.type === 'Non Motorized Boreholes').length;
      const functionalWells = data.filter(source => (source.type === 'protected Dug Wells' || source.type === 'Unprotected Dug Wells') && source.status === 'Functional').length;
      const nonFunctionalWells = data.filter(source => (source.type === 'protected Dug Wells' || source.type === 'Unprotected Dug Wells') && source.status === 'Non Functional').length;
      const maintenanceDueWells = data.filter(source => (source.type === 'protected Dug Wells' || source.type === 'Unprotected Dug Wells') && source.status === 'Maintenance Due').length;
      const functionalStreams = data.filter(source => source.type === 'Stream' && source.status === 'Functional').length;
      const nonFunctionalStreams = data.filter(source => source.type === 'Stream' && source.status === 'Non Functional').length;
      const maintenanceDueStreams = data.filter(source => source.type === 'Stream' && source.status === 'Maintenance Due').length;
      const functionalHandpumpBoreholes = data.filter(source => source.type === 'Hand Pump Boreholes' && source.status === 'Functional').length;
      const nonFunctionalHandpumpBoreholes = data.filter(source => source.type === 'Hand Pump Boreholes' && source.status === 'Non Functional').length;
      const maintenanceDueHandpumpBoreholes = data.filter(source => source.type === 'Hand Pump Boreholes' && source.status === 'Maintenance Due').length;
      const functionalMotorizedBoreholes = data.filter(source => source.type === 'Motorized Boreholes' && source.status === 'Functional').length;
      const nonFunctionalMotorizedBoreholes = data.filter(source => source.type === 'Motorized Boreholes' && source.status === 'Non Functional').length;
      const maintenanceDueMotorizedBoreholes = data.filter(source => source.type === 'Motorized Boreholes' && source.status === 'Maintenance Due').length;
      const functionalNonMotorizedBoreholes = data.filter(source => source.type === 'Non Motorized Boreholes' && source.status === 'Functional').length;
      const nonFunctionalNonMotorizedBoreholes = data.filter(source => source.type === 'Non Motorized Boreholes' && source.status === 'Non Functional').length;
      const maintenanceDueNonMotorizedBoreholes = data.filter(source => source.type === 'Non Motorized Boreholes' && source.status === 'Maintenance Due').length;

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
        functionalWells,
        nonFunctionalWells,
        maintenanceDueWells,
        functionalStreams,
        nonFunctionalStreams,
        maintenanceDueStreams,
        functionalHandpumpBoreholes,
        nonFunctionalHandpumpBoreholes,
        maintenanceDueHandpumpBoreholes,
        functionalMotorizedBoreholes,
        nonFunctionalMotorizedBoreholes,
        maintenanceDueMotorizedBoreholes,
        functionalNonMotorizedBoreholes,
        nonFunctionalNonMotorizedBoreholes,
        maintenanceDueNonMotorizedBoreholes,
      });
    }
  }, [data]);

  const countByProperties = <T extends object>(
    data: T[] | undefined,
    filters: Array<{ property: keyof T; value: T[keyof T] }>
  ): number => {
    if (!data) return 0;

    return data.filter(item =>
      filters.every(filter => item[filter.property] === filter.value)
    ).length;
  };

  const counts = {
    functionalHPB: countByProperties(data, [
      { property: 'type', value: 'Hand Pump Boreholes' },
      { property: 'status', value: 'Functional' },
    ]),
    nonFunctionalHPB: countByProperties(data, [
      { property: 'type', value: 'Hand Pump Boreholes' },
      { property: 'status', value: 'Non Functional' },
    ]),
    functionalMB: countByProperties(data, [
      { property: 'type', value: 'Motorized Boreholes' },
      { property: 'status', value: 'Functional' },
    ]),
    nonFunctionalMB: countByProperties(data, [
      { property: 'type', value: 'Motorized Boreholes' },
      { property: 'status', value: 'Non Functional' },
    ]),
    functionalPDW: countByProperties(data, [
      { property: 'type', value: 'Protected Dug Wells' },
      { property: 'status', value: 'Functional' },
    ]),
    nonFunctionalPDW: countByProperties(data, [
      { property: 'type', value: 'Protected Dug Wells' },
      { property: 'status', value: 'Non Functional' },
    ]),

    functionalUPDW: countByProperties(data, [
      { property: 'type', value: 'Unprotected Dug Wells' },
      { property: 'status', value: 'Functional' },
    ]),
    nonFunctionalUPDW: countByProperties(data, [
      { property: 'type', value: 'Unprotected Dug Wells' },
      { property: 'status', value: 'Non Functional' },
    ]),
  };

  const functionalW = counts.functionalPDW + counts.functionalUPDW;
  const nonFunctionalW = counts.nonFunctionalPDW + counts.nonFunctionalUPDW;

  // Dataset for the BarChart
  const dataset = {
    functional: [functionalW, counts.functionalHPB, counts.functionalMB],
    nonFunctional: [nonFunctionalW, counts.nonFunctionalHPB, counts.nonFunctionalMB],
  };

  // Labels for the xAxis
  const labels = ['Dug wells', 'Hand pump BH', 'Motorized BH'];

  const safeWater = {
    drinkable: countByProperties(data, [
      { property: 'quality', value: 'Drinkable' }
    ]),
    nonDrinkable: countByProperties(data, [
      { property: 'quality', value: 'Non Drinkable' }
    ]),
  }

  // Format data for PieChart
  const pieChartData = [
    { id: 'Drinkable', label: 'Drinkable', value: safeWater.drinkable },
    { id: 'Non Drinkable', label: 'Non Drinkable', value: safeWater.nonDrinkable },
  ];


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
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
        <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* well */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
            Wells
          </Typography>
        </Box>

      </Box> */}

      {/* Well Stats */}
      {/* <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          {
        title: 'Total Wells',
        value: analytics.wells,
        icon: <GiWell style={{ color: '#16A34A', fontSize: '2rem' }} />,
        bgColor: '#DCFCE7'
          },
          {
        title: 'Functional Wells',
        value: analytics.functionalWells,
        icon: <FaCheck style={{ color: '#4CAF50', fontSize: '2rem' }} />,
        bgColor: '#E8F5E9'
          },
          {
        title: 'Non-Functional Wells',
        value: analytics.nonFunctionalWells,
        icon: <FaTimes style={{ color: '#EF5350', fontSize: '2rem' }} />,
        bgColor: '#FFEBEE'
          },
          {
        title: ' Due for Maintenance',
        value: analytics.maintenanceDueWells,
        icon: <FaWrench style={{ color: '#FFA726', fontSize: '2rem' }} />,
        bgColor: '#FFF3E0'
          },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
        <StatCard {...stat} />
          </Grid>
        ))}
      </Grid> */}

      {/* handborehole */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
          Hand Pump Boreholes
          </Typography>
        </Box>

      </Box> */}

      {/* Handpump Boreholes Stats */}
      {/* <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          {
        title: 'Total Handpump Boreholes',
        value: analytics.handpumpBoreholes,
        icon: <FaFaucetDrip style={{ color: '#2563EB', fontSize: '2rem' }} />,
        bgColor: '#DBEAFE'
          },
          {
        title: 'Functional Handpump Boreholes',
        value: analytics.functionalHandpumpBoreholes,
        icon: <FaCheck style={{ color: '#4CAF50', fontSize: '2rem' }} />,
        bgColor: '#E8F5E9'
          },
          {
        title: 'Non-Functional Handpump Boreholes',
        value: analytics.nonFunctionalHandpumpBoreholes,
        icon: <FaTimes style={{ color: '#EF5350', fontSize: '2rem' }} />,
        bgColor: '#FFEBEE'
          },
          {
        title: ' Due for Maintenance',
        value: analytics.maintenanceDueHandpumpBoreholes,
        icon: <FaWrench style={{ color: '#FFA726', fontSize: '2rem' }} />,
        bgColor: '#FFF3E0'
          },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
        <StatCard {...stat} />
          </Grid>
        ))}
      </Grid> */}

      {/* motorized boreholes */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
            Motorized Boreholes
          </Typography>
        </Box>
      </Box> */}

      {/* Motorized Boreholes Stats */}
      {/* <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          {
            title: 'Total Motorized Boreholes',
            value: analytics.motorizedBoreholes,
            icon: <FaFaucet style={{ color: '#DBEAFE', fontSize: '2rem' }} />,
            bgColor: '#2563EB'
          },
          {
            title: 'Functional Motorized Boreholes',
            value: analytics.functionalMotorizedBoreholes,
            icon: <FaCheck style={{ color: '#4CAF50', fontSize: '2rem' }} />,
            bgColor: '#E8F5E9'
          },
          {
            title: 'Non-Functional Motorized Boreholes',
            value: analytics.nonFunctionalMotorizedBoreholes,
            icon: <FaTimes style={{ color: '#EF5350', fontSize: '2rem' }} />,
            bgColor: '#FFEBEE'
          },
          {
            title: 'Due for Maintenance',
            value: analytics.maintenanceDueMotorizedBoreholes,
            icon: <FaWrench style={{ color: '#FFA726', fontSize: '2rem' }} />,
            bgColor: '#FFF3E0'
          },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid> */}

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Water source functionality</Typography>
            <BarChart
              series={[
                { data: dataset.functional, label: 'Functional' },
                { data: dataset.nonFunctional, label: 'Non Functional' },
              ]}
              height={350}
              xAxis={[{ data: labels, scaleType: 'band' }]}
              margin={{ top: 50, bottom: 30, left: 40, right: 10 }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Safe Water</Typography>
            <PieChart
              colors={['#007bff', '#dc3545']} // Use palette
              series={[
                {
                  data: pieChartData,
                  arcLabel: (item) => `${item.value}`,
                  arcLabelMinAngle: 50,
                  arcLabelRadius: '60%',
                  arcLabelStyle: {
                    fontSize: '10px',
                    fontWeight: 'bold',
                  },
                },
              ]}
              width={400}
              height={350}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Table Section */}
      <Card sx={{ mt: 3, boxShadow: 1 }}>
        <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, }}>Water Sources Overview</Typography>
            <DataTable  setSearch={setSearch} setPage={setPage} setLimit={setLimit} isLoading={isLoading} columns={columns} data={data || []} />
        </Box>
      </Card>
    </Box>
  );
};

export default WaterSourcesDashboard;
