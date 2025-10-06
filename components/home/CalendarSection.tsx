// components/home/CalendarSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CalendarComponent from '@/components/schedule/CalendarComponent';
import { CalendarData, Schedule } from '@/types/schedule';
import { MONTH_NAMES } from '@/constants';
import { Colors } from '@/constants/Colors';

interface CalendarSectionProps {
    calendarData: CalendarData;
    selectedDate: number | null;
    currentMonth: number;
    currentYear: number;
    onDateSelect: (day: number) => void;
    onNavigateMonth: (direction: 'prev' | 'next') => void;
    schedules: Schedule[];
}

const CalendarSection: React.FC<CalendarSectionProps> = ({
                                                             calendarData,
                                                             selectedDate,
                                                             currentMonth,
                                                             currentYear,
                                                             onDateSelect,
                                                             onNavigateMonth,
                                                             schedules,
                                                         }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => onNavigateMonth('prev')}
                    style={styles.navButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="chevron-back" size={24} color={Colors.text.secondary} />
                </TouchableOpacity>
                <Text style={styles.monthYearText}>
                    {currentYear}년 {MONTH_NAMES[currentMonth]}
                </Text>
                <TouchableOpacity
                    onPress={() => onNavigateMonth('next')}
                    style={styles.navButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="chevron-forward" size={24} color={Colors.text.secondary} />
                </TouchableOpacity>
            </View>

            <CalendarComponent
                calendarData={calendarData}
                selectedDate={selectedDate !== null
                    ? new Date(currentYear, currentMonth - 1, selectedDate)
                    : null}
                onDateSelect={onDateSelect}
                schedules={schedules}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    navButton: {
        padding: 8,
        borderRadius: 8,
    },
    monthYearText: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.main,
    },
});

export default CalendarSection;