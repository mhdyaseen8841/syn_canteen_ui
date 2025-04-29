import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

// third party
// import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports

import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ adminLogin, ...others }) => {
  const theme = useTheme();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>


      <Formik
        initialValues={{
          phone: '',
          password: '',
          submit: null
        }}
        // validationSchema={Yup.object().shape({
        //   phone: Yup.string()
        //   .matches(/^[0-9]{10}$/, 'Must be a valid 10-digit phone number')
        //   .required('Phone number is required'),
        //   password: Yup.string().max(255).required('Password is required')
        // })}
        onSubmit={async (values) => {
          try {

            adminLogin({ "phone": values.phone, "password": values.password }).then((res) => {
              console.log(res)
              // res.accessToken
              let role='admin'
              if(res.user.companyId){
                
                role = res.user.companyId.companyType
              }
              localStorage.setItem("role", role);
              localStorage.setItem("token", res.accessToken);
              localStorage.setItem("user",  JSON.stringify(res.user));
             toast.success("Login Success");
             if(role == "admin"){
              navigate("/doUpload")
             }else{
             navigate("/dashboard")
             }
 
            }).catch((err) => {
              console.log(err)
              toast.error(err.response.data.message);
              console.log(err)
            });
          } catch (err) {
            toast.error(err);
            console.error(err);

          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.phone && errors.phone)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Phone Number</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="number"
                value={values.phone}
                name="phone"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Phone Number "
                inputProps={{}}
              />
              {touched.phone && errors.phone && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.phone}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
