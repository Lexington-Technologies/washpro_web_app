import { Box, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { getWards, getHamletsByVillage, getVillagesByWard } from '../utils/location-filter';

const LocationFilter = ({ward, village, hamlet, setWard, setVillage, setHamlet}) => {
  const wards = getWards();
  const villages = ward? getVillagesByWard(ward,) : [];
  const hamlets = village ? getHamletsByVillage(ward, village) : [];

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2}>
        {/* Ward Select */}
        <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 180 }}>
          <InputLabel>Ward</InputLabel>
          <Select
            value={ward}
            label="Ward"
            sx={{ height: 45 }}
            onChange={(e) => {
              setWard(e.target.value);
              setVillage('');
              setHamlet('');
            }}
          >
            <MenuItem value="">
              <em>Select Ward</em>
            </MenuItem>
            {wards.map((ward) => (
              <MenuItem key={ward} value={ward}>{ward}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Village Select */}
        <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 120 }} disabled={!ward}>
          <InputLabel>Village</InputLabel>
          <Select
            value={village}
            label="Village"
            sx={{ height: 45 }}
            onChange={(e) => {
              setVillage(e.target.value);
              setHamlet('');
            }}
          >
            <MenuItem value="">
              <em>Select Village</em>
            </MenuItem>
            {villages.map((village) => (
              <MenuItem key={village} value={village}>{village}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Hamlet Select */}
        <FormControl variant="outlined" sx={{ mb: 2, height: 40, minWidth: 120 }} disabled={!village}>
          <InputLabel>Hamlet</InputLabel>
          <Select
            value={hamlet}
            label="Hamlet"
            sx={{ height: 45 }}
            onChange={(e) => setHamlet(e.target.value)}
          >
            <MenuItem value="">
              <em>Select Hamlet</em>
            </MenuItem>
            {hamlets.map((hamlet) => (
              <MenuItem key={hamlet} value={hamlet}>{hamlet}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default LocationFilter; 