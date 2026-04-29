import {apiUrl} from "@/data/api/api";
import axios, {AxiosInstance} from "axios";
import Toast from "react-native-toast-message";

export const apiClient: AxiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = "" //AuthManager.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            const { status } = error.response;
            if (status === 401 && !originalRequest._retry) {

            }
        } else if (error.request) {
            Toast.show({ type: 'error', text1: "Ошибка сети" });
        } else {
            Toast.show({ type: 'error', text1: "Ошибка", text2: error.message });
        }

        return Promise.reject(error);
    }
);
