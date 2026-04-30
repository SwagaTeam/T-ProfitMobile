import {apiUrl} from "@/data/api/api";
import axios, {AxiosInstance, AxiosError} from "axios";

export const apiClient: AxiosInstance = axios.create({baseURL: apiUrl});

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 404) {
            return Promise.resolve({
                data: null,
                status: 404,
                statusText: 'Not Found',
                headers: error.response.headers,
                config: error.config,
            });
        }
        return Promise.reject(error);
    }
);
