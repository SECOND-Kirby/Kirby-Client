// screens/Main/HomeScreen.tsx
import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import UpcomingScheduleCard from '@/components/home/UpcomingScheduleCard';
import RallyWorkSection from '@/components/home/RallyWorkSection';
import ActionButtons from '@/components/home/ActionButtons';
import CalendarSection from '@/components/home/CalendarSection';
import ScheduleListSection from '@/components/home/ScheduleListSection';

import { useScheduleStore } from '@/store/scheduleStore';
import { useHomeCalendar } from '@/hooks/useHomeCalendar';
import { getTodaySchedules, getSchedulesForDate, navigateMonth } from '@/utils/dateUtils';

const HomeScreen: React.FC = () => {
    const {
        schedules,
        selectedDate,
        currentMonth,
        currentYear,
        setSelectedDate,
        setCurrentMonth,
        setCurrentYear,
        loadSchedules,
    } = useScheduleStore();

    const calendarData = useHomeCalendar({ currentMonth, currentYear });

    const todaySchedule = useMemo(() => {
        const todaySchedules = getTodaySchedules(schedules);
        return todaySchedules[0] || null;
    }, [schedules]);

    const selectedDateSchedules = useMemo(() => {
        if (!selectedDate) return [];
        return getSchedulesForDate(schedules, selectedDate, currentMonth, currentYear);
    }, [schedules, selectedDate, currentMonth, currentYear]);

    const handleNavigateMonth = useCallback((direction: 'prev' | 'next'): void => {
        const { month, year } = navigateMonth(currentMonth, currentYear, direction);
        setCurrentMonth(month);
        setCurrentYear(year);
    }, [currentMonth, currentYear, setCurrentMonth, setCurrentYear]);

    const handleDateSelect = useCallback((day: number): void => {
        setSelectedDate(selectedDate === day ? null : day);
    }, [selectedDate, setSelectedDate]);

    const handleAddSchedule = useCallback((): void => {
        // 일정 추가 화면으로 이동 (schedule screen에서 처리)
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadSchedules();
        }, [loadSchedules])
    );

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {todaySchedule && <UpcomingScheduleCard schedule={todaySchedule} />}

                <RallyWorkSection />

                <ActionButtons />

                <CalendarSection
                    calendarData={calendarData}
                    selectedDate={selectedDate}
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    onDateSelect={handleDateSelect}
                    onNavigateMonth={handleNavigateMonth}
                    schedules={schedules}
                />

                <ScheduleListSection
                    selectedDate={selectedDate}
                    schedules={selectedDateSchedules}
                    onAddSchedule={handleAddSchedule}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 16,
        paddingBottom: 32,
    },
});

export default HomeScreen;