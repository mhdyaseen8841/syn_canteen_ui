import { useEffect, useState } from 'react';

// material-ui
import { Grid, Typography } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import { gridSpacing } from 'store/constant';

// import { useNavigate } from 'react-router';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  // const navigate = useNavigate();
  const [inQueue, setInQueue] = useState([]);
  const [onGoing, setOnGoing] = useState([]);



  useEffect(() => {

  }, []);





  return (
    <div style={{ overflowX: 'auto' }}>




      <Grid container spacing={gridSpacing}>
       
        <>
          {/* <Grid item xs={12}>
            <Grid py={4}>
              <Typography variant="h2">Ongoing</Typography>
            </Grid>
            <Grid container spacing={gridSpacing}>
              {onGoing && onGoing.length > 0 ? (
                onGoing.map((result) => (
                  <Grid item key={result._id} lg={4} md={4} sm={6} xs={12}>
                    <EarningCard data={result} isLoading={isLoading} />
                  </Grid>
                ))
              ) : (
                <Grid item key={1} lg={4} md={4} sm={6} xs={12}>
                  {isLoading ? (
                    <EarningCard data={[]} isLoading={true} />
                  ) : (
                    <Typography variant="body1">Currently No Ongoing Trucks</Typography> // Show message when no data and not loading
                  )}
                </Grid>
              )}
            </Grid>
          </Grid> */}

          {/* <Grid item xs={12}>
            <Grid py={3}>
              <Typography variant="h2">In Queue</Typography>
            </Grid>
            <Grid container spacing={gridSpacing}>
              {inQueue && inQueue.length > 0 ? (
                inQueue.map((result) => (
                  <Grid item key={result.registrationNumber} lg={4} md={4} sm={6} xs={12}>
                    <TotalOrderLineChartCard data={result} isLoading={isLoading} />
                  </Grid>
                ))
              ) : (
                <Grid item key={1} lg={4} md={4} sm={6} xs={12}>
                  {isLoading ? (
                    <TotalOrderLineChartCard data={[]} isLoading={true} />
                  ) : (
                    <Typography variant="body1">Currently No Inqueue available</Typography> // Show message when no data and not loading
                  )}
                </Grid>
              )}
            </Grid>
          </Grid> */}
        </>


     


      </Grid>
    </div>
  );
};

export default Dashboard;
