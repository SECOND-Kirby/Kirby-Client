// src/components/analytics/GoalProgressSection.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import CircularProgressChart from '@/components/charts/CircularProgressChart';

interface GoalProgressSectionProps {
    dailyGoalHours: number;
    serveGoal: number;
}

const GoalProgressSection: React.FC<GoalProgressSectionProps> = ({ dailyGoalHours, serveGoal }) => {
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');

    // 더미 데이터 (실제로는 API 또는 상태에서 가져옴)
    const currentHours = 1.5; // 현재 훈련 시간
    const currentServe = 35; // 현재 서브 성공 횟수

    const timeProgress = Math.min((currentHours / dailyGoalHours) * 100, 100);
    const serveProgress = Math.min((currentServe / serveGoal) * 100, 100);

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>목표 달성 현황</Text>
            <View style={[styles.cardContainer, { backgroundColor: cardBackgroundColor }]}>
                {/* 훈련 시간 목표 */}
                <View style={styles.circularChartContainer}>
                    <CircularProgressChart
                        percentage={timeProgress}
                        subtitle="일일 훈련 목표"
                        size={120}
                    />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryValue}>
                            {currentHours}h / {dailyGoalHours}h
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* 서브 성공률 목표 */}
                <View style={styles.circularChartContainer}>
                    <CircularProgressChart
                        percentage={serveProgress}
                        subtitle="서브 성공 목표"
                        size={120}
                    />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryValue}>
                            {currentServe}회 / {serveGoal}회
                        </Text>
                    </View>
                </View>
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
    circularChartContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    summaryContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 15,
        marginHorizontal: 10,
    },
});

export default GoalProgressSection;