import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface WeeklyActivityChartProps {
    title?: string;
    data?: number[];
    showTitle?: boolean;
}

const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({
                                                                     title = "이번주 활동",
                                                                     data = [90, 70, 60, 40, 20, 65, 55],
                                                                     showTitle = true,
                                                                 }) => {
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');
    const primaryLightColor = useThemeColor({}, 'primaryLight');

    const days = ['월', '화', '수', '목', '금', '토', '일'];

    return (
        <View style={[styles.container, { backgroundColor: cardBackgroundColor }]}>
            {showTitle && (
                <Text style={styles.title}>{title}</Text>
            )}
            <View style={styles.chartContainer}>
                {days.map((day, index) => (
                    <View key={day} style={styles.chartDay}>
                        <View
                            style={[
                                styles.chartBar,
                                {
                                    height: data[index],
                                    backgroundColor: primaryLightColor
                                }
                            ]}
                        />
                        <Text style={styles.chartLabel}>{day}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 120,
        paddingHorizontal: 8,
    },
    chartDay: {
        alignItems: 'center',
        flex: 1,
    },
    chartBar: {
        width: 25,
        marginBottom: 8,
        minHeight: 20,
    },
    chartLabel: {
        fontSize: 12,
        color: '#666',
    },
});

export default WeeklyActivityChart;