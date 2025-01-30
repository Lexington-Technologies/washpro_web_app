import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaFileDownload, FaFilter, FaHandsWash, FaPlus, FaToilet } from 'react-icons/fa';
import { FaScrewdriverWrench } from 'react-icons/fa6';
import { apiController } from '../../axios';

interface ToiletFacility {
  geolocation: {
    type: string;
    coordinates: [number, number, number];
  };
  publicSpace: string;
  _id: string;
  picture: string;
  ward: string;
  village: string;
  hamlet: string;
  space: string;
  compactments: number;
  dependent: number;
  condition: string;
  status: string;
  type: string;
  safetyRisk: string[];
  handWashingFacility: string;
  daysSinceLastEvacuation: number;
  evacuationFrequency: string;
  createdBy: string;
  capturedAt: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

const Sanitation: React.FC = () => {
  const [toilets, setToilets] = useState({});

  const { data } = useQuery<ToiletFacility[], Error>({
    queryKey: ['toilet-facilities'],
    queryFn: () => apiController.get<ToiletFacility[]>(`/toilet-facilities`),
  });

  useEffect(() => {
    if (data) {
      setToilets(data)
    }
  }, [data]);

  const countByProperty = <T extends object>(
    data: T[] | undefined,
    property: keyof T,
    value: T[keyof T]
  ): number => {
    return data?.filter(item => item[property] !== undefined && item[property] === value).length || 0;
  };

  const locationData = [
    {
      location: 'North Ward',
      totalFacilities: 245,
      functional: 198,
      status: 'Good',
    },
    {
      location: 'South Ward',
      totalFacilities: 189,
      functional: 145,
      status: 'Needs Attention',
    },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600 }}>
            Sanitation
          </Typography>
          <Button
            startIcon={<FaFilter />}
            variant="contained"
            sx={{
              bgcolor: 'white',
              color: 'text.primary',
              boxShadow: 1,
              '&:hover': { bgcolor: '#E5E7EB' },
              textTransform: 'none',
            }}
          >
            Filter
          </Button>
        </Box>

        {/* Stats Cards */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <StatsCard
            title="Total Toilets"
            value={data?.length}
            icon={<FaToilet style={{ color: '#2196F3', fontSize: "20px" }} />}
          />
          <StatsCard
            title="Maintained Toilets"
            value={countByProperty(data, 'condition', 'Maintained')}
            icon={<FaScrewdriverWrench style={{ color: '#4CAF50',fontSize: "20px" }} />}
          />
          <StatsCard
            title="Handwashing Facilities"
            value="78%"
            icon={<FaHandsWash style={{ color: '#9C27B0', fontSize: "20px" }} />}
          />
          <StatsCard
            title="Open Defecation Status"
            value="12%"
            icon={<FaExclamationTriangle style={{ color: '#f44336',fontSize: "20px" }} />}
          />
        </Stack>
        {/* Location Table */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Location-wise Sanitation Data
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Location</TableCell>
                    <TableCell>Total Facilities</TableCell>
                    <TableCell>Functional</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locationData.map((row) => (
                    <TableRow key={row.location}>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.totalFacilities}</TableCell>
                      <TableCell>{row.functional}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: row.status === 'Good' ? '#DCFCE7' : '#FEF9C3',
                            color: row.status === 'Good' ? '#166534' : '#854D0E',
                          }}
                        >
                          {row.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Critical Alerts</Typography>
              <Box>
                <Button startIcon={<FaFileDownload />} variant="contained" sx={{ mr: 1, bgcolor: "#2CBEEF" }}>
                  Download Report
                </Button>
                <Button startIcon={<FaPlus />} variant="contained" sx={{ mr: 1, bgcolor: "#16A34A" }}>
                  Propose Maintenance
                </Button>
              </Box>
            </Box>
            <Alert
              severity="error"
              icon={<FaExclamationTriangle  style={{ color: '#f44336', fontSize: '24px' }} />} // Font Awesome Exclamation Icon
              sx={{
                display: 'flex',
                alignItems: 'center',
                '.MuiAlert-message': {
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                },
              }}
            >
              <span>East Ward Facility #23 needs urgent repair</span>
              <Box
                sx={{
                  bgcolor: '#FEF2F2',
                  color: 'error.dark',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                High Priority
              </Box>
            </Alert>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => (
  <Card sx={{ flex: 1 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        {icon}
      </Box>
    </CardContent>
  </Card>
);

export default Sanitation;
