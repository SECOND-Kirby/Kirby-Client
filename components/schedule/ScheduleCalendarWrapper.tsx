// components/schedule/ScheduleCalendarWrapper.tsx
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CalendarComponent from './CalendarComponent';
import { CalendarData, Schedule } from '@/types/schedule';
import { Colors } from '@/constants/Colors';
import { MONTH_NAMES } from '@/constants';

interface ScheduleCalendarWrapperProps {
    currentDate: Date;
    selectedDate: Date | null;
    schedules: Schedule[];
    onDateSelect: (date: Date) => void;
    onPrevMonth: () => void;
    onNextMonth: () => void;
}

const ScheduleCalendarWrapper: React.FC<ScheduleCalendarWrapperProps> = ({
                                                                             currentDate,
                                                                             selectedDate,
                                                                             schedules,
                                                                             onDateSelect,
                                                                             onPrevMonth,
                                                                             onNextMonth,
                                                                         }) => {
    const calendarData: CalendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const today = new Date();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const calendar: CalendarData['calendar'] = [];
        let weeks: any[] = [];

        // 이전 달 날짜들
        for (let i = firstDay - 1; i >= 0; i--) {
            weeks.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
                isPrevMonth: true
            });
        }

        // 현재 달 날짜들
        for (let day = 1; day <= daysInMonth; day++) {
            weeks.push({
                day: day,
                isCurrentMonth: true,
                isPrevMonth: false
            });
        }

        // 다음 달 날짜들
        const remainingCells = 42 - weeks.length;
        for (let day = 1; day <= remainingCells; day++) {
            weeks.push({
                day: day,
                isCurrentMonth: false,
                isPrevMonth: false
            });
        }

        // 주 단위로 분할
        for (let i = 0; i < weeks.length; i += 7) {
            calendar.push(weeks.slice(i, i + 7));
        }

        const isCurrentMonthToday = year === todayYear && month === todayMonth;

        return {
            calendar,
            today: isCurrentMonthToday ? todayDate : null,
            month: month + 1,
            year
        };
    }, [currentDate]);

    const handleDateSelect = (day: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        onDateSelect(newDate);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={onPrevMonth}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={24} color={Colors.text.secondary} />
                </TouchableOpacity>
                <Text style={styles.title}>
                    {calendarData.year}년 {MONTH_NAMES[calendarData.month]}
                </Text>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={onNextMonth}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-forward" size={24} color={Colors.text.secondary} />
                </TouchableOpacity>
            </View>

            <CalendarComponent
                calendarData={calendarData}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                schedules={schedules}
                showHeader={true}
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
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.main,
    },
    navButton: {
        padding: 8,
        borderRadius: 8,
    },
});

export default ScheduleCalendarWrapper;