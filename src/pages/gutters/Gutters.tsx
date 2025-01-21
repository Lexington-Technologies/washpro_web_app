import {
  Box,
  Card,
  Typography,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Pagination} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  FilterAlt,
  Fullscreen,
  MoreHoriz
} from '@mui/icons-material';
import { FaChartPie, FaFilter } from 'react-icons/fa6';
import { FaDownload } from 'react-icons/fa';




const GutterDashboard = () => {


  const gutterTypes = [
    { type: 'Constructed', value: 245, color: '#00B4D8' },
    { type: 'Surface', value: 180, color: '#4CAF50' },
    { type: 'Dug', value: 120, color: '#FFC107' }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#2C3E50', fontWeight: 600, mb: 0.5 }}>
            Gutters
          </Typography>
          <Typography variant="body1" color="text.secondary">
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
          </Box></Box>
      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
  {/* Total Site Card */}
  <Card sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Box>
      <Typography color="text.secondary">Total Site</Typography>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>24</Typography>
    </Box>
    <Box
      sx={{
        bgcolor: '#E0F2FE',
        p: 1.5,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FaChartPie style={{ color: '#3B82F6' }} />
    </Box>
  </Card>

  {/* Maintained Card */}
  <Card sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Box>
      <Typography color="text.secondary">Maintained</Typography>
      <Typography variant="h4" sx={{ fontWeight: 600, color: '#4CAF50' }}>14</Typography>
    </Box>
    <Box
      sx={{
        bgcolor: '#E8F5E9',
        p: 1.5,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CheckCircle sx={{ color: '#4CAF50' }} />
    </Box>
  </Card>

  {/* Overfilled Card */}
  <Card sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Box>
      <Typography color="text.secondary">Overfilled</Typography>
      <Typography variant="h4" sx={{ fontWeight: 600, color: '#EF4444' }}>3</Typography>
    </Box>
    <Box
      sx={{
        bgcolor: '#FEE2E2',
        p: 1.5,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Error sx={{ color: '#EF4444' }} />
    </Box>
  </Card>

  {/* Unmaintained Card */}
  <Card sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Box>
      <Typography color="text.secondary">Unmaintained</Typography>
      <Typography variant="h4" sx={{ fontWeight: 600, color: '#F59E0B' }}>7</Typography>
    </Box>
    <Box
      sx={{
        bgcolor: '#FEF3C7',
        p: 1.5,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Warning sx={{ color: '#F59E0B' }} />
    </Box>
  </Card>
</Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        {/* Timeframe Distribution */}
        <Card sx={{ flex: 1, p: 3, borderRadius: 2, boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E293B' }}>
              Gutter <br /> Type Distribution
            </Typography>
            <ToggleButtonGroup
              size="small"
              exclusive
              sx={{
                backgroundColor: '#F8FAFC',
                borderRadius: 1,
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ToggleButton
                value="monthly"
                sx={{
                  textTransform: 'none',
                  px: 2,
                  '&.Mui-selected': { bgcolor: '#F3F4F6', color: '#0EA5E9' },
                }}
              >
                <Typography variant="body1" color="initial">Monthly</Typography>
              </ToggleButton>
              <ToggleButton
                value="yearly"
                sx={{
                  textTransform: 'none',
                  px: 2,
                  '&.Mui-selected': { bgcolor: '#F3F4F6', color: '#0EA5E9' },
                }}
              >
                <Typography variant="body1" color="initial">Yearly</Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Gutter Types */}
          {gutterTypes.map((item) => (
            <Box key={item.type} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#1E293B' }}>
                  {item.type}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: item.color }}>
                  {item.value}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 8,
                  bgcolor: '#F1F5F9',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${(item.value / 245) * 100}%`,
                    height: '100%',
                    bgcolor: item.color,
                    borderRadius: 4,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Card>

        {/* Gutter Location Map */}
        <Card sx={{ flex: 2, p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Gutter Location Map</Typography>
            <Box>
              <IconButton>
                <Fullscreen />
              </IconButton>
              <IconButton>
                <MoreHoriz />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ height: 400, bgcolor: '#F8FAFC', borderRadius: 1, overflow: 'hidden' }}>
                  <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54444.747381551366!2d7.6930992235022035!3d11.29520357300069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11b27fc3df7cf997%3A0x7f813ac2a29bec28!2sKudan%2C%20Kaduna!5e1!3m2!1sen!2sng!4v1735816821797!5m2!1sen!2sng"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

    </Box>

        </Card>
      </Box>


      {/* Maintenance Table */}
      {/* Maintenance Table */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Maintenance Status</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<FaFilter />}
              sx={{
                color: '#1F2937',
                borderColor: '#E5E7EB',
                '&:hover': { bgcolor: '#F9FAFB' },
              }}
            >
              Filter
            </Button>
            <Button
              startIcon={<FaDownload />}
              sx={{
                color: '#1F2937',
                borderColor: '#E5E7EB',
                '&:hover': { bgcolor: '#F9FAFB' },
              }}
            >
              Export
            </Button>
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell>Picture</TableCell>
                <TableCell>Ward</TableCell>
                <TableCell>Village</TableCell>
                <TableCell>Hamlet</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Discharge Point</TableCell>
                <TableCell>Captured At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            {/* <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : gutters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No gutters found
                  </TableCell>
                </TableRow>
              ) : (
                gutters.map((gutter) => (
                  <TableRow key={gutter._id}>
                    <TableCell>
                      {gutter.picture && (
                        <img 
                          src={gutter.picture} 
                          alt="Gutter" 
                          style={{ 
                            width: 50, 
                            height: 50, 
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }} 
                        />
                      )}
                    </TableCell>
                    <TableCell>{gutter.ward}</TableCell>
                    <TableCell>{gutter.village}</TableCell>
                    <TableCell>{gutter.hamlet}</TableCell>
                    <TableCell>{gutter.condition}</TableCell>
                    <TableCell>
                      <Chip
                        label={gutter.status}
                        size="small"
                        sx={{
                          bgcolor: gutter.status === 'Maintained' ? '#D1FAE5' : '#FEF3C7',
                          color: gutter.status === 'Maintained' ? '#10B981' : '#F59E0B',
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>{gutter.dischargePoint}</TableCell>
                    <TableCell>
                      {new Date(gutter.capturedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody> */}
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
            Showing 1 to 2 of 1,234 entries
          </Typography>
          <Pagination
            count={3}
            sx={{
              '& .Mui-selected': {
                bgcolor: '#0EA5E9',
                color: '#FFFFFF',
              },
            }}
          />
        </Box>
      </Paper>

    </Box>
  );
};

export default GutterDashboard;