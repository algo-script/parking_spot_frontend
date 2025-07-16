import axiosInstance from './axiosInstace';

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