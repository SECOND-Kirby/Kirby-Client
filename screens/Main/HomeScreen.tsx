// screens/Main/HomeScreen.tsx
import React, { useCallback, useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import ScreenHeader from '@/components/shared/layout/ScreenHeader';
import UpcomingScheduleCard from '@/components/home/UpcomingScheduleCard';
import RallyWorkSection from '@/components/home/RallyWorkSection';
import ActionButtons from '@/components/home/ActionButtons';
import CalendarSection from '@/components/home/CalendarSection';
import ScheduleListSection from '@/components/home/ScheduleListSection';

import { useScheduleStore } from '@/store/scheduleStore';
import { useHomeCalendar } from '@/hooks';
import { Colors } from '@/constants/Colors';

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
        const today = new Date();
        const todaySchedules = schedules.filter(schedule => {
            const scheduleDate = new Date(schedule.date);
            return scheduleDate.toDateString() === today.toDateString();
        }).sort((a, b) => a.startTime.localeCompare(b.startTime));

        return todaySchedules[0] || null;
    }, [schedules]);

    const selectedDateSchedules = useMemo(() => {
        if (!selectedDate) return [];

        return schedules.filter(schedule => {
            const scheduleDate = new Date(schedule.date);
            return scheduleDate.getDate() === selectedDate &&
                scheduleDate.getMonth() + 1 === currentMonth &&
                scheduleDate.getFullYear() === currentYear;
        });
    }, [schedules, selectedDate, currentMonth, currentYear]);

    const handleNavigateMonth = useCallback((direction: 'prev' | 'next'): void => {
        let newMonth = direction === 'next' ? currentMonth + 1 : currentMonth - 1;
        let newYear = currentYear;

        if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    }, [currentMonth, currentYear, setCurrentMonth, setCurrentYear]);

    const handleDateSelect = useCallback((day: number): void => {
        // 토글 기능 제거 - 항상 선택된 날짜를 설정
        setSelectedDate(day);
    }, [setSelectedDate]);

    const handleAddSchedule = useCallback((): void => {
        router.push('/(tabs)/schedule');
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadSchedules();
        }, [loadSchedules])
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScreenHeader title="홈" />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <UpcomingScheduleCard
                    schedule={todaySchedule}
                    onPress={handleAddSchedule}
                />

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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 32,
    },
});

export default HomeScreen;