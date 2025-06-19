import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Paper,
  Card,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';
import { FaWrench } from 'react-icons/fa';
import Waves from '@mui/icons-material/Waves';
import { apiController } from '../../axios';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '../../components/Table/DataTable';
import { X, AlertCircle, MapPin } from 'lucide-react';
import { CompassCalibrationSharp, Dangerous, Home, LocationCity, PinDrop, SafetyCheck } from '@mui/icons-material';

// -----------------------------------------------------------------------------
// Constants & Helpers
// -----------------------------------------------------------------------------
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

// Updated risk color mapping: red = critical, yellow = moderate, green = safe.
const riskColorMapping = {
  critical: "#ff0000",   // Red
  moderate: "#f3a080",   // Yellow
  safe: "#4CAF50",       // Green
};

/**
 * Helper component for filter dropdowns.
 */
const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) => (
  <FormControl variant="outlined" sx={{ minWidth: 210 }}>
    <InputLabel>{label}</InputLabel>
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as string)}
      label={label}
      sx={{ height: 40 }}
    >
      <MenuItem value="">{`All ${label}`}</MenuItem>
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

/**
 * Compute overall risk rating for a water source.
 * - If any facility has a distance below 30 m => critical
 * - Else if any facility has distance below 60 m => moderate
 * - Else => safe
 */
const getRiskRating = (source: WaterSourceRiskData): 'critical' | 'moderate' | 'safe' => {
  const facilities = [
    ...source.facilities.toilets,
    ...source.facilities.soakAways,
    ...source.facilities.openDefecation,
    ...source.facilities.gutters,
  ];
  if (facilities.length === 0) return 'safe';
  const distances = facilities.map(f => f.distance);
  if (distances.some(d => d < 30)) return 'critical';
  if (distances.some(d => d < 60)) return 'moderate';
  return 'safe';
};

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
interface WaterSourceRiskData {
  waterSourceId: string;
  waterSourceType: string;
  location: {
    ward: string;
    village: string;
    hamlet: string;
    coordinates: [number, number, number];
    type: string;
    dependent: number;
    picture: string;
  };
  facilities: {
    toilets: Facility[];
    soakAways: Facility[];
    openDefecation: Facility[];
    gutters: Facility[];
  };
  summary: {
    toilets: RiskSummary;
    soakAways: RiskSummary;
    openDefecation: RiskSummary;
    gutters: RiskSummary;
  };
}

interface Facility {
  facilityId: string;
  distance: number;
  riskLevel: 'critical' | 'moderate' | 'good';
}

interface RiskSummary {
  critical: number;
  moderate: number;
  good: number;
  total: number;
}

// -----------------------------------------------------------------------------
// Table Columns
// -----------------------------------------------------------------------------
const columnHelper = createColumnHelper<WaterSourceRiskData>();

