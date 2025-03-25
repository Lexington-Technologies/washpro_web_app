import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { 
  MdAdd, 
  MdKeyboardArrowDown, 
  MdAccessTime, 
  MdFileDownload 
} from 'react-icons/md';

// Sample data
const fundCategories = [
  { name: "Operational Fund", used: "₦0", total: "₦0", color: "#3B82F6" },
  { name: "Maintenance Fund", used: "₦0", total: "₦0", color: "#4F46E5" },
  { name: "Capital Expenditure", used: "₦0", total: "₦0", color: "#10B981" },
  { name: "Aids & Grants", used: "₦0", total: "₦0", color: "#F59E0B" },
  { name: "Community Financing", used: "₦0", total: "₦0", color: "#EF4444" }
];

const pieChartData = [
  { name: "Operational", value: 0, color: "#3B82F6" },
  { name: "Maintenance", value: 0, color: "#EC4899" },
  { name: "Capital Expenditure", value: 0, color: "#06B6D4" },
  { name: "Aids & Grants", value: 0, color: "#F97316" },
  { name: "Community Financing", value: 0, color: "#FACC15" }
];

const monthlyData = [
  { name: 'Jan', operational: 0, maintenance: 0 },
  { name: 'Feb', operational: 0, maintenance: 0 },
  { name: 'Mar', operational: 0, maintenance: 0 },
  { name: 'Apr', operational: 0, maintenance: 0 },
  { name: 'May', operational: 0, maintenance: 0 },
  { name: 'Jun', operational: 0, maintenance: 0 },
  { name: 'Jul', operational: 0, maintenance: 0 },
  { name: 'Aug', operational: 0, maintenance: 0 },
];

const paymentsData = [
  { month: 'Jan', initiated: '₦0', paid: '₦0', status: '-', date: '- - -' },
  { month: 'Feb', initiated: '₦0', paid: '₦0', status: '-', date: '- - -' },
  { month: 'March', initiated: '₦0', paid: 'N0', status: '-', date: '- - -' },
  { month: 'April', initiated: '₦0', paid: '₦0', status: '-', date: '- - - ' },
  { month: 'May', initiated: '₦0', paid: '₦0', status: '-', date: '- - - ' },
  { month: 'June', initiated: '₦0', paid: 'N0', status: '-', date: '- - -' },
];

const FinancialSummary = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFund, setSelectedFund] = useState("Operational Fund");
  const [timeRange, setTimeRange] = useState("6M");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    if (option) {
      setSelectedFund(option);
    }
    setAnchorEl(null);
  };

  const getStatusChip = (status) => {
    if (status === 'Paid') {
      return <Chip label="Paid" size="small" sx={{ bgcolor: '#DEF7EC', color: '#03543E', fontSize: '0.75rem' }} />;
    } else if (status === 'Partial') {
      return <Chip label="Partial" size="small" sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontSize: '0.75rem' }} />;
    } else {
      return <Chip label="-" size="small" sx={{ bgcolor: '#FEE2E2', color: '#7F1D1D', fontSize: '0.75rem' }} />;
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Financial Summary</Typography>
        <Button 
          variant="contained" 
          startIcon={<MdAdd />} 
          sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#047857' } }}
        >
          Record Payment
        </Button>
      </Box>

      {/* Alert */}
      <Alert 
        severity="error" 
        sx={{ 
          mb: 3, 
          bgcolor: '#FEE2E2', 
          color: '#991B1B',
          '& .MuiAlert-icon': { color: '#991B1B' }
        }}
      >
        Alert: There are 4 month(s) with pending operational payments!
      </Alert>

      {/* Fund Categories */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {fundCategories.map((fund, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {fund.name}
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  {fund.used}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(parseInt(fund.used.replace(/[^0-9]/g, '')) / parseInt(fund.total.replace(/[^0-9]/g, ''))) * 100}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: fund.color,
                    }
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Total: {fund.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MdAccessTime size={20} style={{ marginRight: 8 }} />
              <Typography variant="body1" fontWeight="medium">Funding Distribution</Typography>
            </Box>
            <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={1}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Current distribution of funds across different categories
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MdAccessTime size={20} style={{ marginRight: 8 }} />
                <Typography variant="body1" fontWeight="medium">Monthly Trends</Typography>
              </Box>
              <Box>
                <Button 
                  variant={timeRange === "6M" ? "contained" : "outlined"} 
                  size="small" 
                  onClick={() => setTimeRange("6M")}
                  sx={{ 
                    minWidth: 40, 
                    mr: 1,
                    bgcolor: timeRange === "6M" ? '#3B82F6' : 'transparent',
                    color: timeRange === "6M" ? 'white' : '#3B82F6',
                    '&:hover': { bgcolor: timeRange === "6M" ? '#2563EB' : 'rgba(59, 130, 246, 0.1)' }
                  }}
                >
                  6M
                </Button>
                <Button 
                  variant={timeRange === "1Y" ? "contained" : "outlined"} 
                  size="small"
                  onClick={() => setTimeRange("1Y")}
                  sx={{ 
                    minWidth: 40, 
                    mr: 1,
                    bgcolor: timeRange === "1Y" ? '#3B82F6' : 'transparent',
                    color: timeRange === "1Y" ? 'white' : '#3B82F6',
                    '&:hover': { bgcolor: timeRange === "1Y" ? '#2563EB' : 'rgba(59, 130, 246, 0.1)' }
                  }}
                >
                  1Y
                </Button>
                <Button 
                  variant={timeRange === "All" ? "contained" : "outlined"} 
                  size="small"
                  onClick={() => setTimeRange("All")}
                  sx={{ 
                    minWidth: 40,
                    bgcolor: timeRange === "All" ? '#3B82F6' : 'transparent',
                    color: timeRange === "All" ? 'white' : '#3B82F6',
                    '&:hover': { bgcolor: timeRange === "All" ? '#2563EB' : 'rgba(59, 130, 246, 0.1)' }
                  }}
                >
                  All
                </Button>
              </Box>
            </Box>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorOperational" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMaintenance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="operational" 
                    stroke="#0EA5E9" 
                    fillOpacity={1} 
                    fill="url(#colorOperational)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="maintenance" 
                    stroke="#8B5CF6" 
                    fillOpacity={1} 
                    fill="url(#colorMaintenance)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Historical trends of operational and maintenance funds
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Payments Table */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" fontWeight="medium" sx={{ mr: 1 }}>
              {selectedFund}
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleClick}
              sx={{ color: 'primary.main' }}
            >
              <MdKeyboardArrowDown />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => handleClose()}
            >
              {fundCategories.map((option) => (
                <MenuItem 
                  key={option.name} 
                  onClick={() => handleClose(option.name)}
                  selected={option.name === selectedFund}
                >
                  {option.name}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              6 entries
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<MdFileDownload />}
              size="small"
              sx={{ borderColor: '#D1D5DB', color: '#374151' }}
            >
              Export
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell>Month</TableCell>
                <TableCell>Initiated</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentsData.map((row) => (
                <TableRow key={row.month}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>{row.initiated}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {row.paid}
                      <LinearProgress 
                        variant="determinate" 
                        value={(parseInt(row.paid.replace(/[^0-9]/g, '')) / parseInt(row.initiated.replace(/[^0-9]/g, ''))) * 100}
                        sx={{ 
                          ml: 2,
                          width: 100,
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: row.status === 'Paid' ? '#10B981' : row.status === 'Partial' ? '#F59E0B' : '#EF4444',
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{getStatusChip(row.status)}</TableCell>
                  <TableCell>{row.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default FinancialSummary;