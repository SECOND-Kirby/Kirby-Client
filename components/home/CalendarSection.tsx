// components/home/CalendarSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CalendarComponent from '@/components/schedule/CalendarComponent';
import { CalendarData } from '@/types/schedule';

interface CalendarSectionProps {
    calendarData: CalendarData;
    selectedDate: number | null;
    currentMonth: number;
    currentYear: number;
    onDateSelect: (day: number) => void;
    onNavigateMonth: (direction: 'prev' | 'next') => void;
    schedules: any[];
}

const MONTH_NAMES = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
];

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
                <TouchableOpacity onPress={() => onNavigateMonth('prev')} style={styles.navButton}>
                    <Ionicons name="chevron-back" size={24} color="#666" />
                </TouchableOpacity>
                <Text style={styles.monthYearText}>
                    {currentYear}년 {MONTH_NAMES[currentMonth - 1]}
                </Text>
                <TouchableOpacity onPress={() => onNavigateMonth('next')} style={styles.navButton}>
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
    container: {
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    navButton: {
        padding: 8,
    },
    monthYearText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
});

export default CalendarSection;