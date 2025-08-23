import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import WeeklyActivityChart from './WeeklyActivityChart';
import CircularProgressChart from './CircularProgressChart';

const AnalyticsScreen: React.FC = () => {
    const backgroundColor = useThemeColor({}, 'background');
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');
    const primaryColor = useThemeColor({}, 'primary');

    const handleProfilePress = () => {
        router.push('/settings');
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor }]}>
            {/* 헤더 */}
            <View style={[styles.header, { backgroundColor }]}>
                <Text style={styles.headerTitle}>분석</Text>
                <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
                    <Ionicons name="person-outline" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            {/* 훈련성과 분석 */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>훈련성과 분석</Text>
                <View style={styles.performanceContainer}>
                    <View style={[styles.performanceCard, { backgroundColor: cardBackgroundColor }]}>
                        <Ionicons name="radio-button-on-outline" size={24} color="#B2C549" style={styles.performanceIcon} />
                        <Text style={styles.performanceValue}>85%</Text>
                        <Text style={styles.performanceLabel}>정확도</Text>
                    </View>

                    <View style={[styles.performanceCard, { backgroundColor: cardBackgroundColor }]}>
                        <Ionicons name="trophy-outline" size={24} color="#B2C549" style={styles.performanceIcon} />
                        <Text style={styles.performanceValue}>92</Text>
                        <Text style={styles.performanceLabel}>점수</Text>
                    </View>

                    <View style={[styles.performanceCard, { backgroundColor: cardBackgroundColor }]}>
                        <Ionicons name="time-outline" size={24} color="#B2C549" style={styles.performanceIcon} />
                        <Text style={styles.performanceValue}>2.5</Text>
                        <Text style={styles.performanceLabel}>시간</Text>
                    </View>
                </View>
            </View>

            {/* 목표 달성도 */}
            <View style={styles.section}>
                <View style={[styles.cardContainer, { backgroundColor: cardBackgroundColor }]}>
                    <Text style={styles.cardTitle}>목표 달성도</Text>
                    <View style={styles.circularChartContainer}>
                        <CircularProgressChart
                            percentage={85}
                            subtitle="458kcal"
                            size={180}
                        />
                    </View>
                </View>
            </View>

            {/* 이번주 활동 - 공유 컴포넌트 사용 */}
            <View style={styles.section}>
                <WeeklyActivityChart />
            </View>

            {/* 주간 요약 */}
            <View style={styles.section}>
                <View style={[styles.cardContainer, { backgroundColor: cardBackgroundColor }]}>
                    <Text style={styles.weekTitle}>주간 요약</Text>
                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>총 운동 시간</Text>
                            <Text style={styles.summaryValue}>12.5시간</Text>
                        </View>

                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>평균 서브 횟수</Text>
                            <Text style={styles.summaryValue}>135회</Text>
                        </View>

                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>평균 달성률</Text>
                            <Text style={styles.summaryValue}>85%</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileIcon: {
        padding: 8,
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
        marginBottom: 16,
        marginLeft: 10
    },
    weekTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    performanceContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    performanceCard: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    performanceIcon: {
        marginBottom: 8,
    },
    performanceValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    performanceLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    cardContainer: {
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
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
    circularChartContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryItem: {
        alignItems: 'center',
        flex: 1,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
        textAlign: 'center',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default AnalyticsScreen;