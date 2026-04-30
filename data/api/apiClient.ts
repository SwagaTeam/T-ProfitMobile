import {apiUrl} from "@/data/api/api";
import axios, {AxiosInstance} from "axios";

export const apiClient: AxiosInstance = axios.create({baseURL: apiUrl});
