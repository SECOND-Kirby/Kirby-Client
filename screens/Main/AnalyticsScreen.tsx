// src/screens/AnalyticsScreen.tsx
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

// 분리된 컴포넌트 임포트
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import PerformanceAnalysisSection from '@/components/analytics/PerformanceAnalysisSection';
import StatSummarySection from '@/components/analytics/StatSummarySection';
import GoalProgressSection from '@/components/analytics/GoalProgressSection';

const AnalyticsScreen: React.FC = () => {
    const backgroundColor = useThemeColor({}, 'background');

    // 목표 값 (실제로는 상태나 API에서 가져와야 합니다)
    const dailyGoalHours = 2;
    const serveGoal = 50;

    return (
        <ScrollView style={[styles.container, { backgroundColor }]} contentContainerStyle={styles.contentContainer}>
            {/* 1. 헤더 */}
            <AnalyticsHeader />

            {/* 2. 훈련성과 분석 섹션 */}
            <PerformanceAnalysisSection />

            {/* 3. 통계 요약 섹션 (주간 활동 차트 및 카드) */}
            <StatSummarySection />

            {/* 4. 목표 달성 현황 섹션 (원형 차트) */}
            <GoalProgressSection dailyGoalHours={dailyGoalHours} serveGoal={serveGoal} />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingVertical: 15, // 상하 패딩 추가
    }
});

export default AnalyticsScreen;