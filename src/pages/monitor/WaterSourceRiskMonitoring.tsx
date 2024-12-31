import React from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Paper,
  IconButton,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import WarningIcon from '@mui/icons-material/Warning';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ListIcon from '@mui/icons-material/List';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LayersIcon from '@mui/icons-material/Layers';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MapIcon from '@mui/icons-material/Map';

const WaterSourceRiskMonitoring = () => {
  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 0.5 }}>
            Distance Monitoring for Risks
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
            textTransform: 'none'
          }}
        >
          Filter
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <StatsCard
          title="Critical Alerts"
          value="24"
          icon={<WarningIcon />}
          iconColor="#f44336"
        />
        <StatsCard
          title="Moderate Risks"
          value="67"
          icon={<ReportProblemIcon />}
          iconColor="#ff9800"
        />
        <StatsCard
          title="Safe Zones"
          value="143"
          icon={<CheckCircleIcon />}
          iconColor="#4caf50"
        />
        <StatsCard
          title="Monitored Sites"
          value="234"
          icon={<ListIcon />}
          iconColor="#2196f3"
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Risk Heatmap */}
        <Paper sx={{ flex: 2, p: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Risk Heatmap</Typography>
          <Box sx={{ position: 'relative' }}>
            <Box 
              component="img"
              src="/api/placeholder/800/400"
              alt="Risk heatmap"
              sx={{ 
                width: '100%', 
                height: 400, 
                objectFit: 'cover',
                borderRadius: 1
              }}
            />
            
            {/* Map Controls */}
            <Paper 
              sx={{ 
                position: 'absolute', 
                top: 10, 
                right: 10, 
                borderRadius: 1,
                display: 'flex'
              }}
            >
              <IconButton size="small"><AddIcon /></IconButton>
              <IconButton size="small"><RemoveIcon /></IconButton>
              <IconButton size="small"><MapIcon /></IconButton>
            </Paper>

            {/* Map Legend */}
            <Paper 
              sx={{ 
                position: 'absolute', 
                bottom: 10, 
                left: 10, 
                p: 1, 
                borderRadius: 1
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">Sample Points</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LayersIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">Density Areas</Typography>
              </Box>
            </Paper>
          </Box>
        </Paper>

        {/* Right Column */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Risk Legend */}
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Risk Legend</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f44336' }} />
                <Typography>Critical Risk (&lt;5m)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff9800' }} />
                <Typography>Moderate Risk (10-30m)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50' }} />
                <Typography>Safe Distance (&gt;30m)</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Recent Alerts */}
          <Paper sx={{ p: 2, borderRadius: 2, flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Alerts</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <AlertItem
                status="critical"
                title="Site A23 - Critical"
                description="3.2m from dump site"
              />
              <AlertItem
                status="warning"
                title="Site B15 - Warning"
                description="15m from sanitation risk"
              />
              <AlertItem
                status="safe"
                title="Site C08 - Clear"
                description="45m from nearest risk"
              />
            </Box>
          </Paper>
        </Box>
      </Box>
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
      <Box sx={{ 
        bgcolor: `${iconColor}15`, 
        p: 1, 
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {React.cloneElement(icon, { sx: { color: iconColor } })}
      </Box>
    </Box>
  </Card>
);

// Alert Item Component
interface AlertItemProps {
  status: 'critical' | 'warning' | 'safe';
  title: string;
  description: string;
}

const AlertItem: React.FC<AlertItemProps> = ({ status, title, description }) => {
  const getStatusColor = (status: 'critical' | 'warning' | 'safe'): string => {
    switch (status) {
      case 'critical':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      case 'safe':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        bgcolor: `${getStatusColor(status)}10`,
        border: 1,
        borderColor: `${getStatusColor(status)}30`,
      }}
    >
      <Typography variant="subtitle2" sx={{ color: getStatusColor(status), mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
};

export default WaterSourceRiskMonitoring;