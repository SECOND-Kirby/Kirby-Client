// components/training/AIFeedback.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface AIFeedbackProps {
    feedback: string;
}

export const AIFeedback: React.FC<AIFeedbackProps> = ({ feedback }) => {
    const primaryColor = useThemeColor({}, 'primary');

    return (
        <View style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
                <Ionicons name="bulb" size={20} color={primaryColor} />
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
        backgroundColor: '#E6FFE4',
        borderLeftWidth: 4,
        borderLeftColor: '#5CB33D',
    },
    feedbackHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    feedbackTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#527D40',
        marginLeft: 8,
    },
    feedbackText: {
        fontSize: 14,
        color: '#6E6E6E',
        lineHeight: 20,
    },
});