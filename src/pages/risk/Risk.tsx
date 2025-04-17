import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader,
  Typography, 
  Grid, 
  Paper, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Stack,
  ToggleButtonGroup, 
  ToggleButton,
  Fade
} from '@mui/material';
import { 
  MdLocationOn, 
  MdWarning, 
  MdWaterDrop, 
  MdCheckCircle,
} from 'react-icons/md';
import { Map } from 'lucide-react';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WcIcon from '@mui/icons-material/Wc';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import WashIcon from '@mui/icons-material/Soap';
import RouteIcon from '@mui/icons-material/Route';
import WarningIcon from '@mui/icons-material/Warning';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import BugReportIcon from '@mui/icons-material/BugReport';
import SevereColdIcon from '@mui/icons-material/SevereCold';
import PublicIcon from '@mui/icons-material/Public';
import ScienceIcon from '@mui/icons-material/Science';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import DangerousIcon from '@mui/icons-material/Dangerous';

// Type Definitions
interface FilterDropdownProps {
  label: string;
  options: string[];
}

interface KPICard {
  icon: JSX.Element;
  label: string;
  value: string;
  color: string;
}

interface WaterSource {
  type: string;
  distance: string;
  riskLevel: 'high' | 'moderate' | 'low';
  additionalInfo?: string;
}

interface EnvironmentalRisk {
  type: string;
  description: string;
  riskLevel: 'high' | 'moderate' | 'low';
}

interface WasteManagement {
  type: string;
  description: string;
  riskLevel: 'high' | 'moderate' | 'low';
}

// Mock data for chart
// const chartData = {
//   labels: [
//     'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
//   ],
//   values1: [12, 20, 38, 47, 50, 65, 80, 70, 60, 48, 30, 18], // Cholera (example)
//   values2: [8, 15, 22, 30, 35, 45, 55, 50, 43, 30, 20, 10],  // Typhoid (example)
// };

