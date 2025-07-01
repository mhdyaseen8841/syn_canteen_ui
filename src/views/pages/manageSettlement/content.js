// Content.jsx (Simplified version - no need to filter into separate arrays now)
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import MenuCard from './MenuCard';

export default function Content({ data }) {
  return (
    <Box sx={{ flexGrow: 1, mt: 3 }}>
      {data.length > 0 ? (
        <Grid container spacing={3}>
          {data.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.menu_id}>
              <MenuCard data={item} /> {/* No 'type' prop needed now */}
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
          No settlement data available for the selected calendar.
        </Typography>
      )}
    </Box>
  );
}