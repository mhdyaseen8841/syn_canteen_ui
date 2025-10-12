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
  CircularProgress,
  MenuItem
} from '@mui/material';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';

import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { Utensils, Building, User } from 'lucide-react';
import {
  getMenu,
  getCompany,
  getEmployee,
  addFixedTransaction,
  addContractorTransaction,
  addGuestTransaction,
  getFixedDashboard
} from '../../../utils/Service';
// import CouponPrintComponent from './CouponPrint';
import './index.css';

import { useNavigate } from 'react-router-dom';

import { Printer, Text, Line, Row, render } from 'react-thermal-printer';
import StyledTable from './StyledTable';
import ExportButtons from '../shared/ExportButtons';

export const Roles = {
  ADMIN: 'admin',
  FRONTOFFICE: 'front_office',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  FIXEDUSER: 'fixed_user'
};

export default function Index() {
  const [openDialog, setOpenDialog] = useState(null);
  const [isWindowsPrint, setIsWindowsPrint] = useState(false);
    const [role, setRole] = useState(localStorage.getItem('role') || '');

  const [fixedData, setFixedData] = useState({
    menuItem: null,
    coupons: 1,
    date: new Date().toISOString().split('T')[0]
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

  const [printData, setPrintData] = useState(null);
  const [shouldPrint, setShouldPrint] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    setRole(role);
    if (role === 'employee' || role === 'manager') {
      navigate('/employeeReports');
    }
  }, [navigate]);

  const handleOpenDialog = (type) => {
    setOpenDialog(type);
    // Reset search states

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
        contractor: null
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
        guest: null
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


  const today = new Date().toISOString().split('T')[0];
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [menuFilter, setMenuFilter] = useState('');
  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const tableHeader = ['Menu Name', 'Fixed Rate (₹)', 'Transaction Count', 'Total (₹)'];

  const tableData = tableHeaderReplace(dashboardData, ['menu_name', 'Fixed_Rate', 'tx_count', 'Total'], tableHeader);

  const fetchDashboard = async () => {
    if (!dateFrom || !dateTo) {
      toast.error('Please select both dates');
      return;
    }
    setDashboardLoading(true);
    try {
      const res = await getFixedDashboard({ from_date: dateFrom, to_date: dateTo, menu_id: menuFilter });
      setDashboardData(res || []);
    } catch (err) {
      toast.error('Error fetching dashboard data');
      setDashboardData([]);
    }
    setDashboardLoading(false);
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
    fetchDashboard();
  }, []);

  const handleFixedSubmit = () => {
    const { menuItem, coupons , date } = fixedData;

    addFixedTransaction({ menu_id: menuItem.menu_id, no_of_entries: coupons, trasaction_time : date })
      .then((res) => {
        console.log(res);
        toast.success(`${coupons} coupons for Fixed Transaction Submitted Successfully, TransactionID: ${res.transaction_id}`);
        fetchDashboard();

        const transactionIds = (res.transaction_id || '')
          .toString()
          .split(',')
          .map((id) => id.trim())
          .filter((id) => id !== '');

        // Create an array of objects for each transaction
        const dataToPrintArray = transactionIds.map((id, index) => ({
          report_type: 'fixed',
          menu: menuItem.menu_name,
          rate: menuItem.fixed_menu_rate,
          transaction_id: id.trim()
        }));

        console.log(dataToPrintArray);

        setPrintData(dataToPrintArray);
        setShouldPrint(true);
      })

      .catch((err) => {
        console.error(err);
        toast.error('Error submitting fixed transaction');
      });

    handleCloseDialog();
    // Reset form
    setFixedData({
      menuItem: null,
      coupons: 1,
    });
  };

  const handleContractorSubmit = () => {
    const { company, contractor, menuItem, coupons, date } = contractorData;

    const transactionData = {
      company_id: company.company_id,
      employee_id: contractor.employee_id,
      menu_id: menuItem.menu_id,
      no_of_entries: coupons,
      trasaction_time: date
    };

    addContractorTransaction(transactionData)
      .then((res) => {
        console.log(res);

        toast.success(`${coupons} coupons for Contractor Transaction Submitted Successfully, TransactionID: ${res.transaction_id}`);
        fetchDashboard();

        // Split transaction IDs safely
        const transactionIds = (res.transaction_id || '')
          .toString()
          .split(',')
          .map((id) => id.trim())
          .filter((id) => id !== '');

        // Prepare array for printing
        const dataToPrintArray = transactionIds.map((id) => ({
          report_type: 'contractor',
          company: company.company_name,
          employee_name: contractor.employee_name,
          employee_id: contractor.employee_id,
          menu: menuItem.menu_name,
          rate: menuItem.fixed_menu_rate,
          transaction_id: id,
          coupon_date: date
        }));

        console.log(dataToPrintArray);

        setPrintData(dataToPrintArray);
        setShouldPrint(true);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Error submitting contractor transaction');
      });

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

    const transactionData = {
      company_id: company.company_id,
      employee_id: guest.employee_id,
      menu_id: menuItem.menu_id,
      no_of_entries: coupons,
      trasaction_time: date
    };

    addGuestTransaction(transactionData)
      .then((res) => {
        console.log(res);

        toast.success(`${coupons} coupons for Guest Transaction Submitted Successfully, TransactionID: ${res.transaction_id}`);
        fetchDashboard();

        // Split transaction IDs safely
        const transactionIds = (res.transaction_id || '')
          .toString()
          .split(',')
          .map((id) => id.trim())
          .filter((id) => id !== '');

        // Prepare array for printing
        const dataToPrintArray = transactionIds.map((id) => ({
          report_type: 'guest',
          company: company.company_name,
          menu: menuItem.menu_name, // Change if guest rate is different
          transaction_id: id,
          coupon_date: date
        }));

        console.log(dataToPrintArray);

        setPrintData(dataToPrintArray);
        setShouldPrint(true);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Error submitting Guest transaction');
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

  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      // Adjust the API and params as per your backend
      const res = await getCurrentTransaction({});
      setTransactions(res);
    } catch (err) {
      toast.error('Error fetching transactions');
    }
  };

  useEffect(() => {
    // fetchTransactions();
    const role = localStorage.getItem('role');
  }, []);

  useEffect(() => {
    if (shouldPrint && printData) {
      if (isWindowsPrint) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const content = `
        <html>
          <head>
            <title>Print</title>
            <style>
              body {
                font-family: monospace;
                text-align: center;
                padding: 10px;
              }
              .coupon {
                border-top: 1px dashed #000;
                border-bottom: 1px dashed #000;
                margin-top: 10px;
                padding: 10px;
              }
            </style>
          </head>
          <body>
            <div class="coupon">
              <h5>Synthite Industries Limited</h5>
              <h6>---------------------------</h6>
              <h6>CANTEEN PASS</h6>
              <p><strong>Menu:</strong> ${printData.menu_name}</p>
              <p><strong>Transaction ID:</strong> ${printData.transaction_id}</p>
              <p><strong>Date:</strong> ${printData.date}</p>
            </div>
            <script>
              window.onload = function() {
                window.focus();
                window.print();
                setTimeout(() => window.close(), 500);
              };
            </script>
          </body>
        </html>
      `;

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(content);
        doc.close();

        // Cleanup iframe after printing
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      } else {
      

        // printData.forEach((item) => {
        //   fetch('http://192.168.8.221/CanteenPrint/api/print', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(item) // send each object directly
        //   })
        //     .then((res) => res.json())
        //     .then((result) => {
        //       console.log('Print result:', result);
        //     })
        //     .catch((err) => {
        //       console.error('Print error:', err);
        //     });
        // });
      }
      setPrintData(null);
      setShouldPrint(false);
    }
  }, [shouldPrint, printData, isWindowsPrint]);

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

  <TextField
  sx={{ mb: 3 }}
            type="date"
            label="Date"
            fullWidth
            value={fixedData.date}
            onChange={(e) => setFixedData({ ...fixedData, date: e.target.value })}
            // InputProps={{
            //   inputProps: {
            //     min: new Date().toISOString().split('T')[0]
            //   }
            // }}
            size="medium" // Larger input size (like Menu Item)
          />

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
            renderInput={(params) => <TextField {...params} label="Company" placeholder="Search companies..." fullWidth size="medium" />}
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
            // InputProps={{
            //   inputProps: {
            //     min: new Date().toISOString().split('T')[0]
            //   }
            // }}
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
            // InputProps={{
            //   inputProps: {
            //     min: new Date().toISOString().split('T')[0]
            //   }
            // }}
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

  

  const exportHeaders = ['Menu Name', 'Fixed Rate', 'Transaction Count', 'Total'];

// For Excel export: data without ₹
const exportData = tableData.map(row => ({
  'Menu Name': row['Menu Name'],
  'Fixed Rate': String(row['Fixed Rate (₹)']).replace(/[₹]/g, '').trim(),
  'Transaction Count': row['Transaction Count'],
  'Total': String(row['Total (₹)']).replace(/[₹]/g, '').trim()
}));


  useEffect(() => {
    // Only call if both dates are selected
    if (dateFrom && dateTo) {
      fetchDashboard();
    }
    // eslint-disable-next-line
  }, [dateFrom, dateTo, menuFilter]);
  return (
    <Box >
       <Stack direction={'row'} sx={{ paddingY:2 }}>
                      <Typography variant='h3' color={'secondary.main'}> Fixed Transactions</Typography>
                  </Stack>
      {/* <Grid container spacing={3} pb={2}>
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

        {role !== Roles.FIXEDUSER && (
          <>
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent
                  onClick={() => handleOpenDialog('contractor')}
                  sx={{
                    cursor: 'pointer',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
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
          </>
        )}

        {role !== Roles.FIXEDUSER && (
          <>
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent
                  onClick={() => handleOpenDialog('guest')}
                  sx={{
                    cursor: 'pointer',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
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
          </>
        )}
      </Grid> */}

      <Box>
        {/* Filters */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Date From */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Date From"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
            </Grid>

            {/* Date To */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Date To"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
            </Grid>

            {/* Menu Select */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Menu"
                select
                value={menuFilter}
                onChange={(e) => setMenuFilter(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="">All</MenuItem>
                {menuItems.map((menu) => (
                  <MenuItem key={menu.menu_id} value={menu.menu_id}>
                    {menu.menu_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Paper>

       {dashboardData.length > 0 ? (
  <>
    {/* Export buttons */}
    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
      <ExportButtons
        headers={exportHeaders}
        data={exportData}
        fileName="Fixed_Dashboard_Report"
        meta={{
          from_date: dateFrom,
          to_date: dateTo,
          menu: menuItems.find(m => m.menu_id === menuFilter)?.menu_name || 'All',
          GrandTotal: exportData.map()
        }}
      />
    </Box>

    <StyledTable
      data={tableData}
      header={tableHeader}
      isShowSerialNo={true}
      isShowAction={false}
      actions={['']}
      totalColumnKey="Total"
      dashboardData={dashboardData}
    />
  </>
) : (
          <Typography variant="body2" color="text.secondary" align="center" mb={3}>
            {dashboardLoading ? 'Loading...' : 'No data found for selected filters.'}
          </Typography>
        )}
      </Box>

      {renderFixedDialog()}
      {renderContractorDialog()}
      {renderGuestDialog()}
    </Box>
  );
}
