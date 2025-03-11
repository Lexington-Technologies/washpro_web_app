import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import {
  FaToilet,
  FaTrash,
  FaWater,
  FaHome,
  FaSchool,
  FaCity
} from 'react-icons/fa';
import { FaHandHoldingDroplet, FaHeartPulse, FaPoop } from 'react-icons/fa6';
import { GiHazardSign } from 'react-icons/gi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Sample data for charts
  const populationData = [
    { name: 'Jan', value: 55 },
    { name: 'Feb', value: 35 },
    { name: 'Mar', value: 15 },
    { name: 'Apr', value: 75 },
    { name: 'May', value: 35 },
    { name: 'Jun', value: 85 },
    { name: 'Jul', value: 80 },
    { name: 'Aug', value: 45 },
  ];

  const communitiesData = [
    { name: 'Hunkuyi', value: 55 },
    { name: 'S/Gari', value: 35 },
    { name: 'Zabi', value: 15 },
    { name: 'Garu', value: 75 },
    { name: 'Likoro', value: 35 },
    { name: 'Kudan', value: 85 },
    { name: 'Taba', value: 80 },
    { name: 'Doka', value: 45 },
  ];

  const disabilityData = [
    { name: 'Female', value: 2345, color: '#1e3a8a' },
    { name: 'Male', value: 1873, color: '#38bdf8' },
  ];

  const COLORS = ['#1e3a8a', '#38bdf8'];

  // Facility card data
  const facilityCards = [
    { title: 'Total Toilets', value: 62, icon: <FaToilet size={20} /> },
    { title: 'Total Open Defecation', value: 62, icon: <FaPoop size={20} /> },
    { title: 'Total Dumpsites', value: 9, icon: <FaTrash size={20} /> },
    { title: 'Total Soakaways', value: 4, icon: <FaWater size={20} /> },
    { title: 'Total Gutters', value: 4, icon: <FaWater size={20} /> },
    { title: 'Total Hygiene Facilities', value: 4, icon: <FaHandHoldingDroplet size={20} /> },
    { title: 'Total Water Source', value: 4, icon: <FaWater size={20} /> },
    { title: 'Alerts', value: 4, icon: <GiHazardSign size={20} /> },
  ];

  // WASH facility card data
  const washCards = [
    { title: 'Total Households', value: 62, icon: <FaHome size={20} /> },
    { title: 'Total Wash In School', value: 62, icon: <FaSchool size={20} /> },
    { title: 'Wash In Health Facilities', value: 9, icon: <FaHeartPulse size={20} /> },
    { title: 'Tsangaya', value: 4, icon: <FaCity size={20} /> },
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
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 1 }}>
          Dashboard
          <Typography variant="subtitle1" color="text.secondary">
          Overview of water, sanitation and hygiene facilities and population
        </Typography>

        </Typography>
    
          <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <FilterDropdown label="Ward" options={['All']} />
          <FilterDropdown label="Village" options={['All']} />
          <FilterDropdown label="Hamlet" options={['All']} />
        </Stack>
      </Box>
        </Box>

      {/* Facilities Captured Section */}
      <Typography variant="h5" component="h2" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 2 }}>
        Facilities Captured
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {facilityCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {card.value}
                  </Typography>
                </Box>
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
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* WASH Facilities Overview */}
      <Typography variant="h5" component="h2" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 2 }}>
        WASH Facilities Overview
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {washCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {card.value}
                  </Typography>
                </Box>
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
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Population distribution */}
      <Typography variant="h5" component="h2" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 2 }}>
        Population distribution
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
                Total Population
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                128,247
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Updated yesterday
              </Typography>
              <Box sx={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={populationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={true} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} ticks={[0, 50, 100]} />
                    <Bar dataKey="value" fill="#1e3a8a" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
                Persons with Disabilities
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                4,218
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Female
                  </Typography>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
                    2,345
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" align="right">
                    Male
                  </Typography>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#38bdf8', textAlign: 'right' }}>
                    1,873
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ height: 180, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ResponsiveContainer width="80%" height="100%">
                  <PieChart>
                    <Pie
                      data={disabilityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {disabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                      <tspan x="50%" dy="-10" fontSize="12" textAnchor="middle">Total</tspan>
                      <tspan x="50%" dy="25" fontSize="18" fontWeight="bold" textAnchor="middle">4,218</tspan>
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
                Communities Captured
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                128,247
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Updated yesterday
              </Typography>
              <Box sx={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={communitiesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={true} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} ticks={[0, 50, 100]} />
                    <Bar dataKey="value" fill="#1e3a8a" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;