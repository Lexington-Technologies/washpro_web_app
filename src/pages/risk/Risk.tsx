import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
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
  SelectChangeEvent
} from '@mui/material';
import { 
  MdLocationOn, 
  MdWarning, 
  MdWaterDrop, 
  MdCheckCircle,
} from 'react-icons/md';
import { Map } from 'lucide-react';
import { 
  WaterDrop as WaterIcon,
  Warning as WarningIcon,
  DeleteOutline as TrashIcon,
  BarChart as ChartIcon
} from '@mui/icons-material';

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
const chartData = {
  labels: Array.from({ length: 12 }, (_, i) => i + 1),
  values1: [20, 35, 40, 30, 45, 50, 60, 55, 65, 70, 75, 80],
  values2: [15, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75]
};

// Mock data for KPI cards
const kpiData: KPICard[] = [
  { icon: <MdLocationOn size={24} />, label: 'Active Outbreaks', value: '3', color: '#ff4d4f' },
  { icon: <MdWarning size={24} />, label: 'At Risk Areas', value: '8', color: '#fa8c16' },
  { icon: <MdWaterDrop size={24} />, label: 'Water Sources', value: '12', color: '#1890ff' },
  { icon: <MdCheckCircle size={24} />, label: 'Cases Resolved', value: '45', color: '#52c41a' },
];

// Mock data for water sources
const waterSources: WaterSource[] = [
  {
    type: 'Contaminated Well',
    distance: '500m from outbreak',
    riskLevel: 'high'
  },
  {
    type: 'Public Borehole',
    distance: '750m from outbreak',
    riskLevel: 'moderate',
    additionalInfo: 'Moderate contamination risk'
  },
  {
    type: 'Stream',
    distance: '1.2km from outbreak',
    riskLevel: 'high',
    additionalInfo: 'Heavy contamination detected'
  },
  {
    type: 'Water Tank',
    distance: '300m from outbreak',
    riskLevel: 'moderate',
    additionalInfo: 'Regular testing needed'
  }
];

// Mock data for environmental risks
const environmentalRisks: EnvironmentalRisk[] = [
  {
    type: 'Open Defecation',
    description: 'Multiple sites within 200m',
    riskLevel: 'high'
  },
  {
    type: 'Poor Drainage',
    description: 'Stagnant water observed',
    riskLevel: 'moderate'
  },
  {
    type: 'Flood Prone Area',
    description: 'Recent flooding reported',
    riskLevel: 'high'
  }
];

