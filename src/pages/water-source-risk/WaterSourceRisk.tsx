import React from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Paper,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FaClipboardCheck, FaWrench } from 'react-icons/fa';
import { Waves } from '@mui/icons-material';

const WaterSourceRisk = () => {
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
            textTransform: 'none',
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
          icon={<ErrorIcon />}
          iconColor="#f44336"
        />
        <StatsCard
          title="Moderate Risks"
          value="67"
          icon={<FaWrench style={{ color: "#CA8A04" }} />}
          iconColor="#ff9800"
        />
        <StatsCard
          title="Safe Zones"
          value="143"
          icon={<FaClipboardCheck style={{ color: "#4caf50" }} />}
          iconColor="#4caf50"
        />
        <StatsCard
          title="Monitored Sites"
          value="234"
          icon={<Waves style={{ color: "#2196f3" }} />}
          iconColor="#2196f3"
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 2, backgroundColor: '#f0f0f0', }}>
        {/* Risk Heatmap */}
        <Paper sx={{ flex: 2, p: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Risk Heatmap</Typography>
          <Box sx={{ height: 400, bgcolor: '#F8FAFC', borderRadius: 1, overflow: 'hidden' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d150598.46582809655!2d7.648291125907573!3d11.296615180519947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11b27fc3df7cf997%3A0x7f813ac2a29bec28!2sKudan%2C%20Kaduna!5e0!3m2!1sen!2sng!4v1735721268833!5m2!1sen!2sng"
              style={{
                border: 0,
                width: '100%',
                height: '100%',
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Box>
        </Paper>

        {/* Right Column */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Risk Legend */}
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
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
          <Paper sx={{ p: 2, borderRadius: 2, flex: 1, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Alerts</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <AlertItem
                status="critical"
                icon={<ErrorIcon sx={{ color: '#f44336' }} />}
                title="Site A23 - Critical"
                description="3.2m from dump site"
              />
              <AlertItem
                status="warning"
                icon={<WarningAmberIcon sx={{ color: '#ff9800' }} />}
                title="Site B15 - Warning"
                description="15m from sanitation risk"
              />
              <AlertItem
                status="safe"
                icon={<CheckCircleIcon sx={{ color: '#4caf50' }} />}
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
  <Card sx={{ flex: 1, p: 2, borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
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
        justifyContent: 'center',
      }}>
        {React.cloneElement(icon, { sx: { color: iconColor } })}
      </Box>
    </Box>
  </Card>
);

// Alert Item Component
interface AlertItemProps {
  status: 'critical' | 'warning' | 'safe';
  icon: React.ReactElement;
  title: string;
  description: string;
}

const AlertItem: React.FC<AlertItemProps> = ({ status, icon, title, description }) => {
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
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        border: 1,
        borderColor: `${getStatusColor(status)}30`,
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: `${getStatusColor(status)}15`,
        }}
      >
        {icon}
      </Box>
      {/* Text */}
      <Box>
        <Typography variant="subtitle2" sx={{ color: getStatusColor(status), mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default WaterSourceRisk;
