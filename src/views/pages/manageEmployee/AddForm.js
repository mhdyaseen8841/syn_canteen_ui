import { Button, Container, MenuItem, Select, Stack, TextField, Typography, FormControl, FormHelperText, FormControlLabel, Switch, Autocomplete } from '@mui/material'
import { set } from 'lodash';
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { toast } from 'react-toastify';
import StyledDialog from 'ui-component/StyledDialog';
import {  getDepartment } from 'utils/Service';

export default function AddForm({selectedCompany, getData, addData, open, onClose, isEdit = false, data = {},type }) {
    const [active, setActive] = useState(data?.active === 1);
    const [premiumEnabled, setPremiumEnabled] = useState(data?.premium_enabled === 1);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            employee_code: data?.employee_code || '',
            employee_name: data?.employee_name || '',
            department_id: data?.department_id || '',
            premium_enabled: data?.premium_enabled || 0,
            active: data?.Active || data?.active || 1
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const deptRes = await getDepartment();
                setDepartments(deptRes);
                
          
                // If we have department_id in edit data, find and set the department
                if (isEdit && data?.department_id) {
                    const dept = deptRes.find(d => d.department_id === data.department_id);
                    if (dept) {
                        setSelectedDepartment(dept);
                        setValue('department_id', dept.department_id);
                    }
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
                toast.error('Error loading departments');
            }
        };
        fetchData();
    }, [isEdit]);

    const onSubmit = (formData) => {
 
        if(selectedCompany === '' || selectedCompany === undefined) {   
            toast.error("Please select a company first")
            return;
        }
        if(type === '' || type === undefined) {
            toast.error("Please select a employee type first")
            return;
        }
        const submitData = {
            employee_code: formData.employee_code,
            employee_name: formData.employee_name,
            employee_type:  type,
            company_id: selectedCompany,
            department_id: formData.department_id,
            premium_enabled: premiumEnabled ? 1 : 0,
            active: active ? 1 : 0
        };
        if(isEdit) {
            submitData.employee_id = data.employee_id; 
        }

        addData(submitData)
            .then((response) => {
                console.log(response)
                toast.success(isEdit ? "Employee Updated Successfully" : "Employee Added Successfully");
                getData();
                onClose();
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.response?.data?.message || "Error saving employee");
            });
    };

    return (
        <StyledDialog open={open} fullWidth onClose={onClose} title={`${isEdit ? "Edit" : "Add"} ${type ? type : 'Employee'}`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container>
                    <Stack direction={'column'} sx={{ p: 2 }} spacing={2}>
                        <Controller
                            name="employee_code"
                            control={control}
                            rules={{ required: "Employee Code is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Employee Code"
                                    error={Boolean(errors.employee_code)}
                                    helperText={errors.employee_code?.message}
                                    fullWidth
                                />
                            )}
                        />

                        <Controller
                            name="employee_name"
                            control={control}
                            rules={{ required: "Employee Name is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Employee Name"
                                    error={Boolean(errors.employee_name)}
                                    helperText={errors.employee_name?.message}
                                    fullWidth
                                />
                            )}
                        />

                        {/* <Controller
                            name="company_id"
                            control={control}
                            rules={{ required: "Company is required" }}
                            render={({ field }) => (
                                <Autocomplete
                                    options={companies}
                                    getOptionLabel={(option) => option.company_name}
                                    value={companies.find(x => x.company_id === field.value) || null}
                                    onChange={(_, newValue) => field.onChange(newValue?.company_id)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Company"
                                            error={Boolean(errors.company_id)}
                                            helperText={errors.company_id?.message}
                                        />
                                    )}
                                />
                            )}
                        /> */}

<Controller
            name="department_id"
            control={control}
            rules={{ required: "Department is required" }}
            render={({ field }) => (
                <Autocomplete
                    options={departments}
                    getOptionLabel={(option) => option.department_name || ''}
                    value={departments.find(d => d.department_id === field.value) || null}
                    onChange={(_, newValue) => {
                        field.onChange(newValue?.department_id);
                        setSelectedDepartment(newValue);
                    }}
                    isOptionEqualToValue={(option, value) => 
                        option.department_id === value.department_id
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Department"
                            error={Boolean(errors.department_id)}
                            helperText={errors.department_id?.message}
                        />
                    )}
                />
            )}
        />

                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={premiumEnabled}
                                    onChange={(e) => setPremiumEnabled(e.target.checked)}
                                />
                            }
                            label="Premium Enabled"
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
    );
}