// components/home/ActionButtons.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { shadowPresets } from '@/utils/styles';

const ActionButtons: React.FC = () => {
    const handleBallCollection = () => {
        router.push('/(tabs)/ball-collection');
    };

    const handleTrainingStart = () => {
        router.push('/(tabs)/training');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, styles.collectionButton]}
                onPress={handleBallCollection}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>공 수거 시작</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.trainingButton]}
                onPress={handleTrainingStart}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>훈련 시작</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadowPresets.button,
    },
    collectionButton: {
        backgroundColor: '#A4D65E',
    },
    trainingButton: {
        backgroundColor: '#A4D65E',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});

export default ActionButtons;