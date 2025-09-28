import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface CircularProgressProps {
    percentage: number;
    size?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage, size = 120 }) => {
    const primaryLightColor = useThemeColor({}, 'primaryLight');

    return (
        <View style={[circularStyles.container, { width: size, height: size }]}>
            {/* 배경 원 */}
            <View
                style={[
                    circularStyles.backgroundCircle,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: 8,
                    }
                ]}
            />

            {/* 진행률 원 */}
            <View
                style={[
                    circularStyles.progressCircle,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: 8,
                        borderColor: primaryLightColor,
                        borderTopColor: percentage > 25 ? primaryLightColor : '#e0e0e0',
                        borderRightColor: percentage > 50 ? primaryLightColor : '#e0e0e0',
                        borderBottomColor: percentage > 75 ? primaryLightColor : '#e0e0e0',
                        borderLeftColor: percentage > 0 ? primaryLightColor : '#e0e0e0',
                    }
                ]}
            />

            <View style={circularStyles.textContainer}>
                <Text style={circularStyles.percentageText}>{percentage}%</Text>
            </View>
        </View>
    );
};

const circularStyles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundCircle: {
        position: 'absolute',
        borderColor: '#e0e0e0',
    },
    progressCircle: {
        position: 'absolute',
        transform: [{ rotate: '-90deg' }],
    },
    textContainer: {
        alignItems: 'center',
    },
    percentageText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
});

interface GoalProgressSectionProps {
    dailyGoalHours: number;
    serveGoal: number;
}

const GoalProgressSection: React.FC<GoalProgressSectionProps> = ({ dailyGoalHours, serveGoal }) => {
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');

    // 더미 데이터
    const currentHours = 1.5;
    const currentServe = 35;

    const timeProgress = Math.min((currentHours / dailyGoalHours) * 100, 100);
    const serveProgress = Math.min((currentServe / serveGoal) * 100, 100);

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>목표 달성 현황</Text>
            <View style={[styles.cardContainer, { backgroundColor: cardBackgroundColor }]}>
                {/* 훈련 시간 목표 */}
                <View style={styles.progressContainer}>
                    <CircularProgress percentage={Math.round(timeProgress)} size={120} />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryValue}>
                            {currentHours}h / {dailyGoalHours}h
                        </Text>
                        <Text style={styles.summaryLabel}>일일 훈련 목표</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* 서브 성공률 목표 */}
                <View style={styles.progressContainer}>
                    <CircularProgress percentage={Math.round(serveProgress)} size={120} />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryValue}>
                            {currentServe}회 / {serveGoal}회
                        </Text>
                        <Text style={styles.summaryLabel}>서브 성공 목표</Text>
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
    progressContainer: {
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
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 15,
        marginHorizontal: 10,
    },
});

export default GoalProgressSection;