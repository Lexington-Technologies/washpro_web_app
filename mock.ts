// dashboard
{
  "populationData": [
    { "name": "Jan", "value": 55 },
    { "name": "Feb", "value": 35 },
    { "name": "Mar", "value": 15 },
    { "name": "Apr", "value": 75 },
    { "name": "May", "value": 35 },
    { "name": "Jun", "value": 85 },
    { "name": "Jul", "value": 80 },
    { "name": "Aug", "value": 45 }
  ],
  "communitiesData": [
    { "name": "Hunkuyi", "value": 55 },
    { "name": "S/Gari", "value": 35 },
    { "name": "Zabi", "value": 15 },
    { "name": "Garu", "value": 75 },
    { "name": "Likoro", "value": 35 },
    { "name": "Kudan", "value": 85 },
    { "name": "Taba", "value": 80 },
    { "name": "Doka", "value": 45 }
  ],
  "disabilityData": [
    { "name": "Female", "value": 2345, "color": "#1e3a8a" },
    { "name": "Male", "value": 1873, "color": "#38bdf8" }
  ],
  "facilityCards": [
    { "title": "Total Toilets", "value": 62, "icon": "FaToilet" },
    { "title": "Total Open Defecation", "value": 62, "icon": "FaPoop" },
    { "title": "Total Dumpsites", "value": 9, "icon": "FaTrash" },
    { "title": "Total Soakaways", "value": 4, "icon": "FaWater" },
    { "title": "Total Gutters", "value": 4, "icon": "FaWater" },
    { "title": "Total Hygiene Facilities", "value": 4, "icon": "FaHandHoldingDroplet" },
    { "title": "Total Water Source", "value": 4, "icon": "FaWater" },
    { "title": "Alerts", "value": 4, "icon": "GiHazardSign" }
  ],
  "washCards": [
    { "title": "Total Households", "value": 62, "icon": "FaHome" },
    { "title": "Total Wash In School", "value": 62, "icon": "FaSchool" },
    { "title": "Wash In Health Facilities", "value": 9, "icon": "FaHeartPulse" },
    { "title": "Tsangaya", "value": 4, "icon": "FaCity" }
  ],
  "filterOptions": {
    "Ward": ["All"],
    "Village": ["All"],
    "Hamlet": ["All"]
  }
}

//wash status
{
  "communityData": [
    {
      "name": "School A",
      "households": "Yes",
      "drinkingWater": "Yes",
      "sanitation": "No"
    },
    {
      "name": "School B",
      "households": "No",
      "drinkingWater": "No",
      "sanitation": "Yes"
    },
    {
      "name": "School C",
      "households": "Yes",
      "drinkingWater": "No",
      "sanitation": "YEs"
    }
  ],
  "drinkingWaterData": [
    { "name": "Basic", "value": 123.86, "color": "#29B6F6" },
    { "name": "Limited", "value": 131.71, "color": "#FEBC11" },
    { "name": "None Service", "value": 154.68, "color": "#FFFF5D" }
  ],
  "sanitationData": [
    { "name": "Advanced", "value": 60, "color": "#8CC265" },
    { "name": "Basic Service", "value": 35, "color": "#F2EB88" },
    { "name": "Limited Service", "value": 75, "color": "#F2B69E" },
    { "name": "No Services", "value": 35, "color": "#F5857F" }
  ],
  "hygieneData": [
    { "name": "Basic Service", "value": 250, "color": "#F2B69E" },
    { "name": "Limited Service", "value": 100, "color": "#F2EB88" },
    { "name": "No Service", "value": 162.47, "color": "#C3AAEB" }
  ],
  "filterOptions": {
    "Ward": ["All"],
    "Village": ["All"],
    "Hamlet": ["All"]
  },
  "accessRates": {
    "drinkingWater": {
      "title": "Basic Drinking Water",
      "accessRate": "75%",
      "accessCount": "12,500",
      "noAccessCount": "4,167"
    },
    "sanitation": {
      "title": "Basic Sanitation",
      "accessRate": "68%",
      "accessCount": "11,334",
      "noAccessCount": "5,333"
    },
    "hygiene": {
      "title": "Basic Hygiene",
      "accessRate": "82%",
      "accessCount": "13,667",
      "noAccessCount": "3,000"
    }
  }
}

