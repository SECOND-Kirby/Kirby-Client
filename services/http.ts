import { logApiError, logApiRequest, logApiResponse } from '@/utils/logger';
import { storage } from '@/utils/storage';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

const http = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

async function refreshTokenInternal(): Promise<string | null> {
    try {
        const refreshToken = await storage.getItem('refreshToken');

        if (!refreshToken) {
            throw new Error('리프레시 토큰이 없습니다.');
        }

        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken
        });

        if (response.data.success && response.data.data) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            await storage.setItem('accessToken', accessToken);
            await storage.setItem('refreshToken', newRefreshToken);
            return accessToken;
        }

        return null;
    } catch (error) {
        logApiError('TOKEN_REFRESH', 'API', error);
        await storage.deleteItem('accessToken');
        await storage.deleteItem('refreshToken');
        return null;
    }
}

http.interceptors.request.use(
    async (config) => {
        try {
            const accessToken = await storage.getItem('accessToken');
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        } catch (error) {
            logApiError('TOKEN_RETRIEVAL', 'Storage', error);
        }

        logApiRequest(config.method?.toUpperCase() || 'UNKNOWN', config.url || '', config.data);

        return config;
    },
    (error) => {
        logApiError('REQUEST_INTERCEPTOR', 'unknown', error);
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (response: AxiosResponse) => {
        logApiResponse(
            response.config.method?.toUpperCase() || 'UNKNOWN',
            response.config.url || '',
            response.status,
            response.data
        );
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        logApiError(
            originalRequest?.method?.toUpperCase() || 'UNKNOWN',
            originalRequest?.url || '',
            error
        );

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshTokenInternal();

                if (newAccessToken && originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return http(originalRequest);
                }
            } catch (refreshError) {
                logApiError('TOKEN_REFRESH', 'API', refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default http;