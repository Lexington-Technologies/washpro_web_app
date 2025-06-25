import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Select,
  MenuItem,
  LinearProgress,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Grid,
} from '@mui/material';
import { FilterAlt, Add } from '@mui/icons-material';
import { FaFileAlt, FaCompass } from 'react-icons/fa';

interface SpaceDistribution {
  type: string;
  count: number;
  color: string;
}

interface FilterOption {
  value: string;
  label: string;
}

const spaceDistribution: SpaceDistribution[] = [
  { type: 'Schools', count: 245, color: '#00B8D9' },
  { type: 'Parks', count: 180, color: '#36B37E' },
  { type: 'Markets', count: 120, color: '#FF5630' },
  { type: 'Community Centers', count: 95, color: '#6554C0' },
];

const filterOptions: FilterOption[] = [
  { value: 'all', label: 'All Types' },
  { value: 'schools', label: 'Schools' },
  { value: 'parks', label: 'Parks' },
  { value: 'markets', label: 'Markets' },
  { value: 'community', label: 'Community Centers' },
];

const getMaxCount = (data: SpaceDistribution[]) =>
  Math.max(...data.map((space) => space.count));

const DistributionBar: React.FC<SpaceDistribution> = ({ type, count, color }) => {
  const maxCount = getMaxCount(spaceDistribution);
  return (
    <Box sx={{ mb: 2, backgroundColor: '#F1F1F5', }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2">{type}</Typography>
        <Typography variant="body2" color="text.secondary">
          {count}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={(count / maxCount) * 100}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
            borderRadius: 4,
          },
        }}
      />
    </Box>
  );
};

const FilterSelect: React.FC<{
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent) => void;
}> = ({ label, value, onChange }) => (
  <FormControl fullWidth size="small">
    <InputLabel>{label}</InputLabel>
    <Select value={value} label={label} onChange={onChange}>
      {filterOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

const PublicSpaces: React.FC = () => {
  const [spaceType, setSpaceType] = React.useState<string>('all');
  const [ward, setWard] = React.useState<string>('all');
  const [status, setStatus] = React.useState<string>('all');

  const handleSpaceTypeChange = (event: SelectChangeEvent) => setSpaceType(event.target.value);
  const handleWardChange = (event: SelectChangeEvent) => setWard(event.target.value);
  const handleStatusChange = (event: SelectChangeEvent) => setStatus(event.target.value);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h5" sx={{ color: '#25306B' }}>
              Public Space Types
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detailed insights about your selected location
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterAlt />}
              sx={{ color: 'text.primary' }}
            >
              Filter
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ bgcolor: '#00B8D9' }}
            >
              Add Space
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FilterSelect
                label="Space Type"
                value={spaceType}
                onChange={handleSpaceTypeChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FilterSelect
                label="Ward"
                value={ward}
                onChange={handleWardChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FilterSelect
                label="Status"
                value={status}
                onChange={handleStatusChange}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Distribution Statistics and Map */}
        <Grid container spacing={3}>
          {/* Distribution Statistics Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#25306B', fontWeight: 600 }}>
                  Distribution Statistics
                </Typography>
                {spaceDistribution.map((space) => (
                  <DistributionBar
                    key={space.type}
                    type={space.type}
                    count={space.count}
                    color={space.color}
                  />
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Location Distribution Map */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#25306B', fontWeight: 600 }}>
                    Location Distribution
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<FaFileAlt />}
                      sx={{ bgcolor: '#2CBEEF', borderRadius: 2.5 }}
                    >
                      View Report
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<FaCompass />}
                      sx={{ bgcolor: '#16A34A' }}
                    >
                      Start Exploration
                    </Button>
                  </Box>
                </Box>
                <Box
                  sx={{
                    position: 'relative',
                    paddingTop: '56.25%', // 16:9 aspect ratio
                    borderRadius: 2,
                    overflow: 'hidden',
                    flexGrow: 1,
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d150598.46582809655!2d7.648291125907573!3d11.296615180519947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11b27fc3df7cf997%3A0x7f813ac2a29bec28!2sKudan%2C%20Kaduna!5e0!3m2!1sen!2sng!4v1735721268833!5m2!1sen!2sng"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0,
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PublicSpaces;
