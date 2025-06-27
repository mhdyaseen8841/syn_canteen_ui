import { useEffect, 
  // useState 
} from 'react';

// material-ui
import { Grid,
  //  Typography 
  } from '@mui/material';

// // project imports
// import EarningCard from './EarningCard';
// import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import { gridSpacing } from 'store/constant';

// import { useNavigate } from 'react-router';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {



  useEffect(() => {

  }, []);





  return (
    <div style={{ overflowX: 'auto' }}>




      <Grid container spacing={gridSpacing}>
       
        <>
       DashBoard
        </>


     


      </Grid>
    </div>
  );
};

export default Dashboard;