const diseaseData = {
  Cholera: {
    riskLevel: 'High',
    stats: [
      { icon: <WaterDropIcon sx={{ fontSize: 40, color: '#2196f3' }} />, title: '1200', subtitle: 'Unimproved Water Sources', color: '#e3f2fd' },
      { icon: <WashIcon sx={{ fontSize: 40, color: '#009688' }} />, title: '133', subtitle: 'Open Defecation', color: '#e0f2f1' },
      { icon: <WcIcon sx={{ fontSize: 40, color: '#f44336' }} />, title: '400', subtitle: 'Lack of Sanitation Facilities', color: '#ffebee' },
    ],
    riskStats: [
      { icon: <PriorityHighIcon sx={{ fontSize: 40, color: '#d32f2f' }} />, title: '45%', subtitle: 'High Risk Areas', color: '#e3f2fd' },
      { icon: <WarningAmberIcon sx={{ fontSize: 40, color: '#fbc02d' }} />, title: '30%', subtitle: 'Low Risk Areas', color: '#fffde7' },
      { icon: <DangerousIcon sx={{ fontSize: 40, color: '#e53935' }} />, title: '15%', subtitle: 'Medium Risk Areas', color: '#e8f5e9' },
    ]
  },

  Malaria: {
    riskLevel: 'High',
    stats: [
      { icon: <LocalDrinkIcon sx={{ fontSize: 40, color: '#ff9800' }} />, title: '800', subtitle: 'Gutters near Water', color: '#fff3e0' },
      { icon: <BugReportIcon sx={{ fontSize: 40, color: '#4caf50' }} />, title: '1500', subtitle: 'Mosquito Breeding Sites', color: '#e8f5e9' },
      { icon: <PublicIcon sx={{ fontSize: 40, color: '#3f51b5' }} />, title: '65%', subtitle: 'Humidity-prone Areas', color: '#e8eaf6' },
    ],
    riskStats: [
      { icon: <WarningAmberIcon sx={{ fontSize: 40, color: '#fbc02d' }} />, title: '40%', subtitle: 'High Risk Areas', color: '#e3f2fd' },
      { icon: <PriorityHighIcon sx={{ fontSize: 40, color: '#d32f2f' }} />, title: '20%', subtitle: 'Low Risk Areas', color: '#ffebee' },
      { icon: <HealthAndSafetyIcon sx={{ fontSize: 40, color: '#00897b' }} />, title: '50%', subtitle: 'Medium Risk Areas', color: '#e8f5e9' },
    ]
  },

  Typhoid: {
    riskLevel: 'Medium',
    stats: [
      { icon: <WaterDropIcon sx={{ fontSize: 40, color: '#64b5f6' }} />, title: '700', subtitle: 'Contaminated Water Use', color: '#e3f2fd' },
      { icon: <WashIcon sx={{ fontSize: 40, color: '#009688' }} />, title: '70%', subtitle: 'Lack of Soap Access', color: '#e0f2f1' },
      { icon: <PublicIcon sx={{ fontSize: 40, color: '#3f51b5' }} />, title: '850', subtitle: 'Gutters near Water', color: '#e8eaf6' },
    ],
    riskStats: [
      { icon: <PriorityHighIcon sx={{ fontSize: 40, color: '#d32f2f' }} />, title: '30%', subtitle: 'High Risk Areas', color: '#e3f2fd' },
      { icon: <WarningAmberIcon sx={{ fontSize: 40, color: '#fbc02d' }} />, title: '18%', subtitle: 'Low Risk Areas', color: '#ffebee' },
      { icon: <CheckCircleOutlineIcon sx={{ fontSize: 40, color: '#388e3c' }} />, title: '52%', subtitle: 'Medium Risk Areas', color: '#e8f5e9' },
    ]
  },

  Polio: {
    riskLevel: 'Low',
    stats: [
      { icon: <ScienceIcon sx={{ fontSize: 40, color: '#7b1fa2' }} />, title: '30:1', subtitle: 'Household Toilet Ratio', color: '#f3e5f5' },
      { icon: <WcIcon sx={{ fontSize: 40, color: '#f44336' }} />, title: '133', subtitle: 'Open Defecation Sites', color: '#ffebee' },
      { icon: <LocalDrinkIcon sx={{ fontSize: 40, color: '#ff9800' }} />, title: '800', subtitle: 'Dumpsite Contamination Incidents', color: '#fff3e0' },
    ],
    riskStats: [
      { icon: <CheckCircleOutlineIcon sx={{ fontSize: 40, color: '#388e3c' }} />, title: '85%', subtitle: 'High Risk Areas', color: '#e3f2fd' },
      { icon: <HealthAndSafetyIcon sx={{ fontSize: 40, color: '#00897b' }} />, title: '12%', subtitle: 'Low Risk Areas', color: '#ffebee' },
      { icon: <PriorityHighIcon sx={{ fontSize: 40, color: '#d32f2f' }} />, title: '3%', subtitle: 'Medium Risk Areas', color: '#e8f5e9' },
    ]
  },

  Dysentry: {
    riskLevel: 'High',
    stats: [
      { icon: <WcIcon sx={{ fontSize: 40, color: '#f44336' }} />, title: '600', subtitle: 'No Access to Toilets', color: '#ffebee' },
      { icon: <WashIcon sx={{ fontSize: 40, color: '#009688' }} />, title: '7%', subtitle: 'No Soap Availability', color: '#e0f2f1' },
      { icon: <PublicIcon sx={{ fontSize: 40, color: '#3f51b5' }} />, title: '200', subtitle: 'Shared Latrines', color: '#e8eaf6' },
    ],
    riskStats: [
      { icon: <DangerousIcon sx={{ fontSize: 40, color: '#e53935' }} />, title: '50%', subtitle: 'High Risk Areas', color: '#e3f2fd' },
      { icon: <PriorityHighIcon sx={{ fontSize: 40, color: '#d32f2f' }} />, title: '33%', subtitle: 'Low Risk Areas', color: '#ffebee' },
      { icon: <WarningAmberIcon sx={{ fontSize: 40, color: '#fbc02d' }} />, title: '40%', subtitle: 'Medium Risk Areas', color: '#e8f5e9' },
    ]
  },

  Diarrhea: {
    riskLevel: 'High',
    stats: [
      { icon: <WaterDropIcon sx={{ fontSize: 40, color: '#2196f3' }} />, title: '1000', subtitle: 'Unsafe Drinking Water', color: '#e3f2fd' },
      { icon: <WashIcon sx={{ fontSize: 40, color: '#009688' }} />, title: '10%', subtitle: 'No Handwashing Facility', color: '#e0f2f1' },
      { icon: <WcIcon sx={{ fontSize: 40, color: '#f44336' }} />, title: '400', subtitle: 'Inadequate Toilets', color: '#ffebee' },
    ],
    riskStats: [
      { icon: <PriorityHighIcon sx={{ fontSize: 40, color: '#d32f2f' }} />, title: '60%', subtitle: 'High Risk Areas', color: '#e3f2fd' },
      { icon: <WarningAmberIcon sx={{ fontSize: 40, color: '#fbc02d' }} />, title: '30%', subtitle: 'Low Risk Areas', color: '#ffebee' },
      { icon: <DangerousIcon sx={{ fontSize: 40, color: '#e53935' }} />, title: '25%', subtitle: 'Medium Risk Areas', color: '#e8f5e9' },
    ]
  },

  'Dengue fever': {
    riskLevel: 'Medium',
    stats: [
      { icon: <BugReportIcon sx={{ fontSize: 40, color: '#4caf50' }} />, title: '950', subtitle: 'Mosquito Hotspots', color: '#e8f5e9' },
      { icon: <SevereColdIcon sx={{ fontSize: 40, color: '#1e88e5' }} />, title: '60%', subtitle: 'Gutters near Water', color: '#e3f2fd' },
      { icon: <PublicIcon sx={{ fontSize: 40, color: '#3f51b5' }} />, title: '40%', subtitle: 'Poor Drainage Zones', color: '#e8eaf6' },
    ],
    riskStats: [
      { icon: <WarningAmberIcon sx={{ fontSize: 40, color: '#fbc02d' }} />, title: '42%', subtitle: 'High Risk Areas', color: '#e3f2fd' },
      { icon: <PriorityHighIcon sx={{ fontSize: 40, color: '#d32f2f' }} />, title: '18%', subtitle: 'Low Risk Areas', color: '#ffebee' },
      { icon: <CheckCircleOutlineIcon sx={{ fontSize: 40, color: '#388e3c' }} />, title: '40%', subtitle: 'Medium Risk Areas', color: '#e8f5e9' },
    ]
  },

  'Yellow fever': {
    riskLevel: 'Low',
    stats: [
      { icon: <WcIcon sx={{ fontSize: 40, color: '#f44336' }} />, title: '10', subtitle: 'Open Defecation Sites', color: '#ffebee' },
      { icon: <BugReportIcon sx={{ fontSize: 40, color: '#4caf50' }} />, title: '300', subtitle: 'Infected Mosquito Zones', color: '#e8f5e9' },
      { icon: <ScienceIcon sx={{ fontSize: 40, color: '#7b1fa2' }} />, title: '80%', subtitle: 'Gutters near Water', color: '#f3e5f5' },
    ],
    riskStats: [
      { icon: <CheckCircleOutlineIcon sx={{ fontSize: 40, color: '#388e3c' }} />, title: '35%', subtitle: 'Low Risk Areas', color: '#e3f2fd' },
      { icon: <HealthAndSafetyIcon sx={{ fontSize: 40, color: '#00897b' }} />, title: '50%', subtitle: 'Medium Risk Areas', color: '#ffebee' },
      { icon: <PriorityHighIcon sx={{ fontSize: 40, color: '#d32f2f' }} />, title: '10%', subtitle: 'Medium Risk Areas', color: '#e8f5e9' },
    ]
  },
};



