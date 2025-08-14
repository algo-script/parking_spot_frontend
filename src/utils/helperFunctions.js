import axiosInstance from './axiosInstace';
import moment from 'moment';

export const triggerLogout = () => {
  // Your logout logic here
};

export const registerUser = async (registerdata) => {
    const response = await axiosInstance.post(`/user/register`, registerdata);
    return response.data;
};

export const loginUser = async (logindata) => {
    const response = await axiosInstance.post(`/user/login`, logindata);
    return response.data;
};

export const changePassword = async (passworddata) => {
  const response = await axiosInstance.post(`/user/change-password`, passworddata);
  return response.data;
};

export const addParkingSpot = async (formdata) => {
  const response = await axiosInstance.post(`/user/addparking-spots`, formdata);
  return response.data;
};

export const updateParkingSpot = async (formdata) => {
  const response = await axiosInstance.post(`/user/updateparking-spots`, formdata);
  return response.data;
};

export const getMyParkingSpot = async () => {
  const response = await axiosInstance.get(`/user/parking-spots`);
  return response.data;
};

export const updateParkingSpotTimeAvailability = async (data) => {
  const response = await axiosInstance.post(`/user/update-time-availability`, data);
  return response.data;
};


export const toggleAvailability = async (data) => {
  const response = await axiosInstance.post(`/user/toggle-availability`, data);
  return response.data;
};

export const nearByParking = async (params) => {
  const response = await axiosInstance.get(`/user/nearby-spots`, {
    params, 
  });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await axiosInstance.get(`/user/get-profile`);
  return response.data;
};

export const updateUserProfile = async (data) => {
  const response = await axiosInstance.post(`/user/update-profile`,data);
  return response.data;
};

export const findspotById = async (spotId) => {
  const response = await axiosInstance.get(`/user/parking-spots/${spotId}`);
  return response.data;
}

export const addVehicle = async (data) => {
  const response = await axiosInstance.post(`/user/addvehicle`,data);
  return response.data;
};

export const getVehicle = async (data) => {
  const response = await axiosInstance.get(`/user/getUser-vehicle`);
  return response.data;
};

export const upadateVehicle = async (data) => {
  const response = await axiosInstance.post(`/user/upadate-vehicle`,data);
  return response.data;
};

export const setDefaultVehicle = async (vehicleId) => {
  const response = await axiosInstance.post(`/user/set-defaultvehicle`,vehicleId);
  return response.data;
};

export const callconfirmBooking = async(bookingdata)=>{
  const response = await axiosInstance.post(`/user/confirmbooking`,bookingdata);
  return response.data;
}

export const getuserBooking = async () => {
  const response = await axiosInstance.get(`/user/getuserBooking`);
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await axiosInstance.post(`/user/cancelBooking`,{bookingId});
  return response.data;
};

export const formatTimeString = (timeStr) => {
  if (!timeStr) return "";
  return moment(timeStr, "HH:mm").format("h:mm A");
};