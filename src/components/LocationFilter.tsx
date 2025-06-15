import { Box, FormControl, InputLabel, MenuItem, Select, Stack, SelectChangeEvent } from '@mui/material';
import { useState, useEffect } from 'react';
import { getWards, getVillagesByWard, getHamletsByVillage } from '../utils/location-filter';

interface LocationFilterProps {
  onFilterChange: (filters: { ward: string; village: string; hamlet: string }) => void;
  initialValues?: {
    ward?: string;
    village?: string;
    hamlet?: string;
  };
  disabled?: boolean;
}

const LocationFilter = ({
  onFilterChange,
  initialValues = { ward: '', village: '', hamlet: '' },
  disabled = false,
}: LocationFilterProps) => {
  const [ward, setWard] = useState(initialValues.ward || '');
  const [village, setVillage] = useState(initialValues.village || '');
  const [hamlet, setHamlet] = useState(initialValues.hamlet || '');

  // Get available options based on selections
  const wardOptions = getWards();
  const villageOptions = ward ? getVillagesByWard(ward) : [];
  const hamletOptions = (ward && village) ? getHamletsByVillage(ward, village) : [];

  // Reset dependent filters when parent filter changes
  useEffect(() => {
    if (!ward) {
      setVillage('');
      setHamlet('');
    }
    if (!village) {
      setHamlet('');
    }
  }, [ward, village]);

  // Notify parent component of filter changes
  useEffect(() => {
    onFilterChange({ ward, village, hamlet });
  }, [ward, village, hamlet, onFilterChange]);

  const handleWardChange = (event: SelectChangeEvent) => {
    setWard(event.target.value);
  };

  const handleVillageChange = (event: SelectChangeEvent) => {
    setVillage(event.target.value);
  };

  const handleHamletChange = (event: SelectChangeEvent) => {
    setHamlet(event.target.value);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2}>
        <FormControl 
          variant="outlined" 
          sx={{ mb: 2, height: 40, minWidth: 120 }}
          disabled={disabled}
        >
          <InputLabel>Ward</InputLabel>
          <Select
            value={ward}
            onChange={handleWardChange}
            label="Ward"
            sx={{ height: 45 }}
          >
            <MenuItem value="">
              <em>Select Ward</em>
            </MenuItem>
            {wardOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl 
          variant="outlined" 
          sx={{ mb: 2, height: 40, minWidth: 120 }}
          disabled={!ward || disabled}
        >
          <InputLabel>Village</InputLabel>
          <Select
            value={village}
            onChange={handleVillageChange}
            label="Village"
            sx={{ height: 45 }}
          >
            <MenuItem value="">
              <em>Select Village</em>
            </MenuItem>
            {villageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl 
          variant="outlined" 
          sx={{ mb: 2, height: 40, minWidth: 120 }}
          disabled={!village || disabled}
        >
          <InputLabel>Hamlet</InputLabel>
          <Select
            value={hamlet}
            onChange={handleHamletChange}
            label="Hamlet"
            sx={{ height: 45 }}
          >
            <MenuItem value="">
              <em>Select Hamlet</em>
            </MenuItem>
            {hamletOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default LocationFilter;