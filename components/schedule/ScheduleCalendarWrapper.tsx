// components/schedule/ScheduleCalendarWrapper.tsx
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CalendarComponent from './CalendarComponent';
import { CalendarData } from '@/types/schedule';
import { MONTH_NAMES, BRAND_COLORS } from '@/utils/constants';

interface ScheduleCalendarWrapperProps {
    currentDate: Date;
    selectedDate: Date | null;
    schedules: any[];
    onDateSelect: (day: number) => void;
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
    // 달력 데이터 생성
    const calendarData: CalendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const today = new Date().getDate();
        const todayMonth = new Date().getMonth();
        const todayYear = new Date().getFullYear();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const calendar: CalendarData['calendar'] = [];
        let weeks: any[] = [];

        // 이전 달의 마지막 날짜들 추가
        for (let i = firstDay - 1; i >= 0; i--) {
            weeks.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
                isPrevMonth: true
            });
        }

        // 현재 달의 날짜들 추가
        for (let day = 1; day <= daysInMonth; day++) {
            weeks.push({
                day: day,
                isCurrentMonth: true,
                isPrevMonth: false
            });
        }

        // 다음 달의 첫 날짜들 추가
        const remainingCells = 42 - weeks.length;
        for (let day = 1; day <= remainingCells; day++) {
            weeks.push({
                day: day,
                isCurrentMonth: false,
                isPrevMonth: false
            });
        }

        // 주 단위로 나누기
        for (let i = 0; i < weeks.length; i += 7) {
            calendar.push(weeks.slice(i, i + 7));
        }

        const isCurrentMonthToday = year === todayYear && month === todayMonth;

        return {
            calendar,
            today: isCurrentMonthToday ? today : null,
            month: month + 1,
            year
        };
    }, [currentDate]);

    const selectedDay = selectedDate?.getDate() || null;

    return (
        <View style={styles.container}>
            {/* 월 네비게이션 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={onPrevMonth}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={24} color="#666" />
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
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            {/* 달력 컴포넌트 */}
            <CalendarComponent
                calendarData={calendarData}
                selectedDate={selectedDay}
                onDateSelect={onDateSelect}
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
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: BRAND_COLORS.green,
    },
    navButton: {
        padding: 8,
        borderRadius: 8,
    },
});

export default ScheduleCalendarWrapper;