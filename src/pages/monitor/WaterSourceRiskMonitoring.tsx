import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Button,
  Grid,
  FormControl,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Waves as WavesIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Layers as LayersIcon,
} from '@mui/icons-material';

const WaterSourceDashboard = () => {
  const stats = {
    highRisk: 27,
    moderateRisk: 67,
    safe: 143,
    total: 234,
  };

  const alerts = [
    { id: 'A23', title: 'Site A23 - Critical', description: '3.2m from dump site', severity: 'error' },
    { id: 'B15', title: 'Site B15 - Warning', description: '15m from sanitation risk', severity: 'warning' },
    { id: 'C08', title: 'Site C08 - Clear', description: '45m from nearest risk', severity: 'success' },
  ];

  const riskLevels = [
    { label: 'Critical Risk (<10m)', color: '#ef4444' },
    { label: 'Moderate Risk (10-30m)', color: '#eab308' },
    { label: 'Safe Distance (>30m)', color: '#22c55e' },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto', bgcolor: '#f8fafc' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h1" sx={{ color: '#1e3a8a', fontWeight: 600 }}>
          Water Source Risk
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['LGA', 'Ward', 'Village', 'Hamlet'].map((item) => (
            <FormControl key={item} size="small" sx={{ minWidth: 100 }}>
              <Select defaultValue="" sx={{ bgcolor: 'white' }}>
                <MenuItem value="">{item}</MenuItem>
              </Select>
            </FormControl>
          ))}
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: '#0ea5e9', 
              '&:hover': { bgcolor: '#0284c7' },
              px: 3
            }}
          >
            View Report
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { icon: WarningIcon, title: 'High Risk', value: stats.highRisk, color: '#ef4444', bgColor: '#fef2f2' },
          { icon: WarningIcon, title: 'Moderate Risk', value: stats.moderateRisk, color: '#eab308', bgColor: '#fefce8' },
          { icon: CheckCircleIcon, title: 'Safe', value: stats.safe, color: '#22c55e', bgColor: '#f0fdf4' },
          { icon: WavesIcon, title: 'Total', value: stats.total, color: '#1e3a8a', bgColor: '#f1f5f9' },
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', bgcolor: stat.bgColor }}>
                <CardContent sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  height: '100%',
                  p: 3,
                }}>
                  <IconComponent sx={{ fontSize: 40, color: stat.color }} />
                  <Box>
                    <Typography sx={{ color: stat.color, fontWeight: 500 }}>{stat.title}</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>{stat.value}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Risk Heatmap */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%', p: 3, position: 'relative' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Risk Heatmap
            </Typography>
            <Box sx={{ position: 'relative', height: 500 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d150598.46582809655!2d7.648291125907573!3d11.296615180519947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11b27fc3df7cf997%3A0x7f813ac2a29bec28!2sKudan%2C%20Kaduna!5e0!3m2!1sen!2sng!4v1735721268833!5m2!1sen!2sng"
                style={{
                  border: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <Paper 
                elevation={2}
                sx={{ 
                  position: 'absolute', 
                  top: 12, 
                  right: 12, 
                  display: 'flex',
                  p: 0.5,
                  borderRadius: 1,
                  bgcolor: 'white',
                }}
              >
                <IconButton size="small"><AddIcon /></IconButton>
                <IconButton size="small"><RemoveIcon /></IconButton>
                <IconButton size="small"><LayersIcon /></IconButton>
              </Paper>
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Risk Legend */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Risk Legend
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {riskLevels.map((risk, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: risk.color,
                    }}
                  />
                  <Typography sx={{ fontSize: '0.95rem' }}>{risk.label}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Recent Alerts */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Alerts
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {alerts.map((alert) => (
                <Paper
                  key={alert.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor:
                      alert.severity === 'error'
                        ? '#fef2f2'
                        : alert.severity === 'warning'
                        ? '#fefce8'
                        : '#f0fdf4',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {alert.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {alert.description}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WaterSourceDashboard;