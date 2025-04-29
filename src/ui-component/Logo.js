// material-ui
// import { useTheme } from '@mui/material/styles';
// import logo from 'assets/images/container-width.svg';
import logo1 from 'assets/images/gemini22.png';
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  // const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Berry" width="100" />
     *
     */
    <img src={logo1} alt="Berry" width="100"/>
    
  );
};

export default Logo;
