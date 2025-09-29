import { logApiError, logApiRequest, logApiResponse } from '@/utils/logger';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import Constants from "expo-constants";
import * as SecureStore from 'expo-secure-store';
import { authService } from './authService';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

const http = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000, // 15초 타임아웃
    headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// 요청 인터셉터: 토큰 자동 추가 및 로깅
http.interceptors.request.use(
    async (config) => {
        try {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        } catch (error) {
            logApiError('TOKEN_RETRIEVAL', 'SecureStore', error);
        }
        
        // API 요청 로깅
        logApiRequest(config.method?.toUpperCase() || 'UNKNOWN', config.url || '', config.data);
        
        return config;
    },
    (error) => {
        logApiError('REQUEST_INTERCEPTOR', 'unknown', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 토큰 만료 처리 및 로깅
http.interceptors.response.use(
    (response: AxiosResponse) => {
        // API 응답 로깅
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
        
        // API 에러 로깅
        logApiError(
            originalRequest?.method?.toUpperCase() || 'UNKNOWN',
            originalRequest?.url || '',
            error
        );
        
        // 401 에러이고 재시도하지 않은 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // 리프레시 토큰으로 토큰 갱신 시도
                await authService.refreshToken();
                
                // 갱신된 토큰으로 원래 요청 재시도
                const newAccessToken = await SecureStore.getItemAsync('accessToken');
                if (newAccessToken && originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                
                return http(originalRequest);

            } catch (refreshError) {
                logApiError('TOKEN_REFRESH', 'API', refreshError);
                await SecureStore.deleteItemAsync('accessToken');
                await SecureStore.deleteItemAsync('refreshToken');
                // 로그인 화면으로 이동
                // navigation.navigate('Login');
            }
        }
        return Promise.reject(error);
    }
);

export default http;
