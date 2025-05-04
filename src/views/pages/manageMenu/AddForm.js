import { Button, Container, MenuItem, Select, Stack, TextField, Typography, FormControl, FormHelperText, FormControlLabel, Switch } from '@mui/material'
import React, { useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import { toast } from 'react-toastify';
import StyledDialog from 'ui-component/StyledDialog';
import { convertTo24Hour } from 'utils/convertTo24Hour';

export default function AddForm({ getData, addData, open, onClose, isEdit = false, data = {} }) {
    const [active, setActive] = React.useState(data?.active === 1);

    const {
        control,
        handleSubmit,
        reset,
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


    useEffect(() => {
console.log("trugger")
        if(isEdit) {
            console.log(data)
            reset({
                start_time: convertTo24Hour(data?.start_time || '00:00'),
            end_time: convertTo24Hour(data?.end_time || '00:00'),
                active: data?.active || 1
            });
            setActive(data?.active === 1);
        }

    },[isEdit])
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
        <TextField
            {...field}
            type="time"
            label="Start Time"
            fullWidth
            error={Boolean(errors.start_time)}
            helperText={errors.start_time?.message}
            InputLabelProps={{
                shrink: true,
            }}
            inputProps={{
                step: 1800, // 30-minute steps
            }}
        />
    )}
/>

<Typography variant='h5'>End Time</Typography>
<Controller
    name="end_time"
    control={control}
    rules={{ required: "End Time is required" }}
    render={({ field }) => (
        <TextField
            {...field}
            type="time"
            label="End Time"
            fullWidth
            error={Boolean(errors.end_time)}
            helperText={errors.end_time?.message}
            InputLabelProps={{
                shrink: true,
            }}
            inputProps={{
                step: 1800, // 30-minute steps
            }}
        />
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