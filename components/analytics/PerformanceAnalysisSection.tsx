// src/components/analytics/PerformanceAnalysisSection.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';

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
    const performanceData = [
        { iconName: 'flash-outline' as const, value: '75%', label: '정확도', iconColor: '#28a745' },
        { iconName: 'stats-chart-outline' as const, value: '110km/h', label: '평균 속도', iconColor: '#007bff' },
        { iconName: 'pulse-outline' as const, value: '125km/h', label: '최고 속도', iconColor: '#dc3545' },
    ];

    return (
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
    performanceCard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        paddingVertical: 20,
        elevation: 2,
        ...Platform.select({
            web: {
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
        }),
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
        color: Colors.text.main,
        marginBottom: 4,
    },
    performanceLabel: {
        fontSize: 12,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
});

export default PerformanceAnalysisSection;