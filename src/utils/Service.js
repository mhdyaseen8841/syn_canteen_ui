import axios from 'axios';
// import { Navigate } from 'react-router-dom';

// const baseURL = `http://${window.location.hostname}:3005/`;

const baseURL = `http://localhost:4001/`;



const apiInstance = axios.create({
  baseURL: `${baseURL}api/`,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');

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
      //  Navigate('/login')
      // window.location.href = '/login'; // redirect to login page
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
  const response = await apiInstance.get('company');
  return response.data;
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