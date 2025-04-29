import { Button, Container, MenuItem, Select, Stack, TextField, Typography, FormControl, InputLabel, FormHelperText, FormControlLabel, Switch } from '@mui/material'
import React from 'react'
import { useForm, Controller } from "react-hook-form";
import { toast } from 'react-toastify';
import StyledDialog from 'ui-component/StyledDialog';

export default function AddForm({ getData, addData, open, onClose, isEdit = false, data = {} }) {
    const [status, setStatus] = React.useState(false);

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
            menuType: data.menuType,
            fromTime: data.fromTime,
            toTime: data.toTime,
            status: status,
        })
            .then((response) => {
                console.log(response);
                toast.success("Menu Item Added Successfully");
                getData()
                onClose();
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.response?.data?.message || "Error adding menu item");
            });
    }

    const generateTimeOptions = () => {
        const times = [];
        for (let hours = 0; hours < 24; hours++) {
            for (let minutes = 0; minutes < 60; minutes += 15) {
                const hour = hours.toString().padStart(2, '0');
                const minute = minutes.toString().padStart(2, '0');
                times.push(`${hour}:${minute}`);
            }
        }
        return times;
    };

    return (
        <StyledDialog open={open} fullWidth onClose={onClose} title={`${isEdit ? "Edit" : "Add"} Menu Item`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container>
                    <Stack direction={'column'} sx={{ p: 2 }} spacing={1}>
                        <Typography variant='h5'>Menu Type</Typography>
                        <Controller
                            name="menuType"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <TextField {...field} placeholder="Enter Menu Name" />
                                    {errors.name && (
                                        <span style={{ color: '#f00' }}>
                                            {errors.name.message}
                                        </span>
                                    )}
                                </>
                            )}
                            rules={{ required: "Menu Name is required" }}
                        />

                        {/* <Typography variant='h5'>Menu Type</Typography>
                        <FormControl error={Boolean(errors.menuType)}>
                            <InputLabel id="menutype-select-label">Menu Type</InputLabel>
                            <Controller
                                name="menuType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="menutype-select-label"
                                        label="Menu Type"
                                        value={field.value || ''}
                                    >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <MenuItem value="breakfast">Breakfast</MenuItem>
                                        <MenuItem value="lunch">Lunch</MenuItem>
                                        <MenuItem value="dinner">Dinner</MenuItem>
                                        <MenuItem value="snacks">Snacks</MenuItem>
                                    </Select>
                                )}
                                rules={{ required: "Menu Type is required" }}
                            />
                            {errors.menuType && (
                                <FormHelperText>{errors.menuType.message}</FormHelperText>
                            )}
                        </FormControl> */}

<Typography variant='h5'>From Time</Typography>
<Controller
    name="fromTime"
    control={control}
    render={({ field }) => (
        <FormControl fullWidth error={Boolean(errors.fromTime)}>
            <Select
                {...field}
                value={field.value || ''}
                displayEmpty
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 300
                        }
                    }
                }}
            >
                <MenuItem value="" disabled>Select Time</MenuItem>
                {generateTimeOptions().map((time) => (
                    <MenuItem key={time} value={time}>
                        {time}
                    </MenuItem>
                ))}
            </Select>
            {errors.fromTime && (
                <FormHelperText>{errors.fromTime.message}</FormHelperText>
            )}
        </FormControl>
    )}
    rules={{ required: "From Time is required" }}
/>

<Typography variant='h5'>To Time</Typography>
<Controller
    name="toTime"
    control={control}
    render={({ field }) => (
        <FormControl fullWidth error={Boolean(errors.toTime)}>
            <Select
                {...field}
                value={field.value || ''}
                displayEmpty
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 300
                        }
                    }
                }}
            >
                <MenuItem value="" disabled>Select Time</MenuItem>
                {generateTimeOptions().map((time) => (
                    <MenuItem key={time} value={time}>
                        {time}
                    </MenuItem>
                ))}
            </Select>
            {errors.toTime && (
                <FormHelperText>{errors.toTime.message}</FormHelperText>
            )}
        </FormControl>
    )}
    rules={{ required: "To Time is required" }}
/>

                        <FormControl>
                            <FormControlLabel
                                sx={{ mt: 1 }}
                                control={
                                    <Switch checked={status} onChange={() => setStatus(!status)} />
                                }
                                label="Status"
                            />
                        </FormControl>

                        <Button variant='contained' type='submit' sx={{ width: '150px' }}>
                            {isEdit ? 'Update' : 'Add'}
                        </Button>
                    </Stack>
                </Container>
            </form>
        </StyledDialog>
    )
}