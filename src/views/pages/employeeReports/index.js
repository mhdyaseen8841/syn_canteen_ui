import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import Content from './content';
import Tools from './tools';
import AddForm from './AddForm';
import { getExpense,getCanteenCalender, getMenu,addExpense,editExpense, searchEmployee  } from '../../../utils/Service';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


export default function Index() {
  const [formOpen, setFormOpen] = useState(false);
  const [data, setData] = useState([]);
  const [canteenCalenderData, setCanteenCalenderData] = useState([]);
  const [selectedCalender, setSelectedCalender] = useState('');
  const [menu, setMenu] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState('');
  const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
  const [employeeOptions, setEmployeeOptions] = useState([]);
const [selectedEmployee, setSelectedEmployee] = useState('');
const [loadingEmployees, setLoadingEmployees] = useState(false);
const debounceRef = React.useRef();



const handleEmployeeSearch = async (searchTerm = '') => {
  // if (!selectedCalender) return;
  debugger;
  setLoadingEmployees(true);
  try {
    const response = await searchEmployee({
      // If you have company_id, pass it here. Otherwise, remove company_id.
      company_id: selectedCompany,
      search_text: searchTerm
    });
    setEmployeeOptions(response.data || response || []);
  } catch (error) {
    setEmployeeOptions([]);
    toast.error('Error loading employees');
  } finally {
    setLoadingEmployees(false);
  }
};


  const getCompanies = async () => {
    try {
      let companyData = localStorage.getItem('companies');

      if (companyData) {
        setCompanies(JSON.parse(companyData));
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching companies');
    }
  };



  const getData = async (calender = selectedCalender,menu = selectedMenu) => {
    console.log(selectedCalender)
    console.log(selectedMenu)
    try {
      const res = await getExpense(calender,menu);
      setData(res);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching expenses");
    }
  };

  const getCanteenCalenderData = async () => {
    try {
      const res = await getCanteenCalender(0);
      setCanteenCalenderData(res);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching calender data");

    }
  };

  const getMenuData = async (data) => {
    try {
      const res = await getMenu(data);
      setMenu(res);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching menu data");
    }
  }

  const handleCalenderDate = (data) =>{
    setSelectedCalender(data)
   // getData(data,selectedMenu);
  }


  useEffect(() => {
    getCanteenCalenderData();
    getMenuData(),
     getCompanies();
  }, []);


  return (
    <Stack direction={'column'} gap={2}>
   <Tools buttonClick={() => setFormOpen(true)} selectedCalender={selectedCalender} />

       <Typography variant="h3" color={'secondary.main'}>
                      Select Filters
                    </Typography>
            <Box sx={{ mb: 2 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Select Date</InputLabel>
                  <Select
                    value={selectedCalender}
                    label="Select Date"
                    onChange={(e) => handleCalenderDate(e.target.value)}
                  >
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

 <FormControl fullWidth>
            <InputLabel>Select Company</InputLabel>
            <Select value={selectedCompany} label="Select Company" onChange={(e) => setSelectedCompany(e.target.value)}>
              <MenuItem value="">
                <em>Select a company</em>
              </MenuItem>
              {companies.map((company) => (
                <MenuItem key={company.company_id} value={company.company_id}>
                  {company.company_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

                <FormControl fullWidth>
  <Autocomplete
    disabled={!selectedCompany}
    loading={loadingEmployees}
    options={employeeOptions}
    getOptionLabel={option =>
      option && typeof option === 'object'
        ? `${option.employee_code} - ${option.employee_name}`
        : ''
    }
    value={employeeOptions.find(emp => emp.employee_id === selectedEmployee) || null}
    onChange={(_, newValue) => {
      setSelectedEmployee(newValue ? newValue.employee_id : '');
      // If both selected, trigger data fetch
      if (selectedCalender && newValue) {
        getData(selectedCalender, newValue.employee_id);
      }
    }}
    onInputChange={(_, newInputValue, reason) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (selectedCalender && newInputValue.length > 0 && reason === 'input') {
        const searchTerm = newInputValue.slice(0, 15);
        debounceRef.current = setTimeout(() => {
          handleEmployeeSearch(searchTerm);
        }, 1000);
      }
    }}
    renderInput={params => (
      <TextField
        {...params}
        label="Employee (ID or Name)"
        placeholder={selectedCalender ? "Search by ID or Name..." : "Select date first"}
      />
    )}
    isOptionEqualToValue={(option, value) => option.employee_id === value.employee_id}
    noOptionsText={
      !selectedCalender
        ? "Please select a date first"
        : loadingEmployees
          ? "Searching employees..."
          : "No employees found"
    }
  />
</FormControl>
      
              </Stack>
            </Box>

      <AddForm open={formOpen} addData={addExpense} getData={getData} onClose={() => setFormOpen(false)} selectedCalender={selectedCalender} />
   
      <Content data={data} updateData={getData} selectedCalender={selectedCalender} editExpense={editExpense} menus={menu}/>
    </Stack>
  );
}
