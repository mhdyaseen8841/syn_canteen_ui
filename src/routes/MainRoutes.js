import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Menu = Loadable(lazy(() => import('views/pages/manageMenu')));
const Transaction = Loadable(lazy(() => import('views/pages/manageTransaction')));
const Company = Loadable(lazy(() => import('views/pages/manageCompany')));
const Contractor = Loadable(lazy(() => import('views/pages/manageContractor')));
const Department = Loadable(lazy(() => import('views/pages/manageDepartment')));
const Employees = Loadable(lazy(() => import('views/pages/manageEmployee')));
// const ManageUsers = Loadable(lazy(() => import('views/pages/manageUsers')));
// ==============================|| MAIN ROUTING ||============================== //



const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '',
      element: <Navigate to="dashboard" />
    },
      {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    //transporter routes
    


  
    {
      path: 'Menu',
      element: <Menu />
    },
    {
      path: 'transaction',
      element: <Transaction />
    },
    {
      path: 'employees/:companyId',
      element: <Employees />
     },
   {
    path: 'contractor',
    element: <Contractor />
   },
   {
    path: 'company',
    element: <Company />
   },
   {
    path: 'department',
    element: <Department />
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
