import { Box, Card, Grid, Typography, Select, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Chip, CircularProgress, Pagination } from '@mui/material';
import { Check, Wrench, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
  } from '@tanstack/react-table';
  import axios from 'axios';  

interface Gutter {
    _id: string;
    picture?: string;
    ward: string;
    village: string;
    hamlet: string;
    condition: string;
    status: string;
    dischargePoint: string;
    capturedAt: string;
  }
  
  const columns: ColumnDef<Gutter>[] = [
    {
      accessorKey: 'picture',
      header: 'Picture',
      cell: (info) => (
        info.getValue() ? (
          <img
            src={info.getValue() as string}
            alt="Gutter"
            style={{
              width: 50,
              height: 50,
              objectFit: 'cover',
              borderRadius: '4px',
            }}
          />
        ) : null
      ),
    },
    { accessorKey: 'ward', header: 'Ward' },
    { accessorKey: 'village', header: 'Village' },
    { accessorKey: 'hamlet', header: 'Hamlet' },
    { accessorKey: 'condition', header: 'Condition' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => (
        <Chip
          label={info.getValue() as string}
          size="small"
          sx={{
            bgcolor: info.getValue() === 'Maintained' ? '#D1FAE5' : '#FEF3C7',
            color: info.getValue() === 'Maintained' ? '#10B981' : '#F59E0B',
            fontWeight: 500,
          }}
        />
      ),
    },
    { accessorKey: 'dischargePoint', header: 'Discharge Point' },
    {
      accessorKey: 'capturedAt',
      header: 'Captured At',
      cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
    },
  ];
  

  const MaintenanceTable: React.FC = () => {
    const [gutters, setGutters] = useState<Gutter[]>([]);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const data = await axios.get<{ data: Gutter[] }>('/gutters');
          setGutters(data);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    const table = useReactTable({
      data: gutters,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });  

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h5" sx={{ color: '#1e3a8a', fontWeight: 'bold' }}>
          Gutters
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Select size="small" defaultValue="lga" sx={{ minWidth: 120 }}>
            <MenuItem value="lga">LGA</MenuItem>
          </Select>
          <Select size="small" defaultValue="ward" sx={{ minWidth: 120 }}>
            <MenuItem value="ward">Ward</MenuItem>
          </Select>
          <Select size="small" defaultValue="village" sx={{ minWidth: 120 }}>
            <MenuItem value="village">Village</MenuItem>
          </Select>
          <Select size="small" defaultValue="hamlet" sx={{ minWidth: 120 }}>
            <MenuItem value="hamlet">Hamlet</MenuItem>
          </Select>
          <Button variant="contained" sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}>
            View Report
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ color: '#1e3a8a' }}>🚰</Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>35</Typography>
                <Typography color="text.secondary" variant="body2">Total Gutters</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Check size={24} color="#22c55e" />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#22c55e' }}>14</Typography>
                <Typography color="text.secondary" variant="body2">Maintained</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Wrench size={24} color="#ef4444" />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ef4444' }}>3</Typography>
                <Typography color="text.secondary" variant="body2">Overfilled</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AlertTriangle size={24} color="#eab308" />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#eab308' }}>7</Typography>
                <Typography color="text.secondary" variant="body2">Unmaintained</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Data Table */}
      <Card sx={{ mb: 3 }}>
      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} sx={{ bgcolor: '#F8FAFC' }}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No gutters found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 3,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing 1 to {table.getRowModel().rows.length} of {gutters.length} entries
        </Typography>
        <Pagination
          count={Math.ceil(gutters.length / 10)} // Adjust pagination logic if needed
          sx={{
            '& .Mui-selected': {
              bgcolor: '#0EA5E9',
              color: '#FFFFFF',
            },
          }}
        />
      </Box>
      </Card>

      {/* Distribution Chart */}
<Box
  sx={{
    display: "flex",
    flexDirection: "column",
    width: 1136,
    p: 4,
    bgcolor: "white",
    borderRadius: 2,
    border: 1,
    borderColor: "grey.300",
  }}
>
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      mb: 3,
    }}
  >
    <Typography variant="h6" fontWeight="600" color="text.primary">
      Gutter Type Distribution
    </Typography>
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button variant="outlined" size="small">
        Monthly
      </Button>
      <Button variant="outlined" size="small">
        Yearly
      </Button>
    </Box>
  </Box>

  <Grid container spacing={2}>
    {/* Constructed */}
    <Grid item xs>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          border: 1,
          borderColor: "grey.300",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="body1" color="text.primary">
            Constructed
          </Typography>
          <Typography variant="body1" color="primary">
            245
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={82.45}
          sx={{
            height: 8,
            borderRadius: 5,
            "& .MuiLinearProgress-bar": { bgcolor: "#38bdf8" }, // Sky Blue
          }}
        />
      </Box>
    </Grid>

    {/* Surface */}
    <Grid item xs>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          border: 1,
          borderColor: "grey.300",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="body1" color="text.primary">
            Surface
          </Typography>
          <Typography variant="body1" color="success.main">
            180
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={59.6}
          sx={{
            height: 8,
            borderRadius: 5,
            "& .MuiLinearProgress-bar": { bgcolor: "#22c55e" }, // Green
          }}
        />
      </Box>
    </Grid>

    {/* Dug */}
    <Grid item xs>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          border: 1,
          borderColor: "grey.300",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="body1" color="text.primary">
            Dug
          </Typography>
          <Typography variant="body1" color="warning.main">
            120
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={39.74}
          sx={{
            height: 8,
            borderRadius: 5,
            "& .MuiLinearProgress-bar": { bgcolor: "#fde047" }, // Yellow
          }}
        />
      </Box>
    </Grid>
  </Grid>
</Box>
    </Box>
  );
};

export default MaintenanceTable;