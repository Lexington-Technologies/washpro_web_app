import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Paper,
  IconButton,
  Pagination,
  TextField,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningIcon from '@mui/icons-material/Warning';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import InfoIcon from '@mui/icons-material/Info';
import { FaChartLine, FaDownload, FaFilter } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '../../components/Table/DataTable';
import { apiController } from '../../axios';
import { Avatar } from '@mui/material';
import Search from '@mui/icons-material/Search';

interface OpenDefecation {
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  publicSpace: string;
  space: string;
  footTraffic: string;
  peakTime: string[];
  demographics: string[];
  environmentalCharacteristics: string[];
  dailyAverage: string;
  createdBy: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
  geolocation: {
    type: string;
    coordinates: number[];
  };
}

const columnHelper = createColumnHelper<OpenDefecation>();

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
        src={props.getValue()}
        alt="open defecation"
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
  columnHelper.accessor('peakTime', {
    header: 'Peak Time',
    cell: info => info.getValue().join(', '),
  }),
  columnHelper.accessor('capturedAt', {
    header: 'Captured At',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),
];

const OpenDefication = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const { data: openDefecations, isLoading } = useQuery<OpenDefecation[], Error>({
    queryKey: ['open-defecations', { limit, page, search }],
    queryFn: () => apiController.get<OpenDefecation[]>(`/open-defecations?limit=${limit}&page=${page}&search=${search}`),
  });
  console.log("openDefecations", openDefecations);
  return (
    <Box sx={{ p: 3, backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 0.5 }}>
            Open Defecation
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
          title="Total Observations"
          value="1,234"
          icon={<VisibilityIcon />}
          iconColor="#2196f3"
        />
        <StatsCard
          title="High Risk Areas"
          value="28"
          icon={<WarningIcon />}
          iconColor="#f44336"
        />
        <StatsCard
          title="Average Daily Cases"
          value="42"
          icon={<FaChartLine style={{ color: "#CA8A04" }} />}
          iconColor="#ff9800"
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {/* Geographic Distribution */}
        <Paper sx={{ flex: 1, p: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>Geographic Distribution</Typography>
            <Box>
              <IconButton size="small">
                <FullscreenIcon />
              </IconButton>
              <IconButton size="small">
                <InfoIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ height: 400, bgcolor: '#F8FAFC', borderRadius: 1, overflow: 'hidden' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d150598.46582809655!2d7.648291125907573!3d11.296615180519947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11b27fc3df7cf997%3A0x7f813ac2a29bec28!2sKudan%2C%20Kaduna!5e0!3m2!1sen!2sng!4v1735721268833!5m2!1sen!2sng"
              style={{
                border: 0,
                width: '100%',
                height: '100%',
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Box>
        </Paper>

      </Box>

      {/* Recent Observations Table */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Recent Observations</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search observations..."
              InputProps={{ startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} /> }}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              startIcon={<FaFilter />}
              sx={{
                color: '#1F2937',
                borderColor: '#E5E7EB',
                '&:hover': { bgcolor: '#F9FAFB' },
              }}
            >
              Filter
            </Button>
            <Button
              startIcon={<FaDownload />}
              sx={{
                color: '#1F2937',
                borderColor: '#E5E7EB',
                '&:hover': { bgcolor: '#F9FAFB' },
              }}
            >
              Export
            </Button>
          </Box>
        </Box>

        <DataTable 
          setSearch={setSearch}
          setPage={setPage}
          setLimit={setLimit}
          isLoading={isLoading}
          columns={columns}
          data={openDefecations || []}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 3,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing 1 to {limit} of {openDefecations?.length || 0} entries
          </Typography>
          <Pagination
            count={Math.ceil((openDefecations?.length || 0) / limit)}
            page={page}
            onChange={(_, value) => setPage(value)}
            sx={{
              '& .Mui-selected': {
                bgcolor: '#0EA5E9',
                color: '#FFFFFF',
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, iconColor }) => (
  <Card sx={{ flex: 1, p: 2, borderRadius: 2 }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
      <Box
        sx={{
          bgcolor: `${iconColor}15`,
          p: 1,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {React.cloneElement(icon, { sx: { color: iconColor } })}
      </Box>
    </Box>
  </Card>
);

export default OpenDefication;
