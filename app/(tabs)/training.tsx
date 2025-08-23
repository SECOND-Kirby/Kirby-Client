import {useLocalSearchParams} from 'expo-router';
import React from 'react';
import TrainingScreen from '@/components/training/TrainingScreen';
import TrainingSessionScreen from '@/components/training/TrainingSessionScreen';

export default function TrainingPage() {
    const params = useLocalSearchParams();

    // 세션 모드인지 확인
    if (params.sessionMode === 'active') {
        const duration = parseInt(params.duration as string) || 20;
        const mode = (params.mode as 'serve' | 'ai') || 'serve';
        const intensity = parseInt(params.intensity as string) || 50;
        const direction = parseInt(params.direction as string) || 30;
        const frequency = parseInt(params.frequency as string) || 40;

        return (
            <TrainingSessionScreen
                duration={duration}
                mode={mode}
                intensity={intensity}
                direction={direction}
                frequency={frequency}
            />
        );
    }

    return <TrainingScreen/>;
}