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
  IconHeartHandshake,
  IconTicket
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
  IconHeartHandshake,
  IconTicket
};

export const Roles = {
  ADMIN: 'admin',
  FRONTOFFICE: 'front_office',
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

export default function Pages() {
  const role = localStorage.getItem('role');
  if (!role) {
    window.location.href = '/login';
    return null;
  }

  const allPages = [
    {
      id: 'transaction',
      title: 'Fixed/Guest/Contractor',
      type: 'item',
      url: '/transaction',
      icon: icons.IconReportAnalytics,
      visibleTo: [Roles.ADMIN, Roles.FRONTOFFICE]
    },
    {
      id: 'manageTransactions',
      title: 'Current Transactions',
      type: 'item',
      url: '/manage-transactions',
      icon: icons.IconReceipt2,
      visibleTo: [Roles.ADMIN]
    },
    {
      id: 'expenses',
      title: 'Expenses',
      type: 'item',
      url: '/expenses',
      icon: icons.IconReportMoney,
      visibleTo: [Roles.ADMIN,Roles.FRONTOFFICE]
    },
    {
      id: 'settlement',
      title: 'Settlement',
      type: 'item',
      url: '/manage-settlement',
      icon: icons.IconHeartHandshake,
      visibleTo: [Roles.ADMIN]
    },
    {
      id: 'printRequest',
      title: 'Print Request',
      type: 'item',
      url: '/printRequest',
      icon: icons.IconTicket,
      visibleTo: [Roles.ADMIN,Roles.MANAGER]
    },
    {
      id: 'issueCanteenCoupons',
      title: 'Issue Canteen Coupons',
      type: 'item',
      url: '/issueCanteenCoupons',
      icon: icons.IconTicket,
      visibleTo: [Roles.ADMIN,Roles.MANAGER]
    },
  ];

  const filteredPages = allPages.filter((page) => page.visibleTo.includes(role));

  const pages = {
    id: 'pages',
    title: 'Pages',
    type: 'group',
    children: [
      ...filteredPages,

      ...(role == Roles.ADMIN || role == Roles.FRONTOFFICE
        ? [
            {
              id: 'manageOrganization',
              title: 'Master',
              type: 'collapse',
              icon: icons.IconAdjustments,
              children: [
                {
                  id: 'menu',
                  title: 'Manage Menu',
                  type: 'item',
                  url: '/menu',
                  icon: icons.IconToolsKitchen2,
                  visibleTo: [Roles.ADMIN]
                },
                {
                  id: 'manageEmployees',
                  title: 'Manage Employees',
                  type: 'item',
                  url: '/employees',
                  icon: icons.IconUserPlus,
                  visibleTo: [Roles.ADMIN,Roles.FRONTOFFICE]
                },
                {
                  id: 'manageDepartment',
                  title: 'Manage Departments',
                  type: 'item',
                  url: '/department',
                  icon: icons.IconBuildingCommunity,
                  visibleTo: [Roles.ADMIN]
                },
                {
                  id: 'manageCompany',
                  title: 'View Companies',
                  type: 'item',
                  url: '/company',
                  icon: icons.IconBuildingSkyscraper,
                  visibleTo: [Roles.ADMIN]
                }
              ].filter((item) => item.visibleTo.includes(role))
            }
          ]
        : []),

         ...(role !== Roles.FRONTOFFICE
        ? [
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
                  visibleTo: [Roles.ADMIN]
                },
                {
                  id: 'employeeReports',
                  title: 'Employee Reports',
                  type: 'item',
                  url: '/employeeReports',
                  icon: icons.IconReportAnalytics,
                  visibleTo: [Roles.ADMIN, Roles.MANAGER, Roles.EMPLOYEE]
                },
                {
                  id: 'complaintReports',
                  title: 'Complaint Reports',
                  type: 'item',
                  url: '/complaintReports',
                  icon: icons.IconReportAnalytics,
                  visibleTo: [Roles.ADMIN]
                }
              ].filter((item) => item.visibleTo.includes(role))
            }
          ]
        : [])
    ]
  };

  return pages;
}
