// constants/index.ts
import Constants from "expo-constants";

export const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

// 날짜 관련
export const MONTH_NAMES = [
    '', '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
] as const;

export const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const;

// UI 크기
export const BUTTON_HEIGHT = 50;
export const INPUT_HEIGHT = 50;
export const BORDER_RADIUS = 5;

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 150,
} as const;

// 트레이닝
export const TRAINING_LIMITS = {
    DURATION: { MIN: 5, MAX: 120, STEP: 5 },
    INTENSITY: { MIN: 0, MAX: 100 },
    DIRECTION: { MIN: 0, MAX: 100 },
    FREQUENCY: { MIN: 0, MAX: 100 },
} as const;

export const TRAINING_DEFAULTS = {
    duration: 60,
    mode: 'serve' as const,
    intensity: 50,
    direction: 30,
    frequency: 40,
} as const;

// 에러 코드
export const ERROR_CODES = {
    INVALID_TOKEN: 'A001',
    TOKEN_EXPIRED: 'A002',
    UNAUTHORIZED: 'A003',
    USER_NOT_FOUND: 'U001',
    USERNAME_ALREADY_EXISTS: 'U002',
    EMAIL_ALREADY_EXISTS: 'U003',
    PHONE_NUMBER_ALREADY_EXISTS: 'U004',
    INVALID_PASSWORD: 'U005',
    PASSWORD_MISMATCH: 'U006',
    SAME_AS_CURRENT_PASSWORD: 'U007',
    INTERNAL_SERVER_ERROR: 'E001',
    INVALID_INPUT_VALUE: 'E002',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];