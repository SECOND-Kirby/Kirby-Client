// types/training.ts
export type TrainingMode = 'serve' | 'ai';

export interface TrainingSettings {
    mode: TrainingMode;
    intensity: number;
    direction: number;
    frequency: number;
    duration: number;
}

export interface TrainingModeOption {
    id: TrainingMode;
    title: string;
    subtitle: string;
    icon: string;
}

export interface TrainingSession {
    id: string;
    settings: TrainingSettings;
    startTime: Date;
    endTime?: Date;
    status: 'active' | 'paused' | 'completed';
}

export interface TrainingStats {
    totalTime: string;
    serveCount: number;
    batteryLevel: number;
}

export interface TrainingSessionData {
    totalServes: number;
    accuracy: number;
    avgSpeed: number;
    timeElapsed: number;
}

// 트레이닝 모드 옵션 상수
export const TRAINING_MODE_OPTIONS: TrainingModeOption[] = [
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