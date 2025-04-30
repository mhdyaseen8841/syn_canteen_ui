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
            department_name: data?.department_name || '',
        }
    });

    const onSubmit = (formData) => {
        const submitData = {
            department_name: formData.department_name,
        };

        addData(submitData)
            .then((response) => {
                toast.success(isEdit ? "Department Updated Successfully" : "Department Added Successfully");
                getData();
                onClose();
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.response?.data?.message || "Error saving Department");
            });
    }

    return (
        <StyledDialog open={open} fullWidth onClose={onClose} title={`${isEdit ? "Edit" : "Add"} Department`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container>
                    <Stack direction={'column'} sx={{ p: 2 }} spacing={2}>
                        <Typography variant='h5'>Department Name</Typography>
                        <Controller
                            name="department_name"
                            control={control}
                            rules={{ 
                                required: "Department Name is required",
                                minLength: {
                                    value: 3,
                                    message: "Department name must be at least 3 characters"
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    error={Boolean(errors.department_name)}
                                    helperText={errors.department_name?.message}
                                    label="Department Name"
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