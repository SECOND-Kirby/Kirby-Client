// screens/Main/HomeScreen.tsx
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { Colors } from '@/constants/Colors';

import HomeHeader from '@/components/home/HomeHeader';
import CalendarSection from '@/components/home/CalendarSection';
import BallCollectionModal from '@/components/home/BallCollectionModal';
import ScheduleList from '@/components/schedule/ScheduleList';
import { CalendarData } from '@/types/schedule';
import { useScheduleStore } from '@/store/scheduleStore';
import { useBallCollectionStore } from '@/store/ballCollectionStore';

const HomeScreen: React.FC = () => {
    const {
        schedules,
        selectedDate,
        currentMonth,
        currentYear,
        isLoading,
        setSelectedDate,
        setCurrentMonth,
        setCurrentYear,
        loadSchedules,
        getNextSchedule,
    } = useScheduleStore();

    const { startCollection } = useBallCollectionStore();

    const [showBallCollection, setShowBallCollection] = useState(false);

    const calendarData: CalendarData = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth - 1, 1);
        const lastDay = new Date(currentYear, currentMonth, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const calendar: CalendarData['calendar'] = [];
        const today = new Date();
        const todayDate = today.getMonth() + 1 === currentMonth && today.getFullYear() === currentYear
            ? today.getDate()
            : null;

        for (let week = 0; week < 6; week++) {
            const weekDates = [];
            for (let day = 0; day < 7; day++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + week * 7 + day);

                weekDates.push({
                    day: date.getDate(),
                    isCurrentMonth: date.getMonth() === currentMonth - 1,
                    isPrevMonth: date.getMonth() < currentMonth - 1,
                });
            }
            calendar.push(weekDates);
        }

        return {
            calendar,
            today: todayDate,
            month: currentMonth,
            year: currentYear,
        };
    }, [currentMonth, currentYear]);

    const handleNextSchedule = useCallback((): void => {
        const nextSchedule = getNextSchedule();

        if (nextSchedule) {
            Alert.alert(
                '다음 일정',
                `${nextSchedule.title}\n${nextSchedule.date} ${nextSchedule.startTime}`,
                [{ text: '확인' }]
            );
        } else {
            Alert.alert('알림', '예정된 일정이 없습니다.');
        }
    }, [getNextSchedule]);

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
        setSelectedDate(selectedDate === day ? null : day);
    }, [selectedDate, setSelectedDate]);

    const handleSchedulePress = useCallback((schedule: any): void => {
        Alert.alert(
            schedule.title,
            `날짜: ${schedule.date}\n시간: ${schedule.startTime} - ${schedule.endTime}`,
            [
                { text: '취소', style: 'cancel' },
                { text: '편집', onPress: () => router.push('/schedule-form') },
            ]
        );
    }, []);

    const handleAddSchedule = useCallback((): void => {
        router.push('/schedule-form');
    }, []);

    const handleBallCollection = useCallback((): void => {
        startCollection();
        setShowBallCollection(true);
    }, [startCollection]);

    const handleCloseBallCollection = useCallback((): void => {
        setShowBallCollection(false);
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
                <HomeHeader
                    onNextSchedule={handleNextSchedule}
                    isLoading={isLoading}
                />

                <CalendarSection
                    calendarData={calendarData}
                    selectedDate={selectedDate}
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    onDateSelect={handleDateSelect}
                    onNavigateMonth={handleNavigateMonth}
                    schedules={schedules}
                />

                <ScheduleList
                    schedules={schedules}
                    selectedDate={selectedDate}
                    onSchedulePress={handleSchedulePress}
                    onAddSchedule={handleAddSchedule}
                />
            </ScrollView>

            <BallCollectionModal
                visible={showBallCollection}
                onClose={handleCloseBallCollection}
            />
        </View>
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
        paddingBottom: 20,
    },
});

export default HomeScreen;