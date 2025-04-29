// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { useEffect,useState } from 'react';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {

  const [navItem,setNavItem] = useState(<></>)
  useEffect(()=>{
setNavItem(menuItem().items.map((item) => {
  console.log(item)
  switch (item.type) {
    case 'group':
      return <NavGroup key={item.id} item={item} />;
    default:
      return (
        <Typography key={item.id} variant="h6" color="error" align="center">
          Menu Items Error
        </Typography>
      );
  }
}))
  },[])
  

  return <>{navItem}</>;
};

export default MenuList;
