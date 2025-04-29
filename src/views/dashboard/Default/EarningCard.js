import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/icons8-truck-24.png';
import MovingIcon from '@mui/icons-material/Moving';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';

import { useEffect, useState } from 'react';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCard = ({ isLoading, data }) => {
  const theme = useTheme();
  const [truckData, setTruckData] = useState(data);
  useEffect(() => {
  
    setTruckData(data);
  }, [data, isLoading]);

  return (
    <>
      {isLoading || !truckData ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: theme.palette.secondary[800],
                        mt: 1
                      }}
                    >
                      <img src={EarningIcon} alt="truck" />
                    </Avatar>
                  </Grid>
                  <Grid item>
                    {/* Badge component with MailIcon */}
                    <Badge
                      color="secondary"
                      badgeContent={truckData.truck.truckType + 'FT'}
                      max={999}
                      sx={{ marginTop: 1, marginRight: 1.5 }}
                    >
                      <MailIcon />
                    </Badge>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography sx={{ fontSize: '2rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                      {truckData.truck.registrationNumber}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar
                      sx={{
                        cursor: 'pointer',
                        ...theme.typography.smallAvatar,
                        backgroundColor: theme.palette.secondary[200],
                        color: theme.palette.secondary.dark
                      }}
                    >
                      <MovingIcon fontSize="inherit" />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
              
              
              <Grid container direction="row" justifyContent="space-between" alignItems="center">
  <Grid item>
    <Typography
      sx={{
        fontSize: '1rem',
        fontWeight: 500,
        color: theme.palette.secondary[200]
      }}
    >
      Category: {truckData.truck.category}
    </Typography>
    <Typography
      sx={{
        fontSize: '1rem',
        fontWeight: 500,
        color: theme.palette.secondary[200]
      }}
    >
      Date: {new Date(truckData.availableFrom).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })} 
    </Typography>
  </Grid>
  <Grid item>
    <Typography
      sx={{
        fontSize: '1rem',
        fontWeight: 500,
        color: theme.palette.secondary[200]
      }}
    >
      Party: {truckData.allocation.DOBookingId.partyId.name}
    </Typography>
    <Typography
      sx={{
        fontSize: '1rem',
        fontWeight: 500,
        color: theme.palette.secondary[200]
      }}
    >
      Contact: {truckData.allocation.DOBookingId.partyId.contactNumber}
    </Typography>
  </Grid>
</Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool
};

export default EarningCard;
