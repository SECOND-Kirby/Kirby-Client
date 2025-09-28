// components/training/SessionStats.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TrainingSessionData } from '@/types/training';

interface SessionStatsProps {
    sessionData: TrainingSessionData;
}

export const SessionStats: React.FC<SessionStatsProps> = ({ sessionData }) => {
    const statCardBackgroundColor = useThemeColor({}, 'statCardBackground');
    const statValueColor = useThemeColor({}, 'statValueColor');
    const statLabelColor = useThemeColor({}, 'statLabelColor');

    return (
        <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: statCardBackgroundColor }]}>
                <Text style={[styles.statValue, { color: statValueColor }]}>
                    {sessionData.totalServes}
                </Text>
                <Text style={[styles.statLabel, { color: statLabelColor }]}>총 서브</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: statCardBackgroundColor }]}>
                <Text style={[styles.statValue, { color: statValueColor }]}>
                    {sessionData.accuracy}%
                </Text>
                <Text style={[styles.statLabel, { color: statLabelColor }]}>정확도</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: statCardBackgroundColor }]}>
                <Text style={[styles.statValue, { color: statValueColor }]}>
                    {sessionData.avgSpeed}km/h
                </Text>
                <Text style={[styles.statLabel, { color: statLabelColor }]}>평균속도</Text>
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
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
});