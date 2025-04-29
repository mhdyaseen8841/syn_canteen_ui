import { Button, Container, MenuItem, Select, Stack, TextField, Typography, FormControl, InputLabel, FormHelperText } from '@mui/material';
import React, {  useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { toast } from 'react-toastify';
import StyledDialog from 'ui-component/StyledDialog';
import { addCompany,editCompany } from 'utils/Service';

export default function CompanyAdForm({ getData, open, onClose, isEdit = false, data = {} }) {

    const {
        control,
        handleSubmit,
        formState: { errors },
    
    } = useForm({
        defaultValues: isEdit ? {
            name:data.Name,
            ownerName: data['Owner Name'],
            contactNumber: data.ContactNumber,
            address: data.Address,
            companyType: data.CompanyType
        } : {
            name: '',
            ownerName: '',
            contactNumber: '',
            address: '',
            companyType: 'forwarder'
        }
    });

    const onSubmit = (formData) => {
        console.log(formData);
        {isEdit ?
            editCompany(data._id,{
                name: formData.name,
                ownerName: formData.ownerName,
                contactNumber: formData.contactNumber,
                address: formData.address,
                companyType: formData.companyType
            }) .then((response) => {
                console.log(response);
                getData();
                onClose();
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.message);
            })
            :
            addCompany({
                name: formData.name,
                ownerName: formData.ownerName,
                contactNumber: formData.contactNumber,
                address: formData.address,
                companyType: formData.companyType
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

 
useEffect(() => {
    
}, []);


    return (
        <StyledDialog open={open} fullWidth onClose={onClose} title={`${isEdit ? "Edit" : "Add"} Company`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container>
                    <Stack direction={'column'} sx={{ p: 2 }} spacing={1}>
                        <Typography variant='h5'>Company Name</Typography>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <TextField {...field} placeholder="Enter Company Name" />
                                    {errors.name && (
                                        <span style={{ color: '#f00' }}>
                                            {errors.name.message}
                                        </span>
                                    )}
                                </>
                            )}
                            rules={{ required: "Company Name is required" }}
                        />

                        <Typography variant='h5'>Owner Name</Typography>
                        <Controller
                            name="ownerName"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <TextField {...field} placeholder="Enter Owner Name" />
                                    {errors.ownerName && (
                                        <span style={{ color: '#f00' }}>
                                            {errors.ownerName.message}
                                        </span>
                                    )}
                                </>
                            )}
                            rules={{ required: "Owner Name is required" }}
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

                        <FormControl error={Boolean(errors.companyType)}>
                            <InputLabel id="companyType-select-label">Company Type</InputLabel>
                            <Controller
                                name="companyType"
                                control={control}
                                defaultValue="forwarder" // Default value
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="companyType-select-label"
                                        id="companyType-select"
                                        label="Company Type"
                                        onChange={(e) => field.onChange(e.target.value)}
                                    >
                                        <MenuItem value="forwarder">Forwarder</MenuItem>
                                        <MenuItem value="transporter">Transporter</MenuItem>
                                        <MenuItem value="both">Both</MenuItem>
                                    </Select>
                                )}
                                rules={{ required: "Company Type is required" }}
                            />
                            {errors.companyType && (
                                <FormHelperText>{errors.companyType.message}</FormHelperText>
                            )}
                        </FormControl>

                        <Button variant='contained' type='submit' sx={{ width: '150px' }}>
                            {isEdit ? "Edit" : "Add"}
                        </Button>
                    </Stack>
                </Container>
            </form>
        </StyledDialog>
    );
}
