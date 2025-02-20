import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaFilter, FaHandsWash, FaToilet } from 'react-icons/fa';
import { FaScrewdriverWrench } from 'react-icons/fa6';
import { apiController } from '../../axios';

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
  const [openDefications, setOpenDefications] = useState({});

  const { data } = useQuery<ToiletFacility[], Error>({
    queryKey: ['toilet-facilities'],
    queryFn: () => apiController.get<ToiletFacility[]>(`/toilet-facilities`),
  });

  const { data: openDefData } = useQuery({
    queryKey: ['open-defecations'],
    queryFn: () => apiController.get(`/open-defecations`),
  });

  useEffect(() => {
    if (data) {
      setToilets(data);
    }
  }, [data]);

  useEffect(() => {
    if (openDefData) {
      setOpenDefications(openDefData);
    }
  }, [openDefData]);

  const countByProperty = <T extends object>(
    data: T[] | undefined,
    property: keyof T,
    value: T[keyof T]
  ): number => {
    return data?.filter(item => item[property] !== undefined && item[property] === value).length || 0;
  };

  const countByProperties = <T extends object>(
    data: T[] | undefined,
    filters: Array<{ property: keyof T; value: T[keyof T] }>
  ): number => {
    if (!data) return 0;

    return data.filter(item =>
      filters.every(filter => item[filter.property] === filter.value)
    ).length;
  };

  const maitained = countByProperty(data, 'handWashingFacility', 'yes');
  const unMaintained = countByProperty(data, 'handWashingFacility', 'no');

  const totalStatus = maitained + unMaintained;

  const locationData = [
    {
      ward: 'S/GARI',
      status: 'Functional',
    },
    {
      ward: 'LIKORO',
      status: 'Functional',
    }
  ];

  const FilterDropdown = ({ label, options }) => {
    const [selectedOption, setSelectedOption] = useState('');
  
    const handleChange = (event) => {
      setSelectedOption(event.target.value);
    };
  
    return (
      <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 120 }}>
        <InputLabel>{label}</InputLabel>
        <Select value={selectedOption} onChange={handleChange} label={label} sx={{ height: 45 }}>
          {options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };  


  return (
    <Box sx={{ p: 3, backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600 }}>
            Sanitation
          </Typography>
          <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <FilterDropdown label="Ward" options={['All']} />
          <FilterDropdown label="Village" options={['All']} />
          <FilterDropdown label="Hamlet" options={['All']} />
        </Stack>
      </Box>
        </Box>

        {/* Stats Cards */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <StatsCard
            title="Total Toilets"
            value={data?.length || 0}
            icon={<FaToilet style={{ color: '#2196F3', fontSize: "20px" }} />}
          />
          <StatsCard
            title="Maintained Toilets"
            value={countByProperty(data, 'condition', 'Maintained')}
            icon={<FaScrewdriverWrench style={{ color: '#4CAF50',fontSize: "20px" }} />}
          />
          <StatsCard
            title="Handwashing Facilities"
            value={`${((maitained / totalStatus) * 100).toFixed(2)}%`}
            icon={<FaHandsWash style={{ color: '#9C27B0', fontSize: "20px" }} />}
          />
          <StatsCard
            title="Total Open Defecation"
            value={openDefications?.length}
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
                    <TableCell>Unimproved</TableCell>
                    <TableCell>Unmaitained</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locationData.map((row) => (
                    <TableRow key={row.ward}>
                      <TableCell>{row.ward}</TableCell>
                      <TableCell>{countByProperty(data, 'ward', row.ward)}</TableCell>
                      <TableCell>{
                        countByProperties(data, [
                          { property: 'ward', value: row.ward },
                          { property: 'status', value: 'Unimproved' },
                        ])
                      }</TableCell>
                      <TableCell>
                        {
                          countByProperties(data, [
                            { property: 'ward', value: row.ward },
                            { property: 'condition', value: 'Unmaintained' },
                          ])
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        {/* <Card>
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
        </Card> */}
      </Box>
    </Box>
  );
};

interface StatsCardProps {
  title: string;
  value: string| number | undefined;
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
