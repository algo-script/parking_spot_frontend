import axios from 'axios';
import { triggerLogout } from './helperFunctions';

const BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api`;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem('refreshToken');

        if (error.response?.status === 403 && !originalRequest._retry && refreshToken) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return waitForTokenRefresh().then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                });
            }

            isRefreshing = true;

            try {
                const res = await axios.post(`${BASE_URL}/refresh`, null, {
                    headers: {
                        refreshtoken: refreshToken,
                    },
                });

                const newAccessToken = res.data.token;
                if (newAccessToken) {
                    localStorage.setItem("authToken", newAccessToken);
                    localStorage.setItem("refreshToken", res.data.refreshToken);

                    processQueue(null, newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                } else {
                    processQueue(new Error("No new access token"));
                    triggerLogout();
                    throw error;
                }
            } catch (err) {
                processQueue(err);
                triggerLogout();
                throw err;
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);


function waitForTokenRefresh() {
    return new Promise((resolve, reject) => { 
        failedQueue.push({ resolve, reject });
    });
}


export default axiosInstance;
