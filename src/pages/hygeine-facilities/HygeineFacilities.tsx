import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Card,
  Chip,
  Grid,
  Paper,
  styled,
  Typography,
  Stack,
} from '@mui/material';
import { pieArcLabelClasses, PieChart, DefaultizedPieValueType } from '@mui/x-charts/PieChart';
import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHandHoldingWater, FaSchool, FaHospital, FaHome } from 'react-icons/fa';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';
import LocationFilter from '../../components/LocationFilter';
import LinearProgress from '@mui/material/LinearProgress';

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.spacing(1)};
  min-height: 150px;
`;

const FixedHeader = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: -9,
  zIndex: 100,
  backgroundColor: '#F1F1F5',
  padding: theme.spacing(2, 0),
  marginBottom: theme.spacing(2),
}));

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  bgColor?: string;
}
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor = '#E3F2FD' }) => (
  <StyledPaper>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
      <Box>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
        <Typography variant="h4" sx={{ mt: 1, fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
      {icon && (
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
      )}
    </Box>
  </StyledPaper>
);

interface HygieneFacility {
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  spaceType: string;
  location: string;
  type: string;
  handwashingMaterials: string[] | string;
  capturedAt: string;
  _id: string;
}

const columnHelper = createColumnHelper<HygieneFacility>();
const columns = [
  columnHelper.accessor('picture', {
    header: 'Picture',
    cell: (props) => (
      <Avatar src={props.row.original.picture} alt="facility" sx={{ borderRadius: '100%' }} />
    ),
  }),
  columnHelper.accessor('ward', {
    header: 'Ward',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('village', {
    header: 'Village',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('hamlet', {
    header: 'Hamlet',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('spaceType', {
    header: 'Space Type',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('capturedAt', {
    header: 'Date & Time',
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
columnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip variant="outlined" label={info.row.original.type} color={info.row.original.type === 'Tippy Tap' ? 'success' : 'primary'} />
      </Stack>
    ),
  }),
  columnHelper.accessor('handwashingMaterials', {
    header: 'Handwashing Materials',
    cell: (info) => {
      const materials = info.getValue();
      return (
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {Array.isArray(materials)
            ? materials.map((material, index) => (
                <Chip key={index} label={material} variant="outlined" size="small" color="success" />
              ))
            : materials}
        </Stack>
      );
    },
  }),
];

const HygieneFacilities: React.FC = () => {
  const navigate = useNavigate();
  const locationObj = useLocation();
  const queryParams = new URLSearchParams(locationObj.search);
  const [searchTerm, setSearchTerm] = useState<string>('');


  // Pagination and filter state
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');
  // Stat state
  const [totalFacilities, setTotalFacilities] = useState<number>(0);
  const [schoolsWithFacilitiesRatio, setSchoolsWithFacilitiesRatio] = useState<string>('0');
  const [avgFacilitiesPerHealthCenter, setAvgFacilitiesPerHealthCenter] = useState<string>('0');
  const [householdsWithoutFacilities, setHouseholdsWithoutFacilities] = useState<string>('0');
  // Chart data types
  type PieChartDataItem = { id: number; label: string; value: number; color: string };
  // Chart state
  const [pieChartData, setPieChartData] = useState<PieChartDataItem[]>([]);
  const [locationChartData, setLocationChartData] = useState<PieChartDataItem[]>([]);
  // Analytics query
  const { data: analytics, isLoading } = useQuery<{
    totalFacilities: number;
    schoolsWithFacilitiesRatio: string;
    avgFacilitiesPerHealthCenter: string;
    householdsWithoutFacilities: string;
    distributionByType: { name: string; value: number; percentage: string }[];
    distributionByLocation: { name: string; value: number; percentage: string }[];
  }>({
    queryKey: ['hand-washing-analytics', ward, village, hamlet],
    queryFn: () =>
      apiController.get(
        `/hand-washing/analytics?` +
        (ward ? `ward=${encodeURIComponent(ward)}&` : '') +
        (village ? `village=${encodeURIComponent(village)}&` : '') +
        (hamlet ? `hamlet=${encodeURIComponent(hamlet)}&` : '')
      ),
  });
  // Table query
  const { data: tableData, isLoading: isTableLoading } = useQuery({
    queryKey: [
      'hand-washing',
      pagination.pageIndex,
      pagination.pageSize,
      ward,
      village,
      hamlet,
    ],
    queryFn: () =>
      apiController.get(
        `/hand-washing?limit=${pagination.pageSize}` +
        `&page=${pagination.pageIndex + 1}` +
        `&search=${searchTerm}`+
        (ward ? `&ward=${encodeURIComponent(ward)}` : '') +
        (village ? `&village=${encodeURIComponent(village)}` : '') +
        (hamlet ? `&hamlet=${encodeURIComponent(hamlet)}` : '')
      ),
  });

  // Table data state
  const [tableRows, setTableRows] = useState<HygieneFacility[]>([]);
  const [tableTotal, setTableTotal] = useState<number>(0);

  useEffect(() => {
    if (analytics) {
      setTotalFacilities(analytics.totalFacilities || 0);
      setSchoolsWithFacilitiesRatio(
        analytics.schoolsWithFacilitiesRatio === 'No data' ? '0' : (analytics.schoolsWithFacilitiesRatio || '0')
      );
      setAvgFacilitiesPerHealthCenter(
        analytics.avgFacilitiesPerHealthCenter === 'No data' ? '0' : (analytics.avgFacilitiesPerHealthCenter || '0')
      );
      setHouseholdsWithoutFacilities(
        analytics.householdsWithoutFacilities === 'No data' ? '0' : (analytics.householdsWithoutFacilities || '0')
      );
      if (analytics.distributionByType) {
        const colorPalette = ['#4CAF50', '#F44336', '#FF9800', '#2196F3', '#9C27B0', '#FF5722'];
        setPieChartData(
          analytics.distributionByType.map((item, index) => ({
            id: index,
            label: item.name,
            value: item.value,
            color: colorPalette[index % colorPalette.length],
          }))
        );
      }
      if (analytics.distributionByLocation) {
        const colorPalette = ['#1976D2', '#388E3C', '#FBC02D', '#D32F2F', '#7B1FA2', '#0288D1'];
        setLocationChartData(
          analytics.distributionByLocation.map((item, index) => ({
            id: index,
            label: item.name,
            value: item.value,
            color: colorPalette[index % colorPalette.length],
          }))
        );
      }
    }
    // Do not reset to 0/empty if analytics is undefined
  }, [analytics]);

  useEffect(() => {
    if (tableData) {
      if (Array.isArray(tableData)) {
        setTableRows(tableData as HygieneFacility[]);
        setTableTotal(tableData.length);
      } else if (typeof tableData === 'object' && tableData !== null) {
        setTableRows((tableData as { data?: HygieneFacility[] }).data || []);
        setTableTotal((tableData as { total?: number }).total || 0);
      }
    }
    // Do not reset to empty if tableData is undefined
  }, [tableData]);

  const totalPieValue = pieChartData.reduce((sum, item) => sum + item.value, 0);
  const totalLocationValue = locationChartData.reduce((sum, item) => sum + item.value, 0);

  const navigateToDetails = (id: string) => {
    navigate(`/hand-washing/${id}?${queryParams.toString()}`);
  };


  return (
    <Box sx={{ backgroundColor: '#F1F1F5', minHeight: '100vh', p: 3 }}>
      <Box sx={{ position: 'relative' }}>
        <FixedHeader>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
                    Hygiene Facilities
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Detailed insights about hygiene facilities in different locations
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <LocationFilter ward={ward} village={village} hamlet={hamlet}
                    setWard={setWard} setVillage={setVillage} setHamlet={setHamlet}
                  />
                </Box>
              </Box>
              <Box sx={{ width: '100%', mb: 3 }}>
                {isLoading && <LinearProgress />}
              </Box>
            </Grid>
          </Grid>
        </FixedHeader>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Facilities"
              value={Number(totalFacilities).toLocaleString()}
              icon={<FaHandHoldingWater style={{ color: '#2563EB', fontSize: '2rem' }} />}
              bgColor="#E3F2FD"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Schools With Facilities"
              value={schoolsWithFacilitiesRatio}
              icon={<FaSchool style={{ color: '#4CAF50', fontSize: '2rem' }} />}
              bgColor="#E8F5E9"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Avg HandWash Facilities in Health Center"
              value={avgFacilitiesPerHealthCenter}
              icon={<FaHospital style={{ color: '#FF9800', fontSize: '2rem' }} />}
              bgColor="#FFF3E0"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Households Without"
              value={householdsWithoutFacilities}
              icon={<FaHome style={{ color: '#0EA5E9', fontSize: '2rem' }} />}
              bgColor="#E3F2FD"
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" mb={2}>
                Distribution by Type
              </Typography>
              <PieChart
                series={[
                  {
                    data: pieChartData,
                    arcLabel: (item: Omit<DefaultizedPieValueType, 'label'> & { label?: string }) =>
                      totalPieValue > 0 ? `${((item.value / totalPieValue) * 100).toFixed(1)}%` : '0%',
                    arcLabelMinAngle: 10,
                    outerRadius: 180,
                    innerRadius: 40,
                  },
                ]}
                width={Math.min(760, window.innerWidth - 40)}
                height={370}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fontWeight: 'bold',
                    fill: 'white',
                    fontSize: '0.8rem',
                  },
                }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" mb={2}>
                Distribution by Location
              </Typography>
              <PieChart
                series={[
                  {
                    data: locationChartData,
                    arcLabel: (item: Omit<DefaultizedPieValueType, 'label'> & { label?: string }) =>
                      totalLocationValue > 0 ? `${((item.value / totalLocationValue) * 100).toFixed(1)}%` : '0%',
                    arcLabelMinAngle: 10,
                    outerRadius: 180,
                    innerRadius: 40,
                  },
                ]}
                width={Math.min(760, window.innerWidth - 40)}
                height={370}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fontWeight: 'bold',
                    fill: 'white',
                    fontSize: '0.8rem',
                  },
                }}
              />
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ overflowX: 'auto' }}>
            {isTableLoading && <LinearProgress sx={{ height: 2 }} />}
            <DataTable
              columns={columns}
              data={Array.isArray(tableData) ? tableData : []}
              pagination={{
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
              }}
              totalCount={tableData?.pagination?.total || 0}
              onPaginationChange={setPagination}
              onFilterChange={({ ward, village, hamlet }) => {
                setWard(ward || 'All');
                setVillage(village || 'All');
                setHamlet(hamlet || 'All');
                setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
              }}
              searchQuery={searchTerm}
              onSearchChange={(newSearch) => {
                setSearchTerm(newSearch);
                setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
              }}
              onRowClick={(row) => navigateToDetails(row._id)}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default HygieneFacilities;