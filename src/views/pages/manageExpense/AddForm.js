import {
    Button,
    Container,
    Stack,
    TextField,
    Typography,
    FormControl,
    Autocomplete
  } from '@mui/material';
  import React, { useEffect, useState } from 'react';
  import { useForm, Controller } from "react-hook-form";
  import { toast } from 'react-toastify';
  import StyledDialog from 'ui-component/StyledDialog';
  import { getMenu, getCanteenCalender } from 'utils/Service';
  
  export default function AddForm({ getData, addData, open, onClose, isEdit = false, data = {},selectedCalender }) {
    const {
      control,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm({
      defaultValues: isEdit ? data : {
        menu_id: null,
        canteen_calendar_id: null,
        expense_date: '',
        expense_amount: '',
        remarks: '',
      }
    });
  
    const [menus, setMenus] = useState([]);
    const [calendars, setCalendars] = useState([]);
    const [dateLimits, setDateLimits] = useState({ min: '', max: '' });

    useEffect(() => {
      getMenu().then(setMenus).catch(err => toast.error("Error loading menus"));
      getCanteenCalender().then(setCalendars).catch(err => toast.error("Error loading calendar dates"));
    }, []);
  
    function parseDDMMYYYY(dateStr) {
      const [day, month, year] = dateStr.split("-");
      return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
    }
    

    useEffect(() => {
      if (isEdit) {
        console.log(data)
        console.log(isEdit)
        setValue("menu_id", data.menu_id);
        setValue("canteen_calendar_id", data.canteen_calendar_id);
       setValue(
  "expense_date",
  data.expense_date ? parseDDMMYYYY(data.expense_date) : ''
);
        
        setValue("expense_amount", data.expense_amount);
        setValue("remarks", data.remarks);
      } else {
        setValue("menu_id", null);
        setValue("canteen_calendar_id", null);
        setValue("expense_date", '');
        setValue("expense_amount", '');
        setValue("remarks", '');
      }
    }, [open]);


    const onSubmit = (formData) => {
      console.log(formData);
      if(isEdit) {
        formData.expense_id = data.expense_id;

        addData(formData).then((response) => {
          toast.success("Expense Updated Successfully");
          getData();
          onClose();
        }).catch((error) => {
          console.error(error);
          toast.error(error.response?.data?.message || "Error updating expense");
        }
        );
      } else {
      addData(formData)
        .then((response) => {
          toast.success("Expense Added Successfully");
          getData();
          onClose();
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response?.data?.message || "Error adding expense");
        });
      }
    };
  
    return (
      <StyledDialog open={open} fullWidth onClose={onClose} title={`${isEdit ? "Edit" : "Add"} Expense`}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Container>
            <Stack direction={'column'} sx={{ p: 2 }} spacing={2}>
              {/* Menu */}
              <Controller
  name="menu_id"
  control={control}
  rules={{ required: "Menu is required" }}
  render={({ field }) => {
    const selectedMenu = menus.find((menu) => menu.menu_id === field.value) || null;

    return (
      <Autocomplete
        options={menus}
        getOptionLabel={(option) => option.menu_name || ''}
        value={selectedMenu}
        onChange={(_, value) => field.onChange(value?.menu_id || null)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Menu"
            error={Boolean(errors.menu_id)}
            helperText={errors.menu_id?.message}
          />
        )}
      />
    );
  }}
/>

  
              {/* Calendar Date */}
              <Controller
  name="canteen_calendar_id"
  control={control}
  rules={{ required: "Calendar date is required" }}
  render={({ field }) => {
    const selectedCalendar = calendars.find(
      (cal) => cal.canteen_calendar_id === selectedCalender
    ) || null;

    useEffect(() => {
      if (selectedCalendar) {
        field.onChange(selectedCalendar.canteen_calendar_id);
        if (selectedCalendar.from_date && selectedCalendar.to_date) {
          setDateLimits({
            min: selectedCalendar.from_date.split('T')[0],
            max: selectedCalendar.to_date.split('T')[0],
          });
        }
      }
    }, [selectedCalender, calendars]);

    return (
      <Autocomplete
        options={selectedCalendar ? [selectedCalendar] : []}
        getOptionLabel={(option) => option.month_year || ''}
        value={selectedCalendar}
        disabled
        renderInput={(params) => (
          <TextField
            {...params}
            label="Month & Year"
            error={Boolean(errors.canteen_calendar_id)}
            helperText={errors.canteen_calendar_id?.message}
          />
        )}
      />
    );
  }}
/>



              {/* Expense Date */}
              <Controller
  name="expense_date"
  control={control}
  rules={{ required: "Expense date is required" }}
  render={({ field }) => (
    <TextField
      {...field}
      label="Expense Date"
      type="date"
      InputLabelProps={{ shrink: true }}
      inputProps={{
        min: dateLimits.min,
        max: dateLimits.max
      }}
      error={Boolean(errors.expense_date)}
      helperText={errors.expense_date?.message}
    />
  )}
/>

  
              {/* Expense Amount */}
              <Controller
                name="expense_amount"
                control={control}
                rules={{ required: "Amount is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Expense Amount"
                    type="number"
                    error={Boolean(errors.expense_amount)}
                    helperText={errors.expense_amount?.message}
                  />
                )}
              />
  
              {/* Remarks */}
              <Controller
                name="remarks"
                control={control}
                rules={{ required: "Remarks are required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Remarks"
                    multiline
                    rows={3}
                    error={Boolean(errors.remarks)}
                    helperText={errors.remarks?.message}
                  />
                )}
              />
  
              <Button
                variant='contained'
                type='submit'
                sx={{ width: '150px', alignSelf: 'flex-end' }}
              >
                {isEdit ? 'Update' : 'Add'} Expense
              </Button>
            </Stack>
          </Container>
        </form>
      </StyledDialog>
    );
  }
  