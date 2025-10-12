import axios from 'axios';
// import { Navigate } from 'react-router-dom';

// const baseURL = `http://${window.location.hostname}:3005/`;

const baseURL = process.env.REACT_APP_BASE_URL || 'http://192.168.8.18:4001/';




export const apiInstance = axios.create({
  baseURL: `${baseURL}api/`,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    } else {
      console.warn('Token not found in localStorage');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized, logging out...');

      localStorage.clear();
       Navigate('/login')
       window.location.href = '/login'; // redirect to login page
    }

    // Return any other error responses
    return Promise.reject(error);
  }
);


export async function login(credentials) {
  const response = await apiInstance.post('users/login', credentials);
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
}
// Menu Operations
export async function getMenu() {
  const response = await apiInstance.get('menu');
  return response.data;
}

export async function editMenu(data) {
  const response = await apiInstance.put('menu', data);
  return response.data;
}

// Company Operations
export async function getCompany() {
  try {
    const companies = localStorage.getItem('companies');
    if (companies) {
      return JSON.parse(companies);
    } else {
      return []
    }
  } catch (error) {
    console.error('Error reading companies from localStorage:', error);
    throw error;
  }
}


export async function addCompany(data) {
  const response = await apiInstance.post('company', data);
  return response.data;
}

// Department Operations
export async function getDepartment() {
  const response = await apiInstance.get('department');
  return response.data;
}

export async function addDepartment(data) {
  const response = await apiInstance.post('department', data);
  return response.data;
}

export async function editDepartment(data) {
  const response = await apiInstance.put('department', data);
  return response.data;
}

// Employee Operations
export async function getEmployee(companyId,employeeType) {
  const response = await apiInstance.get(`employee?company_id=${companyId}&employee_type=${employeeType}`);
  return response.data;
}

export async function addEmployee(data) {
  const response = await apiInstance.post('employee', data);
  return response.data;
}

export async function editEmployee(data) {
  const response = await apiInstance.put('employee', data);
  return response.data;
}

export async function searchEmployee(data) {
  const response = await apiInstance.post(`/employee/search`,data);
  return response.data;
}

//transaction routes

export async function getCurrentTransaction(data) {
  const response = await apiInstance.post('/get-current-transaction',data);
  return response.data;
}

export async function getTransaction(data) {
  const response = await apiInstance.get('transaction',data);
  return response.data;
}

export async function addEmployeeTransaction(data) {
  const response = await apiInstance.post('employee-transaction', data);
  return response.data;
}

export async function deleteEmployeeTransaction(data) {
  const response = await apiInstance.post('delete-employee-transaction', data);
  return response.data;
}

export async function addFixedTransaction(data) {
  const response = await apiInstance.post('fixed-transaction', data);
  return response.data;
}

export async function addContractorTransaction(data) {
  const response = await apiInstance.post('contractor-transaction', data);
  return response.data;
}

export async function addGuestTransaction(data) {
  const response = await apiInstance.post('guest-transaction', data);
  return response.data;
}

export async function addExpense(data) {
  const response = await apiInstance.post('expense', data);
  return response.data;
}

export async function editExpense(data) {
  const response = await apiInstance.put('expense', data);
  return response.data;
}


export async function getExpense(canteen_calendar_id, menu_id = null) {
  const response = await apiInstance.get('expense?canteen_calendar_id=' + canteen_calendar_id + '&menu_id=' + menu_id);
  return response.data;
}

export async function getCanteenCalender(is_settled) {
  const response = await apiInstance.get(`canteen-calender?is_settled=${is_settled}`);
  return response.data;
}

export async function doSettlement(data) {
  // data should be: { menu_id, canteen_calendar_id, amount }
  const response = await apiInstance.post('do-settlement', data);
  return response.data;
}

export async function getSettlementRates(canteenCalenderId) {
  const response = await apiInstance.get(`settlement-rates?canteenCalenderId=${canteenCalenderId}`);
  return response.data;
}

export async function getCanteenEmployeeReport(data) {
  const response = await apiInstance.post('get-canteen-employee-report', data);
  return response.data;
}

export async function getCanteenReport(data) {
  const response = await apiInstance.post('get-canteen-report', data);
  return response.data;
}

export async function addRating(data) {
  const response = await apiInstance.post('rating', data);
  return response.data;
}

export async function getComplaint(data) {
  const response = await apiInstance.post('get-complaint', data);
  return response.data;
}

export async function getFixedDashboard(data){
  const response = await apiInstance.post('fixed-dashboard',data)
  return response.data
}

export async function getContractorDashboard(data){
  const response = await apiInstance.post('contractor-dashboard',data)
  return response.data
}

export async function getCompanyCoupons(data){
  const response = await apiInstance.post('get-company-coupons', data);
  return response.data;
}

export async function issueCompanyCoupons(data){
  const response = await apiInstance.post('issue-company-coupons', data);
  return response.data;
}

//coupon canel
export async function cancelCoupon(data) {
  const response = await apiInstance.put('cancel-coupon', data);
  return response.data;
}