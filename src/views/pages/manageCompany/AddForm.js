import { Button, Container, Stack, TextField, Typography } from '@mui/material'
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
        defaultValues: {
            company_name: data?.company_name || '',
        }
    });

    const onSubmit = (formData) => {
        const submitData = {
            company_name: formData.company_name,
        };

        addData(submitData)
            .then((response) => {
                toast.success(isEdit ? "Company Updated Successfully" : "Company Added Successfully");
                getData();
                onClose();
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.response?.data?.message || "Error saving company");
            });
    }

    return (
        <StyledDialog open={open} fullWidth onClose={onClose} title={`${isEdit ? "Edit" : "Add"} Company`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container>
                    <Stack direction={'column'} sx={{ p: 2 }} spacing={2}>
                        <Typography variant='h5'>Company Name</Typography>
                        <Controller
                            name="company_name"
                            control={control}
                            rules={{ 
                                required: "Company Name is required",
                                minLength: {
                                    value: 3,
                                    message: "Company name must be at least 3 characters"
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    error={Boolean(errors.company_name)}
                                    helperText={errors.company_name?.message}
                                    label="Company Name"
                                    variant="outlined"
                                />
                            )}
                        />

                        <Button 
                            variant='contained' 
                            type='submit' 
                            sx={{ width: '150px' }}
                        >
                            {isEdit ? 'Update' : 'Add'}
                        </Button>
                    </Stack>
                </Container>
            </form>
        </StyledDialog>
    )
}