import { Button, Container, MenuItem, Select, Stack, TextField, Typography, FormControl, InputLabel, FormHelperText, FormControlLabel, Switch } from '@mui/material'
import React from 'react'
import { useForm, Controller } from "react-hook-form";
import { toast } from 'react-toastify';
import StyledDialog from 'ui-component/StyledDialog';

export default function AddForm({ getData, addData, open, onClose, isEdit = false, data = {} }) {
    const [status, setStatus] = React.useState(false);
    const today = new Date().toISOString().split('T')[0];

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: isEdit ? data : {
            date: today
        }
    })

    const onSubmit = (data) => {
        console.log(data)
        addData({
            empId: data.empId,
            date: data.date,
            menu: data.menu,
            no_of_coupons: data.no_of_coupons,
            reason: data.reason,
        })
            .then((response) => {
                console.log(response);
                toast.success("Transaction Added Successfully");
                getData()
                onClose();
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.response?.data?.message || "Error adding transaction");
            });
    }

    return (
        <StyledDialog open={open} fullWidth onClose={onClose} title={`${isEdit ? "Edit" : "Add"} Transaction`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container>
                    <Stack direction={'column'} sx={{ p: 2 }} spacing={2}>
                        <Controller
                            name="empId"
                            control={control}
                            rules={{ required: "Employee ID is required" }}
                            render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.empId)}>
                                    <TextField
                                        {...field}
                                        label="Employee ID"
                                        error={Boolean(errors.empId)}
                                        helperText={errors.empId?.message}
                                    />
                                </FormControl>
                            )}
                        />

                        <Controller
                            name="date"
                            control={control}
                            rules={{ required: "Date is required" }}
                            render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.date)}>
                                    <TextField
                                        {...field}
                                        type="date"
                                        label="Date"
                                        InputLabelProps={{ shrink: true }}
                                        error={Boolean(errors.date)}
                                        helperText={errors.date?.message}
                                    />
                                </FormControl>
                            )}
                        />

                        <Controller
                            name="menu"
                            control={control}
                            rules={{ required: "Menu is required" }}
                            render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.menu)}>
                                    <InputLabel>Menu Type</InputLabel>
                                    <Select {...field} label="Menu Type">
                                        <MenuItem value="breakfast">Breakfast</MenuItem>
                                        <MenuItem value="lunch">Lunch</MenuItem>
                                        <MenuItem value="dinner">Dinner</MenuItem>
                                        <MenuItem value="snacks">Snacks</MenuItem>
                                    </Select>
                                    {errors.menu && (
                                        <FormHelperText>{errors.menu.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />

                        <Controller
                            name="no_of_coupons"
                            control={control}
                            rules={{ 
                                required: "Number of coupons is required",
                                min: {
                                    value: 1,
                                    message: "Minimum 1 coupon required"
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
                                    />
                                </FormControl>
                            )}
                        />

                        <Controller
                            name="reason"
                            control={control}
                            rules={{ required: "Reason is required" }}
                            render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.reason)}>
                                    <TextField
                                        {...field}
                                        label="Reason"
                                        multiline
                                        rows={3}
                                        error={Boolean(errors.reason)}
                                        helperText={errors.reason?.message}
                                    />
                                </FormControl>
                            )}
                        />

                        <Button 
                            variant='contained' 
                            type='submit' 
                            sx={{ width: '150px', alignSelf: 'flex-end' }}
                        >
                            {isEdit ? 'Update' : 'Add'} Transaction
                        </Button>
                    </Stack>
                </Container>
            </form>
        </StyledDialog>
    )
}