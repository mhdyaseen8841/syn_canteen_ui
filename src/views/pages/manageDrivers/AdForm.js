import { Button, Container, MenuItem, Select, Stack, TextField, Typography, FormControl, FormHelperText } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { toast } from 'react-toastify';
import StyledDialog from 'ui-component/StyledDialog';
import { addDriver,editDriver, getAllCompany } from 'utils/Service';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';


export default function DriverAdForm({ getData, open, onClose, isEdit = false, data = {} }) {
    const [companies, setCompanies] = useState([]);
    const licenceTypes = ["LMV TT", "MPV", "MGV", "LMV", "MCWG", "MCWOG"];

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: isEdit ?  {
            name: data.Name,
            contactNumber: data.ContactNumber,
            address: data.Address,
            licenceNumber: data.licenceNumber,
            licenceType: data.licenceType,
            expiryDate: data.expiryDate ? dayjs(data.expiryDate) : null, 
            companyId: data.companyId,
        } : {
            name: '',
            contactNumber: '',
            address: '',
            licenceNumber: '',
            licenceType: '',
            expiryDate: null ,
            companyId: '',
        }
    });

    const onSubmit = (formData) => {
        console.log(formData);
        if(!selectedDate ){
            console.log("Please select a date")
            toast.error("Please select a date")
            return 
        }
        const expiryDate = dayjs(selectedDate).format('YYYY-MM-DD'); // Format the date as per your API requirements
       {
        isEdit? 
        editDriver(data._id,{
            name: formData.name,
            contactNumber: formData.contactNumber,
            address: formData.address,
            licenceNumber: formData.licenceNumber,
            licenceType: formData.licenceType,
            expiryDate: expiryDate,
            companyId: formData.companyId
        })
        .then((response) => {
            console.log(response);
            getData();
            onClose();
        })
        .catch((error) => {
            console.error(error);
            toast.error(error.message);
        })
        :
        addDriver({
            name: formData.name,
            contactNumber: formData.contactNumber,
            address: formData.address,
            licenceNumber: formData.licenceNumber,
            licenceType: formData.licenceType,
            expiryDate: expiryDate,
            companyId: formData.companyId
        })
        .then((response) => {
            console.log(response);
            getData();
            onClose();
        })
        .catch((error) => {
            console.error(error);
            toast.error(error.message);
        });
       } 
    };


    const [selectedDate, setSelectedDate] = React.useState(dayjs(data.expiryDate) || null);


    const currentDate = new Date();
    const minDate = currentDate; // Current date
    
    const dateObj = new Date(minDate);
  
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
  
    const formattedDate = `${year}-${month}-${day}`;
  
  
  
 
    
    useEffect(() => {
        console.log(data)
        getAllCompany({ companyTypes: ['transporter', 'both'] })
            .then((data) => {
                console.log(data);
                setCompanies(data);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.message);
            });
    }, []);

    return (
        <React.Fragment>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StyledDialog open={open} fullWidth onClose={onClose} title={`${isEdit ? "Edit" : "Add"} Driver`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container>
                    <Stack direction={'column'} sx={{ p: 2 }} spacing={1}>
                        <Typography variant='h5'>Driver Name</Typography>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <TextField {...field} placeholder="Enter Driver Name" />
                                    {errors.name && (
                                        <span style={{ color: '#f00' }}>
                                            {errors.name.message}
                                        </span>
                                    )}
                                </>
                            )}
                            rules={{ required: "Driver Name is required" }}
                        />

                        <Typography variant='h5'>Contact Number</Typography>
                        <Controller
                            name="contactNumber"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <TextField {...field} placeholder="Enter Contact Number" />
                                    {errors.contactNumber && (
                                        <span style={{ color: '#f00' }}>
                                            {errors.contactNumber.message}
                                        </span>
                                    )}
                                </>
                            )}
                            rules={{ 
                                required: "Contact Number is required",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Contact Number must be exactly 10 digits"
                                }
                            }}
                        />

                        <Typography variant='h5'>Address</Typography>
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <TextField {...field} placeholder="Enter Address" />
                                    {errors.address && (
                                        <span style={{ color: '#f00' }}>
                                            {errors.address.message}
                                        </span>
                                    )}
                                </>
                            )}
                            rules={{ required: "Address is required" }}
                        />

                        <Typography variant='h5'>Licence Number</Typography>
                        <Controller
                            name="licenceNumber"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <TextField {...field} placeholder="Enter Licence Number" />
                                    {errors.licenceNumber && (
                                        <span style={{ color: '#f00' }}>
                                            {errors.licenceNumber.message}
                                        </span>
                                    )}
                                </>
                            )}
                            rules={{ required: "Licence Number is required" }}
                        />

<Typography variant='h5'>Licence Type</Typography>
                        <FormControl error={Boolean(errors.licenceType)}>
                            <Controller
                                name="licenceType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="licenceType-select-label"
                                        id="licenceType-select"
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    >
                                        {licenceTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                                rules={{ required: "Licence Type is required" }}
                            />
                            {errors.licenceType && (
                                <FormHelperText>{errors.licenceType.message}</FormHelperText>
                            )}
                        </FormControl>

                        <Typography variant='h5'>Expiry Date</Typography>
                        {/* <Controller
                            name="expiryDate"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <TextField {...field} placeholder="Enter Expiry Date" />
                                    {errors.expiryDate && (
                                        <span style={{ color: '#f00' }}>
                                            {errors.expiryDate.message}
                                        </span>
                                    )}
                                </>
                            )}
                            rules={{ required: "Expiry Date is required" }}
                        /> */}
                        <FormControl sx={{ mt: 2, minWidth: 120 }}>
            <DatePicker
          value={selectedDate || dayjs(data.expiryDate)}
        onChange={(newValue) => setSelectedDate(newValue)}
        minDate={dayjs(formattedDate)}
       
        renderInput={(params) => <TextField {...params} />}
      />

            </FormControl>


            <Typography variant='h5'>Company</Typography>
                        <FormControl error={Boolean(errors.companyId)}>
                            <Controller
                                name="companyId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="company-select-label"
                                        id="company-select"
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        {companies.map((company) => (
                                            <MenuItem key={company._id} value={company._id}>
                                                {company.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                                rules={{ required: "Company is required" }}
                            />
                            {errors.companyId && (
                                <FormHelperText>{errors.companyId.message}</FormHelperText>
                            )}
                        </FormControl>

                        <Button variant='contained' type='submit' sx={{ width: '150px' }}>
                            {isEdit ? "Edit" : "Add"}
                        </Button>
                    </Stack>
                </Container>
            </form>
        </StyledDialog>
        </LocalizationProvider>
        </React.Fragment>
    );
}
