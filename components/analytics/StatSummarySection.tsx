// src/components/analytics/StatSummarySection.tsx
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '@/constants/Colors';
import StatsCard from '@/components/shared/ui/StatsCard';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';

interface WeeklyChartProps {
    data?: number[];
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data = [1.2, 1.8, 0.9, 2.5, 1.6, 2.0, 1.4] }) => {
    const screenWidth = Dimensions.get('window').width;
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    const ballCounts = [120, 180, 90, 250, 160, 200, 140];
    const chartWidth = screenWidth - 50;
    const chartHeight = 200;

    const [tooltipPos, setTooltipPos] = useState({ visible: false, x: 0, y: 0, value: '', balls: '' });

    const safeData = Array.isArray(data) ? data : [];

    const chartConfig: AbstractChartConfig = {
        backgroundColor: Colors.background.card,
        backgroundGradientFrom: Colors.background.card,
        backgroundGradientTo: Colors.background.card,
        decimalPlaces: 1,
        color: (opacity = 1) => Colors.primary,
        labelColor: (opacity = 1) => Colors.text.secondary,
        propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: Colors.primary,
            fill: Colors.background.card,
        },
        propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: Colors.menu.border,
        },
    };

    return (
        <View>
            <LineChart
                data={{
                    labels: days,
                    datasets: [
                        {
                            data: safeData,
                        },
                    ],
                }}
                width={chartWidth}
                height={chartHeight}
                yAxisSuffix="h"
                fromZero
                chartConfig={chartConfig}
                bezier
                style={chartStyles.chart}
                withInnerLines={false}
                withVerticalLines={false}
                withHorizontalLines={true}
                onDataPointClick={(data) => {
                    const index = data.index;
                    const hours = safeData[index];
                    const balls = ballCounts[index];
                    setTooltipPos({
                        visible: true,
                        x: data.x,
                        y: data.y,
                        value: `${hours}시간`,
                        balls: `${balls}개`,
                    });
                }}
                decorator={() => null}
            />
            {tooltipPos.visible && (
                <View
                    style={[
                        chartStyles.tooltip,
                        {
                            left: tooltipPos.x - 50,
                            top: tooltipPos.y - 70,
                        },
                    ]}
                >
                    <Text style={chartStyles.tooltipText}>훈련: {tooltipPos.value}</Text>
                    <Text style={chartStyles.tooltipText}>타구: {tooltipPos.balls}</Text>
                </View>
            )}
        </View>
    );
};

const chartStyles = StyleSheet.create({
    chart: {
        borderRadius: 12,
        marginLeft: -16,
    },
    tooltip: {
        position: 'absolute',
        backgroundColor: Colors.text.main,
        padding: 8,
        borderRadius: 8,
        minWidth: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    tooltipText: {
        color: Colors.background.card,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
});

const StatSummarySection: React.FC = () => {
    const statsData = [
        { icon: require('@/assets/images/clock.png'), value: '5h 30m', label: '이번주 훈련 시간' },
        { icon: require('@/assets/images/serve.png'), value: '3200', label: '이번주 타구 수' },
    ];

    const weeklyData = [1.0, 1.5, 2.2, 1.8, 2.5, 3.0, 1.2];

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>통계 요약</Text>

            <View style={styles.cardContainer}>
                <Text style={styles.cardTitle}>주간 활동</Text>
                <WeeklyChart data={weeklyData} />
            </View>

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
        color: Colors.text.main,
        marginBottom: 15,
    },
    cardContainer: {
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text.main,
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
});

export default StatSummarySection;