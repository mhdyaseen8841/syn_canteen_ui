import { Button, Container, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { useForm, Controller } from "react-hook-form";
import { toast } from 'react-toastify';
import StyledDialog from 'ui-component/StyledDialog';
import { useEffect } from 'react';

export default function AddForm({ getData, addData, editData, open, onClose, isEdit = false, data = {}, selectedCompany }) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            plant_code: data?.plant_code || '',
            plant_name: data?.plant_name || '',
            company_id: selectedCompany || ''
        }
    });

    const onSubmit = (formData) => {
        const submitData = {
            plant_code: formData.plant_code,
            plant_name: formData.plant_name,
            company_id: selectedCompany || formData.company_id
        };

        if (isEdit) {
            if (!data?.plant_id) {
                toast.error("Please select a plant to edit");
                return;
            }
            submitData.plant_id = data.plant_id;
            editData(submitData)
                .then(() => {
                    toast.success('Plant Updated Successfully');
                    getData();
                    onClose();
                })
                .catch((error) => {
                    console.error(error);
                    toast.error(error.response?.data?.message || "Error updating plant");
                });
        } else {
            if (!submitData.company_id) {
                toast.error('Please select a company first');
                return;
            }
            addData(submitData)
                .then(() => {
                    toast.success('Plant Added Successfully');
                    getData();
                    onClose();
                })
                .catch((error) => {
                    console.error(error);
                    toast.error(error.response?.data?.message || "Error adding plant");
                });
        }
    }

    useEffect(() => {
        if (open) {
            reset({
                plant_code: data?.plant_code || '',
                plant_name: data?.plant_name || '',
                company_id: selectedCompany || ''
            });
        }
    }, [open, data, selectedCompany]);

    return (
        <StyledDialog open={open} fullWidth onClose={onClose} title={`${isEdit ? "Edit" : "Add"} Plant`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container>
                    <Stack direction={'column'} sx={{ p: 2 }} spacing={2}>
                        <Typography variant='h5'>Plant Code</Typography>
                        <Controller
                            name="plant_code"
                            control={control}
                            rules={{ 
                                required: "Plant Code is required",
                                minLength: {
                                    value: 1,
                                    message: "Plant code must be at least 1 characters"
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    error={Boolean(errors.plant_code)}
                                    helperText={errors.plant_code?.message}
                                    label="Plant Code"
                                    variant="outlined"
                                />
                            )}
                        />

                        <Typography variant='h5'>Plant Name</Typography>
                        <Controller
                            name="plant_name"
                            control={control}
                            rules={{ 
                                required: "Plant Name is required",
                                minLength: {
                                    value: 1,
                                    message: "Plant name must be at least 1 characters"
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    error={Boolean(errors.plant_name)}
                                    helperText={errors.plant_name?.message}
                                    label="Plant Name"
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