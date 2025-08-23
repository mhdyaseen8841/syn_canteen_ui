import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, FormControl, InputLabel, Select, CircularProgress } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import StyledTable from '../manageCompany/StyledTable';
import { toast } from 'react-toastify';
import { getMenu, searchEmployee, getCompanyCoupons, issueCompanyCoupons } from 'utils/Service';  // ✅ Added missing imports

export default function IssueCanteenCoupons() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const [menu, setMenu] = useState('');
  const [count, setCount] = useState(1);

  const [tableData, setTableData] = useState([]);
  const tableHeader = ['Date', 'Menu', 'User Name', 'Count', 'Company','Status'];

  const debounceRef = useRef();

  // ✅ Fetch company coupons whenever company changes
  useEffect(() => {
    if (selectedCompany) {
      fetchCompanyCoupons(selectedCompany);
    }
    // eslint-disable-next-line
  }, [selectedCompany]);

  // ✅ Fetch companies & menu items on mount
  useEffect(() => {
    let companyData = localStorage.getItem('companies');
    if (companyData) {
      const parsed = JSON.parse(companyData);
      setCompanies(parsed);
      if (parsed.length === 1) {
        setSelectedCompany(parsed[0].company_id);
      }
    }

    setMenuLoading(true);
    getMenu()
      .then((res) => setMenuItems(res || []))
      .catch(() => toast.error('Error fetching menu items'))
      .finally(() => setMenuLoading(false));
  }, []);

  // ✅ Fetch company coupons function
  const fetchCompanyCoupons = async (companyId) => {
    try {
      const res = await getCompanyCoupons(companyId);
      setTableData(res.data || []);
    } catch (error) {
      toast.error(error?.message || 'Failed to fetch company coupons');
      setTableData([]);
    }
  };

  const handleEmployeeSearch = async (searchTerm = '') => {
    if (!selectedCompany) return;
    setLoadingEmployees(true);
    try {
      const response = await searchEmployee({
        company_id: selectedCompany,
        search_text: searchTerm,
      });
      setEmployeeOptions(response || []);
    } catch (error) {
      toast.error('Error loading employees');
      setEmployeeOptions([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleRequestSubmit = async () => {
    if (!menu || !selectedEmployee || !count || !selectedCompany) {
      toast.error('Please fill all fields');
      return;
    }

    const body = {
      menu_id: menu,
      employee_id: selectedEmployee,
      count: count,
      company_id: selectedCompany,
    };

    try {
      await issueCompanyCoupons(body);
      toast.success('Coupons issued successfully');

      // ✅ Refresh table after successful coupon issue
      fetchCompanyCoupons(selectedCompany);

      // ✅ Reset form & close dialog
      handleCloseDialog();
      setMenu('');
      setSelectedEmployee('');
      setCount(1);
    } catch (error) {
      toast.error(error?.message || 'Failed to issue coupons');
    }
  };

  const disableCompanyDropdown = companies.length === 1;

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h3" color="secondary.main">
          Issue Company Coupons
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          disabled={!selectedCompany}
        >
          Issue Company Coupons
        </Button>
      </Stack>

      {/* Company Filter */}
      <Box sx={{ mb: 2, maxWidth: 300 }}>
        <FormControl fullWidth>
          <InputLabel>Company</InputLabel>
          <Select
            value={selectedCompany}
            label="Company"
            onChange={(e) => setSelectedCompany(e.target.value)}
            disabled={disableCompanyDropdown}
          >
            {companies.map((company) => (
              <MenuItem key={company.company_id} value={company.company_id}>
                {company.company_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <StyledTable
        data={tableData}
        header={tableHeader}
        isShowSerialNo={true}
        isShowAction={false}
      />

      {/* Request Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Issue Company Coupons</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <FormControl fullWidth required>
              <InputLabel>Menu</InputLabel>
              <Select
                value={menu}
                label="Menu"
                onChange={(e) => setMenu(e.target.value)}
                disabled={menuLoading}
              >
                {menuLoading ? (
                  <MenuItem value="">
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : (
                  menuItems.map((item) => (
                    <MenuItem key={item.menu_id} value={item.menu_id}>
                      {item.menu_name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <Autocomplete
                options={employeeOptions}
                loading={loadingEmployees}
                getOptionLabel={(option) =>
                  option?.employee_code && option?.employee_name
                    ? `${option.employee_code} - ${option.employee_name}`
                    : ''
                }
                value={employeeOptions.find(emp => emp.employee_id === selectedEmployee) || null}
                onChange={(_, newValue) => {
                  setSelectedEmployee(newValue ? newValue.employee_id : '');
                }}
                onInputChange={(_, newInputValue, reason) => {
                  if (debounceRef.current) clearTimeout(debounceRef.current);
                  if (newInputValue.length > 0 && reason === 'input') {
                    debounceRef.current = setTimeout(() => {
                      handleEmployeeSearch(newInputValue);
                    }, 400);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Employee (ID or Name)"
                    placeholder="Search by ID or Name..."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingEmployees ? (
                            <Box sx={{ pr: 2 }}>
                              <span>Loading...</span>
                            </Box>
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                isOptionEqualToValue={(option, value) => option?.employee_id === value?.employee_id}
                noOptionsText={
                  !selectedCompany
                    ? 'Please select a company first'
                    : loadingEmployees
                    ? 'Searching employees...'
                    : 'No employees found'
                }
                disabled={!selectedCompany}
              />
            </FormControl>
            <TextField
              label="Count"
              type="number"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              fullWidth
              required
              inputProps={{ min: 1 }}
            />
            <FormControl fullWidth>
              <InputLabel>Company</InputLabel>
              <Select
                value={selectedCompany}
                label="Company"
                onChange={(e) => setSelectedCompany(e.target.value)}
                disabled={disableCompanyDropdown}
                required
              >
                {companies.map((company) => (
                  <MenuItem key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleRequestSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
