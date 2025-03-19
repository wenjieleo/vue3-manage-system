import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';

interface BaseResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 从环境变量获取基础URL
    timeout: 5000
});

service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 从localStorage获取token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response: AxiosResponse<BaseResponse>) => {
        const res = response.data;
        // 这里可以根据后端接口规范调整判断条件
        if (res.code == 200) {
            return res;
        } else {
            ElMessage.error(res.message || '请求失败');
            return Promise.reject(new Error(res.message || '请求失败'));
        }
    },
    (error: AxiosError) => {
        console.log(error);
        ElMessage.error(error.message || '网络错误');
        return Promise.reject(error);
    }
);

export default service;
