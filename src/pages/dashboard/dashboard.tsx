import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Tab, Tabs, useTheme, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { PieChart, Pie, Cell, Legend, Tooltip, Sector, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '../../components/Table/DataTable';
import { apiController } from '../../axios';
import { createColumnHelper } from '@tanstack/react-table';


// ============================== CONSTANTS & DATA ==============================
const SUMMARY_DATA = [
  { label: 'Total Households', value: '2,178', color: '#1976d2' },
  { label: 'Total Hamlets', value: '57', color: '#2e7d32' },
  { label: 'Total Villages', value: '8', color: '#7b1fa2' },
  { label: 'Total Wards', value: '3', color: '#ed6c02' }
];

const FACILITY_CARDS = [
  { title: 'Water Sources', count: '1,666', percentage: '23.2%', color: '#1976d2' },
  { title: 'Toilet Facilities', count: '2,124', percentage: '29.6%', color: '#7b1fa2' },
  { title: 'Dump Sites', count: '1,459', percentage: '20.3%', color: '#ed6c02' },
  { title: 'Gutters', count: '1,423', percentage: '19.8%', color: '#2e7d32' },
  { title: 'Soak Aways', count: '317', percentage: '4.4%', color: '#e91e63' },
  { title: 'Open Defecation Sites', count: '194', percentage: '2.7%', color: '#d32f2f' }
];

const CHART_DATA = {
  waterSources: [
    { name: 'Hand Pump Borehole', value: 10.2, color: '#4caf50' },
    { name: 'Protected Dug Well', value: 5.5, color: '#ff9800' },
    { name: 'Unprotected Dug Well', value: 3.0, color: '#9c27b0' },
    { name: 'Motorized Borehole', value: 2.5, color: '#03a9f4' },
    { name: 'Pipe Born Water', value: 2.0, color: '#e91e63' }
  ],
  waterSourceConditions: [
    { name: 'Functional', value: 18.0, color: '#4caf50' },
    { name: 'Non-Functional', value: 5.2, color: '#f44336' }
  ],
  toiletFacilities: [
    { name: 'Pit Latrine', value: 15.0, color: '#4caf50' },
    { name: 'WC Squatting', value: 8.0, color: '#ff9800' },
    { name: 'WC Sitting', value: 6.6, color: '#9c27b0' }
  ],
  toiletConditions: [
    { name: 'Improved', value: 18.0, color: '#4caf50' },
    { name: 'With Hand Wash', value: 5.2, color: '#f44336' },
    { name: 'Basic', value: 5.2, color: '#ff9800' }
  ],
  dumpsiteStatus: [
    { name: 'Maintained', value: 18.0, color: '#4caf50' },
    { name: 'Needs Evacuation', value: 5.2, color: '#f44336' }
  ],
  gutterCondition: [
    { name: 'Clean', value: 18.0, color: '#4caf50' },
    { name: 'Blocked', value: 5.2, color: '#f44336' }
  ],
  soakawayCondition: [
    { name: 'Functional', value: 18.0, color: '#4caf50' },
    { name: 'Non-Functional', value: 5.2, color: '#f44336' }
  ],
  openDefecationStatus: [
    { name: 'Active', value: 18.0, color: '#4caf50' },
    { name: 'Inactive', value: 5.2, color: '#f44336' }
  ]
};

// ============================== STYLED COMPONENTS ==============================
const ProfessionalCard = styled(Card)(({ theme }) => ({
  borderRadius: 4,
  boxShadow: theme.shadows[1],
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  position: 'relative'
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.5px',
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary
}));

// Utility function to format numbers with commas
const formatNumberWithCommas = (number: string) => {
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// ============================== COMPONENTS ==============================
const SummaryCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <Grid item xs={12} sm={6} md={3}>
    <ProfessionalCard>
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h4" sx={{ color, fontWeight: 700 }}>
          {formatNumberWithCommas(value)}
        </Typography>
      </CardContent>
    </ProfessionalCard>
  </Grid>
);

const FacilityCard = ({ title, count, percentage, color }: { title: string; count: string; percentage: string; color: string }) => (
  <Grid item xs={12} sm={6} md={4}>
    <ProfessionalCard sx={{ position: 'relative', height: '100%' }}>
      <CardContent sx={{ py: 3, px: 2.5 }}>
        <Box sx={{ 
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: color,
          position: 'absolute',
          right: 20,
          top: 20
        }} />
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          {formatNumberWithCommas(count)}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {percentage} of total facilities
        </Typography>
      </CardContent>
    </ProfessionalCard>
  </Grid>
);

const FacilityPieChart = ({ title, data }: { title: string; data: { name: string; value: number; color: string }[] }) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(-1);

    const renderActiveShape = (props: {
      cx: number;
      cy: number;
      outerRadius: number;
      name: string;
    }) => (
      <g>
        <StyledText
          x={props.cx}
          y={props.cy}
          dy={8}
          textAnchor="middle"
          fill={theme.palette.text.primary}
        >
          {props.name}
        </StyledText>
        <Sector
          {...props}
          outerRadius={props.outerRadius + 6}
          cornerRadius={8}
        />
      </g>
    );
  
  const StyledText = styled('text')({
    fontWeight: 600,
  });


  return (
    <ChartContainer>
      <SectionTitle variant="h6">{title}</SectionTitle>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            dataKey="value"
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(-1)}
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            wrapperStyle={{ paddingTop: 24 }}
            formatter={(value) => (
              <Typography style={{ color: theme.palette.text.primary }}>
                {value}
              </Typography>
            )}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              boxShadow: theme.shadows[3],
              border: 'none'
            }}
          />
        </PieChart>
      </Box>
    </ChartContainer>
  );
};

