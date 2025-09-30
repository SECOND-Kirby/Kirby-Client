import { logError } from '@/utils/logger';
import { storage } from '@/utils/storage';
import http from "./http";

// 백엔드 API와 정확히 일치하는 타입 정의
export interface SignupRequest {
    username: string;
    email: string;
    phoneNumber: string;
    name: string;
    password: string;
    passwordConfirm: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface UsernameCheckRequest {
    username: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

export interface AuthResponse<T = any> {
    success: boolean;
    code: string;
    message: string;
    data: T | null;
}

export interface UserInfo {
    id: number;
    username: string;
    name: string;
    email: string;
    phoneNumber: string;
}

export interface LogoutRequest {
    accessToken?: string;
    refreshToken?: string;
}

// 에러 코드 상수 정의
export const ERROR_CODES = {
    // 인증 관련
    INVALID_TOKEN: 'A001',
    TOKEN_EXPIRED: 'A002',
    UNAUTHORIZED: 'A003',
    
    // 사용자 관련
    USER_NOT_FOUND: 'U001',
    USERNAME_ALREADY_EXISTS: 'U002',
    EMAIL_ALREADY_EXISTS: 'U003',
    PHONE_NUMBER_ALREADY_EXISTS: 'U004',
    INVALID_PASSWORD: 'U005',
    PASSWORD_MISMATCH: 'U006',
    SAME_AS_CURRENT_PASSWORD: 'U007',
    
    // 일반 에러
    INTERNAL_SERVER_ERROR: 'E001',
    INVALID_INPUT_VALUE: 'E002',
} as const;

export const authService = {
    async signup(request: SignupRequest): Promise<AuthResponse<void>> {
        const response = await http.post<AuthResponse<void>>('/api/auth/signup', request);
        return response.data;
    },

    async checkUsername(username: string): Promise<AuthResponse<void>> {
        const response = await http.post<AuthResponse<void>>('/api/auth/check-username', { username });
        return response.data;
    },

    async login(request: LoginRequest): Promise<AuthResponse<TokenResponse>> {
        const response = await http.post<AuthResponse<TokenResponse>>('/api/auth/login', request);

        if (response.data.success && response.data.data) {
            try {
                await storage.setItem('accessToken', response.data.data.accessToken);
                await storage.setItem('refreshToken', response.data.data.refreshToken);
            } catch (error) {
                logError('토큰 저장 실패', error);
                throw new Error('토큰 저장에 실패했습니다.');
            }
        }

        return response.data;
    },

    async logout(accessToken?: string): Promise<AuthResponse<void>> {
        try {
            const requestBody: LogoutRequest = {};

            if (accessToken) {
                requestBody.accessToken = accessToken;
            }

            const response = await http.post<AuthResponse<void>>('/api/auth/logout', requestBody);

            await storage.deleteItem('accessToken');
            await storage.deleteItem('refreshToken');

            return response.data;
        } catch (error) {
            logError('로그아웃 실패', error);
            await storage.deleteItem('accessToken');
            await storage.deleteItem('refreshToken');
            throw error;
        }
    },

    async getCurrentUser(): Promise<AuthResponse<UserInfo>> {
        const response = await http.get<AuthResponse<UserInfo>>('/api/users/me');
        return response.data;
    },

    async getStoredTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
        try {
            const accessToken = await storage.getItem('accessToken');
            const refreshToken = await storage.getItem('refreshToken');
            return { accessToken, refreshToken };
        } catch (error) {
            logError('토큰 조회 실패', error);
            return { accessToken: null, refreshToken: null };
        }
    },

    async refreshToken(): Promise<AuthResponse<TokenResponse>> {
        const { refreshToken } = await this.getStoredTokens();

        if (!refreshToken) {
            throw new Error('리프레시 토큰이 없습니다.');
        }

        const response = await http.post<AuthResponse<TokenResponse>>('/api/auth/refresh', {
            refreshToken
        });

        if (response.data.success && response.data.data) {
            try {
                await storage.setItem('accessToken', response.data.data.accessToken);
                await storage.setItem('refreshToken', response.data.data.refreshToken);
            } catch (error) {
                logError('토큰 갱신 후 저장 실패', error);
                throw new Error('토큰 저장에 실패했습니다.');
            }
        }

        return response.data;
    },

    async isAuthenticated(): Promise<boolean> {
        const { accessToken } = await this.getStoredTokens();
        return !!accessToken;
    }
};