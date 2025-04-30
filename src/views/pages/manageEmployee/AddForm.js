import { Button, Container, MenuItem, Select, Stack, TextField, Typography, FormControl, FormHelperText, FormControlLabel, Switch } from '@mui/material'
import React from 'react'
import { useForm, Controller } from "react-hook-form";
import { toast } from 'react-toastify';
import StyledDialog from 'ui-component/StyledDialog';

export default function AddForm({ getData, addData, open, onClose, isEdit = false, data = {} }) {
    const [active, setActive] = React.useState(data?.active === 1);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            menu_id: data?.menu_id || '',
            start_time: data?.start_time || '',
            end_time: data?.end_time || '',
            active: data?.active || 1
        }
    });

    const onSubmit = (formData) => {
        const submitData = {
            menu_id: isEdit ? data.menu_id : undefined, // Only include menu_id for edit
            start_time: formData.start_time,
            end_time: formData.end_time,
            active: active ? 1 : 0
        };

        addData(submitData)
            .then((response) => {
                toast.success(isEdit ? "Menu Updated Successfully" : "Menu Added Successfully");
                getData();
                onClose();
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.response?.data?.message || "Error saving menu");
            });
    }

    const generateTimeOptions = () => {
        const times = [];
        for (let hours = 0; hours < 24; hours++) {
            for (let minutes = 0; minutes < 60; minutes += 30) {
                const hour = hours.toString().padStart(2, '0');
                const minute = minutes.toString().padStart(2, '0');
                times.push(`${hour}:${minute}:00`);
            }
        }
        return times;
    };

    return (
        <StyledDialog open={open} fullWidth onClose={onClose} title={`${isEdit ? "Edit" : "Add"} Menu`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container>
                    <Stack direction={'column'} sx={{ p: 2 }} spacing={2}>
                        <Typography variant='h5'>Start Time</Typography>
                        <Controller
                            name="start_time"
                            control={control}
                            rules={{ required: "Start Time is required" }}
                            render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.start_time)}>
                                    <Select
                                        {...field}
                                        value={field.value || ''}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Time</MenuItem>
                                        {generateTimeOptions().map((time) => (
                                            <MenuItem key={time} value={time}>
                                                {time}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.start_time && (
                                        <FormHelperText>{errors.start_time.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />

                        <Typography variant='h5'>End Time</Typography>
                        <Controller
                            name="end_time"
                            control={control}
                            rules={{ required: "End Time is required" }}
                            render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.end_time)}>
                                    <Select
                                        {...field}
                                        value={field.value || ''}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Time</MenuItem>
                                        {generateTimeOptions().map((time) => (
                                            <MenuItem key={time} value={time}>
                                                {time}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.end_time && (
                                        <FormHelperText>{errors.end_time.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />

                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={active}
                                    onChange={(e) => setActive(e.target.checked)}
                                />
                            }
                            label="Active"
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