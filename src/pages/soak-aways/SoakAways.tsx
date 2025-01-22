import React from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import {
  FilterAlt as FilterAltIcon,
  FiberManualRecord as FiberManualRecordIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Waves,
} from '@mui/icons-material';
import { FaClipboardCheck, FaDownload, FaExclamationTriangle, FaFilter, FaWrench } from 'react-icons/fa';

const SoakAways = () => {
  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 0.5 }}>
            Soakaways
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
          title="Total Soakaways"
          value="1,247"
          icon={<Waves />}
          iconColor="#2196f3"
        />
        <StatsCard
          title="Inspected This Month"
          value="342"
          icon={<FaClipboardCheck style={{color: "#16A34A"}}/>}
          iconColor="#4caf50"
          valueColor="#16A34A"
        />
        <StatsCard
          title="Critical Condition"
          value="89"
          icon={<FaExclamationTriangle style={{color: "#DC2626"}}/>}
          iconColor="#f44336"
          valueColor="#f44336"
        />
        <StatsCard
          title="Maintenance Due"
          value="156"
          icon={<FaWrench color="#CA8A04" />}
          iconColor="#ff9800"
          valueColor="#ff9800"
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Soakaway Condition Table */}
        <Paper sx={{ flex: 2, p: 2, borderRadius: 2, boxShadow: 10 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>Soakaway Condition</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<FaDownload />}
                sx={{
                  bgcolor: 'rgba(241, 243, 245, 1)',
                  color: 'rgba(37, 48, 107, 1)',
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: 'rgba(220, 225, 230, 1)' },
                }}
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<FaFilter />}
                sx={{
                  bgcolor: 'rgba(241, 243, 245, 1)',
                  color: 'rgba(37, 48, 107, 1)',
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: 'rgba(220, 225, 230, 1)' },
                }}
              >
                Filter
              </Button>
            </Box>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>WATER SOURCE TYPE</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>COUNT</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>PERCENTAGE</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>RISK LEVEL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Maintained</TableCell>
                  <TableCell>847</TableCell>
                  <TableCell>68%</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FiberManualRecordIcon sx={{ color: '#4caf50', fontSize: 12, mr: 1 }} />
                      Low
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Unmaintained</TableCell>
                  <TableCell>311</TableCell>
                  <TableCell>25%</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FiberManualRecordIcon sx={{ color: '#ff9800', fontSize: 12, mr: 1 }} />
                      Medium
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Dilapidated</TableCell>
                  <TableCell>89</TableCell>
                  <TableCell>7%</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FiberManualRecordIcon sx={{ color: '#f44336', fontSize: 12, mr: 1 }} />
                      High
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Slab Safety Risk */}
        <Paper sx={{ flex: 1, p: 2, borderRadius: 2, boxShadow: 10 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Slab Safety Risk</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: '#f5f5f5', p: 1.5, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FiberManualRecordIcon sx={{ color: '#4caf50', fontSize: 12, mr: 1 }} />
                <Typography>Fair Condition (75%)</Typography>
              </Box>
              <Typography>936</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: '#f5f5f5', p: 1.5, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FiberManualRecordIcon sx={{ color: '#f44336', fontSize: 12, mr: 1 }} />
                <Typography>Bad/Fail (25%)</Typography>
              </Box>
              <Typography>311</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
      {/* Geographic Risk Distribution */}
      <Paper sx={{ mt: 2, p: 2, borderRadius: 2, boxShadow: 10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Geographic Risk Distribution</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {['Zone A', 'Zone B', 'Zone C'].map((zone) => (
              <Button
                key={zone}
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  color: 'text.primary',
                  borderColor: 'grey.300'
                }}
              >
                {zone}
              </Button>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            height: 400,
            bgcolor: '#f5f5f5',
            borderRadius: 1,
            position: 'relative',
            overflow: 'hidden'
          }}
        >

          {/* Map Controls */}
          <Paper sx={{ position: 'absolute', top: 16, right: 16, borderRadius: 1 }}>
            <IconButton size="small"><AddIcon /></IconButton>
            <IconButton size="small"><RemoveIcon /></IconButton>
          </Paper>
          <Box sx={{ height: 400, bgcolor: '#F8FAFC', borderRadius: 1, overflow: 'hidden' }}>
                  <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54444.747381551366!2d7.6930992235022035!3d11.29520357300069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11b27fc3df7cf997%3A0x7f813ac2a29bec28!2sKudan%2C%20Kaduna!5e1!3m2!1sen!2sng!4v1735816821797!5m2!1sen!2sng"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

    </Box>

        </Box>
      </Paper>

    </Box>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  iconColor?: string;
  valueColor?: string;
}

const StatsCard = ({ title, value, icon, iconColor, valueColor }: StatsCardProps) => (
  <Card sx={{ flex: 1, p: 2, borderRadius: 2, boxShadow: 10 }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: valueColor || 'text.primary' }}>
        {value}
      </Typography>
      <Box
        sx={{
          bgcolor: `${iconColor}15`,
          width: 48,
          height: 48,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {React.cloneElement(icon, { sx: { color: iconColor, fontSize: 24 } })}
      </Box>
    </Box>
  </Card>
);

export default SoakAways;
