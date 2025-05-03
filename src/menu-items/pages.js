// assets
import {
  IconToolsKitchen2,
  IconUsers,
  IconReportAnalytics,
  IconUserPlus,    // Changed from IconUserCircle
  IconBuildingSkyscraper,
  IconBuildingCommunity,
  IconUserCircle,
  IconReportMoney 
} from '@tabler/icons';

// constant
const icons = {
  IconToolsKitchen2,
  IconUsers,
  IconReportAnalytics,
  IconUserCircle,
  IconBuildingSkyscraper,  
  IconBuildingCommunity,
  IconUserPlus  ,
  IconReportMoney 
};



// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //


export default function Pages (){


  const pages = {
    id: 'pages',
    title: 'Pages',
    type: 'group',
    children: [
     

      {
        id: 'transaction',
        title: 'Transactions',
        type: 'item',
        url: '/transaction',
        icon: icons.IconReportAnalytics,
      },
      {
        id: 'expenses',
        title: 'Expenses',
        type: 'item',
        url: '/expenses',
        icon: icons.IconReportMoney ,
      },
      {
        id: 'menu',
        title: 'Menu',
        type: 'item',
        url: '/menu',
        icon: icons.IconToolsKitchen2,
      },
      {
        id: 'manageEmployees',
        title: 'Manage Employees',
        type: 'item',
        url: '/employees',
        icon: icons.IconUserPlus,
      },
      // {
      //   id: 'manageContractor',
      //   title: 'Manage Contractor',
      //   type: 'item',
      //   url: '/contractor',
      //   icon: icons.IconUserCircle,
      // },
      {
        id: 'manageCompany',
        title: 'Manage Company',
        type: 'item',
        url: '/company',
        icon: icons.IconBuildingSkyscraper,
      },
      {
        id: 'manageDepartment',
        title: 'Manage Department',
        type: 'item',
        url: '/department',
        icon: icons.IconBuildingCommunity,
      },
      //  {
      //   id: 'manageUsers',
      //   title: 'Manage Users',
      //   type: 'item',
      //   url: '/manageUsers',
      //   icon: icons.IconUsers,
      // },
      
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
