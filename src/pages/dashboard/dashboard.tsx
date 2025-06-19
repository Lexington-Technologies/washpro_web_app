import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  FaToilet,
  FaTrash,
  FaWater,
  FaHome,
  FaSchool,
  FaCity,
} from 'react-icons/fa';
import { FaHandHoldingDroplet, FaHeartPulse, FaPoop, FaUsers } from 'react-icons/fa6';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { apiController } from '../../axios';
import LocationFilter from '../../components/LocationFilter';
import { getLocationParams } from '../../utils/location-filter';
import { useEffect, useState } from 'react';

// Type definitions
interface CardItem {
  name: string;
  count: number;
}

interface DashboardData {
  washCards: CardItem[];
  facilityCards: CardItem[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
  }>;
}

// Utility function for color conversion
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Color palette for cards
const CARD_COLORS = {
  facility: [
    { color: '#1A56DB', bgColor: '#E8F2FF' },
    { color: '#7E3AF2', bgColor: '#F3EBFF' },
    { color: '#0E9F6E', bgColor: '#E0F5EF' },
    { color: '#E74694', bgColor: '#FBE9F4' },
    { color: '#F05D23', bgColor: '#FEF0E9' },
    { color: '#C81E1E', bgColor: '#FCE8E8' },
    { color: '#0694A2', bgColor: '#E0F5F6' },
  ],
  wash: [
    { color: '#1A56DB', bgColor: '#E8F2FF' },
    { color: '#3F83F8', bgColor: '#EBF3FF' },
    { color: '#6574CD', bgColor: '#EEF1FC' },
    { color: '#0694A2', bgColor: '#E0F5F6' },
  ],
};

// Color palette for charts to differentiate distribution
const CHART_COLORS = [
  '#1A56DB', '#10B981', '#F59E0B', '#EF4444', '#6366F1',
  '#EC4899', '#8B5CF6', '#22D3EE', '#F43F5E', '#84CC16',
];

