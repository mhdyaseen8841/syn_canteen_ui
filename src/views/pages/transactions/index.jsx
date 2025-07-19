import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  Paper,
  Stack,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { Utensils, Building, User } from 'lucide-react';
import {
  getMenu,
  getCompany,
  getEmployee,
  addFixedTransaction,
  addContractorTransaction,
  addGuestTransaction
} from '../../../utils/Service';
// import CouponPrintComponent from './CouponPrint';
import "./index.css";

import { useNavigate } from 'react-router-dom';


import {
  Printer,
  Text,
  Line,
  Row,
  render
} from 'react-thermal-printer';

// const MyReceipt = () => {
//   const printerData = render(
//     <Printer>
//       <Text align="center" bold={true}>My Company</Text>
//       <Line />
//       <Row left="Item" right="$10.00" />
//       <Row left="Total" right="$10.00" />
//     </Printer>
//   );

//   const handlePrint = async () => {
//     await fetch('http://localhost:3001/print', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ data: printerData })
//     });
//   };

//   return <button onClick={handlePrint}>Print</button>;
// };


export default function Index() {
  const [openDialog, setOpenDialog] = useState(null);
  const [isWindowsPrint, setIsWindowsPrint] = useState(true); 
  const [fixedData, setFixedData] = useState({
    menuItem: null,
    coupons: 1
  });
  const [menuLoading, setMenuLoading] = useState(false);
  const [contractorData, setContractorData] = useState({
    company: null,
    contractor: null,
    date: new Date().toISOString().split('T')[0],
    menuItem: null,
    coupons: 1
  });

  const [guestData, setGuestData] = useState({
    company: null,
    guest: null,
    menuItem: null,
    coupons: 1,
    date: new Date().toISOString().split('T')[0]
  });
  const [menuItems, setMenuItems] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [guests, setGuests] = useState([]);
  // Search state
  const [menuSearch, setMenuSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [contractorSearch, setContractorSearch] = useState('');
  const [guestSearch, setGuestSearch] = useState('');

  const [printData, setPrintData] = useState(null);
const [shouldPrint, setShouldPrint] = useState(false);



const navigate = useNavigate();

useEffect(() => {
  const role = localStorage.getItem('role');
  if (role === 'employee' || role === 'manager') {
    navigate('/employeeReports');
  }
}, [navigate]);


 
  

  const handleOpenDialog = (type) => {
    setOpenDialog(type);
    // Reset search states
    setMenuSearch('');
    setCompanySearch('');
    setContractorSearch('');
    setGuestSearch('');

    if (type === 'contractor' || type === 'guest') {
      getCompany()
        .then((res) => {
          setCompanies(res);
        })
        .catch((err) => {
          console.error(err);
          toast.error('Error fetching menu items');
        });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  const handleCompanyChange = (type, company) => {
    if (type === 'contractor') {
      setContractorData({
        ...contractorData,
        company: company,
        contractor: null,
      });
      getEmployee(company.company_id, 'contractor')
        .then((res) => {
          setContractors(res);
        })
        .catch((err) => {
          console.error(err);
          toast.error('Error fetching contractors');
        });
    } else if (type === 'guest') {
      setGuestData({
        ...guestData,
        company: company,
        guest: null,
      });
      getEmployee(company.company_id, 'guest')
        .then((res) => {
          setGuests(res);
        })
        .catch((err) => {
          console.error(err);
          toast.error('Error fetching Guests');
        });
    }
  };

  useEffect(() => {
    getMenu()
      .then((res) => {
        setMenuItems(res);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Error fetching menu items');
      });
  }, []);

  const handleFixedSubmit = () => {
    const { menuItem, coupons } = fixedData;

    addFixedTransaction({ menu_id: menuItem.menu_id, no_of_entries: coupons })
      .then((res) => {
        console.log(res);
        setPrintData({
      type: 'Fixed',
      menu_name: menuItem.menu_name,
      no_of_entries: coupons,
      transaction_id: res.transaction_id,
      date: new Date().toLocaleDateString()
    });
    setShouldPrint(true); // Trigger print
      })
      .catch((err) => {
        console.error(err);
        toast.error('Error submitting fixed transaction');
      });
    for (let i = 0; i < coupons; i++) {
      console.log(`Submitting Fixed Transaction ${i + 1}:`, menuItem.menu_id);
      // Add your API call or transaction logic here
    }

    handleCloseDialog();
    // Reset form
    setFixedData({
      menuItem: null,
      coupons: 1
    });
  };

  const handleContractorSubmit = () => {
    const { company, contractor, menuItem, coupons, date } = contractorData;

    let transactionData = {
      company_id: company.company_id,
      employee_id: contractor.employee_id,
      menu_id: menuItem.menu_id,
      no_of_entries: coupons,
      trasaction_time: date
    };
    addContractorTransaction(transactionData).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.error(err);
      toast.error('Error submitting contractor transaction');
    });
    for (let i = 0; i < coupons; i++) {
      console.log(`Submitting Contractor Transaction ${i + 1}:`, { company, contractor, menuItem, date });
      // Add your API call or transaction logic here
    }

    handleCloseDialog();
    // Reset form
    setContractorData({
      company: null,
      contractor: null,
      date: new Date().toISOString().split('T')[0],
      menuItem: null,
      coupons: 1
    });
  };

  const handleGuestSubmit = () => {
    const { company, guest, menuItem, coupons, date } = guestData;


    let transactionData = {
      company_id: company.company_id,
      employee_id: guest.employee_id,
      menu_id: menuItem.menu_id,
      no_of_entries: coupons,
      trasaction_time: date
    };

    
    for (let i = 0; i < coupons; i++) {
      console.log(`Submitting Guest Transaction ${i + 1}:`, { company, guest, menuItem, date });
    }

    addGuestTransaction(transactionData).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.error(err);
      toast.error('Error submitting contractor transaction');
    });
    handleCloseDialog();
    // Reset form
    setGuestData({
      company: null,
      guest: null,
      menuItem: null,
      coupons: 1,
      date: new Date().toISOString().split('T')[0]
    });
  };

