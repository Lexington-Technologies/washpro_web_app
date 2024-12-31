// Types
interface SpaceDistribution {
  type: string;
  count: number;
  color: string;
}

interface FilterOption {
  value: string;
  label: string;
}

// Components/PublicSpaces.tsx
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
import {
  FilterAlt,
  Add,
  Download,
  PlayArrow
} from '@mui/icons-material';

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

const DistributionBar: React.FC<SpaceDistribution> = ({ type, count, color }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="body2">{type}</Typography>
      <Typography variant="body2" color="text.secondary">
        {count}
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={(count / 245) * 100}
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

  const handleSpaceTypeChange = (event: SelectChangeEvent) => {
    setSpaceType(event.target.value);
  };

  const handleWardChange = (event: SelectChangeEvent) => {
    setWard(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
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

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
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
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Location Distribution</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      sx={{ bgcolor: '#00B8D9' }}
                    >
                      View Report
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      color="success"
                    >
                      Start Exploration
                    </Button>
                  </Box>
                </Box>
                <Box
                  sx={{
                    height: 400,
                    bgcolor: 'action.hover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Map visualization would go here
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