import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  LinearProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  FilterAlt, 
  FileDownload, 
  ExpandMore,
  ErrorOutline,
  Warning,
  Info,
  AccessTime
} from '@mui/icons-material';

const NeedAndMaintainers = () => {
  const priorities = [
    { 
      title: 'High Priority', 
      count: 5, 
      bgColor: '#FEE2E2', 
      textColor: '#DC2626',
      icon: <ErrorOutline />,
      iconColor: '#DC2626'
    },
    { 
      title: 'Medium Priority', 
      count: 8, 
      bgColor: '#FEF3C7', 
      textColor: '#D97706',
      icon: <Warning />,
      iconColor: '#D97706'
    },
    { 
      title: 'Low Priority', 
      count: 3, 
      bgColor: '#DBEAFE', 
      textColor: '#2563EB',
      icon: <Info />,
      iconColor: '#2563EB'
    }
  ];

  const soakawayData = [
    {
      need: 'Build additional toilets',
      priority: { label: 'Low', color: '#22C55E', bgColor: '#DCFCE7' },
      status: 'In Progress',
      progress: 40,
      progressColor: '#3B82F6'
    },
    {
      need: 'Upgrade water supply system',
      priority: { label: 'Medium', color: '#F59E0B', bgColor: '#FEF3C7' },
      status: 'Pending',
      progress: 10,
      progressColor: '#9CA3AF'
    },
    {
      need: 'Install security cameras',
      priority: { label: 'High', color: '#DC2626', bgColor: '#FEE2E2' },
      status: 'Completed',
      progress: 100,
      progressColor: '#22C55E'
    }
  ];

  const recommendations = [
    {
      title: 'Facility Maintenance',
      description: 'Regular maintenance schedule for all facilities to prevent deterioration.',
      timeline: 'Q2 2025'
    },
    {
      title: 'Safety Measures',
      description: 'Implementation of safety protocols and emergency procedures.',
      timeline: 'Q3 2025'
    },
    {
      title: 'Staff Training',
      description: 'Comprehensive training program for maintenance staff.',
      timeline: 'Q1 2025'
    }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#F3F4F6', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1F2937' }}>
              Open Defecation Observation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detailed insights about your selected location
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<FilterAlt />}
            sx={{ bgcolor: 'white' }}
          >
            Filter
          </Button>
        </Box>

        {/* Priority Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {priorities.map((priority) => (
            <Grid item xs={12} md={4} key={priority.title}>
              <Paper sx={{ 
                p: 2, 
                bgcolor: priority.bgColor,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: priority.textColor }}>
                    {priority.count}
                  </Typography>
                  <Typography sx={{ color: priority.textColor }}>
                    {priority.title}
                  </Typography>
                </Box>
                <Box sx={{ color: priority.iconColor }}>
                  {priority.icon}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <Grid container spacing={2}>
          {/* Soakaway Condition */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3 
              }}>
                <Typography variant="h6">Soakaway Condition</Typography>
                <Box>
                  <Button startIcon={<FileDownload />} sx={{ mr: 1 }}>
                    Export
                  </Button>
                  <Button startIcon={<FilterAlt />}>
                    Filter
                  </Button>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>NEED</TableCell>
                      <TableCell>PRIORITY</TableCell>
                      <TableCell>STATUS</TableCell>
                      <TableCell>PROGRESS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {soakawayData.map((row) => (
                      <TableRow key={row.need}>
                        <TableCell>{row.need}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.priority.label}
                            sx={{
                              bgcolor: row.priority.bgColor,
                              color: row.priority.color,
                              fontSize: '0.875rem'
                            }}
                          />
                        </TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell sx={{ width: '30%' }}>
                          <LinearProgress
                            variant="determinate"
                            value={row.progress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: '#E5E7EB',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: row.progressColor
                              }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Recommendations */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recommendations
              </Typography>
              {recommendations.map((item, index) => (
                <Accordion key={index} elevation={0} sx={{ 
                  '&:before': { display: 'none' },
                  border: 1,
                  borderColor: 'divider',
                  mb: 1
                }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1">{item.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                      <AccessTime sx={{ fontSize: '1rem', mr: 0.5 }} />
                      <Typography variant="body2">
                        Timeline: {item.timeline}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default NeedAndMaintainers;