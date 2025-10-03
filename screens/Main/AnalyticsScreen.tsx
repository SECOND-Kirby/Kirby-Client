// src/screens/AnalyticsScreen.tsx
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useSettingsStore } from '@/store/settingsStore';

import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import PerformanceAnalysisSection from '@/components/analytics/PerformanceAnalysisSection';
import StatSummarySection from '@/components/analytics/StatSummarySection';
import GoalProgressSection from '@/components/analytics/GoalProgressSection';

const AnalyticsScreen: React.FC = () => {
    const { dailyGoalHours, serveGoal } = useSettingsStore();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <AnalyticsHeader />
            <PerformanceAnalysisSection />
            <GoalProgressSection dailyGoalHours={dailyGoalHours} serveGoal={serveGoal} />
            <StatSummarySection />
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
    }
});

export default AnalyticsScreen;