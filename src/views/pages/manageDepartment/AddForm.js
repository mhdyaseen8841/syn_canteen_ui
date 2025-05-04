import { Button, Container, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { useForm, Controller } from "react-hook-form";
import { toast } from 'react-toastify';
import StyledDialog from 'ui-component/StyledDialog';
import { useEffect } from 'react';

export default function AddForm({ getData, addData, open, onClose, isEdit = false, data = {}, isExist }) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            department_name: '',
        }
    });

    const onSubmit = (formData) => {
       
        if(isExist(formData.department_name)) {
                toast.error("Department already exists")
                return;
        }
        const submitData = {
            department_name: formData.department_name,
        };
        if(isEdit){
            if(data?.department_id === undefined || data?.department_id === '') {
                toast.error("Please select a department first")
                return;
            }

            submitData.department_id = data?.department_id;
        }

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

    useEffect(() => {
        if (open) {
            console.log("dddddddddddd")
            reset({
                department_name: data?.department_name || '',
            });
        }
    }, [open]);

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
                                    value: 1,
                                    message: "Department name must be at least 1 characters"
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