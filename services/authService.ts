import http from "./http";
import * as SecureStore from 'expo-secure-store';

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

export interface AuthResponse {
    success: boolean;
    code: string;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    } | null;
}

export const authService = {
    async signup(request: SignupRequest) {
        console.log('회원가입 API 호출');
        const response = await http.post('/api/auth/signup', request);
        return response.data;
    },

    async checkUsername(username: string) {
        console.log('중복 확인 API 호출:', username);
        const response = await http.post('/api/auth/check-username', { username });
        console.log('API 응답:', response.data);
        return response.data;
    },

    async login(request: any) {
        const response = await http.post('/api/auth/login', request);

        if (response.data.success && response.data.data) {
            try {
                await SecureStore.setItemAsync('accessToken', response.data.data.accessToken);
                await SecureStore.setItemAsync('refreshToken', response.data.data.refreshToken);
            } catch (error) {
                console.log('토큰 저장 실패:', error);
            }
        }

        return response.data;
    },

    async logout() {
        try {
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
        } catch (error) {
            console.log('로그아웃 실패:', error);
        }
    }
};