// hooks/useTrainingSession.ts
import { useState, useEffect, useCallback } from 'react';
import { TrainingSessionData, TrainingSettings } from '@/types/training';

export const useTrainingSession = (settings: TrainingSettings) => {
    const [timeLeft, setTimeLeft] = useState(settings.duration * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [sessionData, setSessionData] = useState<TrainingSessionData>({
        totalServes: 0,
        accuracy: 0,
        avgSpeed: 0,
        timeElapsed: 0,
    });

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });

                // 더미 데이터 업데이트 (10% 확률)
                if (Math.random() < 0.1) {
                    setSessionData(prev => ({
                        ...prev,
                        totalServes: prev.totalServes + 1,
                        accuracy: Math.floor(Math.random() * 20) + 80,
                        avgSpeed: Math.floor(Math.random() * 50) + 120,
                        timeElapsed: (settings.duration * 60) - timeLeft,
                    }));
                }
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRunning, timeLeft, settings.duration]);

    const formatTime = useCallback((seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const handleStart = useCallback(() => {
        setIsRunning(true);
        setIsStarted(true);
    }, []);

    const handlePause = useCallback(() => {
        setIsRunning(false);
    }, []);

    const handleContinue = useCallback(() => {
        setIsRunning(true);
    }, []);

    const handleReset = useCallback(() => {
        setIsRunning(false);
        setIsStarted(false);
        setTimeLeft(settings.duration * 60);
        setSessionData({
            totalServes: 0,
            accuracy: 0,
            avgSpeed: 0,
            timeElapsed: 0,
        });
    }, [settings.duration]);

    const progress = ((settings.duration * 60 - timeLeft) / (settings.duration * 60)) * 100;

    return {
        timeLeft,
        isRunning,
        isStarted,
        sessionData,
        progress,
        formatTime,
        handleStart,
        handlePause,
        handleContinue,
        handleReset,
    };
};