// components/training/SessionControls.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

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
    return (
        <View style={styles.buttonContainer}>
            {!isStarted ? (
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={onStart}
                >
                    <Text style={styles.primaryButtonText}>훈련 시작</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.controlButtons}>
                    {isRunning ? (
                        <TouchableOpacity
                            style={styles.pauseButton}
                            onPress={onPause}
                        >
                            <Text style={styles.secondaryButtonText}>일시정지</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={onContinue}
                        >
                            <Text style={styles.secondaryButtonText}>계속하기</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.resetButton}
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
        backgroundColor: Colors.background.card,
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
        backgroundColor: Colors.training.start,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.white,
    },
    controlButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    pauseButton: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        backgroundColor: Colors.training.pause,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    continueButton: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        backgroundColor: Colors.training.continue,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resetButton: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        backgroundColor: Colors.training.reset,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text.white,
    },
});