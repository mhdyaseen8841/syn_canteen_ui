import {
    Button,
    Container,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    FormHelperText,
  } from '@mui/material';
  import React, { useEffect, useState } from 'react';
  import { useForm, Controller } from 'react-hook-form';
  import { toast } from 'react-toastify';
  import StyledDialog from 'ui-component/StyledDialog';
  import { addUser, editUser,getAllCompany } from '../../../utils/Service';
  
  export default function UserForm({ getData, open, onClose, isEdit = false, data = {} }) {
    const [companies, setCompanies] = useState([]);
  
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm({
      defaultValues: isEdit
        ? {
     
            name: data.Name || '',
            userName: data['User Name'] || '',
            address: data.Address || '',
            email: data.Email || '',
            phone: data['Contact Number'] || '',
            password: '',
            companyId: data.companyId || '',
          }
        : {
            name: '',
            userName: '',
            address: '',
            email: '',
            phone: '',
            password: '',
            companyId: '',
          },
    });
  
    useEffect(() => {
      if (open) {
        getAllCompany()
          .then((res) =>{ 
            console.log("heyyy")
            setCompanies(res)
      })
          .catch((err) => {
            console.error(err);
            toast.error('Failed to fetch companies');
          });
  
          console.log(data)
       
      }
    }, [open]);
  
    const onSubmit = (formData) => {
      const payload = {
        ...formData,
        role: 'company',
      };
  
      const submitAction = isEdit
        ? editUser({userId:data._id, ...payload})
        : addUser(payload);
  
      submitAction
        .then(() => {
          toast.success(`User ${isEdit ? 'updated' : 'added'} successfully`);
          getData();
          handleClose();
      
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response?.data?.message || 'Something went wrong');
        });
    };
  
    const handleClose = () => {
      onClose();
      reset();
    };

    return (
      <StyledDialog open={open} fullWidth onClose={handleClose} title={`${isEdit ? 'Edit' : 'Add'} User`}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Container>
            <Stack direction="column" sx={{ p: 2 }} spacing={2}>
              <Typography variant="h5">Name</Typography>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => <TextField {...field} placeholder="Enter Name" error={!!errors.name} helperText={errors.name?.message} />}
              />
  
              <Typography variant="h5">User Name</Typography>
              <Controller
                name="userName"
                control={control}
                rules={{ required: 'Username is required' }}
                render={({ field }) => <TextField {...field} placeholder="Enter Username" error={!!errors.userName} helperText={errors.userName?.message} />}
              />
  
              <Typography variant="h5">Address</Typography>
              <Controller
                name="address"
                control={control}
                rules={{ required: 'Address is required' }}
                render={({ field }) => <TextField {...field} placeholder="Enter Address" error={!!errors.address} helperText={errors.address?.message} />}
              />
  
              <Typography variant="h5">Email</Typography>
              <Controller
                name="email"
                control={control}
                rules={{ required: 'Email is required' }}
                render={({ field }) => <TextField {...field} placeholder="Enter Email" error={!!errors.email} helperText={errors.email?.message} />}
              />
  
              <Typography variant="h5">Phone</Typography>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Phone number must be exactly 10 digits',
                  },
                }}
                render={({ field }) => <TextField {...field} placeholder="Enter Phone" error={!!errors.phone} helperText={errors.phone?.message} />}
              />
  
              <Typography variant="h5">Password</Typography>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: !isEdit ? 'Password is required' : false,
                }}
                render={({ field }) => <TextField {...field} type="password" placeholder="Enter Password" error={!!errors.password} helperText={errors.password?.message} />}
              />
  
              <FormControl fullWidth error={!!errors.companyId}>
                <InputLabel id="companyId-label">Company</InputLabel>
                <Controller
                  name="companyId"
                  control={control}
                  rules={{ required: 'Company is required' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="companyId-label"
                      label="Company"
                      showSearch
                      MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                    >
                      {companies.map((company) => (
                        <MenuItem key={company._id} value={company._id}>
                          {company.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.companyId && <FormHelperText>{errors.companyId.message}</FormHelperText>}
              </FormControl>
  
              <Button variant="contained" type="submit" sx={{ width: '150px' }}>
                {isEdit ? 'Update' : 'Create'}
              </Button>
            </Stack>
          </Container>
        </form>
      </StyledDialog>
    );
  }
  