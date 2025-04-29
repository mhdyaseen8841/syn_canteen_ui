import { Button, Container, MenuItem, Select, Stack, TextField, Typography, FormControl, InputLabel, FormHelperText, FormControlLabel, Switch } from '@mui/material'
import React from 'react'
import { useForm, Controller } from "react-hook-form";
import { toast } from 'react-toastify';
import StyledDialog from 'ui-component/StyledDialog';

export default function AddForm({ getData, addData, open, onClose, isEdit = false, data = {} }) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: isEdit ? data : {}
    })

    const onSubmit = (data) => {
        console.log(data)
        addData({
            name: data.name,
            contact: data.contact,
            address: data.address,
            details: data.details,
        })
            .then((response) => {
                console.log(response);
                toast.success("Contractor Added Successfully");
                getData()
                onClose();
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.response?.data?.message || "Error adding contractor");
            });
    }

    return (
        <StyledDialog open={open} fullWidth onClose={onClose} title={`${isEdit ? "Edit" : "Add"} Contractor`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container>
                    <Stack direction={'column'} sx={{ p: 2 }} spacing={2}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "Contractor name is required" }}
                            render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.name)}>
                                    <TextField
                                        {...field}
                                        label="Contractor Name"
                                        error={Boolean(errors.name)}
                                        helperText={errors.name?.message}
                                    />
                                </FormControl>
                            )}
                        />

                        <Controller
                            name="contact"
                            control={control}
                            rules={{ 
                                required: "Contact number is required",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Please enter valid 10-digit contact number"
                                }
                            }}
                            render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.contact)}>
                                    <TextField
                                        {...field}
                                        label="Contact Number"
                                        error={Boolean(errors.contact)}
                                        helperText={errors.contact?.message}
                                    />
                                </FormControl>
                            )}
                        />

                        <Controller
                            name="address"
                            control={control}
                            rules={{ required: "Address is required" }}
                            render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.address)}>
                                    <TextField
                                        {...field}
                                        label="Address"
                                        multiline
                                        rows={3}
                                        error={Boolean(errors.address)}
                                        helperText={errors.address?.message}
                                    />
                                </FormControl>
                            )}
                        />

                        <Controller
                            name="details"
                            control={control}
                            rules={{ required: "Details are required" }}
                            render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.details)}>
                                    <TextField
                                        {...field}
                                        label="Additional Details"
                                        multiline
                                        rows={3}
                                        error={Boolean(errors.details)}
                                        helperText={errors.details?.message}
                                    />
                                </FormControl>
                            )}
                        />

                        <Button 
                            variant='contained' 
                            type='submit' 
                            sx={{ width: '150px', alignSelf: 'flex-end' }}
                        >
                            {isEdit ? 'Update' : 'Add'} Contractor
                        </Button>
                    </Stack>
                </Container>
            </form>
        </StyledDialog>
    )
}