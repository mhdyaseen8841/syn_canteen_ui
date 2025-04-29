// assets
import {IconToolsKitchen2,IconUsers,IconReportAnalytics,IconUserCircle } from '@tabler/icons';

// constant
const icons = {
  IconToolsKitchen2,
  IconUsers,
  IconReportAnalytics,
  IconUserCircle
};



// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //


export default function Pages (){


  const pages = {
    id: 'pages',
    title: 'Pages',
    type: 'group',
    children: [
     

      {
        id: 'menu',
        title: 'Menu',
        type: 'item',
        url: '/menu',
        icon: icons.IconToolsKitchen2,
      },
      {
        id: 'transaction',
        title: 'Transactions',
        type: 'item',
        url: '/transaction',
        icon: icons.IconReportAnalytics,
      },
      {
        id: 'manageContractor',
        title: 'Manage Contractor',
        type: 'item',
        url: '/contractor',
        icon: icons.IconUserCircle,
      },
       {
        id: 'manageUsers',
        title: 'Manage Users',
        type: 'item',
        url: '/manageUsers',
        icon: icons.IconUsers,
      },
      
      //  //admin routes
      //  {
      //   id: 'manageCompany',
      //   title: 'Manage Company',
      //   type: 'item',
      //   url: '/manageCompany',
      //   icon: icons.IconBuildingSkyscraper,
      // },
      // {
      //   id: 'manageDriver',
      //   title: 'Manage Drivers',
      //   type: 'item',
      //   url: '/manageDrivers',
      //   icon: icons.IconSteeringWheel,
      // },
     
    ]
  };
  




  return pages;
  
}
  
  
  


// export default pages;
