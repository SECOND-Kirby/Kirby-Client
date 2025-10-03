// components/training/AIFeedback.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface AIFeedbackProps {
    feedback: string;
}

export const AIFeedback: React.FC<AIFeedbackProps> = ({ feedback }) => {
    return (
        <View style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
                <Ionicons name="bulb" size={20} color={Colors.primary} />
                <Text style={styles.feedbackTitle}>AI 코치 피드백</Text>
            </View>
            <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    feedbackCard: {
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        backgroundColor: Colors.background.aiFeedback,
        borderLeftWidth: 4,
        borderLeftColor: Colors.training.aiFeedbackBorder,
    },
    feedbackHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    feedbackTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.training.aiFeedbackTitle,
        marginLeft: 8,
    },
    feedbackText: {
        fontSize: 14,
        color: Colors.text.secondary,
        lineHeight: 20,
    },
});