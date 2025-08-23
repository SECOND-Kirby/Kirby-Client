import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface CircularProgressChartProps {
    percentage: number;
    subtitle: string;
    size?: number;
}

const CircularProgressChart: React.FC<CircularProgressChartProps> = ({
                                                                         percentage,
                                                                         subtitle,
                                                                         size = 160,
                                                                     }) => {
    const primaryLightColor = useThemeColor({}, 'primaryLight');

    // SVG 대신 간단한 원형 차트로 구현
    const circumference = 2 * Math.PI * (size / 2 - 10);
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {/* 배경 원 */}
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

            {/* 진행률 원 - CSS로는 구현이 복잡하므로 간단한 방식 사용 */}
            <View
                style={[
                    styles.progressCircle,
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

            <View style={styles.textContainer}>
                <Text style={styles.percentageText}>{percentage}%</Text>
                <Text style={styles.subtitleText}>{subtitle}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    subtitleText: {
        fontSize: 14,
        color: '#666',
    },
});

export default CircularProgressChart;