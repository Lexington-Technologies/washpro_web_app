import { Box, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { useState, useEffect } from 'react';

interface LocationFilterProps {
  wardOptions: string[];
  villageOptions: string[];
  hamletOptions: string[];
  onFilterChange: (filters: { ward: string; village: string; hamlet: string }) => void;
  initialValues?: {
    ward?: string;
    village?: string;
    hamlet?: string;
  };
}

const LocationFilter = ({
  wardOptions,
  villageOptions,
  hamletOptions,
  onFilterChange,
  initialValues = { ward: 'All', village: 'All', hamlet: 'All' }
}: LocationFilterProps) => {
  const [ward, setWard] = useState(initialValues.ward || 'All');
  const [village, setVillage] = useState(initialValues.village || 'All');
  const [hamlet, setHamlet] = useState(initialValues.hamlet || 'All');

  // Reset dependent filters when parent filter changes
  useEffect(() => {
    if (ward === 'All') {
      setVillage('All');
      setHamlet('All');
    }
    if (village === 'All') {
      setHamlet('All');
    }
  }, [ward, village]);

  // Notify parent component of filter changes
  useEffect(() => {
    onFilterChange({ ward, village, hamlet });
  }, [ward, village, hamlet, onFilterChange]);

  const handleWardChange = (event: any) => {
    setWard(event.target.value);
  };

  const handleVillageChange = (event: any) => {
    setVillage(event.target.value);
  };

  const handleHamletChange = (event: any) => {
    setHamlet(event.target.value);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2}>
        <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 120 }}>
          <InputLabel>Ward</InputLabel>
          <Select
            value={ward}
            onChange={handleWardChange}
            label="Ward"
            sx={{ height: 45 }}
          >
            {wardOptions.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl 
          variant="outlined" 
          sx={{ mb: 2, height: 40, minWidth: 120 }}
          disabled={ward === 'All'}
        >
          <InputLabel>Village</InputLabel>
          <Select
            value={village}
            onChange={handleVillageChange}
            label="Village"
            sx={{ height: 45 }}
          >
            {villageOptions.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl 
          variant="outlined" 
          sx={{ mb: 2, height: 40, minWidth: 120 }}
          disabled={village === 'All'}
        >
          <InputLabel>Hamlet</InputLabel>
          <Select
            value={hamlet}
            onChange={handleHamletChange}
            label="Hamlet"
            sx={{ height: 45 }}
          >
            {hamletOptions.map((option, index) => (
              <MenuItem key={index} value={option}>
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