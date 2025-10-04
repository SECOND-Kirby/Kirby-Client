// hooks/useTrainingSettings.ts
import { useState, useCallback } from 'react';
import { TrainingSettings, TrainingMode } from '@/types/training';
import { TRAINING_DEFAULTS, TRAINING_LIMITS } from '@/constants';

export const useTrainingSettings = () => {
    const [settings, setSettings] = useState<TrainingSettings>(TRAINING_DEFAULTS);

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
            const step = TRAINING_LIMITS.DURATION.STEP;
            const newDuration = increase ? prev.duration + step : prev.duration - step;

            if (newDuration >= TRAINING_LIMITS.DURATION.MIN &&
                newDuration <= TRAINING_LIMITS.DURATION.MAX) {
                return { ...prev, duration: newDuration };
            }
            return prev;
        });
    }, []);

    return {
        settings,
        updateMode,
        updateIntensity,
        updateDirection,
        updateFrequency,
        adjustDuration,
    };
};