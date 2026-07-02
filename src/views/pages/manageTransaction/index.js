import React, { useState, useEffect, useRef } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Typography, Pagination, TextField, CircularProgress, Autocomplete } from '@mui/material';
import Content from './content';
import Tools from './tools';
import AddForm from './AddForm';
import { getCanteenCalender, getMenu, getCurrentTransaction, searchEmployee  } from '../../../utils/Service';
import { toast } from 'react-toastify';



export default function Index() {
    const [formOpen, setFormOpen] = useState(false);
   const [data, setData] = useState([]);
    const [canteenCalenderData, setCanteenCalenderData] = useState([]);
    const [selectedCalender, setSelectedCalender] = useState(null);
    const [selectedCalenderData, setSelectedCalenderData] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [menu, setMenu] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState('');
     const [transactionType, setTransactionType] = useState('employee'); // <-- New state


       const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [searchText, setSearchText] = useState('');
  const [employeeOptions, setEmployeeOptions] = useState([]);
   const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const debounceRef = useRef();


   const getData = async (
    calender = selectedCalender,
    menuId = selectedMenu,
    selectedType = transactionType,
    pageNo = page,
    pageLimit = limit,
    employeeId = selectedEmployee,
    dateVal = selectedDate
  ) => {
    try {
      let formattedDate = null;
      if (dateVal) {
        const parts = dateVal.split('-');
        if (parts.length === 3 && parts[0].length === 4) {
          formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else {
          formattedDate = dateVal;
        }
      }

      let reqData = {
        canteen_calendar_id: calender,
        menu_id: menuId,
        transaction_type: selectedType,
        page: pageNo,
        limit: pageLimit,
        employee_id : employeeId,
        from_date: formattedDate,
        to_date: formattedDate
      };
      const res = await getCurrentTransaction(reqData);
      setData(res.data || res.recordset || []);
      setPage(res.page || pageNo);
      setLimit(res.limit || pageLimit);
      setTotalPages(res.total_pages || 1);
      setTotalCount(res.total_records || 0);
    } catch (err) {
      console.log(err);
      toast.error('Error fetching transactions');
      setData([]);
      setTotalPages(1);
      setTotalCount(0);
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
        const selected = canteenCalenderData.find(cal => cal.canteen_calendar_id === data);
      setSelectedCalender(data)
      setSelectedCalenderData(selected)

      const fromD = selected?.from_date?.split('T')[0];
      const toD = selected?.to_date?.split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      let defaultDate = '';
      if (fromD && toD) {
        if (today >= fromD && today <= toD) {
          defaultDate = today;
        } else {
          defaultDate = fromD;
        }
      }
      setSelectedDate(defaultDate);
      getData(data, selectedMenu, transactionType, 1, limit, selectedEmployee, defaultDate);
    }
  
    const handleDateChange = (dateVal) => {
      setSelectedDate(dateVal);
      setPage(1);
      getData(selectedCalender, selectedMenu, transactionType, 1, limit, selectedEmployee, dateVal);
    }

    const handleMenuChange = (data) => {
      setSelectedMenu(data)
      if(selectedCalender){
        getData(selectedCalender, data, transactionType, 1, limit, selectedEmployee, selectedDate);
      }
    }

       const handleTransactionTypeChange = (data) => {
      setTransactionType(data);
      if (selectedCalender) {
        getData(selectedCalender, selectedMenu, data, 1, limit, selectedEmployee, selectedDate);
      }
    }
  
      const handlePageChange = (event, value) => {
    setPage(value);
    getData(selectedCalender, selectedMenu, transactionType, value, limit, selectedEmployee, selectedDate);
  };

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setPage(1);
    getData(selectedCalender, selectedMenu, transactionType, 1, newLimit, selectedEmployee, selectedDate);
  };


  

  useEffect(() => {
    if (selectedCalender) {
      getData(selectedCalender, selectedMenu, transactionType, page, limit, selectedEmployee, selectedDate);
    }
  }, [page, limit]);

    useEffect(() => {
      getCanteenCalenderData();
      getMenuData()
    }, []);
  

  const handleEmployeeSearch = React.useCallback(
    async (searchTerm = '') => {
      if (!searchTerm) {
        setEmployeeOptions([]);
        return [];
      }
      setLoadingEmployees(true);
      try {
        const response = await searchEmployee({
          search_text: searchTerm
        });
        const employeesData = response.data || response || [];
        setEmployeeOptions(employeesData);
        return employeesData;
      } catch (error) {
        console.log(error)
        toast.error('Error loading employees');
        setEmployeeOptions([]);
        return [];
      } finally {
        setLoadingEmployees(false);
      }
    },
    []
  );



    return (
      <Stack direction={'column'} gap={2}>
      <Tools buttonClick={() => setFormOpen(true)} selectedCalender={selectedCalender} />
      <Typography variant="h3" color={'secondary.main'}>
        Select Filters
      </Typography>
      <Box sx={{ mb: 1 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Select Month/Year</InputLabel>
            <Select value={selectedCalender} label="Select Month/Year" onChange={(e) => handleCalenderDate(e.target.value)}>
              <MenuItem value="">
                <em>Select a Month/Year</em>
              </MenuItem>
              {canteenCalenderData.map((calender) => (
                <MenuItem key={calender.canteen_calendar_id} value={calender.canteen_calendar_id}>
                  {calender.month_year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              type="date"
              label="Select Date"
              value={selectedDate || ''}
              onChange={(e) => handleDateChange(e.target.value)}
              disabled={!selectedCalender}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: selectedCalenderData?.from_date?.split('T')[0],
                max: selectedCalenderData?.to_date?.split('T')[0]
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Menu</InputLabel>
            <Select value={selectedMenu} label="Menu" onChange={(e) => handleMenuChange(e.target.value)}>
            
              {menu.map((type) => (
                <MenuItem key={type.menu_id} value={type.menu_id}>
                  {type.menu_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


           <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={transactionType} label="Type" onChange={(e) => handleTransactionTypeChange(e.target.value)}>
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="fixed">Fixed</MenuItem>
                <MenuItem value="guest">Guest</MenuItem>
                <MenuItem value="contractor">Contractor</MenuItem>
              </Select>
            </FormControl>
        </Stack>
      </Box>


   <Stack   direction="row"
  alignItems="center"
  spacing={3}
  sx={{ mb: 1 }}
  justifyContent="space-between" >
       
        <Box sx={{ flex: 1, mr: 2 }}>
      <Autocomplete
          options={employeeOptions}
          loading={loadingEmployees}
          getOptionLabel={option =>
            option && typeof option === 'object'
              ? `${option.employee_code} - ${option.employee_name}`
              : ''
          }
          inputValue={searchText}
          disabled={
        !selectedCalender || transactionType === 'fixed'
      }
       onInputChange={(_, newInputValue, reason) => {
  setSearchText(newInputValue);
  if (debounceRef.current) clearTimeout(debounceRef.current);
  if (
    newInputValue.length > 0 &&
    reason === 'input' &&
    selectedCalender &&
    transactionType !== 'fixed'
  ) {
    debounceRef.current = setTimeout(() => {
      handleEmployeeSearch(newInputValue);
    }, 500);
  } else if (reason === 'clear') {
    setEmployeeOptions([]);
    setSearchText('');
    setSelectedEmployee(null); // <-- clear selected employee first!
    getData(selectedCalender, selectedMenu, transactionType, 1, limit, null, selectedDate); // pass null for employee
  }
}}
          onChange={(_, newValue) => {
            setSearchText(newValue ? `${newValue.employee_code} - ${newValue.employee_name}` : '');
            setPage(1);
            setSelectedEmployee(newValue?.employee_id || null)
            getData(
              selectedCalender,
              selectedMenu,
              transactionType,
              1,
              limit,
              newValue ? newValue.employee_id : null,
              selectedDate
            );
          }}
          renderInput={params => (
            <TextField
              {...params}
              label="Employee Search"
              size="small"
              placeholder="Search by Employee ID or Name"
              sx={{ minWidth: 220 }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingEmployees ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
          isOptionEqualToValue={(option, value) => option.employee_id === value.employee_id}
          noOptionsText={loadingEmployees ? 'Searching employees...' : 'No employees found'}
        />
        </Box>

        <Typography variant="body2">
          Showing {data.length} of {totalCount} records
        </Typography>
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel>Rows</InputLabel>
          <Select value={limit} label="Rows" onChange={handleLimitChange}>
            {[10, 20, 50, 100].map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Stack>

      <AddForm 
        open={formOpen}  
        getData={getData} 
        onClose={() => setFormOpen(false)} 
        selectedCalender={selectedCalenderData}
        selectedDate={selectedDate}
        selectedMenu={selectedMenu}
      />
      <Content data={data} updateData={getData} />
    </Stack>
  );
}
