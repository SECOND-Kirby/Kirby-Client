// screens/Main/AnalyticsScreen.tsx
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';

import ScreenHeader from '@/components/shared/layout/ScreenHeader';
import StatsCard from '@/components/shared/ui/StatsCard';
import { useSettingsStore } from '@/store/settingsStore';
import { Colors } from '@/constants/Colors';
import { shadowPresets } from '@/utils/styles';

// ===== CircularProgress 컴포넌트 =====
interface CircularProgressProps {
    percentage: number;
    size?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage, size = 100 }) => {
    return (
        <View style={[circularProgressStyles.container, { width: size, height: size }]}>
            <View
                style={[
                    circularProgressStyles.backgroundCircle,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: 8,
                    }
                ]}
            />

            <View
                style={[
                    circularProgressStyles.progressCircle,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: 8,
                        borderColor: Colors.primary,
                        borderTopColor: percentage > 25 ? Colors.primary : Colors.background.progressBar,
                        borderRightColor: percentage > 50 ? Colors.primary : Colors.background.progressBar,
                        borderBottomColor: percentage > 75 ? Colors.primary : Colors.background.progressBar,
                        borderLeftColor: percentage > 0 ? Colors.primary : Colors.background.progressBar,
                    }
                ]}
            />

            <View style={circularProgressStyles.textContainer}>
                <Text style={circularProgressStyles.percentageText}>{percentage}%</Text>
            </View>
        </View>
    );
};

const circularProgressStyles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    backgroundCircle: {
        position: 'absolute',
        borderColor: Colors.background.progressBar,
    },
    progressCircle: {
        position: 'absolute',
        transform: [{ rotate: '-90deg' }],
    },
    textContainer: {
        alignItems: 'center',
    },
    percentageText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text.main,
    },
});

// ===== PerformanceStat 컴포넌트 =====
interface PerformanceStatProps {
    iconName: keyof typeof Ionicons.glyphMap;
    value: string;
    label: string;
    iconColor: string;
}

const PerformanceStat: React.FC<PerformanceStatProps> = ({ iconName, value, label, iconColor }) => {
    return (
        <View style={performanceStyles.stat}>
            <Ionicons name={iconName} size={28} color={iconColor} style={performanceStyles.icon} />
            <Text style={performanceStyles.value}>{value}</Text>
            <Text style={performanceStyles.label}>{label}</Text>
        </View>
    );
};

const performanceStyles = StyleSheet.create({
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginBottom: 8,
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.main,
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
});

// ===== WeeklyChart 컴포넌트 =====
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
        ...shadowPresets.tooltip,
    },
    tooltipText: {
        color: Colors.background.card,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
});

// ===== 메인 AnalyticsScreen =====
const AnalyticsScreen: React.FC = () => {
    const { dailyGoalHours, serveGoal } = useSettingsStore();

    const currentHours = 1.5;
    const currentServe = 35;

    const timeProgress = Math.min((currentHours / dailyGoalHours) * 100, 100);
    const serveProgress = Math.min((currentServe / serveGoal) * 100, 100);

    const performanceData = [
        { iconName: 'flash-outline' as const, value: '75%', label: '정확도', iconColor: '#28a745' },
        { iconName: 'stats-chart-outline' as const, value: '110km/h', label: '평균 속도', iconColor: '#007bff' },
        { iconName: 'pulse-outline' as const, value: '125km/h', label: '최고 속도', iconColor: '#dc3545' },
    ];

    const statsData = [
        { icon: require('@/assets/images/clock.png'), value: '5h 30m', label: '이번주 훈련 시간' },
        { icon: require('@/assets/images/serve.png'), value: '3200', label: '이번주 타구 수' },
    ];

    const weeklyData = [1.0, 1.5, 2.2, 1.8, 2.5, 3.0, 1.2];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* 헤더 */}
            <ScreenHeader
                title="분석"
                rightComponent={
                    <TouchableOpacity
                        style={styles.profileIcon}
                        onPress={() => router.push('/settings')}
                    >
                        <Ionicons name="person-outline" size={24} color={Colors.text.secondary} />
                    </TouchableOpacity>
                }
            />

            {/* 훈련성과 분석 */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>훈련성과 분석</Text>
                <View style={styles.performanceCard}>
                    {performanceData.map((stat, index) => (
                        <PerformanceStat
                            key={index}
                            iconName={stat.iconName}
                            value={stat.value}
                            label={stat.label}
                            iconColor={stat.iconColor}
                        />
                    ))}
                </View>
            </View>

            {/* 목표 달성 현황 */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>목표 달성 현황</Text>
                <View style={styles.cardRow}>
                    <View style={styles.goalCard}>
                        <CircularProgress percentage={Math.round(timeProgress)} size={100} />
                        <View style={styles.summaryContainer}>
                            <Text style={styles.summaryValue}>
                                {currentHours}h / {dailyGoalHours}h
                            </Text>
                            <Text style={styles.summaryLabel}>일일 훈련 목표</Text>
                        </View>
                    </View>

                    <View style={styles.goalCard}>
                        <CircularProgress percentage={Math.round(serveProgress)} size={100} />
                        <View style={styles.summaryContainer}>
                            <Text style={styles.summaryValue}>
                                {currentServe}회 / {serveGoal}회
                            </Text>
                            <Text style={styles.summaryLabel}>서브 성공 목표</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* 통계 요약 */}
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    contentContainer: {
        paddingVertical: 15,
    },
    profileIcon: {
        padding: 4,
    },
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
    performanceCard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        paddingVertical: 20,
        ...shadowPresets.small,
    },
    cardRow: {
        flexDirection: 'row',
        gap: 12,
    },
    goalCard: {
        flex: 1,
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        ...shadowPresets.small,
    },
    summaryContainer: {
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.text.main,
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 12,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
    cardContainer: {
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        padding: 20,
        ...shadowPresets.small,
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

export default AnalyticsScreen;