const columns = [
  columnHelper.accessor('location.picture', {
    header: 'Picture',
    cell: (props) => (
      <Avatar
        src={props.row.original.location.picture}
        alt="water source"
        sx={{ borderRadius: '100%' }}
      />
    ),
  }),
  columnHelper.accessor('location.ward', {
    header: 'Ward',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('location.village', {
    header: 'Village',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('location.hamlet', {
    header: 'Hamlet',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('waterSourceType', {
    header: 'Type',
    cell: (info) => info.getValue(),
  }),
  // Column for computed risk level indicator.
  columnHelper.display({
    header: 'Risk Level',
    cell: (props) => {
      const risk = getRiskRating(props.row.original);
      return (
        <Chip
          label={risk.toUpperCase()}
          sx={{
            color: riskColorMapping[risk],
            backgroundColor: `${riskColorMapping[risk]}15`,
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        />
      );
    },
  }),
];

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
const WaterSourceRisk = () => {
  const navigate = useNavigate();
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');
  const [type, setType] = useState('');
  const [showMapMarkers, setShowMapMarkers] = useState(false);
  const [selectedSource, setSelectedSource] = useState<WaterSourceRiskData | null>(null);

  // Fetch water risk data from API.
  const { data: waterRisks, error, isLoading } = useQuery<WaterSourceRiskData[], Error>({
    queryKey: ['waterSourceRisk', ward, village, hamlet, type],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (ward) params.append('ward', ward);
      if (village) params.append('village', village);
      if (hamlet) params.append('hamlet', hamlet);
      if (type) params.append('type', type);
      
      const response = await apiController.get<WaterSourceRiskData[]>(`/analysis?${params.toString()}`);
      return response;
    },
  });

  console.log(waterRisks)
  
  // Generate filter options from location data.
  const wardOptions = useMemo(
    () => Array.from(new Set(waterRisks?.map(item => item.location.ward) || [])),
    [waterRisks]
  );

  const typeOptions = useMemo(
    () => Array.from(new Set(waterRisks?.map(item => item.waterSourceType) || [])),
    [waterRisks]
  );

  const villageOptions = useMemo(
    () =>
      Array.from(
        new Set(
          waterRisks
            ?.filter(item => !ward || item.location.ward === ward)
            .map(item => item.location.village) || []
        )
      ),
    [waterRisks, ward]
  );

  const hamletOptions = useMemo(
    () =>
      Array.from(
        new Set(
          waterRisks
            ?.filter(
              item =>
                (!ward || item.location.ward === ward) &&
                (!village || item.location.village === village)
            )
            .map(item => item.location.hamlet) || []
        )
      ),
    [waterRisks, ward, village]
  );

  // Filter water risks based on selected filters.
  const filteredWaterRisks = useMemo(
    () =>
      waterRisks?.filter(
        item =>
          (!ward || item.location.ward === ward) &&
          (!village || item.location.village === village) &&
          (!hamlet || item.location.hamlet === hamlet) &&
          (!type || item.waterSourceType === type)
      ) || [],
    [waterRisks, ward, village, hamlet, type]
  );

  // Compute analytics based on computed risk ratings.
  const analytics = useMemo(() => {
    return filteredWaterRisks.reduce(
      (acc, source) => {
        const risk = getRiskRating(source);
        if (risk === 'critical') acc.critical++;
        else if (risk === 'moderate') acc.moderate++;
        else if (risk === 'safe') acc.safe++;
        acc.total++;
        return acc;
      },
      { total: 0, critical: 0, moderate: 0, safe: 0 }
    );
  }, [filteredWaterRisks]);

  // Handle filter changes.
  const handleFilterChange = (filterType: 'ward' | 'village' | 'hamlet' | 'type', value: string) => {
    if (filterType === 'ward') {
      setWard(value);
      setVillage('');
      setHamlet('');
    } else if (filterType === 'village') {
      setVillage(value);
      setHamlet('');
    } else if (filterType === 'hamlet') {
      setHamlet(value);
    } else if (filterType === 'type') {
      setType(value);
    }
    // Show markers when any filter is applied
    if (value) {
      setShowMapMarkers(true);
    }
  };

  // Navigate on row click in DataTable.
  const handleRowClick = (row: WaterSourceRiskData) => {
    navigate(`/water-source-risk/${row.waterSourceId}`);
  };

  const handleMarkerClick = (waterRisk: WaterSourceRiskData) => {
    setSelectedSource(waterRisk);
  };

  const handleCloseModal = () => {
    setSelectedSource(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" color="error.main">
          Failed to load water source data. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Header & Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 600 }}>
            Water Source Risk
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Filtered water sources analysis
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {typeOptions.length > 0 && (
            <FilterDropdown
              label="Type"
              value={type}
              options={typeOptions}
              onChange={(value) => handleFilterChange('type', value)}
            />
          )}
          {wardOptions.length > 0 && (
            <FilterDropdown
              label="Ward"
              value={ward}
              options={wardOptions}
              onChange={(value) => handleFilterChange('ward', value)}
            />
          )}
          {villageOptions.length > 0 && (
            <FilterDropdown
              label="Village"
              value={village}
              options={villageOptions}
              onChange={(value) => handleFilterChange('village', value)}
            />
          )}
          {hamletOptions.length > 0 && (
            <FilterDropdown
              label="Hamlet"
              value={hamlet}
              options={hamletOptions}
              onChange={(value) => handleFilterChange('hamlet', value)}
            />
          )}
        </Stack>  
      </Box>

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Sources"
            value={analytics.total}
            icon={<Waves />}
            iconColor="#3b82f6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Critical Risks"
            value={analytics.critical}
            icon={<Dangerous sx={{ color: riskColorMapping.critical }} />}
            iconColor={riskColorMapping.critical}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Moderate Risks"
            value={analytics.moderate}
            icon={<FaWrench color={riskColorMapping.moderate} />}
            iconColor={riskColorMapping.moderate}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Safe Facilities"
            value={analytics.safe}
            icon={<SafetyCheck />}
            iconColor={riskColorMapping.safe}
          />
        </Grid>
      </Grid>

      {/* Map Section with Legend */}
      <Paper
        sx={{
          p: 2,
          mb: 5,
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Risk Distribution Map
          </Typography>
          {!showMapMarkers && (
            <Typography variant="body2" color="text.secondary">
              Apply filters to view markers on the map
            </Typography>
          )}
        </Box>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Box sx={{ height: 500, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
            <Map
              defaultZoom={11}
              defaultCenter={{ lat: 11.2832241, lng: 7.6644755 }}
              mapId={GOOGLE_MAPS_API_KEY}
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              {showMapMarkers &&
                filteredWaterRisks.map((waterRisk) => {
                  const position = {
                    lat: waterRisk.location.coordinates[1],
                    lng: waterRisk.location.coordinates[0],
                  };
                  const risk = getRiskRating(waterRisk);
                  return (
                    <AdvancedMarker
                      key={waterRisk.waterSourceId}
                      position={position}
                      onClick={() => handleMarkerClick(waterRisk)}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          bgcolor: riskColorMapping[risk],
                          border: '2px solid #fff',
                        }}
                      />
                    </AdvancedMarker>
                  );
                })}
            </Map>
            {/* Legend Overlay - Only show when markers are visible */}
            {showMapMarkers && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  bgcolor: '#FFF',
                  p: 2,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Legend
                </Typography>
                <Stack spacing={0.5}>
                  <LegendItem color={riskColorMapping.critical} label="< 30m (Critical)" />
                  <LegendItem color={riskColorMapping.moderate} label="30m - 60m (Moderate)" />
                  <LegendItem color={riskColorMapping.safe} label=">= 60m (Safe)" />
                </Stack>
              </Box>
            )}
          </Box>
        </APIProvider>
      </Paper>

      {/* Data Table with Row Navigation */}
      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={waterRisks || []}
        onRowClick={handleRowClick}
      />

      {/* Details Modal */}
      <WaterSourceDetailsDialog open={!!selectedSource} onClose={handleCloseModal} waterSource={selectedSource} />
    </Box>
  );
};

// -----------------------------------------------------------------------------
// StatsCard Component (Uniform Size & Enhanced Analytics UI)
// -----------------------------------------------------------------------------
interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactElement;
  iconColor: string;
}

const StatsCard = React.memo(({ title, value, icon, iconColor }: StatsCardProps) => (
  <Card
    sx={{
      flex: 1,
      p: 2,
      borderRadius: 3,
      background: '#fff',
      minHeight: 150,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      transition: 'transform 0.2s ease-in-out',
    }}
  >
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {Number(value).toLocaleString()}
      </Typography>
      <Box
        sx={{
          bgcolor: `${iconColor}15`,
          p: 1.5,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {React.cloneElement(icon, { sx: { color: iconColor, fontSize: '1.75rem' } })}
      </Box>
    </Box>
  </Card>
));

// -----------------------------------------------------------------------------
// LegendItem Component
// -----------------------------------------------------------------------------
interface LegendItemProps {
  color: string;
  label: string;
}
const LegendItem = ({ color, label }: LegendItemProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box sx={{ width: 16, height: 16, bgcolor: color, borderRadius: '50%' }} />
    <Typography variant="caption">{label}</Typography>
  </Box>
);

// -----------------------------------------------------------------------------
// WaterSourceDetailsDialog Component (Updated Modal Styling)
// -----------------------------------------------------------------------------
interface WaterSourceDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  waterSource: WaterSourceRiskData | null;
}

const WaterSourceDetailsDialog = ({ open, onClose, waterSource }: WaterSourceDetailsDialogProps) => {
  const navigate = useNavigate();
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const riskRating = waterSource ? getRiskRating(waterSource) : null;

  // Add this new state at the top of the WaterSourceDetailsDialog component
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Gather all contaminants (facilities) into a flat list for the contamination summary
  const contaminants = useMemo(() => {
    if (!waterSource) return [];
    // Each facility type gets a label
    const facilityTypes = [
      { key: 'toilets', label: 'Toilet' },
      { key: 'soakAways', label: 'Soak Away' },
      { key: 'openDefecation', label: 'Open Defecation' },
      { key: 'gutters', label: 'Gutter' },
    ];
    let result: {
      id: string;
      name: string;
      distance: number;
      type: string;
      riskLevel: string;
    }[] = [];
    facilityTypes.forEach(({ key, label }) => {
      // @ts-ignore
      const arr: Facility[] = waterSource.facilities[key] || [];
      arr.forEach(fac => {
        result.push({
          id: fac.facilityId,
          name: fac.facilityId, // If you have a better name, replace here
          distance: fac.distance,
          type: label,
          riskLevel: fac.riskLevel,
        });
      });
    });
    return result;
  }, [waterSource]);

  // Add this image preview modal just before the return statement
  const ImagePreviewDialog = (
    <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="md">
      <DialogContent>
        <Box
          component="img"
          src={selectedImage || ''} 
          alt="Full size preview" 
          style={{ width: '100%', height: 'auto' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSelectedImage(null)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Update the contamination handling logic
  const handleContaminantDetails = (contaminant: { 
    id: string; 
    name: string; 
    type: string; 
    distance: number; 
    riskLevel: string 
  }) => {
    const routeMap = {
      'toilet': '/Toilet-Facilities',
      'gutter': '/gutters',
      'soak away': '/soak-aways',
      'open defecation': '/open-defecation',
      'dumpsite': '/dump-site'
    };

    const baseRoute = routeMap[contaminant.type.toLowerCase() as keyof typeof routeMap] || '/contaminants';
    navigate(`${baseRoute}/${contaminant.id}`);
  };

  return (
    <>
      {ImagePreviewDialog}
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            p: 3,
            bgcolor: '#1a237e',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            color: '#fff',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              Water Source Details
            </Typography>
            <IconButton onClick={onClose} sx={{ color: '#fff' }}>
              <X size={20} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: '#F8F9FA', p: 3 }}>
          {waterSource && (
            <Grid container spacing={3}>
              {/* Image Card */}
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#fff',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer', // Add cursor pointer
                  }}
                  onClick={() => waterSource?.location.picture && setSelectedImage(waterSource.location.picture)}
                >
                  {waterSource.location.picture ? (
                    <Box
                      component="img"
                      src={waterSource.location.picture}
                      alt="Water Source"
                      sx={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: 300,
                        borderRadius: 2,
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease-in-out',
                      }}
                    />
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                      Image not available
                    </Typography>
                  )}
                </Card>
              </Grid>
              {/* Location Details Card */}
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: '#fff',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
                    <MapPin size={20} style={{ marginRight: 8 }} />
                    Location Details
                  </Typography>
                  <Stack spacing={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <DetailItem icon={() => <Home color="primary" />} label="Ward" value={waterSource.location.ward} />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <DetailItem icon={() => <LocationCity color="success" />} label="Village" value={waterSource.location.village} />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <DetailItem icon={() => <PinDrop color="error" />} label="Hamlet" value={waterSource.location.hamlet} />
                      </Grid>
                      <Grid item xs={12}>
                        <DetailItem
                          icon={() => <CompassCalibrationSharp color="info" />}
                          label="Coordinates"
                          value={`${waterSource.location.coordinates[1]}, ${waterSource.location.coordinates[0]}`}
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Card>
              </Grid>
              {/* Risk Summary Card */}
              <Grid item xs={12}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: '#fff',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    mb: 2,
                    gap: 2,
                    flexWrap: 'wrap' 
                  }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 600, 
                      color: '#1a237e',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <AlertCircle size={20} />
                      Risk Summary
                    </Typography>
                  </Box>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label={`Critical: ${waterSource.summary.toilets.critical}`}
                        onClick={() => setSelectedRisk('Critical')}
                        sx={{
                          bgcolor: '#fee2e2',
                          color: '#dc2626',
                          fontWeight: 600,
                          borderRadius: 1,
                          cursor: 'pointer',
                        }}
                      />
                      <Chip
                        label={`Moderate: ${waterSource.summary.toilets.moderate}`}
                        onClick={() => setSelectedRisk('Moderate')}
                        sx={{
                          bgcolor: '#ffedd5',
                          color: '#f97316',
                          fontWeight: 600,
                          borderRadius: 1,
                          cursor: 'pointer',
                        }}
                      />
                      {/* <Chip
                        label={`Good: ${waterSource.summary.toilets.good}`}
                        onClick={() => setSelectedRisk('Good')}
                        sx={{
                          bgcolor: '#dcfce7',
                          color: '#16a34a',
                          fontWeight: 600,
                          borderRadius: 1,
                          cursor: 'pointer',
                        }}
                      /> */}
                      {/* {riskRating && (
                        <Chip
                          label={`RISK: ${riskRating.toUpperCase()}`}
                          sx={{
                            color: riskColorMapping[riskRating],
                            backgroundColor: `${riskColorMapping[riskRating]}15`,
                            fontWeight: 'bold',
                          }}
                        />
                      )} */}
                    </Box>
                  </Stack>
                </Card>
              </Grid>
              {/* Contamination Section */}
              <Grid item xs={12}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: '#fff',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    mt: 2,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
                    Contamination Summary
                  </Typography>
                  {contaminants.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No contaminants found for this water source.
                    </Typography>
                  ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', padding: 8 }}>Contaminant Type</th>
                            <th style={{ textAlign: 'left', padding: 8 }}>Distance (m)</th>
                            <th style={{ textAlign: 'left', padding: 8 }}>action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contaminants.map(contaminant => (
                            <tr key={contaminant.id}>
                              <td style={{ padding: 8 }}>{contaminant.type}</td>
                              <td style={{ padding: 8 }}>{contaminant.distance}</td>
                              <td style={{ padding: 8 }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleContaminantDetails(contaminant)}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  )}
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)',
            justifyContent: 'space-between',
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              color: '#1a237e',
              fontWeight: 600,
              border: '1px solid #1a237e',
              '&:hover': { bgcolor: 'rgba(26,35,126,0.1)' },
            }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              if (waterSource) {
                navigate(`/water-source-risk/${waterSource.waterSourceId}`);
                onClose();
              }
            }}
            sx={{
              bgcolor: '#1a237e',
              color: '#fff',
              fontWeight: 600,
              '&:hover': { bgcolor: '#14207a' },
            }}
          >
            View Full Details
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

interface DetailItemProps {
  icon: () => JSX.Element;
  label: string;
  value: string;
}

const DetailItem = ({ icon, label, value }: DetailItemProps) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
    {icon()}
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        {value}
      </Typography>
    </Box>
  </Box>
);

export default WaterSourceRisk;
