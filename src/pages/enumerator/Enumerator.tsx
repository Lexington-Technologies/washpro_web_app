import React from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { FaPlus } from 'react-icons/fa';

interface Intervention {
  name: string;
  location: string;
  category: string;
  startDate: string;
  endDate: string;
}

const Enumerator: React.FC = () => {
  const interventions: Intervention[] = [
    {
      name: 'Chlorination Initiative',
      location: 'Hunkuyi',
      category: 'Chlorination',
      startDate: '2025-01-05',
      endDate: '2025-01-12',
    },
    {
      name: 'Waste Management Drive',
      location: 'Kudan Toun',
      category: 'Waste Disposal',
      startDate: '2025-01-03',
      endDate: '2025-01-10',
    },
    {
      name: 'Community Health Training',
      location: 'Doka',
      category: 'Community Training',
      startDate: '2024-12-15',
      endDate: '2024-12-20',
    },
    {
      name: 'Borehole Maintenance',
      location: 'Likoro',
      category: 'Chlorination',
      startDate: '2024-12-15',
      endDate: '2024-12-20',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Box>
          <Typography variant="h4">Enumerator Management</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Oversee and manage ongoing interventions, assignments, and performance metrics for enumerators.
          </Typography>
        </Box>        <Button variant="contained" color="primary">
          <FaPlus style={{ marginRight: 10}}/>
          Add New
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#1a237e' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Full Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Location</TableCell>
              <TableCell sx={{ color: 'white' }}>Category</TableCell>
              <TableCell sx={{ color: 'white' }}>Start Date & End Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interventions.map((intervention, index) => (
              <TableRow key={index}>
                <TableCell>{intervention.name}</TableCell>
                <TableCell>{intervention.location}</TableCell>
                <TableCell>{intervention.category}</TableCell>
                <TableCell>
                  {`${intervention.startDate} - ${intervention.endDate}`}
                </TableCell>
                <TableCell>
                  <Button size="small" color="primary">
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography variant="body2" color="text.secondary">
          Showing 1 to 3 of 3 entries
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Button size="small" disabled>
            Previous
          </Button>
          <Chip label="1" color="primary" />
          <Button size="small">Next</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Enumerator;
