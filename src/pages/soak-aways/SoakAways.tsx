import {
  Add as AddIcon,
  FiberManualRecord as FiberManualRecordIcon,
  FilterAlt as FilterAltIcon,
  Remove as RemoveIcon,
  Waves,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { FaClipboardCheck, FaDownload, FaExclamationTriangle, FaFilter, FaWrench } from 'react-icons/fa';
import { apiController } from '../../axios';
import { DataTable } from '../../components/Table/DataTable';

// Add SoakAway interface
interface SoakAway {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  publicSpace: string;
  space: string;
  condition: string;
  status: string;
  daysSinceLastEvacuation: number;
  evacuationFrequency: string;
  safetyRisk: string;
  daysSinceLastMaintenance: number | null;
  daysUntilEvacuation: number | null;
  maintenanceStatus: string;
  createdBy: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
  geolocation: {
    type: string;
    coordinates: number[];
  };
}

// Add column helper
const columnHelper = createColumnHelper<SoakAway>();

const columns = [
  columnHelper.accessor('picture', {
    header: 'Picture',
    cell: props => (
      <Avatar
        src={props.getValue()}
        alt="soakaway"
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
    header: 'Category',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => (
      <Chip
        label={info.getValue()}
        color={info.getValue() === 'Improved' ? 'success' : 'error'}

        size="small"
      />
    ),
  }),
  columnHelper.accessor('capturedAt', {
    header: 'Captured At',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),
];

const SoakAways = () => {
  const [soakAways, setSoakAways] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const { data , isLoading } = useQuery<SoakAway[], Error>({
    queryKey: ['soak-aways', { limit, page, search }],
    queryFn: () => apiController.get<SoakAway[]>(`/soak-aways?limit=${limit}&page=${page}&search=${search}`),
  });

  useEffect(() => {
    if (data) {
      setSoakAways(data)
    }
  }, [data]);

  const countByProperty = <T extends object>(
    data: T[] | undefined,
    property: keyof T,
    value: T[keyof T]
  ): number => {
    return data?.filter(item => item[property] !== undefined && item[property] === value).length || 0;
  };

  const improved = countByProperty(data, 'status', 'Improved');
  const unimproved = countByProperty(data, 'status', 'Unimproved');

  const totalStatus = improved + unimproved;

  const fairSafety = countByProperty(data, 'safetyRisk', 'Fair');
  const badSafety = countByProperty(data, 'safetyRisk', 'Bad/Fail');

  const totalSafety = fairSafety + badSafety;

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 0.5 }}>
            Soakaways
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed insights about your selected location
          </Typography>
        </Box>
        <Button
          startIcon={<FilterAltIcon />}
          variant="contained"
          sx={{
            bgcolor: 'white',
            color: 'text.primary',
            boxShadow: 1,
            '&:hover': { bgcolor: 'grey.100' },
            textTransform: 'none',
          }}
        >
          Filter
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <StatsCard
          title="Total Soakaways"
          value={data?.length}
          icon={<Waves />}
          iconColor="#2196f3"
        />
        <StatsCard
          title="Maintained"
          value={countByProperty(data, 'condition', 'Maintained')}
          icon={<FaClipboardCheck style={{color: "#16A34A"}}/>}
          iconColor="#4caf50"
          valueColor="#16A34A"
        />
        <StatsCard
          title="Unmaitained"
          value={countByProperty(data, 'condition', 'Unmaintained')}
          icon={<FaExclamationTriangle style={{color: "#DC2626"}}/>}
          iconColor="#f44336"
          valueColor="#f44336"
        />
        <StatsCard
          title="Dilapated"
          value={countByProperty(data, 'condition', 'Dilapidated')}
          icon={<FaWrench color="#CA8A04" />}
          iconColor="#ff9800"
          valueColor="#ff9800"
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Soakaway Condition Table */}
        <Paper sx={{ flex: 2, p: 2, borderRadius: 2, boxShadow: 10 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>Soakaway Condition</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<FaDownload />}
                sx={{
                  bgcolor: 'rgba(241, 243, 245, 1)',
                  color: 'rgba(37, 48, 107, 1)',
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: 'rgba(220, 225, 230, 1)' },
                }}
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<FaFilter />}
                sx={{
                  bgcolor: 'rgba(241, 243, 245, 1)',
                  color: 'rgba(37, 48, 107, 1)',
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: 'rgba(220, 225, 230, 1)' },
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
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>Status</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>Total</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                  <FiberManualRecordIcon sx={{ color: '#4caf50', fontSize: 12, mr: 1 }} />
                    Improved</TableCell>
                  <TableCell>{improved}</TableCell>
                  <TableCell>{`${((improved / totalStatus) * 100).toFixed(2)}%`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                  <FiberManualRecordIcon sx={{ color: '#f44336', fontSize: 12, mr: 1 }} />
                    Unimproved</TableCell>
                  <TableCell>{unimproved}</TableCell>
                  <TableCell>{`${((unimproved / totalStatus) * 100).toFixed(2)}%`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Slab Safety Risk */}
        <Paper sx={{ flex: 1, p: 2, borderRadius: 2, boxShadow: 10 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Slab Safety Risk</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: '#f5f5f5', p: 1.5, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FiberManualRecordIcon sx={{ color: '#4caf50', fontSize: 12, mr: 1 }} />
                <Typography>Fair Condition {`(${((fairSafety / totalSafety) * 100).toFixed(2)}%)`}</Typography>
              </Box>
              <Typography>{fairSafety}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: '#f5f5f5', p: 1.5, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FiberManualRecordIcon sx={{ color: '#f44336', fontSize: 12, mr: 1 }} />
                <Typography>Bad/Fail {`(${((badSafety / totalSafety) * 100).toFixed(2)}%)`}</Typography>
              </Box>
              <Typography>{badSafety}</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
      {/* Geographic Risk Distribution */}
      <Paper sx={{ mt: 2, p: 2, borderRadius: 2, boxShadow: 10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Geographic Risk Distribution</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {['Zone A', 'Zone B', 'Zone C'].map((zone) => (
              <Button
                key={zone}
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  color: 'text.primary',
                  borderColor: 'grey.300'
                }}
              >
                {zone}
              </Button>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            height: 400,
            bgcolor: '#f5f5f5',
            borderRadius: 1,
            position: 'relative',
            overflow: 'hidden'
          }}
        >

          {/* Map Controls */}
          <Paper sx={{ position: 'absolute', top: 16, right: 16, borderRadius: 1 }}>
            <IconButton size="small"><AddIcon /></IconButton>
            <IconButton size="small"><RemoveIcon /></IconButton>
          </Paper>
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

        </Box>
      </Paper>

      {/* Soakaway Overview */}
      <Paper sx={{ mt: 3, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Soakaway Overview</Typography>
        </Box>

        <DataTable
          setSearch={setSearch}
          setPage={setPage}
          setLimit={setLimit}
          isLoading={isLoading}
          columns={columns}
          data={data || []}
        />

      </Paper>
    </Box>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number | undefined;
  icon: React.ReactElement;
  iconColor?: string;
  valueColor?: string;
}

const StatsCard = ({ title, value, icon, iconColor, valueColor }: StatsCardProps) => (
  <Card sx={{ flex: 1, p: 2, borderRadius: 2, boxShadow: 10 }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: valueColor || 'text.primary' }}>
        {value}
      </Typography>
      <Box
        sx={{
          bgcolor: `${iconColor}15`,
          width: 48,
          height: 48,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {React.cloneElement(icon, { sx: { color: iconColor, fontSize: 24 } })}
      </Box>
    </Box>
  </Card>
);

export default SoakAways;
