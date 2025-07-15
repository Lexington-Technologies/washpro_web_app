import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  Typography,
  styled,
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell as PieCell,
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
  waterAnalytics: {
    totalSources: number;
    functionalSources: number;
    nonFunctionalSources: number;
    sourceTypes: { name: string; count: number }[];
    functionalPercentage: number;
  };
  sanitationAnalytics: {
    toilets: {
      total: number;
      maintained: number;
      unmaintained: number;
      types: { name: string; count: number }[];
      maintainedPercentage: number;
    };
    gutters: {
      total: number;
      maintained: number;
      unmaintained: number;
      maintainedPercentage: number;
    };
    soakAways: {
      total: number;
      conditions: { name: string; count: number }[];
    };
    dumpSites: {
      total: number;
      fencingStatus: { name: string; count: number }[];
    };
    openDefecation: {
      total: number;
    };
  };
  hygieneAnalytics: {
    handwashing: {
      total: number;
    };
    householdHygiene: unknown[];
  };
  populationAnalytics: {
    totalPopulation: number;
    genderDistribution: { name: string; count: number }[];
    disabilityData: { name: string; count: number }[];
    children: number;
    monthlyPopulation: { month: string; value: number }[];
    hamletDistributionByWard: { name: string; count: number }[];
  };
  locationAnalytics: {
    wardDistribution: { name: string; count: number }[];
    villageDistribution: { name: string; count: number }[];
    hamletDistribution: { name: string; count: number }[];
  };
  filterOptions: Record<string, string[]>;
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

// FixedHeader styled component (copied from WaterSources)
const FixedHeader = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: -9,
  zIndex: 100,
  backgroundColor: '#F1F1F5',
  padding: theme.spacing(2, 0),
  marginBottom: theme.spacing(2),
}));

