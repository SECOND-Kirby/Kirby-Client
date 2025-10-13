// components/training/SessionStats.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TrainingSessionData } from '@/types/training';
import { shadowPresets } from '@/utils/styles';

interface SessionStatsProps {
    sessionData: TrainingSessionData;
}

export const SessionStats: React.FC<SessionStatsProps> = ({ sessionData }) => {
    return (
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <Text style={styles.statValue}>{sessionData.totalServes}</Text>
                <Text style={styles.statLabel}>총 서브</Text>
            </View>

            <View style={styles.statCard}>
                <Text style={styles.statValue}>{sessionData.accuracy}%</Text>
                <Text style={styles.statLabel}>정확도</Text>
            </View>

            <View style={styles.statCard}>
                <Text style={styles.statValue}>{sessionData.avgSpeed}km/h</Text>
                <Text style={styles.statLabel}>평균 속도</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 8,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        ...shadowPresets.small,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text.main,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
});