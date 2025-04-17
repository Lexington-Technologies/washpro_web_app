import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { FaTint, FaHandsWash } from 'react-icons/fa';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FaHandHoldingDroplet } from 'react-icons/fa6';
import { MdWaterDrop, MdOutlineSanitizer, MdSoap } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { apiController } from '../../../axios';
import { SelectChangeEvent } from '@mui/material';

// Add type definitions
interface WashAccessData {
  name: string;
  drinkingWater: string;
  basicSanitation: string;
  hygieneFacilities: string;
}

interface WashStatusData {
  waterAccess: {
    accessRate: number;
    basic: number;
    limited: number;
    noService: number;
    noOfAccess: number;
    noOfNoAccess: number;
  };
  sanitationAccess: {
    accessRate: number;
    basic: number;
    limited: number;
    noService: number;
    noOfAccess: number;
    noOfNoAccess: number;
  };
  hygieneAccess: {
    accessRate: number;
    basic: number;
    limited: number;
    noService: number;
    noOfAccess: number;
    noOfNoAccess: number;
  };
  waterServiceLadder: Array<{ name: string; value: number }>;
  sanitationServiceLadder: Array<{ name: string; value: number }>;
  hygieneServiceLadder: Array<{ name: string; value: number }>;
}

// Sample data for different space types
const sampleData: Record<string, WashAccessData[]> = {
  household: [
    { name: 'Auwal Maaruf', drinkingWater: 'Yes', basicSanitation: 'No', hygieneFacilities: 'Yes' },
    { name: 'Gidan babangida mai nika', drinkingWater: 'No', basicSanitation: 'Yes', hygieneFacilities: 'No' },
    { name: 'Murtala', drinkingWater: 'Yes', basicSanitation: 'Yes', hygieneFacilities: 'Yes' },
    { name: 'Gidan Musa', drinkingWater: 'No', basicSanitation: 'No', hygieneFacilities: 'No' },
    { name: 'Zangina', drinkingWater: 'Yes', basicSanitation: 'Yes', hygieneFacilities: 'No' },
  ],
  school: [
    { name: 'GDSSS HUNKUYI', drinkingWater: 'Yes', basicSanitation: 'No', hygieneFacilities: 'Yes' },
    { name: 'GDSSS K/WALI', drinkingWater: 'No', basicSanitation: 'Yes', hygieneFacilities: 'No' },
    { name: 'GDSSS KUDAN', drinkingWater: 'Yes', basicSanitation: 'No', hygieneFacilities: 'Yes' },
    { name: 'GDSSS TABA', drinkingWater: 'No', basicSanitation: 'Yes', hygieneFacilities: 'No' },
    { name: 'GDSSS ZANI', drinkingWater: 'No', basicSanitation: 'Yes', hygieneFacilities: 'No' },
  ],
  healthFacility: [
    { name: 'PHC HUNKUYI', drinkingWater: 'Yes', basicSanitation: 'No', hygieneFacilities: 'Yes' },
    { name: 'PHC KYAUDAI', drinkingWater: 'No', basicSanitation: 'Yes', hygieneFacilities: 'No' },
    { name: 'PHC ANG MALAM', drinkingWater: 'Yes', basicSanitation: 'No', hygieneFacilities: 'Yes' },
    { name: 'PHC KUDAN', drinkingWater: 'No', basicSanitation: 'Yes', hygieneFacilities: 'No' },
    { name: 'PHC TABA', drinkingWater: 'Yes', basicSanitation: 'No', hygieneFacilities: 'Yes' },
  ],
  tsangaya: [
    { name: 'Gidan Dikko mai allo', drinkingWater: 'Yes', basicSanitation: 'No', hygieneFacilities: 'Yes' },
    { name: 'Gidan Mallan ALiyu mai Almajirai', drinkingWater: 'No', basicSanitation: 'Yes', hygieneFacilities: 'No' },
    { name: 'Tsanagan Mal musa', drinkingWater: 'Yes', basicSanitation: 'No', hygieneFacilities: 'Yes' },
    { name: 'Gidan Baba hamisu', drinkingWater: 'No', basicSanitation: 'Yes', hygieneFacilities: 'No' },
    { name: 'Mallan Aliyu', drinkingWater: 'Yes', basicSanitation: 'No', hygieneFacilities: 'Yes' },
  ],
};

