import {TrainingParams} from "@/types/schedule";
import {TrainingModeOption} from "@/types/training";

export const BRAND_COLORS = {
    green: '#9DE84C',
    yellowHighlight: '#FFE55C',
} as const;

export const MONTH_NAMES = ['', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'] as const;
export const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const;

export const TRAINING_DEFAULT_PARAMS: TrainingParams = {
    duration: '20',
    mode: 'serve',
    difficulty: 'medium',
    ballCount: '50',
} as const;


export const TRAINING_MODES: TrainingModeOption[] = [
    {
        id: 'serve',
        title: '서브 훈련',
        subtitle: '속도 및 방향 조절',
        icon: 'search-outline'
    },
    {
        id: 'ai',
        title: 'AI 추천',
        subtitle: '맞춤 훈련 모드',
        icon: 'bulb-outline'
    }
];

export const TRAINING_LIMITS = {
    DURATION: { MIN: 5, MAX: 120, STEP: 5 },
    INTENSITY: { MIN: 0, MAX: 100 },
    DIRECTION: { MIN: 0, MAX: 100 },
    FREQUENCY: { MIN: 0, MAX: 100 }
} as const;


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
};