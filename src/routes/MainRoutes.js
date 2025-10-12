import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Menu = Loadable(lazy(() => import('views/pages/manageMenu')));
const Company = Loadable(lazy(() => import('views/pages/manageCompany')));
// const Contractor = Loadable(lazy(() => import('views/pages/manageContractor')));
const Department = Loadable(lazy(() => import('views/pages/manageDepartment')));
const Employees = Loadable(lazy(() => import('views/pages/manageEmployee')));
const Transaction = Loadable(lazy(() => import('views/pages/transactions')));
const ManageTransactions = Loadable(lazy(()=>import('views/pages/manageTransaction')))
const ManageSettlement = Loadable(lazy(()=>import('views/pages/manageSettlement')))
const ManageExpenses = Loadable(lazy(() => import('views/pages/manageExpense')));
const CompanyReport = Loadable(lazy(() => import('views/pages/companyReports')));
const EmployeeReport = Loadable(lazy(() => import('views/pages/employeeReports')));
const ContractorReport = Loadable(lazy(() => import('views/pages/contractorReports')));
const ComplaintReport = Loadable(lazy(() => import('views/pages/complaintReports')));
const PrintRequest = Loadable(lazy(() => import('views/pages/printRequest')));
const IssueCanteenCoupons = Loadable(lazy(()=> import('views/pages/issueCanteenCoupons')))
const CancelCanteenCoupons = Loadable(lazy(()=> import('views/pages/cancelCanteenCoupons')))
const GuestReport = Loadable(lazy(() => import('views/pages/guestReports')));
// const ManageUsers = Loadable(lazy(() => import('views/pages/manageUsers')));
// ==============================|| MAIN ROUTING ||============================== //



const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '',
      element: <Navigate to="manage-transactions" />
    },
      {
      path: 'dashboard',
      element: <DashboardDefault />
    },



  
    {
      path: 'Menu',
      element: <Menu />
    },
    {
      path: 'transaction',
      element: <Transaction />
    },
    {
      path: 'manage-transactions',
      element: <ManageTransactions />
    },
    {
      path: 'manage-settlement',
      element: <ManageSettlement />
    },
    {
      path: 'expenses',
      element: <ManageExpenses />
    },
    {
      path: 'employees',
      element: <Employees />
     },
      {
      path: 'printRequest',
      element: <PrintRequest />
    },
    {
      path: 'issueCanteenCoupons',
      element: <IssueCanteenCoupons />
    },
    {
      path: 'cancel-transaction',
      element: <CancelCanteenCoupons />
    },
  //  {
  //   path: 'contractor',
  //   element: <Contractor />
  //  },
   {
    path: 'company',
    element: <Company />
   },
   {
    path: 'department',
    element: <Department />
   },
   {
    path: 'companyReports',
    element: <CompanyReport />
   },
   {
    path: 'employeeReports',
    element: <EmployeeReport />
   },
   {
    path:'/contractorReports',
    element: <ContractorReport/>
   },
   {
    path: 'guestReports',
    element: <GuestReport />
   },
   {
    path: 'complaintReports',
    element: <ComplaintReport />
   },
    
    // {
    //   path: 'manageDrivers',
    //   element: <ManageDrivers />
    // },
    // {
    //   path: 'manageUsers',
    //   element: <ManageUsers />
    // },
    
    // 404 route
    {
      path: '*',
      element: <DashboardDefault />
    }
  ]
};

export default MainRoutes;