// Mock data for different facility types
const mockWashStatusData: Record<string, WashStatusData> = {
  household: {
    waterAccess: {
      accessRate: 35,
      basic: 35,
      limited: 30,
      noService: 35,
      noOfAccess: 1814, // 35% of 5182
      noOfNoAccess: 1814 // 35% of 5182
    },
    sanitationAccess: {
      accessRate: 75,
      basic: 75,
      limited: 20,
      noService: 5,
      noOfAccess: 3887, // 75% of 5182
      noOfNoAccess: 259 // 5% of 5182
    },
    hygieneAccess: {
      accessRate: 5,
      basic: 5,
      limited: 10,
      noService: 85,
      noOfAccess: 259, // 5% of 5182
      noOfNoAccess: 4405 // 85% of 5182
    },
    waterServiceLadder: [
      { name: 'Basic', value: 35 },
      { name: 'Limited', value: 30 },
      { name: 'No Service', value: 35 }
    ],
    sanitationServiceLadder: [
      { name: 'Basic', value: 75 },
      { name: 'Limited', value: 20 },
      { name: 'No Service', value: 5 }
    ],
    hygieneServiceLadder: [
      { name: 'Basic', value: 5 },
      { name: 'Limited', value: 10 },
      { name: 'No Service', value: 85 }
    ]
  },
  school: {
    waterAccess: {
      accessRate: 20,
      basic: 20,
      limited: 20,
      noService: 60,
      noOfAccess: 9, // 20% of 44
      noOfNoAccess: 26 // 60% of 44
    },
    sanitationAccess: {
      accessRate: 15,
      basic: 15,
      limited: 20,
      noService: 65,
      noOfAccess: 7, // 15% of 44
      noOfNoAccess: 29 // 65% of 44
    },
    hygieneAccess: {
      accessRate: 10,
      basic: 10,
      limited: 20,
      noService: 70,
      noOfAccess: 4, // 10% of 44
      noOfNoAccess: 31 // 70% of 44
    },
    waterServiceLadder: [
      { name: 'Basic', value: 8.6 },
      { name: 'Limited', value: 20 },
      { name: 'No Service', value: 60 }
    ],
    sanitationServiceLadder: [
      { name: 'Basic', value: 15 },
      { name: 'Limited', value: 20 },
      { name: 'No Service', value: 65 }
    ],
    hygieneServiceLadder: [
      { name: 'Basic', value: 10 },
      { name: 'Limited', value: 20 },
      { name: 'No Service', value: 70 }
    ]
  },
  healthFacility: {
    waterAccess: {
      accessRate: 50,
      basic: 50,
      limited: 30,
      noService: 20,
      noOfAccess: 14, // 50% of 27
      noOfNoAccess: 5 // 20% of 27
    },
    sanitationAccess: {
      accessRate: 50,
      basic: 50,
      limited: 40,
      noService: 10,
      noOfAccess: 14, // 50% of 27
      noOfNoAccess: 3 // 10% of 27
    },
    hygieneAccess: {
      accessRate: 60,
      basic: 60,
      limited: 35,
      noService: 5,
      noOfAccess: 16, // 60% of 27
      noOfNoAccess: 1 // 5% of 27
    },
    waterServiceLadder: [
      { name: 'Basic', value: 50 },
      { name: 'Limited', value: 30 },
      { name: 'No Service', value: 20 }
    ],
    sanitationServiceLadder: [
      { name: 'Basic', value: 50 },
      { name: 'Limited', value: 40 },
      { name: 'No Service', value: 10 }
    ],
    hygieneServiceLadder: [
      { name: 'Basic', value: 60 },
      { name: 'Limited', value: 35 },
      { name: 'No Service', value: 5 }
    ]
  },
  tsangaya: {
    waterAccess: {
      accessRate: 20,
      basic: 20,
      limited: 50,
      noService: 30,
      noOfAccess: 16, // 20% of 81
      noOfNoAccess: 24 // 30% of 81
    },
    sanitationAccess: {
      accessRate: 5,
      basic: 5,
      limited: 45,
      noService: 50,
      noOfAccess: 4, // 5% of 81
      noOfNoAccess: 41 // 50% of 81
    },
    hygieneAccess: {
      accessRate: 5,
      basic: 5,
      limited: 30,
      noService: 65,
      noOfAccess: 4, // 5% of 81
      noOfNoAccess: 53 // 65% of 81
    },
    waterServiceLadder: [
      { name: 'Basic', value: 20 },
      { name: 'Limited', value: 50 },
      { name: 'No Service', value: 30 }
    ],
    sanitationServiceLadder: [
      { name: 'Basic', value: 5 },
      { name: 'Limited', value: 45 },
      { name: 'No Service', value: 50 }
    ],
    hygieneServiceLadder: [
      { name: 'Basic', value: 5 },
      { name: 'Limited', value: 30 },
      { name: 'No Service', value: 65 }
    ]
  }
};

