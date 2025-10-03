// src/components/analytics/GoalProgressSection.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';

interface CircularProgressProps {
    percentage: number;
    size?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage, size = 100 }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <View
                style={[
                    styles.backgroundCircle,
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
                    styles.progressCircle,
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

            <View style={styles.textContainer}>
                <Text style={styles.percentageText}>{percentage}%</Text>
            </View>
        </View>
    );
};

interface GoalProgressSectionProps {
    dailyGoalHours: number;
    serveGoal: number;
}

const GoalProgressSection: React.FC<GoalProgressSectionProps> = ({ dailyGoalHours, serveGoal }) => {
    const currentHours = 1.5;
    const currentServe = 35;

    const timeProgress = Math.min((currentHours / dailyGoalHours) * 100, 100);
    const serveProgress = Math.min((currentServe / serveGoal) * 100, 100);

    return (
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
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
});

export default GoalProgressSection;