const ChartCard = ({ children }: { children: React.ReactNode }) => (
  <ProfessionalCard sx={{ p: 3, mt: 3 }}>
    {children}
  </ProfessionalCard>
);

const DistributionCharts = () => {
  const wardData = [
    { name: 'S/GARI', value: 3272 },
    { name: 'LIKORO', value: 3906 }
  ];

  const villageData = [
    { name: 'SIGARIN LILUNKIYI', value: 1098 },
    { name: 'LIKORO', value: 3210 },
    { name: 'KYAUDAI', value: 230 },
    { name: 'JAJA', value: 331 },
    { name: 'S / GARIN LIKORO', value: 696 },
    { name: 'MUSAWA', value: 992 },
    { name: 'KAURAN WALI', value: 621 }
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Ward-wise Distribution
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wardData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 4000]} />
                  <Bar dataKey="value" fill="#4F98FF" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
      </Grid>
      <Grid item xs={12} md={6}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Village-wise Distribution
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={villageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 4000]} />
                  <Bar dataKey="value" fill="#4F98FF" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
      </Grid>
    </Grid>
  );
};


interface EnumeratorPerformance {
  id: string;
  name: string;
  totalFacilities: number;
  lastActive: string;
  villages: string[];
  facilities: {
    waterSources: number;
    toiletFacilities: number;
    dumpSites: number;
    gutters: number;
    soakAways: number;
    openDefecationSites: number;
  };
}

