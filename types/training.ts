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

// 세션 중 실시간 데이터
export interface TrainingSessionData {
    totalServes: number;
    accuracy: number;
    avgSpeed: number;
    timeElapsed: number;
}