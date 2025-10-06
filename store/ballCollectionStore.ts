// store/ballCollectionStore.ts
import { create } from 'zustand';
import { logInfo } from '@/utils/logger';

interface BallCollectionState {
    isCollecting: boolean;
    collectedBalls: number;
    totalBalls: number;
    progress: number;
}

interface BallCollectionActions {
    startCollection: () => void;
    stopCollection: () => void;
    updateProgress: (collected: number) => void;
    resetCollection: () => void;
}

type BallCollectionStore = BallCollectionState & BallCollectionActions;

export const useBallCollectionStore = create<BallCollectionStore>((set, get) => ({
    isCollecting: false,
    collectedBalls: 0,
    totalBalls: 100,
    progress: 0,

    startCollection: () => {
        set({ isCollecting: true });
        logInfo('BALL_COLLECTION', '공수거 시작');
    },

    stopCollection: () => {
        set({ isCollecting: false });
        logInfo('BALL_COLLECTION', '공수거 중지');
    },

    updateProgress: (collected: number) => {
        const { totalBalls } = get();
        const newProgress = Math.round((collected / totalBalls) * 100);
        set({
            collectedBalls: collected,
            progress: newProgress
        });
        logInfo('BALL_COLLECTION', '공수거 진행률 업데이트', { collected, progress: newProgress });
    },

    resetCollection: () => {
        set({
            collectedBalls: 0,
            progress: 0,
            isCollecting: false
        });
        logInfo('BALL_COLLECTION', '공수거 초기화');
    },
}));