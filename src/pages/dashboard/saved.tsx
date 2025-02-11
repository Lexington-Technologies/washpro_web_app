<StyledCard>
  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    <Tabs
      value={currentTab}
      onChange={handleTabChange}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        px: 2,
        '& .MuiTab-root': {
          minHeight: 64,
          textTransform: 'none',
        },
      }}
    >

      <Tab icon={<Timeline />} label="Facilities Overview" iconPosition="start" key="Facilities Overview" />
      <Tab icon={<PieChart />} label="Distribution Analysis" iconPosition="start" key="Distribution Analysis" /
    </Tabs>
  </Box>

  <CardContent>
    {currentTab === 0 && (
      <>
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <FilterDropdown label="Ward" options={['All', 'Ward 1', 'Ward 2', 'Ward 3']} />
            <FilterDropdown label="Village" options={['All', 'Village 1', 'Village 2']} />
            <FilterDropdown label="Hamlet" options={['All', 'Hamlet 1', 'Hamlet 2']} />
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {/*  */}
        </Grid>
      </>
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
            <FacilityPieChart title="Water Source Types" data={CHART_DATA.waterSources} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard>
            <FacilityPieChart title="Water Source Conditions" data={CHART_DATA.waterSourceConditions} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard>
            <FacilityPieChart title="Toilet Facility Types" data={CHART_DATA.toiletFacilities} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard>
            <FacilityPieChart title="Toilet Facility Conditions" data={CHART_DATA.toiletConditions} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard>
            <FacilityPieChart title="Dumpsite by Status" data={CHART_DATA.dumpsiteStatus} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard>
            <FacilityPieChart title="Gutter by Condition" data={CHART_DATA.gutterCondition} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard>
            <FacilityPieChart title="Soakaway by Condition" data={CHART_DATA.soakawayCondition} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard>
            <FacilityPieChart title="Open Defecation by Status" data={CHART_DATA.openDefecationStatus} />
          </ChartCard>
        </Grid>
      </Grid>
    )}
  </CardContent>
</StyledCard>