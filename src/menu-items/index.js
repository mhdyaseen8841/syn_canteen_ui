import dashboard from './dashboard';
import pages from './pages';
// import utilities from './utilities';
// import other from './other';

// ==============================|| MENU ITEMS ||============================== //


export default function menuItems(){

  return  {
    items: [dashboard, pages()]
  };
  
}