const columnHelper = createColumnHelper<EnumeratorPerformance>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('totalFacilities', {
    header: 'Total Facilities',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastActive', {
    header: 'Last Active',
    cell: (info) => new Date(info.getValue() as string).toLocaleString(),
  }),
  columnHelper.accessor('villages', {
    header: 'Villages',
    cell: (info) => (info.getValue() as string[]).join(', '),
  }),
  columnHelper.accessor((row) => row.facilities.waterSources, {
    header: 'Water Sources',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.facilities.toiletFacilities, {
    header: 'Toilet Facilities',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.facilities.dumpSites, {
    header: 'Dump Sites',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.facilities.gutters, {
    header: 'Gutters',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.facilities.soakAways, {
    header: 'Soak Aways',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.facilities.openDefecationSites, {
    header: 'Open Defecation Sites',
    cell: (info) => info.getValue(),
  }),
];

const FilterDropdown = ({ label, options }: { label: string; options: string[] }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedOption(event.target.value as string);
  };

  return (
    <FormControl variant="outlined" sx={{ mb: 2, height: 40 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={selectedOption}
        onChange={handleChange}
        label={label}
        sx={{ height:45, width:100 }}
      >
        {options.map((option: string, index: number) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Main Component
const WashDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => apiController.get<{ enumeratorPerformance: EnumeratorPerformance[] }>('/analytics')
  });
  
  useEffect(() => {
    console.log("enu", data?.enumeratorPerformance);
  }, [data]);

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', p: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#25306B" }}>
            Dashboard
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography variant="caption" color="textSecondary">
            Last updated: {new Date().toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {SUMMARY_DATA.map((item) => (
          <SummaryCard key={item.label} {...item} />
        ))}
      </Grid>

      {/* Tabs Navigation and Content */}
      <ProfessionalCard>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontWeight: 600
            }
          }}
        >
          <Tab label="Facilities Overview" />
          <Tab label="Distribution Analysis" />
          <Tab label="Geographic Analysis" />
          <Tab label="Enumerator Performance" />
        </Tabs>
        <CardContent>
          {currentTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                <FilterDropdown label="Ward" options={['Option 1', 'Option 2', 'Option 3']} />
                <FilterDropdown label="Village" options={['Option 1', 'Option 2', 'Option 3']} />
                <FilterDropdown label="Hamlet" options={['Option 1', 'Option 2', 'Option 3']} />
              </Grid>   
              {FACILITY_CARDS.map((facility) => (
                <FacilityCard key={facility.title} {...facility} />
              ))}
              <Grid item xs={12}>
                <FacilityPieChart 
                  title="Facility Distribution Overview"
                  data={CHART_DATA.waterSources}
                />
              </Grid>
            </Grid>
          )}

          {currentTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                <FilterDropdown label="Ward" options={['Option 1', 'Option 2', 'Option 3']} />
                <FilterDropdown label="Village" options={['Option 1', 'Option 2', 'Option 3']} />
                <FilterDropdown label="Hamlet" options={['Option 1', 'Option 2', 'Option 3']} />
              </Grid>   

              <Grid item xs={12} md={6}>
                <ChartCard>
                  <FacilityPieChart 
                    title="Water Source Types"
                    data={CHART_DATA.waterSources}
                  />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <FacilityPieChart 
                    title="Water Source Conditions"
                    data={CHART_DATA.waterSourceConditions}
                  />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <FacilityPieChart 
                    title="Toilet Facility Types"
                    data={CHART_DATA.toiletFacilities}
                  />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <FacilityPieChart 
                    title="Toilet Facility Conditions"
                    data={CHART_DATA.toiletConditions}
                  />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <FacilityPieChart 
                    title="Dumpsite by Status"
                    data={CHART_DATA.dumpsiteStatus}
                  />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <FacilityPieChart 
                    title="Gutter by Condition"
                    data={CHART_DATA.gutterCondition}
                  />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <FacilityPieChart 
                    title="Soakaway by Condition"
                    data={CHART_DATA.soakawayCondition}
                  />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <FacilityPieChart 
                    title="Open Defecation by Status"
                    data={CHART_DATA.openDefecationStatus}
                  />
                </ChartCard>
              </Grid>
            </Grid>
          )}

          {currentTab === 2 && (
            <>
              <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                <FilterDropdown label="Ward" options={['Option 1', 'Option 2', 'Option 3']} />
                <FilterDropdown label="Village" options={['Option 1', 'Option 2', 'Option 3']} />
                <FilterDropdown label="Hamlet" options={['Option 1', 'Option 2', 'Option 3']} />
              </Grid>   

              <DistributionCharts />
            </>
          )}

          {currentTab === 3 && (
            <>  
            <DataTable setSearch={() => {}} setPage={() => {}} setLimit={() => {}} isLoading={isLoading} columns={columns} data={data?.enumeratorPerformance || []} />
            </>
          )}
        </CardContent>
      </ProfessionalCard>
    </Box>
  );
};

export default WashDashboard;