import { useState, useCallback } from 'react';
import { TrainingSettings, TrainingMode } from '@/types/training';

export const useTrainingSettings = () => {
    const [settings, setSettings] = useState<TrainingSettings>({
        mode: 'serve',
        intensity: 50,
        direction: 30,
        frequency: 40,
        duration: 60,
    });

    const updateMode = useCallback((mode: TrainingMode) => {
        setSettings(prev => ({ ...prev, mode }));
    }, []);

    const updateIntensity = useCallback((intensity: number) => {
        setSettings(prev => ({ ...prev, intensity }));
    }, []);

    const updateDirection = useCallback((direction: number) => {
        setSettings(prev => ({ ...prev, direction }));
    }, []);

    const updateFrequency = useCallback((frequency: number) => {
        setSettings(prev => ({ ...prev, frequency }));
    }, []);

    const adjustDuration = useCallback((increase: boolean) => {
        setSettings(prev => {
            const newDuration = increase ? prev.duration + 5 : prev.duration - 5;
            if (newDuration >= 5 && newDuration <= 120) {
                return { ...prev, duration: newDuration };
            }
            return prev;
        });
    }, []);

    const startTraining = useCallback(() => {
        // 훈련 시작 로직은 컴포넌트에서 처리
        console.log('Training started with settings:', settings);
    }, [settings]);

    return {
        settings,
        updateMode,
        updateIntensity,
        updateDirection,
        updateFrequency,
        adjustDuration,
        startTraining,
    };
};