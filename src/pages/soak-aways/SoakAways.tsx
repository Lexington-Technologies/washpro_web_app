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
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LayersIcon from '@mui/icons-material/Layers';

const SoakAways = () => {
  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
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
            textTransform: 'none'
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
          iconColor="#2196f3"
          icon={<img src="/svg/water.svg" alt="water icon" />}        />
        <StatsCard
          title="Inspected This Month"
          value="342"
          icon={<img src="/svg/calac.svg" alt="calac icon" />}        
          iconColor="#4caf50"
          valueColor="#4caf50"
        />
        <StatsCard
          title="Critical Condition"
          value="89"
         icon={<img src="/svg/caution2.svg" alt="caution2 icon" />}        
         iconColor="#f44336"
         valueColor="#f44336"
         />
        <StatsCard
          title="Maintenance Due"
          value="156"
          icon={<img src="/svg/fix.svg" alt="caution2 icon" />}        
          iconColor="#ff9800"
          valueColor="#ff9800"
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Soakaway Condition Table */}
        <Paper sx={{ flex: 2, p: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Soakaway Condition</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
      <Button
        variant="contained"
        startIcon={<FileDownloadOutlinedIcon />}
        sx={{
          bgcolor: "rgba(241, 243, 245, 1)",
          color: "rgba(37, 48, 107, 1)",
          borderRadius: 2,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": { bgcolor: "rgba(220, 225, 230, 1)" },
        }}
      >
        Export
      </Button>
      <Button
        variant="contained"
        startIcon={<FilterAltIcon />}
        sx={{
          bgcolor: "rgba(241, 243, 245, 1)",
          color: "rgba(37, 48, 107, 1)",
          borderRadius: 2,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": { bgcolor: "rgba(220, 225, 230, 1)" },
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
        <Paper sx={{ flex: 1, p: 2, borderRadius: 2 }}>
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
      <Paper sx={{ mt: 2, p: 2, borderRadius: 2 }}>
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
          {/* Map Legend */}
          <Paper sx={{ position: 'absolute', top: 16, left: 16, p: 1, borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LayersIcon sx={{ fontSize: 20, mr: 1 }} />
              <Typography variant="body2">Sample Points</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LayersIcon sx={{ fontSize: 20, mr: 1 }} />
              <Typography variant="body2">Density Areas</Typography>
            </Box>
          </Paper>

          {/* Map Controls */}
          <Paper sx={{ position: 'absolute', top: 16, right: 16, borderRadius: 1 }}>
            <IconButton size="small"><AddIcon /></IconButton>
            <IconButton size="small"><RemoveIcon /></IconButton>
          </Paper>
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
  imageSrc?: string;
}

const StatsCard = ({ title, value, icon, iconColor, valueColor }: StatsCardProps) => (
  <Card sx={{ flex: 1, p: 2, borderRadius: 2 }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: valueColor || 'text.primary' }}>
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

export default SoakAways;