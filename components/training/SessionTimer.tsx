// components/training/SessionTimer.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
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
    return (
        <View style={styles.timerSection}>
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
        backgroundColor: Colors.training.timer,
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: Colors.text.white,
        marginBottom: 8,
    },
    modeText: {
        fontSize: 16,
        color: Colors.text.white,
        opacity: 0.9,
    },
});