let currentData = diseaseData['Cholera']; // Default data

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

  const getRiskCard = () => {
    const level = currentData.riskLevel;
    const cardProps = {
      High: {
        icon: <PriorityHighIcon sx={{ fontSize: 40, color: '#d32f2f' }} />,
        color: '#ffebee',
        text: 'High Risk Area'
      },
      Medium: {
        icon: <WarningAmberIcon sx={{ fontSize: 40, color: '#fbc02d' }} />,
        color: '#fffde7',
        text: 'Moderate Risk Area'
      },
      Low: {
        icon: <CheckCircleOutlineIcon sx={{ fontSize: 40, color: '#388e3c' }} />,
        color: '#e8f5e9',
        text: 'Low Risk Area'
      }
    };

    const card = cardProps[level];
    return (
      <Card sx={{ backgroundColor: card.color, display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, boxShadow: 2 }}>
        <Box sx={{ mr: 2 }}>{card.icon}</Box>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="h6" fontWeight="bold">{level}</Typography>
          <Typography variant="body2" color="text.secondary">{card.text}</Typography>
        </CardContent>
      </Card>
    );
  };

// const stats = [
//   {
//     icon: <WaterDropIcon sx={{ fontSize: 40, color: '#2196f3' }} />,
//     title: '2449',
//     subtitle: 'Number of Unimproved Water Sources',
//     color: '#e3f2fd',
//   },
//   {
//     icon: <WashIcon sx={{ fontSize: 40, color: '#009688' }} />,
//     title: '1.6%',
//     subtitle: 'Households with No Handwashing Facility',
//     color: '#e0f2f1',
//   },
//   {
//     icon: <WcIcon sx={{ fontSize: 40, color: '#f44336' }} />,
//     title: '133',
//     subtitle: 'Number of Open Defecation Sites',
//     color: '#ffebee',
//   },
//   {
//     icon: <LocalDrinkIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
//     title: '1,569',
//     subtitle: 'Number of Gutters within Drinking Water',
//     color: '#fff3e0',
//   },
//   {
//     icon: <RouteIcon sx={{ fontSize: 40, color: '#9c27b0' }} />,
//     title: '600m',
//     subtitle: 'Average Distance to Improved Water Source',
//     color: '#f3e5f5',
//   },
// ];

