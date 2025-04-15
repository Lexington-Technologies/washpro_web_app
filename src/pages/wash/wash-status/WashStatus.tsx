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

const WashStatus = () => {
  const [selectedOption, setSelectedOption] = useState('Households');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Data for community table
  const communityData = [
  ];

  const drinkingWaterData = [
    { name: 'Basic Service', value: 0, color: '#29B6F6' },
    { name: 'Limited Service', value: 0, color: '#ee8e00' },
    { name: 'None Service', value: 0, color: '#ef4444' },
  ];

  // Data for Sanitation Service Ladder
  const sanitationData = [
    { name: 'Advanced', value: 0, color: '#8CC265' },
    { name: 'Basic Service', value: 0, color: '#F2EB88' },
    { name: 'Limited Service', value: 0, color: '#F2B69E' },
    { name: 'No Services', value: 0, color: '#F5857F' },
  ];

  // Data for Hygiene Service Ladder
  const hygieneData = [
    { name: 'Basic Service', value: 0, color: '#29B6F6' },
    { name: 'Limited Service', value: 0, color: '#ee8e00' },
    { name: 'None Service', value: 0, color: '#ef4444' },
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
          fontSize: 25,
          marginTop: -2
              }}
            >
              <MenuItem value="Households">Households</MenuItem>
              <MenuItem value="School">School</MenuItem>
              <MenuItem value="Health Facilities">Health Facilities</MenuItem>
              <MenuItem value="Tsangaya">Tsangaya</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Comprehensive overview of water, sanitation and hygiene facilities
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <FilterDropdown label="Ward" options={['All']} />
            <FilterDropdown label="Village" options={['All']} />
            <FilterDropdown label="Hamlet" options={['All']} />
          </Stack>
        </Box>

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
                0%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Access Rate
              </Typography>
              
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Access</Typography>
                  <Typography variant="body2" fontWeight="bold">0</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={0} 
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
                  <Typography variant="body2" fontWeight="bold">0</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={0} 
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
                0%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Access Rate
              </Typography>
              
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Access</Typography>
                  <Typography variant="body2" fontWeight="bold">0</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={0} 
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
                  <Typography variant="body2" fontWeight="bold">0</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={0} 
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
                0%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Access Rate
              </Typography>
              
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Access</Typography>
                  <Typography variant="body2" fontWeight="bold">0</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={0} 
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
                  <Typography variant="body2" fontWeight="bold">0</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={0} 
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
                    <Tooltip formatter={(value) => value.toFixed(2)} />
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
                  <BarChart data={sanitationData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={false}
                      paddingAngle={2}
                    >
                      {hygieneData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value.toFixed(2)} />
                    <Legend 
                      layout="vertical" 
                      align="right" 
                      verticalAlign="middle" 
                      wrapperStyle={{ paddingLeft: '20px' }}
                      formatter={(value, entry, index) => (
                        <span style={{ color: '#000000' }}>{value}</span>
                      )}
                    />
                    <text x="30%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                      {""}
                    </text>
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
          School Basic WASH Access
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#1e3a8a' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>School Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Drinking Water</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Basic Sanitation</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Hygiene Facilities</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {communityData.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.households}</TableCell>
                  <TableCell>{row.drinkingWater}</TableCell>
                  <TableCell>{row.sanitation}</TableCell>
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