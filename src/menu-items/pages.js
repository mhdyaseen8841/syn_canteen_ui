// assets
import {
  IconToolsKitchen2,
  IconUsers,
  IconReportAnalytics,
  IconUserPlus, // Changed from IconUserCircle
  IconBuildingSkyscraper,
  IconBuildingCommunity,
  IconUserCircle,
  IconReportMoney,
  IconReceipt2
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
  IconReceipt2 
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
        title: 'Transactions',
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
      },
      {
        id: 'manageTransactions',
        title: 'Manage Transactions',
        type: 'item',
        url: '/manage-transactions',
        icon: icons.IconReceipt2 
      },
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
        title: 'Manage Department',
        type: 'item',
        url: '/department',
        icon: icons.IconBuildingCommunity
      },
      {
        id: 'manageCompany',
        title: 'Manage Company',
        type: 'item',
        url: '/company',
        icon: icons.IconBuildingSkyscraper
      }
    ]
  };

  return pages;
}

// export default pages;
