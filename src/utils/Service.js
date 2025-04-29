import axios from 'axios';
// import { Navigate } from 'react-router-dom';

// const baseURL = `http://${window.location.hostname}:3005/`;

//const baseURL = `http://localhost:5000/`;
const baseURL = `https://apis.fleetq.live/`


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

//Company
export async function addCompany(data) {
  const response = await apiInstance.post(`company`, data);

  return response.data;
}

export async function deleteCompany(data) {
  const response = await apiInstance.delete(`company/` + data, data);

  return response.data;
}

export async function editCompany(id, data) {
  const response = await apiInstance.patch(`company/` + id, data);

  return response.data;
}

export async function getAllCompany(data) {
  const response = await apiInstance.post(`company/getAllCompany`, data);

  return response.data;
}

////Trucks
export async function addTruck(data) {
  const response = await apiInstance.post(`truck`, data);

  return response.data;
}

export async function getAllTruck(data) {
  const response = await apiInstance.post(`truck/getAllTruck`, data);

  return response.data;
}

export async function updateTruck(data) {
  const response = await apiInstance.post(`truck/updateTruckStatus`, data);

  return response.data;
}

export async function deleteTruck(data) {
  const response = await apiInstance.delete(`truck/` + data, data);

  return response.data;
}

export async function editTruck(id, data) {
  const response = await apiInstance.patch(`truck/` + id, data);

  return response.data;
}

//Truck Booking API
export async function updateTruckBooking(data) {
  const response = await apiInstance.post(`truck/updateTruckBookingStatus`, data);

  return response.data;
}

export async function getTruckBooking(data) {
  const response = await apiInstance.post(`truck/getAllTruckBookings`, data);

  return response.data;
}

export async function AddTruckBooking(data) {
  const response = await apiInstance.post(`truck/addTruckToBooking`, data);

  return response.data;
}

//parties
export async function getAllParties(data) {
  const response = await apiInstance.post(`party/getAllParty`, data);

  return response.data;
}

export async function addParty(data) {
  const response = await apiInstance.post(`party`, data);

  return response.data;
}

export async function deleteParty(id) {
  const response = await apiInstance.delete(`party/${id}`);

  return response.data;
}

export async function updateParty(id, data) {
  const response = await apiInstance.post(`party/${id}`, data);

  return response.data;
}

export async function updatePartyStatus(id) {
  const response = await apiInstance.put(`party/updateStatus/${id}`);

  return response.data;
}

//////Dashboard API
export async function getTruckBasedOnStatus(data) {
  const response = await apiInstance.post(`truck/getAllTruckBookings`, { status: data.status });
  return response.data;
}

export async function getMatchingInqueueTrucks(data) {
  const response = await apiInstance.post(`truck/getInQueueTrucks`, data);
  return response.data;
}



export async function getTruckQueue(data) {
  const response = await apiInstance.post(`truck/getTruckQueue`, data);
  return response.data;
}
////allocation
export async function getAllocationDetails(data) {
  const response = await apiInstance.post(`allocation/getAllocationDetails`, data);

  return response.data;
}

export async function doAllocation(data) {
  const response = await apiInstance.post(`allocation`, data);

  return response.data;
}

export async function changeAllocationStatus(data) {
  const response = await apiInstance.post(`allocation/changeAllocationStatus`, data);

  return response.data;
}

///users

// Add new user
export async function addUser(data) {
  const response = await apiInstance.post('user', data);
  return response.data;
}

// Edit existing user
export async function editUser(data) {
  const response = await apiInstance.post('user/editUser', data);
  return response.data;
}

export async function getAllUsers(query) {
  const response = await apiInstance.get(`user/getAllUsers${query ? `?companyId=${query}` : ''}`);
  return response.data;
}


export async function deleteUser(id) {
  const response = await apiInstance.delete(`user/${id}`);
  return response.data;
}


///admin

export async function adminLogin(data) {
  const response = await apiInstance.post(`user/login`, data);
  console.log(response);

  return response.data;
}

//location
export async function getAllLocation(data) {
  const response = await apiInstance.post(`location/getAllLocation`, data);

  return response.data;
}
export async function addLocation(data) {
  const response = await apiInstance.post(`location`, data);

  return response.data;
}

//doBooking
export async function getAllBooking(data) {
  const response = await apiInstance.post(`doBooking/getAllDO`, data);

  return response.data;
}

export async function createDo(data) {
  const response = await apiInstance.post(`doBooking`, data);

  return response.data;
}

export async function uploadDo(data) {
  const response = await apiInstance.post(`doBooking/uploadDO`, data);

  return response.data;
}

export async function updateDo(id, data) {
  try {
    const response = await apiInstance.put(`doBooking/updateDO/${id}`, data);

    return response.data;
  } catch (error) {
    console.error('Error updating delivery order:', error);
    throw error; // Rethrow the error to handle it in the calling function if necessary
  }
}

export async function cancelDo(id, data) {
  try {
    const response = await apiInstance.post(`doBooking/cancelDO/${id}`, data);

    return response.data;
  } catch (error) {
    console.error('Error updating delivery order:', error);
    throw error; // Rethrow the error to handle it in the calling function if necessary
  }
}

export async function cancelDOBooking(id, data) {
  try {
    const response = await apiInstance.post(`doBooking/cancelDOBooking/${id}`, data);

    return response.data;
  } catch (error) {
    console.error('Error cancelling Do booking:', error);
    throw error; // Rethrow the error to handle it in the calling function if necessary
  }
}

export async function reOpenDOBooking(id) {
  try {
    const response = await apiInstance.post(`doBooking/reopen-do-booking/${id}`);

    return response.data;
  } catch (error) {
    console.error('Error cancelling Do booking:', error);
    throw error; // Rethrow the error to handle it in the calling function if necessary
  }
}

export async function CancelAllocatedBooking(id, data) {
  try {
    const response = await apiInstance.post(`allocation/cancel-allocated-booking/${id}`, data);

    return response.data;
  } catch (error) {
    console.error('Error cancelling Do booking:', error);
    throw error; // Rethrow the error to handle it in the calling function if necessary
  }
}

export async function ReAllocateBooking(id) {
  try {
    const response = await apiInstance.post(`allocation/re-allocate-booking/${id}`);

    return response.data;
  } catch (error) {
    console.error('Error cancelling Do booking:', error);
    throw error; // Rethrow the error to handle it in the calling function if necessary
  }
}

export async function getAllDoUpload(data) {
  const response = await apiInstance.post(`doBooking/getAllDeliveryOrders`, data);

  return response.data;
}

export async function deleteDo(data) {
  const response = await apiInstance.delete(`doBooking`, data);

  return response.data;
}

export async function deleteDeliveryOrder(data) {
  const response = await apiInstance.delete(`doBooking/deleteDeliveryOrder/` + data);

  return response.data;
}

//driver

export async function addDriver(data) {
  const response = await apiInstance.post(`driver`, data);

  return response.data;
}

export async function getAllDrivers(data) {
  const response = await apiInstance.post(`driver/getAllDrivers`, data);

  return response.data;
}

export async function getCompanyDrivers(data) {
  const response = await apiInstance.post(`driver/getCompanyDrivers`, data);

  return response.data;
}

export async function deleteDriver(data) {
  const response = await apiInstance.delete(`driver/` + data, data);

  return response.data;
}

export async function editDriver(id, data) {
  const response = await apiInstance.patch(`driver/` + id, data);

  return response.data;
}
