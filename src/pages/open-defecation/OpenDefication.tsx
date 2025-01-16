import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
  CircularProgress,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningIcon from '@mui/icons-material/Warning';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import InfoIcon from '@mui/icons-material/Info';
import { FaChartLine, FaDownload, FaFilter } from 'react-icons/fa';
import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from '@tanstack/react-table';
import axios from 'axios';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const timeDistributionData = [
  {
    name: 'Count',
    'Motorized Boreholes': 25,
    'Wells (Covered & Open)': 60,
    'Surface Water Points': 35,
  },
  {
    name: 'Percentage',
    'Motorized Boreholes': 80,
    'Wells (Covered & Open)': 25,
    'Surface Water Points': 15,
  },
];

interface Observation {
  id: string;
  location: string;
  date: string;
  demographics: string;
  riskLevel: 'high' | 'medium' | 'low';
}

const OpenDefication = () => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchObservations = async () => {
      setIsLoading(true);
      try {
        const data = await axios.get<{ data: Observation[] }>('/open-defecations');
        setObservations(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchObservations();
  }, []);

  // Define columns for the table
  const columns: ColumnDef<Observation>[] = [
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'demographics', header: 'Demographics' },
    {
      accessorKey: 'riskLevel',
      header: 'Risk Level',
      cell: (info) => {
        const riskLevel = info.getValue() as 'high' | 'medium' | 'low';
        const getRiskColor = (level: 'high' | 'medium' | 'low') => {
          switch (level) {
            case 'high':
              return '#f44336';
            case 'medium':
              return '#ff9800';
            case 'low':
              return '#4caf50';
            default:
              return '#757575';
          }
        };
        return (
          <Box
            sx={{
              display: 'inline-block',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              bgcolor: `${getRiskColor(riskLevel)}15`,
              color: getRiskColor(riskLevel),
              fontWeight: 500,
            }}
          >
            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
          </Box>
        );
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: () => (
        <IconButton size="small">
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  // Table instance
  const table = useReactTable({
    data: observations,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 0.5 }}>
            Open Defecation Observation
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

        {/* Time Distribution */}
        <Paper sx={{ flex: 1, p: 2, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 5 }}>Time Distribution</Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeDistributionData}>
                <CartesianGrid strokeDasharray="10 10" />
                <XAxis dataKey="name" />
                <YAxis />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    textAlign: 'center',
                  }}
                />
                <Bar dataKey="Motorized Boreholes" fill="#8884d8" />
                <Bar dataKey="Wells (Covered & Open)" fill="#82ca9d" />
                <Bar dataKey="Surface Water Points" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>

      {/* Recent Observations Table */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Recent Observations</Typography>
          <Box>
            <Button startIcon={<FaFilter style={{color:"#1F2937"}}/>} sx={{ mr: 1 }}>
              <Typography variant="body1" color="#1F2937">Filter</Typography>
            </Button>
            <Button startIcon={<FaDownload style={{color: "#1F2937"}} />}>
              <Typography variant="body1" color="#1F2937">Export</Typography>
            </Button>
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No observations found
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {table.getRowModel().rows.length} of {observations.length} entries
          </Typography>
          <Pagination count={Math.ceil(observations.length / 10)} shape="rounded" />
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