const Dashboard = () => {
  // Get location filter values from context
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');
  const [washCards, setWashCards] = useState([]);
  const [facilityCards, setFacilityCards] = useState([])




  // Query using react-query with filter parameters passed to the backend.
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard', getLocationParams(ward, village, hamlet)],
    queryFn: () =>
      apiController.get(`/analytics/dashboard?${getLocationParams(ward, village, hamlet)}`),
  });

  // Use the data directly from the backend with default values
  // const {
  //   washCards = [],
  //   facilityCards = [],
  // } = data || {};

  useEffect(() => {
  
    setWashCards(data?.washCards || washCards)
    setFacilityCards(data?.facilityCards || facilityCards)
  }, [data])
  

  // Cards: facilities
  const facilityCardItems = [
    { 
      title: 'Total Water Sources', 
      value: facilityCards?.find((card: CardItem) => card.name === 'Total Water Sources')?.count || 0, 
      icon: <FaWater size={20} />, 
      ...CARD_COLORS.facility[0]
    },
    { 
      title: 'Total Toilet Facilities', 
      value: facilityCards?.find((card: CardItem) => card.name === 'Total Toilet Facilities')?.count || 0, 
      icon: <FaToilet size={20} />, 
      ...CARD_COLORS.facility[1]
    },
    { 
      title: 'Total Gutters', 
      value: facilityCards?.find((card: CardItem) => card.name === 'Total Gutters')?.count || 0, 
      icon: <FaWater size={20} />, 
      ...CARD_COLORS.facility[2]
    },
    { 
      title: 'Total Soakaways', 
      value: facilityCards?.find((card: CardItem) => card.name === 'Total Soakaways')?.count || 0, 
      icon: <FaWater size={20} />, 
      ...CARD_COLORS.facility[3]
    },
    { 
      title: 'Total Dumpsites', 
      value: facilityCards?.find((card: CardItem) => card.name === 'Total Dumpsites')?.count || 0, 
      icon: <FaTrash size={20} />, 
      ...CARD_COLORS.facility[4]
    },
    { 
      title: 'Total Open Defecation Sites', 
      value: facilityCards?.find((card: CardItem) => card.name === 'Total Open Defecation Sites')?.count || 0, 
      icon: <FaPoop size={20} />, 
      ...CARD_COLORS.facility[5]
    },
    { 
      title: 'Total Handwashing Facilities', 
      value: facilityCards?.find((card: CardItem) => card.name === 'Total Handwashing Facilities')?.count || 0, 
      icon: <FaHandHoldingDroplet size={20} />, 
      ...CARD_COLORS.facility[6]
    },
    { 
      title: 'Total Population', 
      value: 104150,
      icon: <FaUsers size={20} />,
      ...CARD_COLORS.facility[0]
    },
  ];

  // Cards: WASH facilities
  const washCardItems = [
    { 
      title: 'Total Households', 
      value: washCards?.find((card: CardItem) => card.name === 'Total Households')?.count || 0, 
      icon: <FaHome size={20} />, 
      ...CARD_COLORS.wash[0]
    },
    { 
      title: 'Total Schools', 
      value: washCards?.find((card: CardItem) => card.name === 'Total Schools')?.count || 0, 
      icon: <FaSchool size={20} />, 
      ...CARD_COLORS.wash[1]
    },
    { 
      title: 'Health Facilities', 
      value: washCards?.find((card: CardItem) => card.name === 'Health Facilities')?.count || 0, 
      icon: <FaHeartPulse size={20} />, 
      ...CARD_COLORS.wash[2]
    },
    { 
      title: 'Tsangaya', 
      value: washCards?.find((card: CardItem) => card.name === 'Tsangaya')?.count || 0, 
      icon: <FaCity size={20} />, 
      ...CARD_COLORS.wash[3]
    },
  ];

  // Custom Tooltip to display extra details on hover
  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ backgroundColor: 'white', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <Typography variant="body2">
            {`${payload[0].name}: ${payload[0].value}`}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ position: 'relative' }}>
          <Grid container spacing={3}>
            {/* Header and Filter Dropdowns */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 1 }}>
                  Dashboard
                  <Typography variant="subtitle1" color="text.secondary">
                    Overview of water, sanitation and hygiene facilities and population
                  </Typography>
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <LocationFilter ward={ward} village={village} hamlet={hamlet}
                  setWard={setWard} setVillage={setVillage} setHamlet={setHamlet}
                  />
                </Box>
              </Box>
              <Box sx={{ width: '100%' }}>
              {isLoading && <LinearProgress  />}
            </Box>
            </Grid>

            {/* Facilities Captured Section */}
            <Grid item xs={12}>
              <Typography variant="h5" component="h2" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 2 }}>
                Facilities Captured
              </Typography>
              <Card sx={{ backgroundColor: 'white', p: 2 }}>
                <Grid container spacing={2} sx={{ mb: 1 }}>
                  {facilityCardItems.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card
                        sx={{
                          height: '100%',
                          backgroundColor: card.bgColor,
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <CardContent
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '24px',
                          }}
                        >
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {card.title}
                            </Typography>
                            <Typography
                              variant="h4"
                              component="div"
                              sx={{ fontWeight: 800, color: card.color, letterSpacing: '-0.03em' }}
                            >
                              {card.value.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              backgroundColor: card.color,
                              borderRadius: '50%',
                              width: 48,
                              height: 48,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              boxShadow: `0 2px 4px ${hexToRgba(card.color, 0.2)}`,
                            }}
                          >
                            {card.icon}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>

            {/* WASH Facilities Overview */}
            <Grid item xs={12}>
              <Typography variant="h5" component="h2" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 2, mt: 2 }}>
                WASH Facilities Overview
              </Typography>
              <Card sx={{ backgroundColor: 'white', p: 2 }}>
                <Grid container spacing={2} sx={{ mb: 1}}>
                  {washCardItems.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card
                        sx={{
                          height: '100%',
                          backgroundColor: card.bgColor,
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <CardContent
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '24px',
                          }}
                        >
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {card.title}
                            </Typography>
                            <Typography
                              variant="h4"
                              component="div"
                              sx={{ fontWeight: 800, color: card.color, letterSpacing: '-0.03em' }}
                            >
                              {card.value.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              backgroundColor: card.color,
                              borderRadius: '50%',
                              width: 48,
                              height: 48,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              boxShadow: `0 2px 4px ${hexToRgba(card.color, 0.2)}`,
                            }}
                          >
                            {card.icon}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>

            {/* Analytics Distributions Section */}
            <Grid item xs={12}>
              <Typography variant="h5" component="h2" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 2, mt: 2 }}>
                Analytics Distributions
              </Typography>
              <Grid container spacing={4}>
                {/* 1. Disability Distribution as a Bar Chart */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <CardContent>
                      <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Disability Distribution
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { name: 'Female', count: 43701 },
                            { name: 'Male', count: 60449 },
                          ]} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" label={{ fill: '#000', fontSize: 12, position: 'top' }}>
                              <Cell fill={CHART_COLORS[0]} />
                              <Cell fill={CHART_COLORS[1]} />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* 2. Gender Distribution as a Pie Chart */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <CardContent>
                      <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Gender Distribution
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Female', count: 17340 },
                                { name: 'Male', count: 16660 },
                              ]}
                              dataKey="count"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              innerRadius={10}
                              label={({
                                cx,
                                cy,
                                midAngle,
                                innerRadius,
                                outerRadius,
                                percent
                              }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                return (
                                  <text
                                    x={x}
                                    y={y}
                                    fill="white"
                                    textAnchor={x > cx ? 'start' : 'end'}
                                    dominantBaseline="central"
                                  >
                                    {`${(percent * 100).toFixed(0)}%`}
                                  </text>
                                );
                              }}
                            >
                              <Cell fill={CHART_COLORS[0]} />
                              <Cell fill={CHART_COLORS[1]} />
                            </Pie>
                            <Tooltip
                              content={({ payload }) => (
                                <Card sx={{ p: 1, boxShadow: 3 }}>
                                  <Typography variant="body2">
                                    {payload?.[0]?.name}: {payload?.[0]?.value.toLocaleString()}
                                  </Typography>
                                </Card>
                              )}
                            />
                            <Legend 
                              wrapperStyle={{
                                paddingTop: '20px'
                              }}
                              formatter={(value) => (
                                <Typography variant="body2" color="textSecondary">
                                  {value}
                                </Typography>
                              )}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* 3. Ward Distribution as a Horizontal Bar Chart */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <CardContent>
                      <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Ward Distribution
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={[
                              { name: "DOKA", count: 847 },
                              { name: "S/GARI", count: 803 },
                              { name: "KUDAN", count: 766 },
                              { name: "TABA", count: 685 },
                              { name: "HUNKUYI", count: 558 },
                              { name: "ZABI", count: 547 },
                              { name: "LIKORO", count: 474 },
                              { name: "GARU", count: 248 },
                              { name: "K/WALI NORTH", count: 239 },
                              { name: "K/WALI SOUTH", count: 9 }
                            ]}
                            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis 
                              dataKey="name" 
                              type="category" 
                              tick={{ fontSize: 12 }} 
                              width={100} 
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar 
                              dataKey="count" 
                              label={({ x, y, width, index }) => (
                                <text
                                  x={x + width + 5}
                                  y={y + 10}
                                  fill="#000"
                                  fontSize={12}
                                  textAnchor="start"
                                >
                                  {[
                                    "DOKA", "S/GARI", "KUDAN", "TABA", "HUNKUYI", 
                                    "ZABI", "LIKORO", "GARU", "K/WALI NORTH", "K/WALI SOUTH"
                                  ][index]}
                                </text>
                              )}
                            >
                              {[
                                { name: "DOKA", count: 847 },
                                { name: "S/GARI", count: 803 },
                                { name: "KUDAN", count: 766 },
                                { name: "TABA", count: 685 },
                                { name: "HUNKUYI", count: 558 },
                                { name: "ZABI", count: 547 },
                                { name: "LIKORO", count: 474 },
                                { name: "GARU", count: 248 },
                                { name: "K/WALI NORTH", count: 239 },
                                { name: "K/WALI SOUTH", count: 9 }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;