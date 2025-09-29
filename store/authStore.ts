import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, UserInfo } from '@/services/authService';
import { logAuthAction, logError } from '@/utils/logger';

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,

      // 액션들
      login: async (username: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login({ username, password });

          if (response.success && response.data) {
            // 토큰 저장 후 사용자 정보 가져오기
            const userResponse = await authService.getCurrentUser();

            set({
              isAuthenticated: true,
              user: userResponse.data,
              isLoading: false
            });
            logAuthAction('LOGIN_SUCCESS', { username });
            return true;
          } else {
            set({
              error: response.message || '로그인에 실패했습니다.',
              isLoading: false
            });
            logAuthAction('LOGIN_FAILED', { username, reason: response.message });
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.message || '로그인 중 오류가 발생했습니다.';
          set({
            error: errorMessage,
            isLoading: false
          });
          logError('LOGIN_ERROR', errorMessage, error);
          return false;
        }
      },

      logout: async (): Promise<void> => {
        set({ isLoading: true });
        
        try {
          await authService.logout();
          set({ 
            isAuthenticated: false, 
            user: null,
            isLoading: false 
          });
          logAuthAction('LOGOUT_SUCCESS');
        } catch (error: any) {
          logError('LOGOUT_ERROR', '로그아웃 중 오류 발생', error);
          // 에러가 발생해도 로컬 상태는 초기화
          set({ 
            isAuthenticated: false, 
            user: null,
            isLoading: false 
          });
        }
      },

      refreshUser: async (): Promise<void> => {
        try {
          const userResponse = await authService.getCurrentUser();
          set({ user: userResponse.data }); // .data를 가져와야 함
        } catch (error: any) {
          logError('REFRESH_USER_ERROR', '사용자 정보 갱신 실패', error);
          // 토큰이 유효하지 않으면 로그아웃
          set({
            isAuthenticated: false,
            user: null
          });
        }
      },

      checkAuthStatus: async (): Promise<void> => {
        set({ isLoading: true });
        
        try {
          const isAuth = await authService.isAuthenticated();
          if (isAuth) {
            await get().refreshUser();
            set({ isAuthenticated: true });
          } else {
            set({ 
              isAuthenticated: false, 
              user: null 
            });
          }
        } catch (error: any) {
          logError('AUTH_CHECK_ERROR', '인증 상태 확인 실패', error);
          set({ 
            isAuthenticated: false, 
            user: null 
          });
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: (): void => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user 
      }),
    }
  )
);
