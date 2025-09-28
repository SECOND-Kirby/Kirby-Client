// src/components/analytics/StatSummarySection.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import WeeklyActivityChart from '@/components/charts/WeeklyActivityChart'; // 가정된 경로
import StatsCard from '@/components/shared/ui/StatsCard'; // 가정된 경로

const StatSummarySection: React.FC = () => {
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');

    // 더미 데이터 (실제로는 API 또는 상태에서 가져옴)
    const statsData = [
        { icon: require('@/assets/images/training-icon.png'), value: '5h 30m', label: '총 훈련 시간' },
        { icon: require('@/assets/images/analytics-icon.png'), value: '3200', label: '총 타구 수' },
    ];

    // 차트 데이터 더미
    const weeklyData = [1000, 1500, 2200, 1800, 2500, 3000, 1200];

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>통계 요약</Text>
            <View style={[styles.cardContainer, { backgroundColor: cardBackgroundColor, marginBottom: 20 }]}>
                {/* 주간 활동 차트 */}
                <Text style={styles.cardTitle}>주간 활동</Text>
                {/* WeeklyActivityChart 컴포넌트가 제대로 동작한다고 가정 */}
                <WeeklyActivityChart data={weeklyData} />
            </View>

            {/* 통계 카드들 */}
            <View style={styles.statsRow}>
                {statsData.map((stat, index) => (
                    <StatsCard
                        key={index}
                        icon={stat.icon}
                        value={stat.value}
                        label={stat.label}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    cardContainer: {
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
});

export default StatSummarySection;