// interventions

{
  "filters": {
    "project": ["All", "Water", "Sanitation"],
    "ward": ["All", "North", "South"],
    "village": ["All", "Hunkuyi", "Doka"],
    "hamlet": ["All", "Sector 1", "Sector 2"]
  },
  "keyMetrics": [
    {
      "title": "Total Active Interventions",
      "value": 364
    },
    {
      "title": "Communities Impacted",
      "value": 37
    },
    {
      "title": "Critical Tasks Pending",
      "value": 56
    }
  ],
  "maintenanceSchedule": [
    {
      "title": "Water Pump Station",
      "location": "North District",
      "date": "2024-02-15",
      "priority": "High",
      "priorityColor": "#d32f2f",
      "priorityBgColor": "#ffebee"
    },
    {
      "title": "Treatment Plant",
      "location": "Central Area",
      "date": "2024-02-20",
      "priority": "Medium",
      "priorityColor": "#f57c00",
      "priorityBgColor": "#fff8e1"
    },
    {
      "title": "Distribution Network",
      "location": "South District",
      "date": "2024-02-25",
      "priority": "Low",
      "priorityColor": "#2e7d32",
      "priorityBgColor": "#e8f5e9"
    }
  ],
  "interventionsTable": {
    "headers": ["Ward", "Hamlet", "Space Type", "Status", "Action"],
    "rows": [
      {
        "ward": "Hunkuyi",
        "hamlet": "Chlorination",
        "spaceType": "2025-01-05 - 2025-01-12",
        "status": "In Progress",
        "statusColor": "#1976d2",
        "statusBgColor": "#e3f2fd"
      },
      {
        "ward": "Kudan Toun",
        "hamlet": "Waste Disposal",
        "spaceType": "2025-01-03 - 2025-01-10",
        "status": "Pending",
        "statusColor": "#f57c00",
        "statusBgColor": "#fff8e1"
      },
      {
        "ward": "Doka",
        "hamlet": "Community Training",
        "spaceType": "2024-12-15 - 2024-12-20",
        "status": "Completed",
        "statusColor": "#2e7d32",
        "statusBgColor": "#e8f5e9"
      },
      {
        "ward": "Likoro",
        "hamlet": "Chlorination",
        "spaceType": "2024-12-15 - 2024-12-20",
        "status": "Pending",
        "statusColor": "#f57c00",
        "statusBgColor": "#fff8e1"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalEntries": 3,
      "totalPages": 1
    }
  }
}

//wash

{
  "filters": {
    "LGA": ["LGA"],
    "Ward": ["Ward"],
    "Village": ["Village"],
    "Hamlet": ["Hamlet"]
  },
  "metrics": [
    {
      "title": "Water Quality Metrics",
      "value": "0-100"
    },
    {
      "title": "Sanitation Activities",
      "value": 56
    },
    {
      "title": "Hygiene Facility Conditions",
      "value": 70,
      "unit": "%"
    },
    {
      "title": "Community and Feedback",
      "value": 130
    }
  ],
  "charts": {
    "waterQualityData": [
      { "date": "Q4 2024", "value": 45 },
      { "date": "Q1 2025", "value": 85 }
    ],
    "contaminationData": [
      { "source": "Source 1", "2022": 80, "2023": 65 },
      { "source": "Source 2", "2022": 60, "2023": 45 },
      { "source": "Source 3", "2022": 40, "2023": 30 },
      { "source": "Source 4", "2022": 70, "2023": 55 }
    ]
  },
  "sanitationFacilities": [
    {
      "facilityName": "Community Borehole 1",
      "location": "Angwuwan Sarki",
      "condition": "Good",
      "lastDate": "2024-01-05",
      "nextDate": "2025-01-12"
    },
    {
      "facilityName": "Waste Disposal Unit A",
      "location": "Angwuwan Shanu",
      "condition": "Fair",
      "lastDate": "2024-01-03",
      "nextDate": "2025-01-15"
    }
  ],
  "hygienePrograms": [
    {
      "date": "2025-01-02",
      "trainerName": "Aliyu Abdullahi",
      "participantCount": 25,
      "feedbackSummary": "Participants appreciated practical demonstrations but suggested extended sessions"
    },
    {
      "date": "2024-12-18",
      "trainerName": "Musa Ibrahim",
      "participantCount": 30,
      "feedbackSummary": "Engaging session; participants requested additional follow-up training"
    }
  ],
  "progressTracker": {
    "label": "Handwashing Awareness Campaign",
    "initiative": "Safe Water Initiative",
    "progress": 45
  }
}

//routine activities

{
  "stats": [
    {
      "title": "Total Sites",
      "value": "2,456",
      "color": "#1E3A8A"
    },
    {
      "title": "Active Surveys",
      "value": "1,890",
      "color": "#1E3A8A"
    },
    {
      "title": "Pending Reviews",
      "value": "78%",
      "color": "#1E3A8A"
    },
    {
      "title": "Critical Alerts",
      "value": "12%",
      "color": "#DC2626"
    }
  ],
  "locations": [
    {
      "name": "Kudan",
      "type": "Water Facility",
      "lastUpdate": "2 hours ago",
      "status": "Functional",
      "statusColor": "#10B981"
    },
    {
      "name": "Doka",
      "type": "Sanitation",
      "lastUpdate": "2 hours ago",
      "status": "Non-Functional",
      "statusColor": "#EF4444"
    },
    {
      "name": "Kauru",
      "type": "Water Facility",
      "lastUpdate": "2 hours ago",
      "status": "Functional",
      "statusColor": "#10B981"
    },
    {
      "name": "Hunkuyi",
      "type": "Sanitation",
      "lastUpdate": "2 hours ago",
      "status": "On Repair",
      "statusColor": "#F59E0B"
    }
  ],
  "recentPhotos": [
    "Report1",
    "Report2",
    "Report3",
    "Report4"
  ],
  "filters": [
    "LGA",
    "Ward",
    "Village",
    "Hamlet"
  ]
}

// financial summary

{
  "fundCategories": [
    {
      "name": "Operational Fund",
      "used": "N27,000",
      "total": "N60,000",
      "color": "#3B82F6"
    },
    {
      "name": "Maintenance Fund",
      "used": "N650,000",
      "total": "N800,000",
      "color": "#4F46E5"
    },
    {
      "name": "Capital Expenditure",
      "used": "N185,000",
      "total": "N370,000",
      "color": "#10B981"
    },
    {
      "name": "Aids & Grants",
      "used": "N27,000",
      "total": "N60,000",
      "color": "#F59E0B"
    },
    {
      "name": "Community Financing",
      "used": "N25,000",
      "total": "N25,000",
      "color": "#EF4444"
    }
  ],
  "pieChartData": [
    {
      "name": "Operational",
      "value": 27000,
      "color": "#3B82F6"
    },
    {
      "name": "Maintenance",
      "value": 650000,
      "color": "#EC4899"
    },
    {
      "name": "Capital Expenditure",
      "value": 185000,
      "color": "#06B6D4"
    },
    {
      "name": "Aids & Grants",
      "value": 27000,
      "color": "#F97316"
    },
    {
      "name": "Community Financing",
      "value": 25000,
      "color": "#FACC15"
    }
  ],
  "monthlyData": [
    {
      "name": "Jan",
      "operational": 40,
      "maintenance": 60
    },
    {
      "name": "Feb",
      "operational": 60,
      "maintenance": 45
    },
    {
      "name": "Mar",
      "operational": 50,
      "maintenance": 40
    },
    {
      "name": "Apr",
      "operational": 30,
      "maintenance": 25
    },
    {
      "name": "May",
      "operational": 25,
      "maintenance": 20
    },
    {
      "name": "Jun",
      "operational": 40,
      "maintenance": 30
    },
    {
      "name": "Jul",
      "operational": 70,
      "maintenance": 60
    },
    {
      "name": "Aug",
      "operational": 45,
      "maintenance": 40
    }
  ],
  "paymentsData": [
    {
      "month": "Jan",
      "initiated": "N10,000",
      "paid": "N10,000",
      "status": "Paid",
      "date": "Jan 10, 2023"
    },
    {
      "month": "Feb",
      "initiated": "N10,000",
      "paid": "N5,000",
      "status": "Partial",
      "date": "Feb 15, 2023"
    },
    {
      "month": "March",
      "initiated": "N10,000",
      "paid": "N0",
      "status": "Overdue",
      "date": "-"
    },
    {
      "month": "April",
      "initiated": "N10,000",
      "paid": "N10,000",
      "status": "Paid",
      "date": "Apr 20, 2023"
    },
    {
      "month": "May",
      "initiated": "N10,000",
      "paid": "N2,000",
      "status": "Partial",
      "date": "May 10, 2023"
    },
    {
      "month": "June",
      "initiated": "N10,000",
      "paid": "N0",
      "status": "Overdue",
      "date": "-"
    }
  ]
}

//activities

{
  "activities": [
    {
      "id": 1,
      "activity": "Hand Washing Workshop",
      "type": "Hygiene Promotion",
      "location": "Kudan Community Center",
      "date": "2023-10-15",
      "participants": 45,
      "status": "Completed"
    },
    {
      "id": 2,
      "activity": "Soap Distribution",
      "type": "Resource Distribution",
      "location": "Sabon Gari",
      "date": "2023-10-12",
      "participants": 120,
      "status": "Completed"
    },
    {
      "id": 3,
      "activity": "Community Meeting",
      "type": "Community Engagement",
      "location": "Doka Village Hall",
      "date": "2023-10-10",
      "participants": 32,
      "status": "Completed"
    },
    {
      "id": 4,
      "activity": "School Hygiene Program",
      "type": "Behavioral Change",
      "location": "Kudan Primary School",
      "date": "2023-10-20",
      "participants": 85,
      "status": "Scheduled"
    }
  ],
  "statsCards": [
    {
      "title": "Hygiene Sessions",
      "value": 24,
      "color": "#4caf50"
    },
    {
      "title": "Community Engagements",
      "value": 18,
      "color": "#2196f3"
    },
    {
      "title": "Resources Distributed",
      "value": 156,
      "color": "#9c27b0"
    },
    {
      "title": "Behavior Change Initiatives",
      "value": 7,
      "color": "#ff9800"
    }
  ],
  "filters": {
    "Ward": ["All"],
    "Village": ["All"],
    "Hamlet": ["All"]
  }
}

// chlorine

{
  "waterQualityData": [
    {
      "id": 1,
      "source": "Community Well #1",
      "location": "Kudan",
      "testDate": "2023-10-15",
      "chlorineLevel": 1.2,
      "pH": 7.4,
      "status": "Compliant"
    },
    {
      "id": 2,
      "source": "Public Tap #3",
      "location": "Sabon Gari",
      "testDate": "2023-10-14",
      "chlorineLevel": 0.8,
      "pH": 7.2,
      "status": "Borderline"
    },
    {
      "id": 3,
      "source": "School Water Tank",
      "location": "Doka",
      "testDate": "2023-10-16",
      "chlorineLevel": 1.5,
      "pH": 7.6,
      "status": "Compliant"
    },
    {
      "id": 4,
      "source": "Community Well #4",
      "location": "Kudan",
      "testDate": "2023-10-13",
      "chlorineLevel": 0.5,
      "pH": 7.1,
      "status": "Non-compliant"
    }
  ],
  "statistics": {
    "waterSourcesTreated": 18,
    "chlorineStockKg": 245,
    "complianceRate": "92%",
    "qualityTests": 72
  },
  "filters": {
    "ward": ["All"],
    "village": ["All"],
    "hamlet": ["All"]
  }
}

//issues
{
  "stats": {
    "totalIssues": 38,
    "openIssues": 12,
    "resolvedIssues": 26,
    "resolutionRate": "68%"
  },
  "filters": {
    "wardOptions": ["All"],
    "villageOptions": ["All"],
    "hamletOptions": ["All"]
  },
  "issuesData": [
    {
      "id": "ISS-1023",
      "issue": "Water source contamination",
      "location": "Kudan Well #2",
      "reportedDate": "2023-10-15",
      "severity": "High",
      "status": "In Progress"
    },
    {
      "id": "ISS-1022",
      "issue": "Broken latrine door",
      "location": "Sabon Gari School",
      "reportedDate": "2023-10-12",
      "severity": "Medium",
      "status": "Resolved"
    },
    {
      "id": "ISS-1021",
      "issue": "Chlorine supply shortage",
      "location": "Doka Distribution Center",
      "reportedDate": "2023-10-10",
      "severity": "High",
      "status": "Resolved"
    },
    {
      "id": "ISS-1020",
      "issue": "Drainage blockage",
      "location": "Kudan Market Area",
      "reportedDate": "2023-10-08",
      "severity": "Medium",
      "status": "In Progress"
    }
  ]
}

//Lam Report

{
  "reportingHistory": [
    {
      "id": 1,
      "location": "Kudan",
      "functionality": "Functional",
      "maintenanceType": "Pump Repair",
      "materials": "Pipes, Pump parts",
      "timeline": "2023-10-05",
      "status": "Urgent"
    },
    {
      "id": 2,
      "location": "Sabon Gari",
      "functionality": "Non-Functional",
      "maintenanceType": "Pump Repair, Pipe Replacement",
      "materials": "Pipes",
      "timeline": "2023-10-12",
      "status": "Urgent"
    },
    {
      "id": 3,
      "location": "Doka",
      "functionality": "Partially Functional",
      "maintenanceType": "Water Quality Treatment",
      "materials": "Chlorine tablets",
      "timeline": "2023-10-08",
      "status": "In Progress"
    },
    {
      "id": 4,
      "location": "Zabi",
      "functionality": "Functional",
      "maintenanceType": "Electrical Repair",
      "materials": "Wires, switches",
      "timeline": "2023-09-30",
      "status": "Completed"
    }
  ],
  "filters": {
    "wardOptions": ["All"],
    "villageOptions": ["All"],
    "hamletOptions": ["All"]
  },
  "locations": ["Kudan", "Sabon Gari", "Doka", "Zabi"],
  "maintenanceTypes": [
    "Pump Repair",
    "Pipe Replacement",
    "Water Quality Treatment",
    "Structural Repair",
    "Electrical Repair",
    "Preventive Maintenance"
  ]
}

//cholera outbreak

{
  "locationData": [
    {
      "location": "Kudan",
      "suspected": 50,
      "confirmed": 20,
      "deaths": 3,
      "communitiesAffected": 5,
      "population": 10000,
      "status": "Moderate Risk",
      "trend": "Increasing"
    },
    {
      "location": "Sabon Gari",
      "suspected": 30,
      "confirmed": 10,
      "deaths": 1,
      "communitiesAffected": 3,
      "population": 8000,
      "status": "High Risk",
      "trend": "Stable"
    },
    {
      "location": "Doka",
      "suspected": 15,
      "confirmed": 5,
      "deaths": 0,
      "communitiesAffected": 2,
      "population": 5000,
      "status": "Low Risk",
      "trend": "Decreasing"
    }
  ],
  "metrics": [
    {
      "title": "Suspected Cases",
      "color": "#ef5350",
      "subItems": [
        { "label": "Children <5 Years", "value": 97 },
        { "label": "Children ≥5 Years", "value": 79 }
      ]
    },
    {
      "title": "Rapid Diagnostic Test",
      "color": "#ffa726",
      "subItems": [
        { "label": "Tested", "value": 86 },
        { "label": "Positives", "value": 97 }
      ]
    },
    {
      "title": "Laboratory Testing",
      "color": "#42a5f5",
      "subItems": [
        { "label": "Conducted", "value": 4 },
        { "label": "Confirmed", "value": "12 (+5%)" }
      ]
    },
    {
      "title": "Mortality",
      "color": "#78909c",
      "subItems": [
        { "label": "Facility Deaths", "value": 3 },
        { "label": "Community Deaths", "value": 2 }
      ]
    }
  ],
  "metrics2": [
    {
      "title": "Severity & Spread",
      "color": "#ef5350",
      "subItems": [
        { "label": "Attack Rate", "value": "8%" },
        { "label": "Case Fatality Rate", "value": "8%" }
      ]
    },
    {
      "title": "Ongoing Cases",
      "color": "#ffa726",
      "subItems": [
        { "label": "Active Cases", "value": 12 },
        { "label": "Currently Hospitalised", "value": 8 }
      ]
    },
    {
      "title": "Recoveries",
      "color": "#42a5f5",
      "subItems": [
        { "label": "Recovered", "value": 4 },
        { "label": "Recovery Rate", "value": "12 (+5%)" }
      ]
    },
    {
      "title": "Communities",
      "color": "#78909c",
      "subItems": [
        { "label": "Affected", "value": 3 },
        { "label": "Most Affected Ward", "value": 2 }
      ]
    }
  ],
  "filters": {
    "timeRangeOptions": ["Last 24 Hours", "Last 7 Days", "Last 30 Days"]
  },
  "tabContent": {
    "recentAlerts": [
      {
        "site": "Site A23",
        "distance": "3.2m from dump site",
        "riskLevel": "Critical"
      },
      {
        "site": "Site B15",
        "distance": "15m from sanitation risk",
        "riskLevel": "Warning"
      },
      {
        "site": "Site C08",
        "distance": "45m from nearest risk",
        "riskLevel": "Clear"
      }
    ],
    "riskLegend": [
      {
        "label": "Critical Risk (<10m)",
        "color": "#ef5350"
      },
      {
        "label": "Moderate Risk (10-30m)",
        "color": "#ffa726"
      },
      {
        "label": "Safe Distance (>30m)",
        "color": "#42a5f5"
      }
    ]
  }
}

//analysis page

{
  "keyStatistics": {
    "totalWaterSources": {
      "value": "1,666",
      "subtitle": "Avg. 76 dependents per source"
    },
    "totalHouseholds": {
      "value": "2,173",
      "subtitle": "Avg. 17 people per household"
    },
    "totalToiletFacilities": {
      "value": "2,120"
    },
    "totalDumpSites": {
      "value": "1,459"
    }
  },
  "chartData": {
    "toiletFacilityData": [
      { "name": "WC Squatting", "value": 196 },
      { "name": "Pit Latrine", "value": 1800 },
      { "name": "WC Sitting", "value": 124 }
    ],
    "soakAwayData": [
      { "name": "Maintained", "value": 154 },
      { "name": "Dilapidated", "value": 49 },
      { "name": "Unmaintained", "value": 114 }
    ],
    "dumpSiteData": [
      { "name": "Unimproved", "value": 1193 },
      { "name": "Improved", "value": 266 }
    ],
    "gutterData": [
      { "name": "Poor", "value": 637 },
      { "name": "Critical", "value": 69 },
      { "name": "Fair", "value": 573 },
      { "name": "Good", "value": 144 }
    ],
    "wardData": [
      {
        "name": "LIKORO",
        "waterSources": 859,
        "toilets": 1148,
        "households": 1125,
        "population": 21971
      },
      {
        "name": "S/GARI",
        "waterSources": 805,
        "toilets": 970,
        "households": 1047,
        "population": 15509
      }
    ]
  },
  "colors": [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D"
  ]
}

//risk analysis

{
  "kpiData": [
    {
      "label": "Active Outbreaks",
      "value": "317",
      "color": "#ff4d4f"
    },
    {
      "label": "At Risk Areas",
      "value": "1,462",
      "color": "#fa8c16"
    },
    {
      "label": "Water Sources",
      "value": "1,672",
      "color": "#1890ff"
    },
    {
      "label": "Cases Resolved",
      "value": "1,424",
      "color": "#52c41a"
    }
  ],
  "waterSources": [
    {
      "title": "Contaminated Well",
      "description": "500m from outbreak",
      "riskLevel": "High"
    },
    {
      "title": "Public Borehole",
      "description": "750m from outbreak",
      "additionalInfo": "Moderate contamination risk",
      "riskLevel": "Medium"
    }
  ],
  "environmentalRisks": [
    {
      "title": "Open Defecation",
      "description": "Multiple sites within 200m",
      "riskLevel": "High"
    },
    {
      "title": "Poor Drainage",
      "description": "Stagnant water observed",
      "riskLevel": "Medium"
    }
  ],
  "wasteManagement": [
    {
      "title": "Waste Collection",
      "description": "Irregular service reported",
      "riskLevel": "Medium"
    },
    {
      "title": "Illegal Dumping",
      "description": "Multiple sites identified",
      "riskLevel": "High"
    },
    {
      "title": "Drainage System",
      "description": "Partially blocked",
      "riskLevel": "Medium"
    }
  ],
  "chartData": {
    "labels": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    "values1": [80, 78, 55, 63, 35, 62, 32, 47, 20, 65, 30, 25],
    "values2": [75, 82, 58, 60, 38, 55, 33, 48, 15, 20, 22, 80]
  },
  "filters": {
    "diseaseTypeOptions": ["All"],
    "riskLevelOptions": ["All"],
    "fromDateOptions": ["All"],
    "toDateOptions": ["All"]
  },
  "riskHeatmap": {
    "iframeSrc": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d144.9537353153166!3d-37.816279742021665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d2a7c5e4a7c1!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1633023222539!5m2!1sen!2sus"
  }
}

//reports

{
  "recentReports": [
    {
      "id": 1,
      "title": "Baseline Public sanitation, hygiene and water status",
      "description": "Comprehensive analysis of water quality metrics across all sources for June 2023",
      "date": "2023-06-15",
      "type": "Water Quality",
      "downloads": 25,
      "views": 48,
      "color": "#2196f3",
      "downloadUrl": "https://docs.google.com/spreadsheets/d/1B9sX9SCF8oS6DAzfaLigjz_nXhXW9u_hKVJKMrZtbII/edit?usp=sharing",
      "viewUrl": "https://docs.google.com/spreadsheets/d/1B9sX9SCF8oS6DAzfaLigjz_nXhXW9u_hKVJKMrZtbII/edit?usp=sharing"
    },
    {
      "id": 2,
      "title": "Sanitation Facilities Status",
      "description": "Current status and maintenance report of all sanitation facilities",
      "date": "2023-06-10",
      "type": "Sanitation",
      "downloads": 32,
      "views": 95,
      "color": "#4caf50",
      "downloadUrl": "https://docs.google.com/spreadsheets/d/1AtpMFgVrsgtBF0r-Z7xYGzIXIe55S2b8Sd7Jdx-mukw/edit?usp=sharing",
      "viewUrl": "https://docs.google.com/spreadsheets/d/1AtpMFgVrsgtBF0r-Z7xYGzIXIe55S2b8Sd7Jdx-mukw/edit?usp=sharing"
    },
    {
      "id": 3,
      "title": "Community sanitation facilities",
      "description": "Analysis of waste management practices and dump site conditions",
      "date": "2023-06-05",
      "type": "Waste",
      "downloads": 28,
      "views": 82,
      "color": "#ff9800",
      "downloadUrl": "https://docs.google.com/spreadsheets/d/16UwhRBvago1avJYqbXXjK6Z-i-uxT458lbvPW0wTC7g/edit?usp=sharing",
      "viewUrl": "https://docs.google.com/spreadsheets/d/16UwhRBvago1avJYqbXXjK6Z-i-uxT458lbvPW0wTC7g/edit?usp=sharing"
    }
  ],
  "generalReports": [
    {
      "id": 4,
      "title": "General community information",
      "description": "Yearly evaluation of water and sanitation infrastructure condition",
      "date": "2023-05-20",
      "type": "Infrastructure",
      "downloads": 156,
      "views": 423,
      "color": "#9c27b0",
      "downloadUrl": "https://docs.google.com/spreadsheets/d/1dYopJDOqO5k4BoUovanorv2b3Zq4oKa32CiYHQ9gCEk/edit?usp=sharing",
      "viewUrl": "https://docs.google.com/spreadsheets/d/1dYopJDOqO5k4BoUovanorv2b3Zq4oKa32CiYHQ9gCEk/edit?usp=sharing"
    },
    {
      "id": 5,
      "title": "Baseland Household sanitation & hygiene status",
      "description": "Key performance indicators and metrics for Q2 2023",
      "date": "2023-05-15",
      "type": "Performance",
      "downloads": 89,
      "views": 245,
      "color": "#e91e63",
      "downloadUrl": "https://docs.google.com/spreadsheets/d/1-LXFwXxCclnSZPW0CkBWJMvP34048JpomUSzG4LLt2I/edit?usp=sharing",
      "viewUrl": "https://docs.google.com/spreadsheets/d/1-LXFwXxCclnSZPW0CkBWJMvP34048JpomUSzG4LLt2I/edit?usp=sharing"
    }
  ],
  "stakeholderReports": [
    {
      "id": 6,
      "title": "Post intervention public sanitation ,hygiene and water status",
      "description": "Overview of community engagement and stakeholder feedback",
      "date": "2023-05-10",
      "type": "Engagement",
      "downloads": 67,
      "views": 189,
      "color": "#673ab7",
      "downloadUrl": "https://docs.google.com/spreadsheets/d/1B9sX9SCF8oS6DAzfaLigjz_nXhXW9u_hKVJKMrZtbII/edit?usp=sharing",
      "viewUrl": "https://docs.google.com/spreadsheets/d/1B9sX9SCF8oS6DAzfaLigjz_nXhXW9u_hKVJKMrZtbII/edit?usp=sharing"
    },
    {
      "id": 7,
      "title": "Community sanitation facilities",
      "description": "Analysis of project impact on local communities and beneficiaries",
      "date": "2023-05-05",
      "type": "Impact",
      "downloads": 92,
      "views": 176,
      "color": "#3f51b5",
      "downloadUrl": "https://docs.google.com/spreadsheets/d/16UwhRBvago1avJYqbXXjK6Z-i-uxT458lbvPW0wTC7g/edit?usp=sharing",
      "viewUrl": "https://docs.google.com/spreadsheets/d/16UwhRBvago1avJYqbXXjK6Z-i-uxT458lbvPW0wTC7g/edit?usp=sharing"
    }
  ]
}