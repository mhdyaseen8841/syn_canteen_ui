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
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';

import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { Utensils, Building, User } from 'lucide-react';
import {
  getMenu,
  getCompany,
  getCanteenCalender,
  getSettledFixedDashboard
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
  const [selectedCalender, setSelectedCalender] = useState('');
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

  const [canteenCalenderData, setCanteenCalenderData] = useState([]);

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



  const today = new Date().toISOString().split('T')[0];
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [menuFilter, setMenuFilter] = useState('');
  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const tableHeader = ['Menu Name', 'Fixed Rate (₹)', 'Transaction Count', 'Total (₹)'];

  const tableData = tableHeaderReplace(dashboardData, ['menu_name', 'Fixed_Rate', 'tx_count', 'Total'], tableHeader);

  const fetchDashboard = async () => {
    if (!selectedCalender) {
      toast.error('Please select a calendar date');
      return;
    }
    setDashboardLoading(true);
    try {
      const res = await getSettledFixedDashboard({ canteenCalendarId: selectedCalender, menu_id: menuFilter });
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

        getCanteenCalender(1)
    .then((res) => setCanteenCalenderData(res))
    .catch((err) => {
      console.error(err);
      toast.error('Error fetching calendars');
    });
  }, []);

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
    if (selectedCalender) {
      fetchDashboard();
    }
    // eslint-disable-next-line
  }, [selectedCalender, menuFilter]);
  return (
    <Box >
       <Stack direction={'row'} sx={{ paddingY:2 }}>
                      <Typography variant='h3' color={'secondary.main'}> Fixed Reports</Typography>
                  </Stack>
    

      <Box>
        {/* Filters */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4} md={6}>
            {/* Date From */}
               <FormControl fullWidth>
          <InputLabel>Select Date</InputLabel>
          <Select value={selectedCalender} label="Select Date" onChange={(e) => setSelectedCalender(e.target.value)}>
            <MenuItem value="">
              <em>Select a Date</em>
            </MenuItem>
            {canteenCalenderData.map((calender) => (
              <MenuItem key={calender.canteen_calendar_id} value={calender.canteen_calendar_id}>
                {calender.month_year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </Grid>

            {/* Menu Select */}
            <Grid item xs={12} sm={4} md={6}>
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
              GrandTotal: exportData.reduce((sum, row) => sum + (parseFloat(row['Total']) || 0), 0)
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

    </Box>
  );
}