const WashStatus = () => {
  const [selectedOption, setSelectedOption] = useState<string>('household');

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedOption(event.target.value);
  };

  // Use mock data instead of API call
  const washStatusData = mockWashStatusData[selectedOption];

  // Get the appropriate data based on selected option
  const tableData = sampleData[selectedOption] || [];

  const drinkingWaterData = [
    { name: washStatusData?.waterServiceLadder[0].name, 
      value: washStatusData?.waterServiceLadder[0].value, 
      color: '#29B6F6' },
    { name: washStatusData?.waterServiceLadder[1].name, 
      value: washStatusData?.waterServiceLadder[1].value, 
      color: '#ee8e00' },
    { name: washStatusData?.waterServiceLadder[2].name, 
      value: washStatusData?.waterServiceLadder[2].value, 
      color: '#ef4444' },
  ];

  // Data for Sanitation Service Ladder
  const sanitationData = [
    { name: washStatusData?.sanitationServiceLadder[0].name,
      value: washStatusData?.sanitationServiceLadder[0].value,
      color: '#8CC265'
     },
    { name: washStatusData?.sanitationServiceLadder[1].name,
      value: washStatusData?.sanitationServiceLadder[1].value,
      color: '#F2EB88'
     },
    { name: washStatusData?.sanitationServiceLadder[2].name,
      value: washStatusData?.sanitationServiceLadder[2].value,
      color: '#F2B69E'
     },
  ];

  // Data for Hygiene Service Ladder
  const hygieneData = [
    { name: washStatusData?.hygieneServiceLadder[0].name,
      value: washStatusData?.hygieneServiceLadder[0].value,
      color: '#29B6F6'
     },
    { name: washStatusData?.hygieneServiceLadder[1].name,
      value: washStatusData?.hygieneServiceLadder[1].value,
      color: '#ee8e00'
     },
    { name: washStatusData?.hygieneServiceLadder[2].name, 
      value: washStatusData?.hygieneServiceLadder[2].value, 
      color: '#ef4444' 
     },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };

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
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: '#F1F1F5', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
      {/* header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap' }}>
        <Box>
          {/* Styled Dropdown for Title */}
          <FormControl variant="outlined" sx={{ minWidth: 200, mb: 0 }}>
            <InputLabel
              id="dropdown-label"
              sx={{
              color: '#25306B', // Placeholder color
              fontSize: 0, // Placeholder font size
              '&.Mui-focused': {
                color: '#1e3a8a', // Color when focused
              },
              }}
            >
              Select Option
            </InputLabel>
            <Select
              labelId="dropdown-label"
              id="dropdown"
              value={selectedOption}
              onChange={handleChange}
              label="Select Option"
              sx={{
                  backgroundColor: '#F1F1F5', // Background color
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#25306B', // Border color
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#25306B', // Border color on hover
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#25306B', // Border color when focused
                  },
                  fontWeight: 'bold', // Add font weight
                  color: '#1a237e', // Add text color
                  fontSize: 20,
                  marginTop: -2
                  }}
                >
              <MenuItem value="household">Households</MenuItem>
              <MenuItem value="school">School</MenuItem>
              <MenuItem value="healthFacility">Health Facilities</MenuItem>
              <MenuItem value="tsangaya">Tsangaya</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Comprehensive overview of water, sanitation and hygiene facilities
          </Typography>
        </Box>
        
        {/* <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <FilterDropdown label="Ward" options={['All']} />
            <FilterDropdown label="Village" options={['All']} />
            <FilterDropdown label="Hamlet" options={['All']} />
          </Stack>
        </Box> */}

        </Box>
        </Box>

      {/* Access Rate Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Drinking Water Access */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" component="div">
                  Basic Drinking Water
                </Typography>
                <Box sx={{ 
                  backgroundColor: '#f0f4fa', 
                  borderRadius: '50%', 
                  width: 40, 
                  height: 40, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#1e3a8a'
                }}>
                  <FaTint size={20} />
                </Box>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {washStatusData?.waterAccess?.accessRate} %
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Access Rate
              </Typography>
              
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Access</Typography>
                  <Typography variant="body2" fontWeight="bold">{washStatusData?.waterAccess?.noOfAccess}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={washStatusData?.waterAccess?.basic} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 1,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#1e3a8a',
                    }
                  }} 
                />
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">No Access</Typography>
                  <Typography variant="body2" fontWeight="bold">{washStatusData?.waterAccess?.noOfNoAccess}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={washStatusData?.waterAccess?.noService} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 1,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#f44336',
                    }
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sanitation Access */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" component="div">
                  Basic Sanitation
                </Typography>
                <Box sx={{ 
                  backgroundColor: '#f0f4fa', 
                  borderRadius: '50%', 
                  width: 40, 
                  height: 40, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#1e3a8a'
                }}>
                  <FaHandsWash size={20} />
                </Box>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {washStatusData?.sanitationAccess?.accessRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Access Rate
              </Typography>
              
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Access </Typography>
                  <Typography variant="body2" fontWeight="bold">{washStatusData?.sanitationAccess?.noOfAccess}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={washStatusData?.sanitationAccess?.basic} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 1,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#1e3a8a',
                    }
                  }} 
                />
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">No Access</Typography>
                  <Typography variant="body2" fontWeight="bold">{washStatusData?.sanitationAccess?.noOfNoAccess}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={washStatusData?.sanitationAccess?.noService} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 1,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#f44336',
                    }
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Hygiene Access */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" component="div">
                  Basic Hygiene
                </Typography>
                <Box sx={{ 
                  backgroundColor: '#f0f4fa', 
                  borderRadius: '50%', 
                  width: 40, 
                  height: 40, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#1e3a8a'
                }}>
                  <FaHandHoldingDroplet size={20} />
                </Box>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {washStatusData?.hygieneAccess?.accessRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Access Rate
              </Typography>
              
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Access</Typography>
                  <Typography variant="body2" fontWeight="bold">{washStatusData?.hygieneAccess?.noOfAccess}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={washStatusData?.hygieneAccess?.basic} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 1,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#1e3a8a',
                    }
                  }} 
                />
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">No Access</Typography>
                  <Typography variant="body2" fontWeight="bold">{washStatusData?.hygieneAccess?.noOfNoAccess}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={washStatusData?.hygieneAccess?.noService} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 1,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#f44336',
                    }
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Service Ladder Charts */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Drinking Water Service (JMP) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <MdWaterDrop style={{ marginRight: '8px', color: '#3373B4' }} />
                Drinking Water Service (JMP)
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={drinkingWaterData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {drinkingWaterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => value.toFixed(2)} />
                    <Legend 
                      layout="vertical" 
                      align="right" 
                      verticalAlign="middle" 
                      wrapperStyle={{ paddingLeft: '20px' }}
                      formatter={(value, entry, index) => (
                        <span style={{ color: '#000000' }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sanitation Service Ladder */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <MdOutlineSanitizer style={{ marginRight: '8px', color: '#4CBB78' }} />
                Sanitation Service Ladder (JMP)
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, marginLeft: -5 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={sanitationData} 
                    layout="vertical" 
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis 
                      type="number" 
                      domain={[0, 100]} 
                      tick={{ fontSize: 12, fill: '#000000' }} 
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={100} 
                      tick={{ fontSize: 12, fill: '#000000' }} 
                    />
                    <Tooltip />
                    <Bar dataKey="value" isAnimationActive={true}>
                      {sanitationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Hygiene Service Ladder (JMP) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <MdSoap style={{ marginRight: '8px', color: '#C3AAEB' }} />
                Hygiene Service Ladder (JMP)
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                      data={hygieneData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {hygieneData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => value.toFixed(2)} />
                    <Legend 
                      layout="vertical" 
                      align="right" 
                      verticalAlign="middle" 
                      wrapperStyle={{ paddingLeft: '20px' }}
                      formatter={(value, entry, index) => (
                        <span style={{ color: '#000000' }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Community Table */}
      <Box sx={{ mb: 4, backgroundColor: 'white', p: 2 }}>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)} Basic WASH Access
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#1e3a8a' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)} Name
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Drinking Water</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Basic Sanitation</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Hygiene Facilities</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>
                    <Typography 
                      sx={{ 
                        color: row.drinkingWater === 'Yes' ? '#4CAF50' : '#F44336',
                        fontWeight: 'bold'
                      }}
                    >
                      {row.drinkingWater}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      sx={{ 
                        color: row.basicSanitation === 'Yes' ? '#4CAF50' : '#F44336',
                        fontWeight: 'bold'
                      }}
                    >
                      {row.basicSanitation}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      sx={{ 
                        color: row.hygieneFacilities === 'Yes' ? '#4CAF50' : '#F44336',
                        fontWeight: 'bold'
                      }}
                    >
                      {row.hygieneFacilities}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default WashStatus;