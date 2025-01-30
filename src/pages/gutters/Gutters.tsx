import {
  FilterAlt,
  Fullscreen,
  MoreHoriz
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { GiBrickWall, GiRiver, GiSpill, GiSplashyStream } from 'react-icons/gi';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';

// Add Gutter interface
interface Gutter {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  geolocation: {
    type: string;
    coordinates: number[];
  };
  type: string;
  condition: string;
  status: string;
  dischargePoint: string;
  createdBy: string;
  publicSpace: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Add column helper and column definitions
const columnHelper = createColumnHelper<Gutter>();

const columns = [
  columnHelper.accessor('picture', {
    header: 'Picture',
    cell: props => (
      <Avatar
        src={props.getValue()}
        alt="gutter"
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
  columnHelper.accessor('publicSpace', {
    header: 'publicSpace',
    cell: info => info.getValue(),
  }),

  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => (
      <Chip
        label={info.getValue()}
        color={info.getValue() === 'Maintained' ? 'success' : 'warning'}
        size="small"
      />
    ),
  }),
  columnHelper.accessor('capturedAt', {
    header: 'Captured At',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),
];

const GutterDashboard = () => {
  // Add state management
  const [dgutters, setDGutters ] = useState({})
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  // Add query hook
  const { data: gutters, isLoading } = useQuery<Gutter[], Error>({
    queryKey: ['gutters', { limit, page, search }],
    queryFn: () => apiController.get<Gutter[]>(`/gutters?limit=${limit}&page=${page}&search=${search}`),
  });

  useEffect(() => {
    if (gutters) {
      setDGutters(gutters)
    }
  }, [gutters]);

  const countByProperty = <T extends object>(
    data: T[] | undefined,
    property: keyof T,
    value: T[keyof T]
  ): number => {
    return data?.filter(item => item[property] !== undefined && item[property] === value).length || 0;
  };

  const maitained = countByProperty(gutters, 'status', 'Maintained');
  const unMaintained = countByProperty(gutters, 'status', 'Poorly Maintained');

  const totalStatus = maitained + unMaintained;

  const gutterTypes = [
    { type: 'Maintained', value: maitained, color: '#00B4D8' },
    { type: 'Unmaintained', value: unMaintained, color: '#4CAF50' },
  ];

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#2C3E50', fontWeight: 600, mb: 0.5 }}>
            Gutters
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Detailed insights about your selected location
          </Typography>
        </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterAlt />}
              sx={{ color: 'text.primary' }}
            >
              Filter
            </Button>
          </Box></Box>
      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
  {/* Total Site Card */}
  <Card sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
    <Box>
      <Typography color="text.secondary">Total Gutters</Typography>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>{gutters?.length}</Typography>
    </Box>
    <Box
      sx={{
        bgcolor: '#E0F2FE',
        p: 1.5,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <GiRiver style={{ color: '#3B82F6', fontSize: '2rem' }}/>
    </Box>
  </Card>

  {/* Maintained Card */}
  <Card sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
    <Box>
      <Typography color="text.secondary">Constructed with Block</Typography>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#4CAF50' }}>
          {countByProperty(gutters, 'type', 'Constructed with Block')}
        </Typography>
    </Box>
    <Box
      sx={{
        bgcolor: '#E8F5E9',
        p: 1.5,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <GiBrickWall style={{color: '#4CAF50', fontSize: '2rem'}} />
    </Box>
  </Card>

  {/* Overfilled Card */}
  <Card sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
    <Box>
      <Typography color="text.secondary">Locally Dug</Typography>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#EF4444' }}>
        {countByProperty(gutters, 'type', 'Locally Dug')}
        </Typography>
    </Box>
    <Box
      sx={{
        bgcolor: '#FEE2E2',
        p: 1.5,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
          >
      <GiSplashyStream style={{ color: '#EF4444', fontSize: '2rem'}} />
    </Box>
  </Card>

  {/* Unmaintained Card */}
  <Card sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
    <Box>
      <Typography color="text.secondary">Surfaced Gutter</Typography>
      <Typography variant="h4" sx={{ fontWeight: 600, color: '#F59E0B' }}>
      {countByProperty(gutters, 'type', 'Surface Gutter')}
      </Typography>
    </Box>
    <Box
      sx={{
        bgcolor: '#FEF3C7',
        p: 1.5,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <GiSpill style={{color: '#F59E0B', fontSize: '2rem'}}/>
    </Box>
  </Card>
</Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        {/* Timeframe Distribution */}
        <Card sx={{ flex: 1, p: 3, borderRadius: 2, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E293B' }}>
              Gutter <br /> Type Distribution
            </Typography>
            <ToggleButtonGroup
              size="small"
              exclusive
              sx={{
                backgroundColor: '#F8FAFC',
                borderRadius: 1,
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ToggleButton
                value="monthly"
                sx={{
                  textTransform: 'none',
                  px: 2,
                  '&.Mui-selected': { bgcolor: '#F3F4F6', color: '#0EA5E9' },
                }}
              >
                <Typography variant="body1" color="initial">Monthly</Typography>
              </ToggleButton>
              <ToggleButton
                value="yearly"
                sx={{
                  textTransform: 'none',
                  px: 2,
                  '&.Mui-selected': { bgcolor: '#F3F4F6', color: '#0EA5E9' },
                }}
              >
                <Typography variant="body1" color="initial">Yearly</Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Gutter Types */}
          {gutterTypes.map((item) => (
            <Box key={item.type} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#1E293B' }}>
                  {item.type}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: item.color }}>
                  {`${item.value}  - ${((item.value / totalStatus) * 100).toFixed(2)}%`}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 8,
                  bgcolor: '#F1F5F9',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${(item.value / totalStatus) * 100}%`,
                    height: '100%',
                    bgcolor: item.color,
                    borderRadius: 4,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Card>

        {/* Gutter Location Map */}
        <Card sx={{ flex: 2, p: 3, borderRadius: 2, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Gutter Location Map</Typography>
            <Box>
              <IconButton>
                <Fullscreen />
              </IconButton>
              <IconButton>
                <MoreHoriz />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ height: 400, bgcolor: '#F8FAFC', borderRadius: 1, overflow: 'hidden' }}>
                  <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54444.747381551366!2d7.6930992235022035!3d11.29520357300069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11b27fc3df7cf997%3A0x7f813ac2a29bec28!2sKudan%2C%20Kaduna!5e1!3m2!1sen!2sng!4v1735816821797!5m2!1sen!2sng"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

    </Box>

        </Card>
      </Box>


      {/* Maintenance Table */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Maintenance Status</Typography>
        </Box>

        <DataTable
          setSearch={setSearch}
          setPage={setPage}
          setLimit={setLimit}
          isLoading={isLoading}
          columns={columns}
          data={gutters || []}
        />
      </Paper>

    </Box>
  );
};

export default GutterDashboard;