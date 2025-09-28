// src/components/analytics/PerformanceAnalysisSection.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface PerformanceStatProps {
    iconName: keyof typeof Ionicons.glyphMap;
    value: string;
    label: string;
    iconColor: string;
}

const PerformanceStat: React.FC<PerformanceStatProps> = ({ iconName, value, label, iconColor }) => {
    return (
        <View style={styles.performanceStat}>
            <Ionicons name={iconName} size={28} color={iconColor} style={styles.performanceIcon} />
            <Text style={styles.performanceValue}>{value}</Text>
            <Text style={styles.performanceLabel}>{label}</Text>
        </View>
    );
};

const PerformanceAnalysisSection: React.FC = () => {
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');

    // 더미 데이터 (실제로는 API 또는 상태에서 가져옴)
    const performanceData = [
        { iconName: 'flash-outline' as const, value: '75%', label: '정확도', iconColor: '#28a745' },
        { iconName: 'stats-chart-outline' as const, value: '110km/h', label: '평균 속도', iconColor: '#007bff' },
        { iconName: 'pulse-outline' as const, value: '85', label: '최고 속도', iconColor: '#dc3545' },
    ];

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>훈련성과 분석</Text>
            <View style={[styles.performanceCard, { backgroundColor: cardBackgroundColor }]}>
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
    performanceCard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderRadius: 12,
        paddingVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    performanceStat: {
        alignItems: 'center',
        flex: 1,
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
});

export default PerformanceAnalysisSection;