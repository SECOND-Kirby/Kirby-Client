// components/home/CalendarSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CalendarComponent from '@/components/schedule/CalendarComponent';
import { CalendarData } from '@/types/schedule';
import { MONTH_NAMES } from '@/utils/constants';

interface CalendarSectionProps {
    calendarData: CalendarData;
    selectedDate: number | null;
    currentMonth: number;
    currentYear: number;
    onDateSelect: (day: number) => void;
    onNavigateMonth: (direction: 'prev' | 'next') => void;
    schedules: any[];
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
        <View style={styles.calendarSection}>
            <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={() => onNavigateMonth('prev')}>
                    <Ionicons name="chevron-back" size={24} color="#666" />
                </TouchableOpacity>
                <Text style={styles.monthYearText}>
                    {currentYear}년 {MONTH_NAMES[currentMonth]}
                </Text>
                <TouchableOpacity onPress={() => onNavigateMonth('next')}>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <CalendarComponent
                calendarData={calendarData}
                selectedDate={selectedDate}
                onDateSelect={onDateSelect}
                schedules={schedules}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    calendarSection: {
        marginTop: 8,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    monthYearText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default CalendarSection;