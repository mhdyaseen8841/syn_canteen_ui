import React, { useState, useEffect, useRef } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Typography, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Content from './content';
import Tools from './tools';
import { getCanteenCalender, editExpense, searchEmployee, getCanteenEmployeeReport } from '../../../utils/Service';
import { toast } from 'react-toastify';

export default function Index() {
  const [formOpen, setFormOpen] = useState(false);
  const [data, setData] = useState([]);
  const [canteenCalenderData, setCanteenCalenderData] = useState([]);
  const [selectedCalender, setSelectedCalender] = useState('');
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const debounceRef = useRef();
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  
  useEffect(() => {
  const employeeObj = employeeOptions.find((emp) => emp.employee_id === Number(selectedEmployee));
  setSelectedEmployeeDetails(employeeObj || currentEmployee);
}, [employeeOptions, selectedEmployee, currentEmployee]);


  const getCompanies = async () => {
    try {
      const companyData = localStorage.getItem('companies');
      if (companyData) {
        const parsed = JSON.parse(companyData);
        setCompanies(parsed);

        if (parsed.length >= 1) {
          setSelectedCompany(parsed[0].company_id);
        }

        if (role === 'employee') {
          const empData = JSON.parse(localStorage.getItem('user'));
          setSelectedEmployee(empData.employee_id);
          setCurrentEmployee(empData);
        }
      }
    } catch (err) {
      toast.error('Error fetching companies');
    }
  };

  const getCanteenCalenderData = async () => {
    try {
      const res = await getCanteenCalender(1);
      setCanteenCalenderData(res);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching calendar data');
    }
  };

  const getData = async () => {
    try {
      const res = await getCanteenEmployeeReport({
        canteenCalendarId: selectedCalender,
        employeeId: selectedEmployee
      });
      setData(res);
    } catch (err) {
      console.log(err);
      toast.error('Error fetching report');
    }
  };

  const handleEmployeeSearch = async (searchTerm = '') => {
    if (!selectedCompany) return;
    setLoadingEmployees(true);
    try {
      const response = await searchEmployee({
        company_id: selectedCompany,
        search_text: searchTerm
      });
      setEmployeeOptions(response || []);
    } catch (error) {
      toast.error('Error loading employees');
      setEmployeeOptions([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    getCompanies();
    getCanteenCalenderData();
  }, []);

  const disableCompanyDropdown = companies.length === 1;
  const disableEmployeeDropdown = role === 'employee';

  const shouldEnableFetch =
    selectedCalender &&
    ((role === 'employee' && selectedEmployee) || ((role === 'admin' || role === 'manager') && selectedEmployee && selectedCompany));

  return (
    <Stack direction="column" gap={2}>
      <Typography variant="h3" color="secondary.main">
        Employee Report
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        {/* Date Dropdown - Always Visible */}
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

        {/* Company Dropdown - Only for Admin/Manager */}
        {(role === 'admin' || role === 'manager') && (
          <FormControl fullWidth disabled={disableCompanyDropdown}>
            <InputLabel>Select Company</InputLabel>
            <Select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setSelectedEmployee('');
                setEmployeeOptions([]);
              }}
            >
              <MenuItem value="">
                <em>Select a Company</em>
              </MenuItem>
              {companies.map((company) => (
                <MenuItem key={company.company_id} value={company.company_id}>
                  {company.company_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Employee Dropdown - Admin/Manager */}
        {(role === 'admin' || role === 'manager') && selectedCompany && (
          <FormControl fullWidth>
            <Autocomplete
              options={employeeOptions}
              loading={loadingEmployees}
              getOptionLabel={(option) =>
                option?.employee_code && option?.employee_name ? `${option.employee_code} - ${option.employee_name}` : ''
              }
              value={employeeOptions.find((emp) => emp.employee_id === Number(selectedEmployee)) || null}
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
                    )
                  }}
                />
              )}
              isOptionEqualToValue={(option, value) => option?.employee_id === value?.employee_id}
              noOptionsText={
                !selectedCompany ? 'Please select a company first' : loadingEmployees ? 'Searching employees...' : 'No employees found'
              }
            />
          </FormControl>
        )}
      </Stack>

      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        {role === 'employee' && currentEmployee ? (
          <Typography variant="body2" color="textSecondary">
            Viewing report for: {currentEmployee?.employee_id} - {currentEmployee?.display_name}
          </Typography>
        ) : (
          <Box />
        )}
        <button
          disabled={!shouldEnableFetch}
          onClick={getData}
          style={{
            padding: '8px 16px',
            backgroundColor: shouldEnableFetch ? '#1976d2' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: shouldEnableFetch ? 'pointer' : 'not-allowed'
          }}
        >
          Fetch Report
        </button>
      </Box>

      {/* Content */}
      <Content
        data={data}
        updateData={getData}
        selectedCalender={selectedCalender}
        role={role}
        employeeMeta={{
          month: canteenCalenderData.find((c) => c.canteen_calendar_id === selectedCalender)?.month_year || '',
          companyName: companies.find((c) => c.company_id === selectedCompany)?.company_name || '',
          employeeName: selectedEmployeeDetails?.employee_name || '',
          employeeCode: selectedEmployeeDetails?.employee_code || ''
        }}
      />
    </Stack>
  );
}
