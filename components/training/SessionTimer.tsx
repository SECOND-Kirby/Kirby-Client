// components/training/SessionTimer.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TrainingMode } from '@/types/training';

interface SessionTimerProps {
    timeLeft: number;
    mode: TrainingMode;
    formatTime: (seconds: number) => string;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({
                                                              timeLeft,
                                                              mode,
                                                              formatTime,
                                                          }) => {
    const timerBackgroundColor = useThemeColor({}, 'timerBackground');

    return (
        <View style={[styles.timerSection, { backgroundColor: timerBackgroundColor }]}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.modeText}>
                {mode === 'serve' ? '플랫 서브' : 'AI'} • 와이드 존 타겟
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    timerSection: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    modeText: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
});