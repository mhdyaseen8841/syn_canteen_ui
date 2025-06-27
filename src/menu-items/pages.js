// assets
import {
  IconToolsKitchen2,
  IconUsers,
  IconReportAnalytics,
  IconUserPlus, 
  IconBuildingSkyscraper,
  IconBuildingCommunity,
  IconUserCircle,
  IconReportMoney,
  IconReceipt2,
  IconAdjustments,
  IconHeartHandshake  
} from '@tabler/icons';

// constant
const icons = {
  IconToolsKitchen2,
  IconUsers,
  IconReportAnalytics,
  IconUserCircle,
  IconBuildingSkyscraper,
  IconBuildingCommunity,
  IconUserPlus,
  IconReportMoney,
  IconReceipt2,
  IconAdjustments,
  IconHeartHandshake  
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

export default function Pages() {
  const role = localStorage.getItem('role');
  if (!role) {
    window.location.href = '/login';
    return null;
  }



  // Menu items with role-based visibility
  const allPages = [
    {
      id: 'transaction',
      title: 'Fixed/Guest/Contractor',
      type: 'item',
      url: '/transaction',
      icon: icons.IconReportAnalytics,
      visibleTo: ['admin', 'contractor', 'manager', 'employee']
    },
    {
      id: 'expenses',
      title: 'Expenses',
      type: 'item',
      url: '/expenses',
      icon: icons.IconReportMoney,
      visibleTo: ['admin', 'contractor', 'manager', 'employee']
    },
    {
      id: 'settlement',
      title: 'Settlement',
      type: 'item',
      url: '/manage-settlement',
      icon: icons.IconHeartHandshake , // or any icon you prefer
      visibleTo: ['admin', 'contractor', 'manager', 'employee']
    },
    {
      id: 'manageTransactions',
      title: 'Manage Current Transactions',
      type: 'item',
      url: '/manage-transactions',
      icon: icons.IconReceipt2,
      visibleTo: ['admin', 'contractor', 'manager', 'employee']
    },
    // ...add more items as needed, with their own visibleTo arrays
  ];

  // Filter pages based on current role
  const filteredPages = allPages.filter(page => page.visibleTo.includes(role));

  // Add collapses and reports as needed, with their own visibility logic
  const pages = {
    id: 'pages',
    title: 'Pages',
    type: 'group',
    children: [
      ...filteredPages,
      {
        id: 'manageOrganization',
        title: 'Manage Company',
        type: 'collapse',
        icon: icons.IconAdjustments,
        children: [
          {
            id: 'menu',
            title: 'Manage Menu',
            type: 'item',
            url: '/menu',
            icon: icons.IconToolsKitchen2,
            visibleTo: ['admin', 'contractor', 'manager', 'employee']
          },
          {
            id: 'manageEmployees',
            title: 'Manage Employees',
            type: 'item',
            url: '/employees',
            icon: icons.IconUserPlus,
            visibleTo: ['admin', 'contractor', 'manager', 'employee']
          },
          {
            id: 'manageDepartment',
            title: 'Manage Departments',
            type: 'item',
            url: '/department',
            icon: icons.IconBuildingCommunity,
            visibleTo: ['admin', 'contractor', 'manager', 'employee']
          },
          {
            id: 'manageCompany',
            title: 'View Companies',
            type: 'item',
            url: '/company',
            icon: icons.IconBuildingSkyscraper,
            visibleTo: ['admin', 'contractor', 'manager', 'employee']
          }
        ].filter(item => item.visibleTo.includes(role))
      },
      {
        id: 'reports',
        title: 'Reports',
        type: 'collapse',
        icon: icons.IconReportAnalytics,
        children: [
          {
            id: 'companyReports',
            title: 'Company Reports',
            type: 'item',
            url: '/companyReports',
            icon: icons.IconReportAnalytics,
            visibleTo: ['admin', 'contractor', 'manager', 'employee']
          },
          {
            id: 'employeeReports',
            title: 'Employee Reports',
            type: 'item',
            url: '/employeeReports',
            icon: icons.IconReportAnalytics,
            visibleTo: ['admin', 'contractor', 'manager', 'employee']
          }
        ].filter(item => item.visibleTo.includes(role))
      }
    ]
  };

  return pages;
}