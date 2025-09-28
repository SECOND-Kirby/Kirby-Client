import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useThemeColor } from '@/hooks/useThemeColor';
import StatsCard from '@/components/shared/ui/StatsCard';

interface WeeklyChartProps {
    data?: number[];
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data = [1.2, 1.8, 0.9, 2.5, 1.6, 2.0, 1.4] }) => {
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');
    const primaryLightColor = useThemeColor({}, 'primaryLight');
    const screenWidth = Dimensions.get('window').width;

    const days = ['월', '화', '수', '목', '금', '토', '일'];
    const chartWidth = screenWidth - 88; // 패딩 고려
    const chartHeight = 200;

    const safeData = Array.isArray(data) ? data : [];

    return (
        <LineChart
            data={{
                labels: days,
                datasets: [
                    {
                        data: safeData,
                        color: () => primaryLightColor,
                        strokeWidth: 3,
                    },
                ],
            }}
            width={chartWidth}
            height={chartHeight}
            yAxisSuffix="h"
            fromZero
            chartConfig={{
                backgroundColor: cardBackgroundColor,
                backgroundGradientFrom: cardBackgroundColor,
                backgroundGradientTo: cardBackgroundColor,
                decimalPlaces: 1,
                color: () => primaryLightColor,
                labelColor: () => '#666',
                propsForDots: {
                    r: '5',
                    strokeWidth: '2',
                    stroke: primaryLightColor,
                    fill: '#fff',
                },
            }}
            bezier
            style={chartStyles.chart}
            withInnerLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
        />
    );
};

const chartStyles = StyleSheet.create({
    chart: {
        borderRadius: 12,
        marginLeft: -16,
    },
});

const StatSummarySection: React.FC = () => {
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');

    // 더미 데이터
    const statsData = [
        { icon: require('@/assets/images/clock.png'), value: '5h 30m', label: '총 훈련 시간' },
        { icon: require('@/assets/images/serve.png'), value: '3200', label: '총 타구 수' },
    ];

    const weeklyData = [1.0, 1.5, 2.2, 1.8, 2.5, 3.0, 1.2];

    return (
        <View style={summaryStyles.section}>
            <Text style={summaryStyles.sectionTitle}>통계 요약</Text>

            {/* 주간 활동 차트 */}
            <View style={[summaryStyles.cardContainer, { backgroundColor: cardBackgroundColor, marginBottom: 20 }]}>
                <Text style={summaryStyles.cardTitle}>주간 활동</Text>
                <WeeklyChart data={weeklyData} />
            </View>

            {/* 통계 카드들 */}
            <View style={summaryStyles.statsRow}>
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

const summaryStyles = StyleSheet.create({
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