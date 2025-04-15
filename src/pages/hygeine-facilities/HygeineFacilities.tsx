import React, { useState, useMemo } from 'react';
import {
  Avatar,
  Box,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  styled,
  Typography,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHandHoldingWater, FaSchool, FaHospital, FaHome } from 'react-icons/fa';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.spacing(1)};
  min-height: 150px;
`;

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
  _id: string;
}

interface HygieneAnalytics {
  totalFacilities: number;
  schoolsWithFacilitiesRatio: string;
  avgFacilitiesPerHealthCenter: string;
  householdsWithoutFacilities: string;
  distributionByType: {
    name: string;
    value: number;
    percentage: string;
  }[];
  distributionByLocation: {
    name: string;
    value: number;
    percentage: string;
  }[];
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
  columnHelper.accessor('location', {
    header: 'Location',
    cell: (info) => info.getValue(),
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

const sanitizeAnalytics = (analytics?: HygieneAnalytics | null): HygieneAnalytics => {
  if (!analytics)
    return {
      totalFacilities: 0,
      schoolsWithFacilitiesRatio: '0',
      avgFacilitiesPerHealthCenter: '0',
      householdsWithoutFacilities: '0',
      distributionByType: [],
      distributionByLocation: [],
    };

  return {
    ...analytics,
    schoolsWithFacilitiesRatio:
      analytics.schoolsWithFacilitiesRatio === 'No data' ? '0' : analytics.schoolsWithFacilitiesRatio,
    avgFacilitiesPerHealthCenter:
      analytics.avgFacilitiesPerHealthCenter === 'No data' ? '0' : analytics.avgFacilitiesPerHealthCenter,
    householdsWithoutFacilities:
      analytics.householdsWithoutFacilities === 'No data' ? '0' : analytics.householdsWithoutFacilities,
  };
};

const HygieneFacilities: React.FC = () => {
  const navigate = useNavigate();
  const locationObj = useLocation();
  const queryParams = new URLSearchParams(locationObj.search);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [spaceTypeFilter, setSpaceTypeFilter] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [hamletFilter, setHamletFilter] = useState('');

  const { data: allData, isLoading: isTableLoading } = useQuery<HygieneFacility[], Error>({
    queryKey: ['hand-washing'],
    queryFn: () => apiController.get('/hand-washing'),
  });

  const { data: initialAnalytics } = useQuery<HygieneAnalytics, Error>({
    queryKey: ['hand-washing-analytics'],
    queryFn: () => apiController.get('/hand-washing/analytics'),
  });

  const spaceTypeOptions = useMemo(() => [...new Set(allData?.map((item) => item.spaceType) ?? [])], [allData]);
  const wardOptions = useMemo(() => [...new Set(allData?.map((item) => item.ward) ?? [])], [allData]);
  const villageOptions = useMemo(
    () => [
      ...new Set(
        allData
          ?.filter((item) => !wardFilter || item.ward === wardFilter)
          .map((item) => item.village) ?? []
      ),
    ],
    [allData, wardFilter]
  );
  const hamletOptions = useMemo(
    () => [
      ...new Set(
        allData
          ?.filter(
            (item) =>
              (!wardFilter || item.ward === wardFilter) &&
              (!villageFilter || item.village === villageFilter)
          )
          .map((item) => item.hamlet) ?? []
      ),
    ],
    [allData, wardFilter, villageFilter]
  );

  const filteredData = useMemo(
    () =>
      allData?.filter(
        (item) =>
          (!spaceTypeFilter || item.spaceType === spaceTypeFilter) &&
          (!wardFilter || item.ward === wardFilter) &&
          (!villageFilter || item.village === villageFilter) &&
          (!hamletFilter || item.hamlet === hamletFilter)
      ) || [],
    [allData, spaceTypeFilter, wardFilter, villageFilter, hamletFilter]
  );

  const effectiveAnalytics = useMemo(() => {
    const baseAnalytics =
      !spaceTypeFilter && !wardFilter && !villageFilter && !hamletFilter
        ? initialAnalytics
        : {
            totalFacilities: filteredData.length,
            schoolsWithFacilitiesRatio: initialAnalytics?.schoolsWithFacilitiesRatio || '0',
            avgFacilitiesPerHealthCenter: initialAnalytics?.avgFacilitiesPerHealthCenter || '0',
            householdsWithoutFacilities: initialAnalytics?.householdsWithoutFacilities || '0',
            distributionByType: Object.entries(
              filteredData.reduce((acc, item) => {
                acc[item.type] = (acc[item.type] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([name, value]) => ({
              name,
              value,
              percentage:
                filteredData.length > 0 ? ((value / filteredData.length) * 100).toFixed(1) + '%' : '0%',
            })),
            distributionByLocation: Object.entries(
              filteredData.reduce((acc, item) => {
                acc[item.location] = (acc[item.location] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([name, value]) => ({
              name,
              value,
              percentage:
                filteredData.length > 0 ? ((value / filteredData.length) * 100).toFixed(1) + '%' : '0%',
            })),
          };

    return sanitizeAnalytics(baseAnalytics);
  }, [initialAnalytics, filteredData, spaceTypeFilter, wardFilter, villageFilter, hamletFilter]);

  const paginatedData = useMemo(
    () => filteredData.slice(page * pageSize, (page + 1) * pageSize),
    [filteredData, page, pageSize]
  );

  const navigateToDetails = (id: string) => {
    navigate(`/hygeine-facilities/${id}?${queryParams.toString()}`);
  };

  const FilterDropdown = ({
    label,
    value,
    options,
    onChange,
  }: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
  }) => (
    <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 120 }}>
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

  if (isTableLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
            Hygiene Facilities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed insights about hygiene facilities in different locations
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <FilterDropdown
              label="Space Type"
              value={spaceTypeFilter}
              options={spaceTypeOptions}
              onChange={setSpaceTypeFilter}
            />
            <FilterDropdown
              label="Ward"
              value={wardFilter}
              options={wardOptions}
              onChange={setWardFilter}
            />
            <FilterDropdown
              label="Village"
              value={villageFilter}
              options={villageOptions}
              onChange={setVillageFilter}
            />
            <FilterDropdown
              label="Hamlet"
              value={hamletFilter}
              options={hamletOptions}
              onChange={setHamletFilter}
            />
          </Stack>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Facilities"
            value={effectiveAnalytics.totalFacilities.toLocaleString()}
            icon={<FaHandHoldingWater style={{ color: '#2563EB', fontSize: '2rem' }} />}
            bgColor="#E3F2FD"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Schools With Facilities"
            value={effectiveAnalytics.schoolsWithFacilitiesRatio}
            icon={<FaSchool style={{ color: '#4CAF50', fontSize: '2rem' }} />}
            bgColor="#E8F5E9"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Avg/Health Center"
            value={effectiveAnalytics.avgFacilitiesPerHealthCenter}
            icon={<FaHospital style={{ color: '#FF9800', fontSize: '2rem' }} />}
            bgColor="#FFF3E0"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Households Without"
            value={effectiveAnalytics.householdsWithoutFacilities}
            icon={<FaHome style={{ color: '#0EA5E9', fontSize: '2rem' }} />}
            bgColor="#E3F2FD"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Distribution by Type as a BarChart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" mb={2}>
              Distribution by Type
            </Typography>
            <BarChart
              xAxis={[
                {
                  scaleType: 'band',
                  data: effectiveAnalytics.distributionByType.map((item) => item.name),
                },
              ]}
              series={[
                {
                  data: effectiveAnalytics.distributionByType.map((item) => item.value),
                  label: 'Facilities',
                  color: '#4CAF50',
                },
              ]}
              width={650}
              height={350}
              tooltip={({ datum, index }) =>
                `${effectiveAnalytics.distributionByType[index].name}: ${datum}`
              }
            />
          </Card>
        </Grid>

        {/* Distribution by Location as a PieChart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" mb={2}>
              Distribution by Location
            </Typography>
            <PieChart
              series={[
                {
                  data: effectiveAnalytics.distributionByLocation.map((item, index) => ({
                    id: index,
                    label: item.name,
                    value: item.value,
                    percentage: item.percentage,
                  })),
                  arcLabel: (item) => item.percentage,
                  arcLabelMinAngle: 20,
                  outerRadius: 120,
                  innerRadius: 30,
                  tooltip: ({ datum }) => `${datum.label}: ${datum.value}`,
                },
              ]}
              width={750}
              height={350}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  fill: '#333',
                  textShadow: '0 1px 2px rgba(255,255,255,0.7)',
                },
              }}
            />
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Facilities Overview
          </Typography>
          <DataTable
            columns={columns}
            data={paginatedData}
            pagination={{ pageIndex: page, pageSize }}
            onPaginationChange={({ pageIndex, pageSize }) => {
              setPage(pageIndex);
              setPageSize(pageSize);
            }}
            totalCount={filteredData.length}
            onRowClick={(row) => navigateToDetails(row.original._id)}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default HygieneFacilities;
