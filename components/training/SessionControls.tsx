// components/training/SessionControls.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SessionControlsProps {
    isStarted: boolean;
    isRunning: boolean;
    onStart: () => void;
    onPause: () => void;
    onContinue: () => void;
    onEnd: () => void;
}

export const SessionControls: React.FC<SessionControlsProps> = ({
                                                                    isStarted,
                                                                    isRunning,
                                                                    onStart,
                                                                    onPause,
                                                                    onContinue,
                                                                    onEnd,
                                                                }) => {
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');
    const startButtonColor = useThemeColor({}, 'startButton');
    const pauseButtonColor = useThemeColor({}, 'pauseButton');
    const continueButtonColor = useThemeColor({}, 'continueButton');
    const resetButtonColor = useThemeColor({}, 'resetButton');

    return (
        <View style={[styles.buttonContainer, { backgroundColor: cardBackgroundColor }]}>
            {!isStarted ? (
                <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: startButtonColor }]}
                    onPress={onStart}
                >
                    <Text style={styles.primaryButtonText}>훈련 시작</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.controlButtons}>
                    {isRunning ? (
                        <TouchableOpacity
                            style={[styles.secondaryButton, { backgroundColor: pauseButtonColor }]}
                            onPress={onPause}
                        >
                            <Text style={styles.secondaryButtonText}>일시정지</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.secondaryButton, { backgroundColor: continueButtonColor }]}
                            onPress={onContinue}
                        >
                            <Text style={styles.secondaryButtonText}>계속하기</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.secondaryButton, { backgroundColor: resetButtonColor }]}
                        onPress={onEnd}
                    >
                        <Text style={styles.secondaryButtonText}>훈련 종료</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        marginHorizontal: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 5,
    },
    primaryButton: {
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    controlButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    secondaryButton: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});