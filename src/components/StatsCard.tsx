import { alpha, Box, Card, CardContent, SvgIconProps, Typography } from '@mui/material';
import React from 'react';

interface StatsCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ElementType<SvgIconProps>;
  iconColor?: string;
  bgColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, iconColor = '#003c1e', bgColor = '#fff' }) => (
  <Card sx={{ flex: 1 , boxShadow: 'none'}}>
    <CardContent sx={{backgroundColor: alpha(bgColor, 0.1)}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5">{value}</Typography>
        </Box>
          <Box
            sx={{
              backgroundColor: alpha(iconColor, 0.1),
              borderRadius: '12px',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              shadow: 1,
            }}
        >
          <Icon sx={{ color: iconColor, fontSize: 25 }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default StatsCard;
