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
  const pages = {
    id: 'pages',
    title: 'Pages',
    type: 'group',
    children: [
      {
        id: 'transaction',
        title: 'Fixed/Guest/Contractor',
        type: 'item',
        url: '/transaction',
        icon: icons.IconReportAnalytics
      },
      {
        id: 'expenses',
        title: 'Expenses',
        type: 'item',
        url: '/expenses',
        icon: icons.IconReportMoney
      },
      {
        id: 'settlement',
        title: 'Settlement',
        type: 'item',
        url: '/manage-settlement',
        icon: icons.IconHeartHandshake 
      },

      {
        id: 'manageTransactions',
        title: 'Manage Current Transactions',
        type: 'item',
        url: '/manage-transactions',
        icon: icons.IconReceipt2 
      },
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
            icon: icons.IconToolsKitchen2
          },

          {
            id: 'manageEmployees',
            title: 'Manage Employees',
            type: 'item',
            url: '/employees',
            icon: icons.IconUserPlus
          },
          {
            id: 'manageDepartment',
            title: 'Manage Departments',
            type: 'item',
            url: '/department',
            icon: icons.IconBuildingCommunity
          },
          {
            id: 'manageCompany',
            title: 'View Companies',
            type: 'item',
            url: '/company',
            icon: icons.IconBuildingSkyscraper
          }
        ]
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
            icon: icons.IconReportAnalytics
          },
          {
            id: 'employeeReports',
            title: 'Employee Reports',
            type: 'item',
            url: '/employeeReports',
            icon: icons.IconReportAnalytics
          }
        ]
      }
    ]
  };

  return pages;
}

// export default pages;
