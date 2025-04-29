import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
// const ManageCompany = Loadable(lazy(() => import('views/pages/manageCompany')));
// const ManageDrivers = Loadable(lazy(() => import('views/pages/manageDrivers')));
const Menu = Loadable(lazy(() => import('views/pages/manageMenu')));
const Transaction = Loadable(lazy(() => import('views/pages/manageTransaction')));
const Contractor = Loadable(lazy(() => import('views/pages/manageContractor')));
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
    path: 'contractor',
    element: <Contractor />
   },
   
    
    // {
    //   path: 'manageCompany',
    //   element: <ManageCompany />
    // },
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
