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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Stack
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
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  MdAdd, 
  MdKeyboardArrowDown, 
  MdAccessTime, 
  MdFileDownload 
} from 'react-icons/md';

const pieChartData = [
  { name: "Operational", value: 50, color: "#3B82F6" },
  { name: "Maintenance", value: 150, color: "#EC4899" },
  { name: "Capital Expenditure", value: 80, color: "#06B6D4" },
  { name: "Aids & Grants", value: 120, color: "#F97316" },
  { name: "Community Financing", value: 20, color: "#FACC15" }
];

// Calculate total for percentage calculation
const totalValue = pieChartData.reduce((sum, item) => sum + item.value, 0);

 // Sample data for funds
 const fundCategories = [
  { name: "Maintenance Fund", used: "₦2,450,000", total: "₦3,000,000", color: "#4F46E5" },
  { name: "Operational Fund", used: "₦1,780,000", total: "₦2,500,000", color: "#3B82F6" },
  { name: "Capital Expenditure", used: "₦5,125,000", total: "₦8,000,000", color: "#10B981" },
  { name: "Aids & Grants", used: "₦750,000", total: "₦1,200,000", color: "#F59E0B" },
  { name: "Community Financing", used: "₦325,000", total: "₦500,000", color: "#EF4444" }
];

// Sample data for monthly expenditure
const monthlyData = [
  { name: 'Jan', operational: 350000, maintenance: 120000 },
  { name: 'Feb', operational: 420000, maintenance: 180000 },
  { name: 'Mar', operational: 380000, maintenance: 210000 },
  { name: 'Apr', operational: 430000, maintenance: 290000 },
  { name: 'May', operational: 510000, maintenance: 340000 },
  { name: 'Jun', operational: 590000, maintenance: 470000 },
  { name: 'Jul', operational: 480000, maintenance: 390000 },
  { name: 'Aug', operational: 520000, maintenance: 450000 },
];

// Sample data for payments
const paymentsData = [
  { month: 'Jan', initiated: '₦450,000', paid: '₦450,000', status: 'Completed', date: '31/01/2025' },
  { month: 'Feb', initiated: '₦600,000', paid: '₦600,000', status: 'Completed', date: '28/02/2025' },
  { month: 'Mar', initiated: '₦590,000', paid: '₦590,000', status: 'Completed', date: '31/03/2025' },
  { month: 'Apr', initiated: '₦720,000', paid: '₦650,000', status: 'Partial', date: '15/04/2025' },
  { month: 'May', initiated: '₦850,000', paid: '₦0', status: 'Pending', date: 'Scheduled 15/05/2025' },
  { month: 'Jun', initiated: '₦1,060,000', paid: '₦0', status: 'Scheduled', date: 'Due 15/06/2025' },
];

const FinancialSummary = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFund, setSelectedFund] = useState("Operational Fund");
  const [timeRange, setTimeRange] = useState("6M");
  const [openModal, setOpenModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    fundCategory: '',
    amount: '',
    date: '',
    description: '',
    status: 'Completed'
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option?: string) => {
    if (option) {
      setSelectedFund(option);
    }
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setPaymentData({
      fundCategory: '',
      amount: '',
      date: '',
      description: '',
      status: 'Completed'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleSubmit = () => {
    // Here you would typically make an API call to save the payment
    console.log('Payment data:', paymentData);
    handleCloseModal();
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

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Financial Summary</Typography>
        <Button 
          variant="contained" 
          startIcon={<MdAdd />} 
          sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#047857' } }}
          onClick={handleOpenModal}
        >
          Record Payment
        </Button>
      </Box>

      {/* Alert */}
      {/* <Alert 
        severity="error" 
        sx={{ 
          mb: 3, 
          bgcolor: '#FEE2E2', 
          color: '#991B1B',
          '& .MuiAlert-icon': { color: '#991B1B' }
        }}
      >
        Alert: There are 4 month(s) with pending operational payments!
      </Alert> */}

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
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => {
                      const percentage = ((value / totalValue) * 100).toFixed(1);
                      return [`${percentage}%`, 'Percentage'];
                    }}
                  />
                  <Legend 
                    layout="vertical" 
                    align="right" 
                    verticalAlign="middle" 
                    wrapperStyle={{ paddingLeft: '20px' }}
                    formatter={(value, entry, index) => (
                      <span style={{ color: '#000000' }}>{value}</span>
                    )}
                  />
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

      {/* Record Payment Modal */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
          <Typography variant="h6" fontWeight="bold">Record New Payment</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Fund Category</InputLabel>
              <Select
                name="fundCategory"
                value={paymentData.fundCategory}
                label="Fund Category"
                onChange={handleInputChange}
              >
                {fundCategories.map((category) => (
                  <MenuItem key={category.name} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="amount"
              label="Amount (₦)"
              value={paymentData.amount}
              onChange={handleInputChange}
              fullWidth
              type="number"
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₦</Typography>,
              }}
            />

            <TextField
              name="date"
              label="Payment Date"
              type="date"
              value={paymentData.date}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={paymentData.status}
                label="Status"
                onChange={handleInputChange}
              >
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Partial">Partial</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="description"
              label="Description"
              value={paymentData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #E5E7EB' }}>
          <Button 
            onClick={handleCloseModal}
            sx={{ 
              color: '#6B7280',
              '&:hover': {
                bgcolor: 'rgba(107, 114, 128, 0.1)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handleSubmit}
            sx={{ 
              bgcolor: '#10B981',
              '&:hover': {
                bgcolor: '#047857'
              }
            }}
          >
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FinancialSummary;