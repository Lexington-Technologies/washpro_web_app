import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  List,
  ListItem,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  FilterAlt as FilterAltIcon,
  LocationOn,
  WaterDrop,
} from '@mui/icons-material';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { apiController } from '../../axios';

interface Location {
  type: string;
  coordinates: number[];
  ward: string;
  village: string;
  hamlet: string;
}

interface RiskSummary {
  toilets: {
    critical: number;
    moderate: number;
    good: number;
    total: number;
  };
}

interface WaterSourceRiskData {
  waterSourceId: string;
  waterSourceType: string;
  location: Location;
  summary: RiskSummary;
  facilities: {
    [key: string]: Array<{ riskLevel: string }>;
  };
}

interface MapViewProps {
  waterRisks: WaterSourceRiskData[];
  defaultPosition: [number, number];
}

interface FilterState {
  ward?: string;
  village?: string;
  riskLevel: string[];
  facilityTypes: string[];
}

const createMarkerIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid white;
        "></div>
      </div>
    `,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  });
};

const markerIcons = {
  critical: createMarkerIcon('#dc2626'),
  moderate: createMarkerIcon('#f59e0b'),
  good: createMarkerIcon('#16a34a'),
};

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
}) => {
  
  return (
    <Card 
      sx={{ 
        p: 3,
        height: '100%',
        borderRadius: 3,
        background: `linear-gradient(135deg, ${color}08 0%, ${color}03 100%)`,
        border: `1px solid ${color}15`,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 600,
            fontSize: '1.1rem',
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            bgcolor: `${color}15`,
            p: 1,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon as React.ReactElement, { 
            sx: { color: color, fontSize: 24 } 
          })}
        </Box>
      </Box>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 700,
          color: color,
          mb: 1
        }}
      >
        {value.toLocaleString()}
      </Typography>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: trend.isPositive ? 'success.main' : 'error.main',
              bgcolor: trend.isPositive ? 'success.lighter' : 'error.lighter',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </Box>
          <Typography variant="body2" color="text.secondary">
            vs last month
          </Typography>
        </Box>
      )}
    </Card>
  );
};

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onClose,
  filters,
  onFiltersChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter Water Sources</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Ward"
            value={filters.ward || ''}
            onChange={(e) => onFiltersChange({ ...filters, ward: e.target.value })}
            fullWidth
          />
          <TextField
            label="Village"
            value={filters.village || ''}
            onChange={(e) => onFiltersChange({ ...filters, village: e.target.value })}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onClose} variant="contained">
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MapView: React.FC<MapViewProps & { onMarkerClick: (waterRisk: WaterSourceRiskData) => void }> = ({ waterRisks, defaultPosition, onMarkerClick }) => {
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (map && waterRisks.length > 0) {
      const bounds = L.latLngBounds(
        waterRisks.map(risk => [
          risk.location.coordinates[1],
          risk.location.coordinates[0]
        ])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, waterRisks]);

  const getRiskLevel = (waterRisk: WaterSourceRiskData): 'critical' | 'moderate' | 'good' => {
    const summary = waterRisk.summary.toilets;
    if (summary.critical > 0) return 'critical';
    if (summary.moderate > 0) return 'moderate';
    return 'good';
  };

  return (
    <Box sx={{ height: 600, borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
      <MapContainer
        center={defaultPosition}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {waterRisks.map((waterRisk) => {
          const riskLevel = getRiskLevel(waterRisk);
          return (
            <Marker
              key={waterRisk.waterSourceId}
              position={[waterRisk.location.coordinates[1], waterRisk.location.coordinates[0]]}
              icon={markerIcons[riskLevel]}
              eventHandlers={{
                click: () => {
                  onMarkerClick(waterRisk);
                },
              }}
            />
          );
        })}
      </MapContainer>
    </Box>
  );
};

const WaterSourceRisk: React.FC = () => {
  const theme = useTheme();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    riskLevel: ['critical', 'moderate', 'good'],
    facilityTypes: ['toilets', 'soakAways', 'openDefecation', 'gutters'],
  });
  const [selectedWaterRisk, setSelectedWaterRisk] = useState<WaterSourceRiskData | null>(null);

  const { data: waterRisks = [], isLoading, error } = useQuery<WaterSourceRiskData[]>({
    queryKey: ['waterSourceRisk'],
    queryFn: async () => {
      const response = await apiController.get<WaterSourceRiskData[]>('/analysis');
      return response;
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  const filteredWaterRisks = useMemo(() => {
    if (!waterRisks) return [];

    return waterRisks.filter((risk) => {
      const matchesWard = !filters.ward || risk.location.ward.toLowerCase().includes(filters.ward.toLowerCase());
      const matchesVillage = !filters.village || risk.location.village.toLowerCase().includes(filters.village.toLowerCase());
      
      const hasMatchingRisk = filters.riskLevel.some((level) =>
        filters.facilityTypes.some((facilityType) =>
          risk.facilities[facilityType].some((facility) => facility.riskLevel === level)
        )
      );

      return matchesWard && matchesVillage && hasMatchingRisk;
    });
  }, [waterRisks, filters]);

  const defaultPosition: [number, number] = filteredWaterRisks.length > 0
    ? [filteredWaterRisks[0].location.coordinates[1], filteredWaterRisks[0].location.coordinates[0]]
    : [-3.3792, 36.6825];

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: 2,
          bgcolor: '#f8fafc'
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Alert 
          severity="error"
          variant="filled"
          sx={{ 
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: 28
            }
          }}
        >
          <Box sx={{ ml: 1 }}>
            <Typography variant="h6" sx={{ mb: 0.5, color: 'white' }}>
              Error Loading Data
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
              Unable to load water source risk data. Please try again later or contact support if the problem persists.
            </Typography>
          </Box>
        </Alert>
      </Box>
    );
  }

  const calculateTotals = (data: WaterSourceRiskData[]) => ({
    critical: data.reduce((acc, curr) => acc + curr.summary.toilets.critical, 0),
    moderate: data.reduce((acc, curr) => acc + curr.summary.toilets.moderate, 0),
    good: data.reduce((acc, curr) => acc + curr.summary.toilets.good, 0),
    total: data.reduce((acc, curr) => acc + curr.summary.toilets.total, 0),
  });

  const totals = calculateTotals(filteredWaterRisks);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f8fafc',
      pb: 6
    }}>
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          bgcolor: '#f8fafc',
          py: 2,
          px: 4,
          zIndex: 1
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
            Distance Monitoring for Risks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredWaterRisks.length} Water Sources Monitored
          </Typography>
        </Box>
        <Button
          startIcon={<FilterAltIcon />}
          variant="contained"
          onClick={() => setIsFilterOpen(true)}
          sx={{
            bgcolor: 'white',
            color: 'text.primary',
            boxShadow: 1,
            '&:hover': { bgcolor: 'grey.100' },
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Filter
        </Button>
      </Box>

      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 4 }}>
        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Critical Risk Sources"
              value={totals.critical}
              icon={<FaExclamationCircle size={24} />}
              color="#dc2626"
              trend={{ value: 12, isPositive: false }}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Moderate Risk Sources"
              value={totals.moderate}
              icon={<FaExclamationTriangle size={24} />}
              color="#f59e0b"
              trend={{ value: 5, isPositive: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Safe Sources"
              value={totals.good}
              icon={<FaCheckCircle size={24} />}
              color="#16a34a"
              trend={{ value: 8, isPositive: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Total Sources"
              value={totals.total}
              icon={<WaterDrop />}
              color="#0284c7"
              trend={{ value: 3, isPositive: true }}
            />
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={9}>
            <Paper 
              sx={{ 
                p: 3,
                bgcolor: 'white',
                height: '100%'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3 
              }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Risk Distribution Map
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {[
                    { color: '#dc2626', label: 'Critical Risk (<10m)' },
                    { color: '#f59e0b', label: 'Moderate Risk (10-30m)' },
                    { color: '#16a34a', label: 'Safe Distance (>30m)' },
                  ].map(({ color, label }) => (
                    <Box 
                      key={label}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        bgcolor: `${color}10`,
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 10, 
                          height: 10, 
                          borderRadius: '50%', 
                          bgcolor: color 
                        }} 
                      />
                      <Typography 
                        sx={{ 
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: 'text.primary'
                        }}
                      >
                        {label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <MapView 
                waterRisks={filteredWaterRisks} 
                defaultPosition={defaultPosition} 
                onMarkerClick={setSelectedWaterRisk}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} lg={3}>
            <Paper 
              sx={{ 
                p: 3,
                borderRadius: 3,
                boxShadow: theme.shadows[2],
                bgcolor: 'white',
                height: '100%'
              }}
            >
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
               Overview
              </Typography>
              {selectedWaterRisk ? (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {selectedWaterRisk.waterSourceType}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Ward:</strong> {selectedWaterRisk.location.ward}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Village:</strong> {selectedWaterRisk.location.village}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Hamlet:</strong> {selectedWaterRisk.location.hamlet}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 2 }}>
                    Risk Summary:
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Box sx={{ 
                        p: 1, 
                        bgcolor: '#dc262610',
                        borderRadius: 1,
                        textAlign: 'center'
                      }}>
                        <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                          {selectedWaterRisk.summary.toilets.critical}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Critical
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ 
                        p: 1, 
                        bgcolor: '#f59e0b10',
                        borderRadius: 1,
                        textAlign: 'center'
                      }}>
                        <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
                          {selectedWaterRisk.summary.toilets.moderate}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Moderate
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ 
                        p: 1, 
                        bgcolor: '#16a34a10',
                        borderRadius: 1,
                        textAlign: 'center'
                      }}>
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                          {selectedWaterRisk.summary.toilets.good}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Good
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Click on a marker to see the details.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default WaterSourceRisk;