import {
  Button,
  Container,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  FormHelperText,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import React, { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import StyledDialog from 'ui-component/StyledDialog';
import { addEmployeeTransaction, getCompany, getMenu, searchEmployee } from 'utils/Service';

export default function AddForm({ getData, open, onClose, isEdit = false, data = {}, selectedCalender }) {
  const [companies, setCompanies] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);
  const [loadingEmployees, setLoadingEmployees] = React.useState(false);
  const [loadingCompanies, setLoadingCompanies] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState(null);
  const [menuItems, setMenuItems] = React.useState([]);
  const debounceRef = React.useRef();

  const today = new Date().toISOString().split('T')[0];

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm({
    defaultValues: isEdit
      ? data
      : {
         date: selectedCalender?.from_date?.split('T')[0] || today,
          companyId: '',
          empId: '',
          menu: '',
          no_of_coupons: '',
          remarks: ''
        }
  });

  const watchedCompany = watch('companyId');

  React.useEffect(() => {
  if (open && selectedCalender) {
    reset({
      date: selectedCalender.from_date?.split('T')[0] || today,
      companyId: '',
      empId: '',
      menu: '',
      no_of_coupons: '',
      remarks: ''
    });
  }
}, [selectedCalender, open, reset]);


  // Load companies on component mount
  React.useEffect(() => {
    const fetchCompanies = async () => {
      if (!getCompany) {
        console.error('getCompany function is not provided');
        return;
      }

      setLoadingCompanies(true);
      try {
        const response = await getCompany();
        console.log('Companies response:', response);

        // Adjust based on your API response structure
        const companiesData = response.data || response || [];
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error('Error loading companies');
        setCompanies([]);
      } finally {
        setLoadingCompanies(false);
      }
    };

    if (open) {
      fetchCompanies();
    }
  }, [open, getCompany]);

  // Search employees when company changes or when searching
  const handleEmployeeSearch = React.useCallback(
    async (searchTerm = '', companyId = null) => {
      console.log('Searching employees with term:', searchTerm, 'for company:', companyId);

      const targetCompanyId = companyId || watchedCompany;
      if (!targetCompanyId) {
        return [];
      }

      setLoadingEmployees(true);
      try {
        const response = await searchEmployee({
          company_id: targetCompanyId,
          search_text: searchTerm
        });

        console.log('Search users response:', response);

        // Adjust based on your API response structure
        const employeesData = response.data || response || [];
        setEmployees(employeesData);
        return employeesData;
      } catch (error) {
        console.error('Error searching employees:', error);
        toast.error('Error loading employees');
        setEmployees([]);
        return [];
      } finally {
        setLoadingEmployees(false);
      }
    },
    [watchedCompany]
  );

  React.useEffect(() => {
    setValue('empId', '');
    setEmployees([]);
  }, [watchedCompany, setValue]);

  React.useEffect(() => {
    getMenu()
      .then((res) => {
        setMenuItems(res);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Error fetching menu items');
      });
  }, []);
  const onSubmit = (data) => {
    console.log(data);

    // Find selected employee details
    const selectedEmployee = employees.find((emp) => emp.empId === data.empId);

    const submitData = {
      employee_id: data.empId,
      menu_id: data.menu,
      no_of_entries: parseInt(data.no_of_coupons),
      trasaction_time: data.date,
      remarks: data.remarks
    };
    addEmployeeTransaction(submitData)
      .then((response) => {
        console.log(response);
        toast.success('Transaction Added Successfully');
        getData();
        onClose();
        reset();
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response?.data?.message || 'Error adding transaction');
      });
  };

  const handleClose = () => {
    reset();
    setEmployees([]);
    setSelectedCompany(null);
    onClose();
  };

  return (
    <StyledDialog open={open} fullWidth maxWidth="sm" onClose={handleClose} title={`${isEdit ? 'Edit' : 'Add'} Transaction - ${selectedCalender?.month_year}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <Stack direction={'column'} sx={{ p: 2 }} spacing={2}>
            {/* Company Dropdown */}
            <Controller
              name="companyId"
              control={control}
              rules={{ required: 'Company is required' }}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.companyId)}>
                  <Autocomplete
                    options={companies}
                    loading={loadingCompanies}
                    getOptionLabel={(option) => option.company_name || ''}
                    value={companies.find((c) => c.company_id === field.value) || null}
                    onChange={(_, newValue) => {
                      field.onChange(newValue ? newValue.company_id : '');
                      setSelectedCompany(newValue ? newValue.company_id : null);
                    }}
                    isOptionEqualToValue={(option, value) => option.company_id === value.company_id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Company"
                        error={Boolean(errors.companyId)}
                        helperText={errors.companyId?.message}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingCompanies ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          )
                        }}
                      />
                    )}
                  />
                </FormControl>
              )}
            />

            {/* Employee Search Dropdown */}
            <Controller
              name="empId"
              control={control}
              rules={{ required: 'Employee is required' }}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.empId)}>
                  <Autocomplete
                    {...field}
                    disabled={!watchedCompany}
                    loading={loadingEmployees}
                    options={employees}
                    getOptionLabel={(option) =>
                      option && typeof option === 'object' ? `${option.employee_code} - ${option.employee_name}` : ''
                    }
                    value={employees.find((emp) => emp.employee_id === field.value) || null}
                    onChange={(_, newValue) => field.onChange(newValue ? newValue.employee_id : '')}
                    onInputChange={async (event, newInputValue, reason) => {
                      if (debounceRef.current) clearTimeout(debounceRef.current);

                      // Only search when user types and company is selected
                      if (watchedCompany && newInputValue.length > 0 && reason === 'input') {
                        const searchTerm = newInputValue.slice(0, 15);
                        debounceRef.current = setTimeout(() => {
                          handleEmployeeSearch(searchTerm, watchedCompany);
                        }, 500); // 500ms debounce
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Employee (ID or Name)"
                        placeholder={watchedCompany ? 'Search by ID or Name...' : 'Select company first'}
                        error={Boolean(errors.empId)}
                        helperText={errors.empId?.message}
                      />
                    )}
                    isOptionEqualToValue={(option, value) => option.employee_id === value.employee_id}
                    noOptionsText={
                      !watchedCompany ? 'Please select a company first' : loadingEmployees ? 'Searching employees...' : 'No employees found'
                    }
                  />
                </FormControl>
              )}
            />

       <Controller
  name="date"
  control={control}
  rules={{
    required: 'Date is required',
    validate: (value) => {
      const minDate = selectedCalender?.from_date?.split('T')[0];
      const maxDate = selectedCalender?.to_date?.split('T')[0];

      if (minDate && value < minDate) return `Date should be on or after ${minDate}`;
      if (maxDate && value > maxDate) return `Date should be on or before ${maxDate}`;
      return true;
    }
  }}
  render={({ field }) => {
    const minDate = selectedCalender?.from_date?.split('T')[0];
    const maxDate = selectedCalender?.to_date?.split('T')[0];

    return (
      <FormControl fullWidth error={Boolean(errors.date)}>
        <TextField
          {...field}
          type="date"
          label="Date"
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: minDate,
            max: maxDate
          }}
          error={Boolean(errors.date)}
          helperText={
            errors.date?.message ||
            (minDate && maxDate ? `Select a date between ${minDate} and ${maxDate}` : '')
          }
        />
      </FormControl>
    );
  }}
/>


            <Controller
              name="menu"
              control={control}
              rules={{ required: 'Menu is required' }}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.menu)}>
                  <InputLabel>Menu Type</InputLabel>
                  <Select {...field} label="Menu Type" error={Boolean(errors.menu)} onChange={(e) => field.onChange(e.target.value)}>
                    <MenuItem value="">
                      <em>Select Menu</em>
                    </MenuItem>
                    {menuItems.map((menu) => (
                      <MenuItem key={menu.menu_id} value={menu.menu_id}>
                        {menu.menu_name}
                      </MenuItem>
                    ))}
                  </Select>

                  {errors.menu && <FormHelperText>{errors.menu.message}</FormHelperText>}
                </FormControl>
              )}
            />

            <Controller
              name="no_of_coupons"
              control={control}
              rules={{
                required: 'Number of coupons is required',
                min: {
                  value: 1,
                  message: 'Minimum 1 coupon required'
                }
              }}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.no_of_coupons)}>
                  <TextField
                    {...field}
                    type="number"
                    label="Number of Coupons"
                    error={Boolean(errors.no_of_coupons)}
                    helperText={errors.no_of_coupons?.message}
                    inputProps={{ min: 1 }}
                  />
                </FormControl>
              )}
            />

            <Controller
              name="remarks"
              control={control}
              rules={{ required: 'Remarks is required' }}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.remarks)}>
                  <TextField
                    {...field}
                    label="Remarks"
                    multiline
                    rows={3}
                    error={Boolean(errors.remarks)}
                    helperText={errors.remarks?.message}
                  />
                </FormControl>
              )}
            />

            <Button variant="contained" type="submit" sx={{ width: '150px', alignSelf: 'flex-end' }} disabled={loadingEmployees}>
              {isEdit ? 'Update' : 'Add'} Transaction
            </Button>
          </Stack>
        </Container>
      </form>
    </StyledDialog>
  );
}
