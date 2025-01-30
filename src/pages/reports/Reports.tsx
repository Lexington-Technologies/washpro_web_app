import {
  AccessTime,
  Assessment,
  Chat,
  ContentCopy,
  Delete,
  Description,
  Download,
  Email,
  Facebook,
  Group,
  LinkedIn,
  Sanitizer,
  Share,
  TrendingUp,
  Twitter,
  Visibility,
  WaterDrop,
  WhatsApp,
} from '@mui/icons-material';
import {
  Alert,
  alpha,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Snackbar,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import React, { useState } from 'react';

// Mock data for reports with download links
const recentReports = [
  {
    id: 1,
    title: 'Monthly Water Quality Assessment',
    description: 'Comprehensive analysis of water quality metrics across all sources for June 2023',
    date: '2023-06-15',
    type: 'Water Quality',
    icon: <WaterDrop />,
    downloads: 45,
    views: 128,
    color: '#2196f3',
    downloadUrl: 'https://example.com/reports/water-quality-june-2023.pdf',
    viewUrl: 'https://example.com/view/water-quality-june-2023',
  },
  {
    id: 2,
    title: 'Sanitation Facilities Status',
    description: 'Current status and maintenance report of all sanitation facilities',
    date: '2023-06-10',
    type: 'Sanitation',
    icon: <Sanitizer />,
    downloads: 32,
    views: 95,
    color: '#4caf50',
    downloadUrl: 'https://docs.google.com/spreadsheets/d/1AtpMFgVrsgtBF0r-Z7xYGzIXIe55S2b8Sd7Jdx-mukw/edit?usp=sharing',
    viewUrl: 'https://example.com/view/sanitation-status-june-2023',
  },
  {
    id: 3,
    title: 'Waste Management Overview',
    description: 'Analysis of waste management practices and dump site conditions',
    date: '2023-06-05',
    type: 'Waste',
    icon: <Delete />,
    downloads: 28,
    views: 82,
    color: '#ff9800',
    downloadUrl: 'https://example.com/reports/waste-management-june-2023.pdf',
    viewUrl: 'https://example.com/view/waste-management-june-2023',
  }
];

const generalReports = [
  {
    id: 4,
    title: 'Annual Infrastructure Assessment',
    description: 'Yearly evaluation of water and sanitation infrastructure condition',
    date: '2023-05-20',
    type: 'Infrastructure',
    icon: <Assessment />,
    downloads: 156,
    views: 423,
    color: '#9c27b0',
    downloadUrl: 'https://example.com/reports/infrastructure-2023.pdf',
    viewUrl: 'https://example.com/view/infrastructure-2023',
  },
  {
    id: 5,
    title: 'Quarterly Performance Metrics',
    description: 'Key performance indicators and metrics for Q2 2023',
    date: '2023-05-15',
    type: 'Performance',
    icon: <TrendingUp />,
    downloads: 89,
    views: 245,
    color: '#e91e63',
    downloadUrl: 'https://example.com/reports/performance-q2-2023.pdf',
    viewUrl: 'https://example.com/view/performance-q2-2023',
  },
];

const stakeholderReports = [
  {
    id: 6,
    title: 'Stakeholder Engagement Summary',
    description: 'Overview of community engagement and stakeholder feedback',
    date: '2023-05-10',
    type: 'Engagement',
    icon: <Group />,
    downloads: 67,
    views: 189,
    color: '#673ab7',
    downloadUrl: 'https://example.com/reports/stakeholder-engagement-2023.pdf',
    viewUrl: 'https://example.com/view/stakeholder-engagement-2023',
  },
  {
    id: 7,
    title: 'Community Impact Assessment',
    description: 'Analysis of project impact on local communities and beneficiaries',
    date: '2023-05-05',
    type: 'Impact',
    icon: <Assessment />,
    downloads: 92,
    views: 276,
    color: '#3f51b5',
    downloadUrl: 'https://example.com/reports/community-impact-2023.pdf',
    viewUrl: 'https://example.com/view/community-impact-2023',
  },
];

const ReportCard: React.FC<{
  report: {
    title: string;
    description: string;
    date: string;
    type: string;
    icon: React.ReactNode;
    downloads: number;
    views: number;
    color: string;
    downloadUrl: string;
    viewUrl: string;
  };
}> = ({ report }) => {
  const theme = useTheme();
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const handleShare = (platform: string) => {
    const shareUrl = report.viewUrl;
    const shareText = `Check out this report: ${report.title}`;
    let shareLink = '';

    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(report.title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
          setSnackbarMessage('Link copied to clipboard!');
          setSnackbarOpen(true);
        });
        break;
      case 'chat':
        // This would typically integrate with your chat system
        setSnackbarMessage('Opening chat...');
        setSnackbarOpen(true);
        break;
    }

    if (shareLink) {
      window.open(shareLink, '_blank');
    }
    handleShareClose();
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        '&:hover': {
          borderColor: 'grey.300',
          backgroundColor: 'grey.50',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                backgroundColor: alpha(report.color, 0.1),
                borderRadius: '6px',
                p: 0.75,
                display: 'flex',
              }}
            >
              {React.cloneElement(report.icon as React.ReactElement, {
                sx: { color: report.color, fontSize: '1.25rem' },
              })}
            </Box>
            <Chip
              label={report.type}
              size="small"
              sx={{
                backgroundColor: alpha(report.color, 0.1),
                color: report.color,
                fontWeight: 500,
                height: 20,
                fontSize: '0.75rem',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="View Report">
              <IconButton
                size="small"
                component={Link}
                href={report.viewUrl}
                target="_blank"
                sx={{
                  p: 0.5,
                  color: 'text.secondary',
                  '&:hover': { backgroundColor: 'grey.100' },
                }}
              >
                <Description sx={{ fontSize: '1.25rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download Report">
              <IconButton
                size="small"
                component={Link}
                href={report.downloadUrl}
                download
                sx={{
                  p: 0.5,
                  color: 'text.secondary',
                  '&:hover': { backgroundColor: 'grey.100' },
                }}
              >
                <Download sx={{ fontSize: '1.25rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share Report">
              <IconButton
                size="small"
                onClick={handleShareClick}
                sx={{
                  p: 0.5,
                  color: 'text.secondary',
                  '&:hover': { backgroundColor: 'grey.100' },
                }}
              >
                <Share sx={{ fontSize: '1.25rem' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            mb: 0.5,
            fontSize: '0.9rem',
            lineHeight: 1.3,
          }}
        >
          {report.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1.5,
            fontSize: '0.8rem',
            lineHeight: 1.4,
          }}
        >
          {report.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime sx={{ fontSize: '0.875rem', mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {new Date(report.date).toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Download sx={{ fontSize: '0.875rem', mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {report.downloads}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Visibility sx={{ fontSize: '0.875rem', mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {report.views}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
      <Menu
        anchorEl={shareAnchorEl}
        open={Boolean(shareAnchorEl)}
        onClose={handleShareClose}
        PaperProps={{
          elevation: 2,
          sx: {
            borderRadius: 2,
            minWidth: 200,
          }
        }}
      >
        <MenuItem onClick={() => handleShare('email')} dense>
          <Email sx={{ mr: 1, color: '#ea4335' }} /> Email
        </MenuItem>
        <MenuItem onClick={() => handleShare('chat')} dense>
          <Chat sx={{ mr: 1, color: '#00bcd4' }} /> Chat User
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleShare('facebook')} dense>
          <Facebook sx={{ mr: 1, color: '#1877f2' }} /> Facebook
        </MenuItem>
        <MenuItem onClick={() => handleShare('twitter')} dense>
          <Twitter sx={{ mr: 1, color: '#1da1f2' }} /> Twitter
        </MenuItem>
        <MenuItem onClick={() => handleShare('linkedin')} dense>
          <LinkedIn sx={{ mr: 1, color: '#0a66c2' }} /> LinkedIn
        </MenuItem>
        <MenuItem onClick={() => handleShare('whatsapp')} dense>
          <WhatsApp sx={{ mr: 1, color: '#25d366' }} /> WhatsApp
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleShare('copy')} dense>
          <ContentCopy sx={{ mr: 1 }} /> Copy Link
        </MenuItem>
      </Menu>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
          elevation={1}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

const ReportSection: React.FC<{
  title: string;
  reports: any[];
}> = ({ title, reports }) => (
  <Box sx={{ mb: 4 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <Typography
        variant="h6"
        sx={{
          color: 'text.primary',
          fontWeight: 500,
          fontSize: '1rem',
        }}
      >
        {title}
      </Typography>
      <Divider sx={{ flex: 1, ml: 2, borderColor: 'grey.200' }} />
    </Box>
    <Grid container spacing={2.5}>
      {reports.map((report) => (
        <Grid item xs={12} md={6} lg={4} key={report.id}>
          <ReportCard report={report} />
        </Grid>
      ))}
    </Grid>
  </Box>
);

const Reports: React.FC = () => {
  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 500,
            color: 'text.primary',
            mb: 1,
          }}
        >
          Reports & Documents
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Access and manage comprehensive reports and analytics documents
        </Typography>
      </Box>

      <ReportSection title="Recent Reports" reports={recentReports} />
      <ReportSection title="General Reports" reports={generalReports} />
      <ReportSection title="Stakeholder Reports" reports={stakeholderReports} />
    </Box>
  );
};

export default Reports;