const Dashboard = () => {
  // Get location filter values from context
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');
  const [washCards, setWashCards] = useState<CardItem[]>([]);
  const [facilityCards, setFacilityCards] = useState<CardItem[]>([]);




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
      value: (facilityCards as CardItem[]).find((card) => card.name === 'Total Water Sources')?.count || 0, 
      icon: <FaWater size={20} />, 
      ...CARD_COLORS.facility[0]
    },
    { 
      title: 'Total Toilet Facilities', 
      value: (facilityCards as CardItem[]).find((card) => card.name === 'Total Toilet Facilities')?.count || 0, 
      icon: <FaToilet size={20} />, 
      ...CARD_COLORS.facility[1]
    },
    { 
      title: 'Total Gutters', 
      value: (facilityCards as CardItem[]).find((card) => card.name === 'Total Gutters')?.count || 0, 
      icon: <FaWater size={20} />, 
      ...CARD_COLORS.facility[2]
    },
    { 
      title: 'Total Soakaways', 
      value: (facilityCards as CardItem[]).find((card) => card.name === 'Total Soakaways')?.count || 0, 
      icon: <FaWater size={20} />, 
      ...CARD_COLORS.facility[3]
    },
    { 
      title: 'Total Dumpsites', 
      value: (facilityCards as CardItem[]).find((card) => card.name === 'Total Dumpsites')?.count || 0, 
      icon: <FaTrash size={20} />, 
      ...CARD_COLORS.facility[4]
    },
    { 
      title: 'Total Open Defecation Sites', 
      value: (facilityCards as CardItem[]).find((card) => card.name === 'Total Open Defecation Sites')?.count || 0, 
      icon: <FaPoop size={20} />, 
      ...CARD_COLORS.facility[5]
    },
    { 
      title: 'Total Handwashing Facilities', 
      value: (facilityCards as CardItem[]).find((card) => card.name === 'Total Handwashing Facilities')?.count || 0, 
      icon: <FaHandHoldingDroplet size={20} />, 
      ...CARD_COLORS.facility[6]
    },
    { 
      title: 'Total Population', 
      value: data?.populationAnalytics?.totalPopulation || 0,
      icon: <FaUsers size={20} />,
      ...CARD_COLORS.facility[0]
    },
  ];

  // Cards: WASH facilities
  const washCardItems = [
    { 
      title: 'Total Households', 
      value: (washCards as CardItem[]).find((card) => card.name === 'Total Households')?.count || 0, 
      icon: <FaHome size={20} />, 
      ...CARD_COLORS.wash[0]
    },
    { 
      title: 'Total Schools', 
      value: (washCards as CardItem[]).find((card) => card.name === 'Total Schools')?.count || 0, 
      icon: <FaSchool size={20} />, 
      ...CARD_COLORS.wash[1]
    },
    { 
      title: 'Health Facilities', 
      value: (washCards as CardItem[]).find((card) => card.name === 'Health Facilities')?.count || 0, 
      icon: <FaHeartPulse size={20} />, 
      ...CARD_COLORS.wash[2]
    },
    { 
      title: 'Tsangaya', 
      value: (washCards as CardItem[]).find((card) => card.name === 'Tsangaya')?.count || 0, 
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

  // Store last non-empty data for analytics charts to prevent disappearance on filter
  const [lastDisabilityData, setLastDisabilityData] = useState<{ name: string; count: number }[]>([]);
  const [lastVillageDistribution, setLastVillageDistribution] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    if (data?.populationAnalytics?.disabilityData && data.populationAnalytics.disabilityData.length > 0) {
      setLastDisabilityData(data.populationAnalytics.disabilityData);
    }
    if (data?.locationAnalytics?.villageDistribution && data.locationAnalytics.villageDistribution.length > 0) {
      setLastVillageDistribution(data.locationAnalytics.villageDistribution);
    }
  }, [data]);

  const safeDisabilityData = (data?.populationAnalytics?.disabilityData && data.populationAnalytics.disabilityData.length > 0)
    ? data.populationAnalytics.disabilityData
    : lastDisabilityData;
  const safeVillageDistribution = (data?.locationAnalytics?.villageDistribution && data.locationAnalytics.villageDistribution.length > 0)
    ? data.locationAnalytics.villageDistribution
    : lastVillageDistribution;

  return (
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: '#F1F1F5', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ position: 'relative' }}>
          {/* FixedHeader for sticky dashboard header and filter */}
          <FixedHeader>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" component="h1" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 0 }}>
                      Dashboard
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Overview of water, sanitation and hygiene facilities and population
                    </Typography>
                  </Box>
                  <Box>
                    <LocationFilter ward={ward} village={village} hamlet={hamlet}
                      setWard={setWard} setVillage={setVillage} setHamlet={setHamlet}
                    />
                  </Box>
                </Box>
                <Box sx={{ width: '100%', mt: 2 }}>
                  {isLoading && <LinearProgress />}
                </Box>
              </Grid>
            </Grid>
          </FixedHeader>

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

            {/* Analytics Distributions: Total Population by Ward, Disability Distribution, Communities Captured */}
              <Typography variant="h5" component="h2" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 2, mt: 2 }}>
                  Population Analytics
              </Typography>

            <Grid container spacing={4}>
              {/* Total Population by Ward Chart (summary card) */}
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Total Population by Ward
                    </Typography>
                    <Typography variant="h2" component="div" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                      {data?.populationAnalytics?.totalPopulation?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Updated yesterday
                    </Typography>
                    <Box sx={{ height: 120 }}>
                      <ResponsiveContainer width="100%" height="120%">
                        <BarChart
                          data={Array.isArray(data?.locationAnalytics?.wardDistribution)
                            ? (data.locationAnalytics.wardDistribution as { name: string; count: number }[]).map((w: { name: string; count: number }) => ({ name: w.name, value: w.count }))
                            : []}
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis hide />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="value" barSize={24} radius={[4, 4, 0, 0]} fill="#475569" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              {/* Disability Distribution Chart (replaced with summary card) */}
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Persons with Disabilities
                    </Typography>
                    {(() => {
                      // Try to extract female/male/total from safeDisabilityData
                      let female = 0, male = 0, total = 0;
                      if (safeDisabilityData && safeDisabilityData.length > 0) {
                        for (const d of safeDisabilityData) {
                          if (d.name.toLowerCase().includes('female')) female = d.count;
                          if (d.name.toLowerCase().includes('male')) male = d.count;
                        }
                        total = safeDisabilityData.reduce((acc, d) => acc + (d.count || 0), 0);
                      } else {
                        // fallback static
                        female = 2345; male = 1873; total = 4218;
                      }
                      const donutData = [
                        { name: 'Female', value: female },
                        { name: 'Male', value: male },
                      ];
                      const donutColors = ['#232e5c', '#19c3f3'];
                      return (
                        <>
                          <Typography variant="h2" component="div" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                            {total.toLocaleString()}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Box sx={{ textAlign: 'left' }}>
                              <Typography variant="body2" color="text.secondary">Female</Typography>
                              <Typography variant="h6" sx={{ color: '#232e5c', fontWeight: 700 }}>{female.toLocaleString()}</Typography>
                            </Box>
                            <Box sx={{ width: 160, height: 160, position: 'relative' }}>
                              <PieChart width={160} height={160}>
                                <Pie
                                  data={donutData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={55}
                                  outerRadius={75}
                                  startAngle={90}
                                  endAngle={-270}
                                  dataKey="value"
                                >
                                  {donutData.map((entry, idx) => (
                                    <PieCell key={`cell-${idx}`} fill={donutColors[idx % donutColors.length]} />
                                  ))}
                                </Pie>
                              </PieChart>
                              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                                <Typography variant="body2" color="text.secondary">Total</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>{total.toLocaleString()}</Typography>
                              </Box>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="body2" color="text.secondary">Male</Typography>
                              <Typography variant="h6" sx={{ color: '#19c3f3', fontWeight: 700 }}>{male.toLocaleString()}</Typography>
                            </Box>
                          </Box>
                          {/* Append all disabilityData breakdown below donut */}
                          {safeDisabilityData && safeDisabilityData.length > 2 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Breakdown</Typography>
                              {safeDisabilityData.map((d) => (
                                <Box key={d.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="body2" color="text.secondary">{d.name}</Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{d.count.toLocaleString()}</Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              </Grid>
              {/* Communities Captured Chart (replaced with summary card) */}
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Communities Captured
                    </Typography>
                    <Typography variant="h2" component="div" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                      {(
                        (data?.populationAnalytics?.hamletDistributionByWard && data.populationAnalytics.hamletDistributionByWard.length > 0)
                          ? data.populationAnalytics.hamletDistributionByWard.reduce((acc, curr) => acc + (curr.count || 0), 0)
                          : safeVillageDistribution.reduce((acc, curr) => acc + (curr.count || 0), 0)
                      ).toLocaleString() || '—'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Updated yesterday
                    </Typography>
                    <Box sx={{ height: 120 }}>
                      <ResponsiveContainer width="100%" height="120%">
                        <BarChart
                          data={
                            (data?.populationAnalytics?.hamletDistributionByWard && data.populationAnalytics.hamletDistributionByWard.length > 0)
                              ? data.populationAnalytics.hamletDistributionByWard.map(v => ({ name: v.name, value: v.count }))
                              : safeVillageDistribution.length > 0
                                ? safeVillageDistribution.map(v => ({ name: v.name, value: v.count }))
                                : [
                                  { name: 'Hunkuyi S/Gari', value: 60 },
                                  { name: 'Zabi', value: 30 },
                                  { name: 'Garu', value: 15 },
                                  { name: 'Likoro', value: 75 },
                                  { name: 'Kudan', value: 90 },
                                  { name: 'Taba', value: 90 },
                                  { name: 'Doka', value: 40 },
                                ]
                          }
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis hide domain={[0, 100]} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="value" barSize={24} radius={[4, 4, 0, 0]} fill="#475569" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
        </Box>
    </Box>
  </Container>
    );
};

export default Dashboard;