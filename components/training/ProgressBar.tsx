// components/training/ProgressBar.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ProgressBarProps {
    progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return (
        <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
                <View
                    style={[
                        styles.progressFill,
                        { width: `${progress}%` },
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    progressContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    progressTrack: {
        height: 8,
        backgroundColor: Colors.background.progressBar,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
        backgroundColor: Colors.training.progress,
    },
});