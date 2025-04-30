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
    user_name: '',  // changed from phone to user_name
    psw: '',        // changed from password to psw
    submit: null
  }}
  onSubmit={async (values) => {
    try {
      adminLogin({ 
        "user_name": values.user_name, 
        "psw": values.psw 
      }).then((res) => {
        console.log(res)
        let role = 'admin'
        if(res.user.companyId){
          role = res.user.companyId.companyType
        }
        localStorage.setItem("role", role);
        localStorage.setItem("token", res.accessToken);
        localStorage.setItem("user", JSON.stringify(res.user));
        toast.success("Login Success");
        if(role == "admin"){
          navigate("/doUpload")
        }else{
          navigate("/dashboard")
        }
      }).catch((err) => {
        console.log(err)
        toast.error(err.response.data.message);
      });
    } catch (err) {
      toast.error(err);
      console.error(err);
    }
  }}
>
{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
    <form noValidate onSubmit={handleSubmit} {...others}>
      <FormControl fullWidth error={Boolean(touched.user_name && errors.user_name)} sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-email-login">Username</InputLabel>
        <OutlinedInput
          id="outlined-adornment-email-login"
          type="text"
          value={values.user_name}
          name="user_name"
          onBlur={handleBlur}
          onChange={handleChange}
          label="Username"
          inputProps={{}}
        />
        {touched.user_name && errors.user_name && (
          <FormHelperText error id="standard-weight-helper-text-email-login">
            {errors.user_name}
          </FormHelperText>
        )}
      </FormControl>

      <FormControl fullWidth error={Boolean(touched.psw && errors.psw)} sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-login"
          type={showPassword ? 'text' : 'password'}
          value={values.psw}
          name="psw"
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
        {touched.psw && errors.psw && (
          <FormHelperText error id="standard-weight-helper-text-password-login">
            {errors.psw}
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