//   useEffect(() => {
//   if (shouldPrint && printData) {
//     setTimeout(() => {
//       window.print();
//       setShouldPrint(false);
//     }, 500); // Short delay to render content
//   }
// }, [shouldPrint, printData]);

  // Fixed Dialog
  const renderFixedDialog = () => (
    <Dialog open={openDialog === 'fixed'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h4">Fixed Transaction</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Autocomplete Menu Item Selector */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Menu Item
            </Typography>
            <Autocomplete
              options={menuItems}
              getOptionLabel={(option) => option.menu_name}
              loading={menuLoading}
              value={fixedData.menuItem || null}
              onChange={(_, value) => setFixedData({ ...fixedData, menuItem: value })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search menu items..."
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {menuLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
              noOptionsText={menuLoading ? 'Loading...' : 'No items found'}
            />
          </Box>

          {/* Number of Coupons */}
          <TextField
            label="Number of Coupons"
            type="number"
            fullWidth
            value={fixedData.coupons}
            onChange={(e) =>
              setFixedData({
                ...fixedData,
                coupons: Math.max(1, parseInt(e.target.value) || 1)
              })
            }
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleFixedSubmit} variant="contained" color="primary" disabled={!fixedData.menuItem}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderContractorDialog = () => (
    <Dialog open={openDialog === 'contractor'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 600 }}>Contractor Transaction</DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Stack spacing={3}>
          {/* Company Autocomplete */}
          <Autocomplete
            options={companies}
            getOptionLabel={(option) => option.company_name}
            value={contractorData.company || null}
            onChange={(e, newValue) => handleCompanyChange('contractor', newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Company"
                placeholder="Search companies..."
                fullWidth
                size="medium" 
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />

          {/* Contractor Autocomplete */}
          <Autocomplete
            options={contractors}
            getOptionLabel={(option) => option.employee_name}
            value={contractorData.contractor || null}
            onChange={(e, newValue) => setContractorData({ ...contractorData, contractor: newValue })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Contractor"
                placeholder="Search contractors..."
                fullWidth
                size="medium" // Larger input size (like Menu Item)
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={!contractorData.company}
          />

          {/* Date Picker */}
          <TextField
            type="date"
            label="Date"
            fullWidth
            value={contractorData.date}
            onChange={(e) => setContractorData({ ...contractorData, date: e.target.value })}
            InputProps={{
              inputProps: {
                min: new Date().toISOString().split('T')[0]
              }
            }}
            size="medium" // Larger input size (like Menu Item)
          />

          {/* Menu Item Autocomplete */}
          <Autocomplete
            options={menuItems}
            getOptionLabel={(option) => option.menu_name}
            loading={menuLoading}
            value={contractorData.menuItem || null}
            onChange={(_, value) => setContractorData({ ...contractorData, menuItem: value })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Menu Item"
                placeholder="Search menu items..."
                fullWidth
                size="medium" // Larger input size (like Menu Item)
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {menuLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
            noOptionsText={menuLoading ? 'Loading...' : 'No items found'}
          />

          {/* Number of Coupons */}
          <TextField
            label="Number of Coupons"
            type="number"
            fullWidth
            value={contractorData.coupons}
            onChange={(e) =>
              setContractorData({
                ...contractorData,
                coupons: Math.max(1, parseInt(e.target.value) || 1)
              })
            }
            InputProps={{ inputProps: { min: 1 } }}
            size="medium" // Larger input size (like Menu Item)
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button
          onClick={handleContractorSubmit}
          variant="contained"
          color="primary"
          disabled={!contractorData.company || !contractorData.contractor || !contractorData.menuItem || !contractorData.date}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Guest Dialog
  const renderGuestDialog = () => (
    <Dialog open={openDialog === 'guest'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 600 }}>Guest Transaction</DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Stack spacing={3}>
          {/* Company Autocomplete */}
          <Autocomplete
            options={companies}
            getOptionLabel={(option) => option.company_name}
            value={guestData.company || null}
            onChange={(e, newValue) => handleCompanyChange('guest', newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Company"
                placeholder="Search companies..."
                fullWidth
                size="medium" // Larger input size
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />

          {/* Guest Autocomplete */}
          <Autocomplete
            options={guests}
            getOptionLabel={(option) => option.employee_name}
            value={guestData.guest || null}
            onChange={(e, newValue) => setGuestData({ ...guestData, guest: newValue })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Guest"
                placeholder="Search guests..."
                fullWidth
                size="medium" // Larger input size
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={!guestData.company}
          />

          {/* Menu Item Autocomplete */}
          <Autocomplete
            options={menuItems}
            getOptionLabel={(option) => option.menu_name}
            value={guestData.menuItem || null}
            onChange={(e, newValue) => setGuestData({ ...guestData, menuItem: newValue })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Menu Item"
                placeholder="Search menu items..."
                fullWidth
                size="medium" // Larger input size
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />

          {/* Date Picker */}
          <TextField
            type="date"
            label="Date"
            fullWidth
            value={guestData.date}
            onChange={(e) => setGuestData({ ...guestData, date: e.target.value })}
            InputProps={{
              inputProps: {
                min: new Date().toISOString().split('T')[0]
              }
            }}
            size="medium" // Larger input size (like Menu Item)
          />

          {/* Number of Coupons */}
          <TextField
            label="Number of Coupons"
            type="number"
            fullWidth
            value={guestData.coupons}
            onChange={(e) =>
              setGuestData({
                ...guestData,
                coupons: Math.max(1, parseInt(e.target.value) || 1)
              })
            }
            InputProps={{ inputProps: { min: 1 } }}
            size="medium" // Larger input size
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button
          onClick={handleGuestSubmit}
          variant="contained"
          color="primary"
          disabled={!guestData.company || !guestData.guest || !guestData.menuItem}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Canteen Counter
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
          Select a transaction type to continue
        </Typography>
      </Paper> */}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent
              onClick={() => handleOpenDialog('fixed')}
              sx={{ cursor: 'pointer', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
            >
              <Box sx={{ p: 2, bgcolor: '#4682B4', borderRadius: '50%', mb: 2 }}>
                <Utensils size={40} color="#ffff" />
              </Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Fixed
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Process fixed menu transactions with specified number of coupons
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 'auto' }} fullWidth>
                Select
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent
              onClick={() => handleOpenDialog('contractor')}
              sx={{ cursor: 'pointer', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
            >
              <Box sx={{ p: 2, backgroundColor: '#6a3d8c', borderRadius: '50%', mb: 2 }}>
                <Building size={40} color="#fff" />
              </Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Contractor
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Process transactions for contractors from registered companies
              </Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 'auto' }} fullWidth>
                Select
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent
              onClick={() => handleOpenDialog('guest')}
              sx={{ cursor: 'pointer', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
            >
              <Box sx={{ p: 2, bgcolor: '#388e3c', borderRadius: '50%', mb: 2 }}>
                <User size={40} color="#fff" />
              </Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Guest
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Process transactions for guests visiting from registered companies
              </Typography>
              <Button
                variant="contained"
                color="success" // Green background
                sx={{
                  mt: 'auto',
                  color: 'white' // Set text color to white
                }}
                fullWidth
              >
                Select
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

  {/* {printData && (
  <div style={{ display: 'block' }}>
    <CouponPrintComponent data={printData}  menuId={printData.menu_name} transactionId={printData.transaction_id} />
  </div>
)} */}
{/* <MyReceipt/> */}
      {renderFixedDialog()}
      {renderContractorDialog()}
      {renderGuestDialog()}
    </Box>
  );
}
