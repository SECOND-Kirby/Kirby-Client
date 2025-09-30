import { logApiError, logApiRequest, logApiResponse } from '@/utils/logger';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import Constants from "expo-constants";
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

const http = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// 토큰 리프레시 함수
async function refreshTokenInternal(): Promise<string | null> {
    try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');

        if (!refreshToken) {
            throw new Error('리프레시 토큰이 없습니다.');
        }

        // 직접 API 호출 (http 인스턴스 사용하지 않음)
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken
        });

        if (response.data.success && response.data.data) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', newRefreshToken);
            return accessToken;
        }

        return null;
    } catch (error) {
        logApiError('TOKEN_REFRESH', 'API', error);
        // 리프레시 실패시 토큰 삭제
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        return null;
    }
}

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

        // 401 에러이고 재시도하지 않은 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // authService 대신 내부 함수 사용
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