// const riskStats = [
//   {
//     icon: <PriorityHighIcon sx={{ fontSize: 40, color: '#d32f2f' }} />,
//     title: '25%',
//     subtitle: 'Areas Classified as High Risk',
//     color: '#ffebee',
//   },
//   {
//     icon: <WarningAmberIcon sx={{ fontSize: 40, color: '#fbc02d' }} />,
//     title: '40%',
//     subtitle: 'Areas Classified as Moderate Risk',
//     color: '#fffde7',
//   },
//   {
//     icon: <CheckCircleOutlineIcon sx={{ fontSize: 40, color: '#388e3c' }} />,
//     title: '35%',
//     subtitle: 'Areas Classified as Low Risk',
//     color: '#e8f5e9',
//   },
// ];

const FilterDropdown = ({ label, options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 150 }}>
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

const RiskAnalysisSection = () => {
  const [timeRange, setTimeRange] = useState<string>('6M');

  const handleTimeRangeChange = (event: React.MouseEvent<HTMLElement>, newTimeRange: string | null) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  // Function to render the chart with SVG
  const renderChart = () => {
    const width = 600;
    const height = 420; // slightly taller to fit legend
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2 - 30; // leave space for legend
  
    const chartData = {
      labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      values1: [12, 20, 38, 47, 50, 65, 80, 70, 60, 48, 30, 18], // Cholera
      values2: [8, 15, 22, 30, 35, 45, 55, 50, 43, 30, 20, 10],  // Malaria
    };
  
    const points1 = chartData.values1.map((value, index) => {
      const x = padding + (index * (chartWidth / (chartData.labels.length - 1)));
      const y = height - padding - 30 - (value / 100 * chartHeight);
      return `${x},${y}`;
    }).join(' ');
  
    const points2 = chartData.values2.map((value, index) => {
      const x = padding + (index * (chartWidth / (chartData.labels.length - 1)));
      const y = height - padding - 30 - (value / 100 * chartHeight);
      return `${x},${y}`;
    }).join(' ');
  
    const areaPoints1 = points1 + ` ${padding + chartWidth},${height - padding - 30} ${padding},${height - padding - 30}`;
    const areaPoints2 = points2 + ` ${padding + chartWidth},${height - padding - 30} ${padding},${height - padding - 30}`;
  
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        <line x1={padding} y1={height - padding - 30} x2={width - padding} y2={height - padding - 30} stroke="#e0e0e0" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding - 30} stroke="#e0e0e0" />
        {[0.25, 0.5, 0.75].map((fraction, i) => (
          <line
            key={i}
            x1={padding}
            y1={height - padding - 30 - chartHeight * fraction}
            x2={width - padding}
            y2={height - padding - 30 - chartHeight * fraction}
            stroke="#e0e0e0"
            strokeDasharray="4"
          />
        ))}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e0e0e0" strokeDasharray="4" />
  
        {/* Y-axis labels */}
        {[0, 25, 50, 75, 100].map((label, i) => (
          <text
            key={i}
            x={padding - 10}
            y={height - padding - 30 - (label / 100 * chartHeight)}
            textAnchor="end"
            fontSize="12"
            fill="#666"
          >
            {label}
          </text>
        ))}
  
        {/* X-axis labels */}
        {chartData.labels.map((label, i) => {
          const x = padding + (i * (chartWidth / (chartData.labels.length - 1)));
          return (
            <text
              key={label}
              x={x}
              y={height - padding + 5}
              textAnchor="middle"
              fontSize="12"
              fill="#666"
            >
              {label}
            </text>
          );
        })}
  
        {/* Area Charts */}
        <polygon points={areaPoints2} fill="rgba(149, 117, 205, 0.3)" />
        <polygon points={areaPoints1} fill="rgba(33, 150, 243, 0.3)" />
  
        {/* Line Charts */}
        <polyline points={points2} fill="none" stroke="#9575cd" strokeWidth="2" />
        <polyline points={points1} fill="none" stroke="#2196f3" strokeWidth="2" />
  
        {/* Data Points */}
        {chartData.values1.map((value, index) => {
          const x = padding + (index * (chartWidth / (chartData.labels.length - 1)));
          const y = height - padding - 30 - (value / 100 * chartHeight);
          return <circle key={`point1-${index}`} cx={x} cy={y} r="4" fill="white" stroke="#2196f3" strokeWidth="2" />;
        })}
        {chartData.values2.map((value, index) => {
          const x = padding + (index * (chartWidth / (chartData.labels.length - 1)));
          const y = height - padding - 30 - (value / 100 * chartHeight);
          return <circle key={`point2-${index}`} cx={x} cy={y} r="4" fill="white" stroke="#9575cd" strokeWidth="2" />;
        })}
  
        {/* Legend */}
        <rect x={padding} y={height - 25} width="12" height="12" fill="#2196f3" />
        <text x={padding + 18} y={height - 15} fontSize="12" fill="#333">Cholera</text>
  
        <rect x={padding + 90} y={height - 25} width="12" height="12" fill="#9575cd" />
        <text x={padding + 108} y={height - 15} fontSize="12" fill="#333">Malaria</text>
      </svg>
    );
  };
  
  
  
  

  return (
    <Box sx={{ p:0 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', minHeight: '400px' }}>
            <Grid container spacing={3}>
              {/* Water Sources */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {/* <WaterIcon sx={{ mr: 1 }} /> */}
                  {/* <Typography variant="h6" component="h2">Risk Summary</Typography> */}
                </Box>
                
                {/* <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ bgcolor: '#ffebee', p: 2, borderRadius: 1, height:100 }}>
                      <Typography variant="subtitle1" color="error.main" fontWeight="medium">
                        Contaminated Well
                      </Typography>
                      <Typography variant="body2" color="error.light">
                        500m from outbreak
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ bgcolor: '#fff8e1', p: 2, borderRadius: 1, height:100 }}>
                      <Typography variant="subtitle1" color="warning.main" fontWeight="medium">
                      Public Borehole
                    </Typography>
                      <Typography variant="body2" color="warning.light">
                      750m from outbreak
                    </Typography> 
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Moderate contamination risk
                    </Typography>
                    </Box>
                  </Grid>                  
                </Grid> */}

                {/* Risk Summary Card */}
      <Grid item xs={12} mb={3}>
        <Typography variant="h6" mb={2}>Risk Summary</Typography>
        {getRiskCard()}
      </Grid>

              </Grid>
              
              <Grid item xs={12}>
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
    <Typography variant="h6" component="h2">Contributing Factors</Typography>
  </Box>

  {/* <Grid container spacing={3}>
  {stats.map((stat, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card sx={{ display: 'flex', alignItems: 'center', backgroundColor: stat.color, p: 2, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ mr: 2 }}>
          {stat.icon}
        </Box>
        <CardContent sx={{ padding: 0 }}>
          <Typography variant="h6" fontWeight="bold">{stat.title}</Typography>
          <Typography variant="body2" color="text.secondary">{stat.subtitle}</Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid> */}

{/* Stats Cards */}
<Grid container spacing={2} mb={3}>
        {currentData.stats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ backgroundColor: stat.color, display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, boxShadow: 2 }}>
              <Box sx={{ mr: 2 }}>{stat.icon}</Box>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h6" fontWeight="bold">{stat.title}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.subtitle}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

</Grid>
              
              {/* Waste Management */}
              <Grid item xs={12}>
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Typography variant="h6" component="h2">Risk Classification</Typography>
  </Box>

  {/* <Grid container spacing={2}>
    {riskStats.map((stat, index) => (
      <Grid item xs={12} md={4} key={index}>
        <Card sx={{ display: 'flex', alignItems: 'center', backgroundColor: stat.color, p: 2, borderRadius: 2, boxShadow: 2 }}>
          <Box sx={{ mr: 2 }}>
            {stat.icon}
          </Box>
          <CardContent sx={{ padding: 0 }}>
            <Typography variant="h6" fontWeight="bold">{stat.title}</Typography>
            <Typography variant="body2" color="text.secondary">{stat.subtitle}</Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid> */}

  {/* Risk Classification Cards */}
  <Grid container spacing={2}>
        {currentData.riskStats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ backgroundColor: stat.color, display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, boxShadow: 2 }}>
              <Box sx={{ mr: 2 }}>{stat.icon}</Box>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h6" fontWeight="bold">{stat.title}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.subtitle}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
</Grid>

            </Grid>
          </Paper>
        </Grid>
        
        {/* Risk Trend Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* <ChartIcon sx={{ mr: 1 }} /> */}
                <Typography variant="h6" component="h2">Risk Trend</Typography>
              </Box>
              
              <ToggleButtonGroup
                value={timeRange}
                exclusive
                onChange={handleTimeRangeChange}
                size="small"
                sx={{ bgcolor: '#f0f7ff' }}
              >
                <ToggleButton value="6M">6M</ToggleButton>
                <ToggleButton value="1Y">1Y</ToggleButton>
                <ToggleButton value="All">All</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box sx={{ flex: 1, mb: 2 }}>
                {renderChart()}
              </Box>
              
              <Typography variant="subtitle2" color="text.secondary" align="center">
                Historical trends Risks
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const RiskAnalysisDashboard = () => {
  const [selectedDisease, setSelectedDisease] = useState('Cholera');
  const [isLoaded, setIsLoaded] = useState(false);

  currentData = diseaseData[selectedDisease] || { riskLevel: 'Low', stats: [], riskStats: [] };

  const handleDiseaseChange = (value) => {
    setSelectedDisease(value);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 1 }}>
            Risk Analysis
            <Typography variant="subtitle1" color="text.secondary">
              Real-time disease outbreak tracking
            </Typography>
          </Typography>
    
          {/* <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={2}>
              <FilterDropdown
                label="Disease Type"
                options={[
                  'All',
                  'Cholera',
                  'Malaria',
                  'Typhiod',
                  'Polio',
                  'Dysentry',
                  'Diarrhea',
                  'Dengue fever',
                  'Yellow fever',
                ]}
              />
              <FilterDropdown label="Risk Level" options={['All']} />
              <FilterDropdown label="From Date" options={['All']} />
              <FilterDropdown label="To Date" options={['All']} />
            </Stack>
          </Box> */}
          {/* Dropdowns */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <FilterDropdown
            label="Disease Type"
            options={Object.keys(diseaseData)}
            onChange={handleDiseaseChange}
            value={selectedDisease}
          />
        </Stack>
      </Box>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { icon: <MdLocationOn size={24} />, label: 'Active Outbreaks', value: '0', color: '#ff4d4f' },
            { icon: <MdWarning size={24} />, label: 'At Risk Areas', value: '1020', color: '#fa8c16' },
            { icon: <MdWaterDrop size={24} />, label: 'Water Sources', value: '2692', color: '#1890ff' },
            { icon: <MdCheckCircle size={24} />, label: 'Cases Resolved', value: '0', color: '#52c41a' },
          ].map((item, index) => (

            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', minHeight: '150px', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ position: 'absolute', right: 16, top: 16, color: item.color }}>
                    {item.icon}
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ mt: 3, color: item.color, fontWeight: 'bold' }}>
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Risk Analysis Section */}
        <RiskAnalysisSection />

{/* Risk Heatmap */}
<Paper elevation={1} sx={{ p: 2, height: '500px', mt: 4 }}>
      <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Map size={20} style={{ marginRight: 8 }} />
        Risk Heatmap
      </Typography>

      <Box
        sx={{
          position: 'relative',
          height: '90%',
          borderRadius: 1,
          overflow: 'hidden',
          backgroundColor: '#f0f0f0'
        }}
      >
        {/* Base Map Layer */}
        <Box
          component="img"
          src={`https://maps.googleapis.com/maps/api/staticmap?center=11.273,7.799&zoom=15&size=1200x800&scale=2&maptype=roadmap&style=feature:all|element:labels|visibility:on&key=${GOOGLE_MAPS_API_KEY}`}
          alt="Map"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Multiple Heatmap Spots for more realistic effect */}
        <Fade in={isLoaded} timeout={1000}>
          <Box>
            {/* Main central hotspot */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '200px',
                height: '200px',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(255,0,0,0.9) 0%, rgba(255,165,0,0.7) 40%, rgba(255,255,255,0) 70%)',
                filter: 'blur(10px)',
                opacity: 0.8
              }}
            />
            
            {/* Additional hotspots */}
            <Box
              sx={{
                position: 'absolute',
                top: '40%',
                left: '45%',
                width: '120px',
                height: '120px',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,165,0,0.6) 40%, rgba(255,255,255,0) 70%)',
                filter: 'blur(8px)',
                opacity: 0.7
              }}
            />
            
            <Box
              sx={{
                position: 'absolute',
                top: '60%',
                left: '55%',
                width: '150px',
                height: '150px',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,165,0,0.6) 40%, rgba(255,255,255,0) 70%)',
                filter: 'blur(9px)',
                opacity: 0.75
              }}
            />
            
            <Box
              sx={{
                position: 'absolute',
                top: '45%',
                left: '60%',
                width: '100px',
                height: '100px',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(255,0,0,0.7) 0%, rgba(255,165,0,0.5) 40%, rgba(255,255,255,0) 70%)',
                filter: 'blur(7px)',
                opacity: 0.6
              }}
            />
            
            <Box
              sx={{
                position: 'absolute',
                top: '55%',
                left: '40%',
                width: '80px',
                height: '80px',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(255,0,0,0.7) 0%, rgba(255,165,0,0.5) 40%, rgba(255,255,255,0) 70%)',
                filter: 'blur(6px)',
                opacity: 0.6
              }}
            />
            
            {/* Small distant hotspots */}
            {[...Array(8)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  top: `${30 + Math.random() * 40}%`,
                  left: `${30 + Math.random() * 40}%`,
                  width: `${40 + Math.random() * 30}px`,
                  height: `${40 + Math.random() * 30}px`,
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(255,0,0,0.6) 0%, rgba(255,165,0,0.4) 40%, rgba(255,255,255,0) 70%)',
                  filter: 'blur(5px)',
                  opacity: 0.5
                }}
              />
            ))}
          </Box>
        </Fade>
        
        {/* Sample Points Indicators */}
        <Fade in={isLoaded} timeout={1500}>
          <Box>
            {[...Array(6)].map((_, i) => (
              <Box
                key={`dot-${i}`}
                sx={{
                  position: 'absolute',
                  top: `${35 + Math.random() * 30}%`,
                  left: `${35 + Math.random() * 30}%`,
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#0074D9',
                  border: '1px solid white',
                  boxShadow: '0 0 2px rgba(0,0,0,0.3)',
                  zIndex: 5
                }}
              />
            ))}
          </Box>
        </Fade>

        {/* Legend */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '6px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            zIndex: 10
          }}
        >
          <Typography variant="caption" fontWeight="bold" display="block" mb={1}>
            Yerking us top poroftics risk zone
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Box sx={{ width: '14px', height: '14px', backgroundColor: 'red', mr: 1, borderRadius: '2px' }} />
            <Typography variant="caption">Redactapoci maret</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '14px', height: '14px', backgroundColor: 'orange', mr: 1, borderRadius: '2px' }} />
            <Typography variant="caption">Post</Typography>
          </Box>
        </Box>
        
        {/* Map Key */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '20px',
            left: '220px',
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '6px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            zIndex: 10
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Box sx={{ width: '6px', height: '6px', backgroundColor: '#0074D9', mr: 1, borderRadius: '50%', border: '1px solid white', boxShadow: '0 0 2px rgba(0,0,0,0.3)' }} />
            <Typography variant="caption">Sample Points</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '14px', height: '14px', background: 'radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,165,0,0.6) 70%)', mr: 1, borderRadius: '2px' }} />
            <Typography variant="caption">Density Areas</Typography>
          </Box>
        </Box>
        
        {/* Controls */}
        <Box
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            display: 'flex'
          }}
        >
          <Box sx={{ p: 1, cursor: 'pointer', borderRight: '1px solid #eee', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>+</Box>
          <Box sx={{ p: 1, cursor: 'pointer', borderRight: '1px solid #eee', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>−</Box>
          <Box sx={{ p: 1, cursor: 'pointer', minWidth: '30px', textAlign: 'center' }}>☰</Box>
        </Box>
      </Box>
    </Paper>
   
    </Box>
  );
};

export default RiskAnalysisDashboard;