// Mock data for waste management
const wasteManagement: WasteManagement[] = [
  {
    type: 'Waste Collection',
    description: 'Irregular service reported',
    riskLevel: 'moderate'
  },
  {
    type: 'Illegal Dumping',
    description: 'Multiple sites identified',
    riskLevel: 'high'
  },
  {
    type: 'Drainage System',
    description: 'Partially blocked',
    riskLevel: 'moderate'
  }
];

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value);
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
    const height = 390;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Calculate points for line charts
    const points1 = chartData.values1.map((value, index) => {
      const x = padding + (index * (chartWidth / (chartData.labels.length - 1)));
      const y = height - padding - (value / 100 * chartHeight);
      return `${x},${y}`;
    }).join(' ');
    
    const points2 = chartData.values2.map((value, index) => {
      const x = padding + (index * (chartWidth / (chartData.labels.length - 1)));
      const y = height - padding - (value / 100 * chartHeight);
      return `${x},${y}`;
    }).join(' ');

    // Create area chart points (close the path at the bottom)
    const areaPoints1 = points1 + ` ${padding + chartWidth},${height - padding} ${padding},${height - padding}`;
    const areaPoints2 = points2 + ` ${padding + chartWidth},${height - padding} ${padding},${height - padding}`;

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e0e0e0" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e0e0e0" />
        <line x1={padding} y1={height - padding - chartHeight * 0.25} x2={width - padding} y2={height - padding - chartHeight * 0.25} stroke="#e0e0e0" strokeDasharray="4" />
        <line x1={padding} y1={height - padding - chartHeight * 0.5} x2={width - padding} y2={height - padding - chartHeight * 0.5} stroke="#e0e0e0" strokeDasharray="4" />
        <line x1={padding} y1={height - padding - chartHeight * 0.75} x2={width - padding} y2={height - padding - chartHeight * 0.75} stroke="#e0e0e0" strokeDasharray="4" />
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e0e0e0" strokeDasharray="4" />

        {/* Y-axis labels */}
        <text x={padding - 10} y={height - padding} textAnchor="end" fontSize="12" fill="#666">0</text>
        <text x={padding - 10} y={height - padding - chartHeight * 0.25} textAnchor="end" fontSize="12" fill="#666">25</text>
        <text x={padding - 10} y={height - padding - chartHeight * 0.5} textAnchor="end" fontSize="12" fill="#666">50</text>
        <text x={padding - 10} y={height - padding - chartHeight * 0.75} textAnchor="end" fontSize="12" fill="#666">75</text>
        <text x={padding - 10} y={padding} textAnchor="end" fontSize="12" fill="#666">100</text>

        {/* Area charts */}
        <polygon points={areaPoints2} fill="rgba(149, 117, 205, 0.3)" />
        <polygon points={areaPoints1} fill="rgba(33, 150, 243, 0.3)" />

        {/* Line charts */}
        <polyline points={points2} fill="none" stroke="#9575cd" strokeWidth="2" />
        <polyline points={points1} fill="none" stroke="#2196f3" strokeWidth="2" />

        {/* Data points */}
        {chartData.values1.map((value, index) => {
          const x = padding + (index * (chartWidth / (chartData.labels.length - 1)));
          const y = height - padding - (value / 100 * chartHeight);
          return (
            <circle key={`point1-${index}`} cx={x} cy={y} r="4" fill="white" stroke="#2196f3" strokeWidth="2" />
          );
        })}
        
        {chartData.values2.map((value, index) => {
          const x = padding + (index * (chartWidth / (chartData.labels.length - 1)));
          const y = height - padding - (value / 100 * chartHeight);
          return (
            <circle key={`point2-${index}`} cx={x} cy={y} r="4" fill="white" stroke="#9575cd" strokeWidth="2" />
          );
        })}
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
                  <WaterIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">Water Sources</Typography>
                </Box>
                
                <Grid container spacing={2}>
                  {waterSources.map((source, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box sx={{ 
                        bgcolor: source.riskLevel === 'high' ? '#ffebee' : '#fff8e1', 
                        p: 2, 
                        borderRadius: 1, 
                        height: 100 
                      }}>
                        <Typography 
                          variant="subtitle1" 
                          color={source.riskLevel === 'high' ? 'error.main' : 'warning.main'} 
                          fontWeight="medium"
                        >
                          {source.type}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color={source.riskLevel === 'high' ? 'error.light' : 'warning.light'}
                        >
                          {source.distance}
                        </Typography>
                        {source.additionalInfo && (
                          <Typography variant="body2" color="text.secondary" mt={0.5}>
                            {source.additionalInfo}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              
              {/* Environmental Risks */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">Environmental Risks</Typography>
                </Box>
                
                <Grid container spacing={2}>
                  {environmentalRisks.map((risk, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box sx={{ 
                        bgcolor: risk.riskLevel === 'high' ? '#ffebee' : '#fff8e1', 
                        p: 2, 
                        borderRadius: 1, 
                        height: 100 
                      }}>
                        <Typography 
                          variant="subtitle1" 
                          color={risk.riskLevel === 'high' ? 'error.main' : 'warning.main'} 
                          fontWeight="medium"
                        >
                          {risk.type}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color={risk.riskLevel === 'high' ? 'error.light' : 'warning.light'}
                        >
                          {risk.description}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              
              {/* Waste Management */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrashIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">Waste Management</Typography>
                </Box>
                
                <Grid container spacing={2}>
                  {wasteManagement.map((item, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Box sx={{ 
                        bgcolor: item.riskLevel === 'high' ? '#ffebee' : '#fff8e1', 
                        p: 2, 
                        borderRadius: 1, 
                        height: 100 
                      }}>
                        <Typography 
                          variant="subtitle1" 
                          color={item.riskLevel === 'high' ? 'error.main' : 'warning.main'} 
                          fontWeight="medium"
                        >
                          {item.type}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color={item.riskLevel === 'high' ? 'error.light' : 'warning.light'}
                        >
                          {item.description}
                        </Typography>
                      </Box>
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
                <ChartIcon sx={{ mr: 1 }} />
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
    
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={2}>
              <FilterDropdown label="Disease Type" options={['All']} />
              <FilterDropdown label="Risk Level" options={['All']} />
              <FilterDropdown label="From Date" options={['All']} />
              <FilterDropdown label="To Date" options={['All']} />
            </Stack>
          </Box>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {kpiData.map((item, index) => (
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
  
  {/* Replace the Box with an iframe */}
  <Box
    sx={{
      position: 'relative',
      height: '90%',
      borderRadius: 1,
      overflow: 'hidden'
    }}
  >
    {/* Embed a map using iframe */}
    <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d144.9537353153166!3d-37.816279742021665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d2a7c5e4a7c1!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1633023222539!5m2!1sen!2sus"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
/>
  </Box>
</Paper>      
    </Box>
  );
};

export default RiskAnalysisDashboard;