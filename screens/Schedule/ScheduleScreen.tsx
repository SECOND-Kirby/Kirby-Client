// screens/Schedule/ScheduleScreen.tsx
import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { useScheduleStore } from '@/store/scheduleStore';
import ScheduleCalendarWrapper from '@/components/schedule/ScheduleCalendarWrapper';
import ScheduleCardList from '@/components/schedule/ScheduleCardList';
import ScreenHeader from '@/components/shared/layout/ScreenHeader';
import { Schedule } from '@/types/schedule';

const ScheduleScreen: React.FC = () => {
  const { schedules: storeSchedules, loadSchedules } = useScheduleStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useFocusEffect(
      useCallback(() => {
        loadSchedules();
      }, [loadSchedules])
  );

  const handleAddSchedule = useCallback(() => {
    const targetDate = selectedDate || new Date();
    router.push({
      pathname: '/(tabs)/schedule/form',
      params: {
        presetDate: targetDate.toISOString(),
      }
    });
  }, [selectedDate]);

  const handleEditSchedule = useCallback((schedule: Schedule) => {
    router.push({
      pathname: '/(tabs)/schedule/form',
      params: {
        mode: 'edit',
        scheduleId: schedule.id,
        title: schedule.title,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        isAllDay: schedule.isAllDay.toString(),
        memo: schedule.memo || '',
        repeatDays: schedule.repeatDays?.join(',') || '',
      },
    });
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  // 홈 화면으로 이동하는 함수
  const handleBackToHome = useCallback(() => {
    router.push('/(tabs)');
  }, []);

  const getSchedulesForDate = useCallback((date: Date): Schedule[] => {
    return storeSchedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.toDateString() === date.toDateString();
    });
  }, [storeSchedules]);

  const selectedDateSchedules = selectedDate ? getSchedulesForDate(selectedDate) : [];

  return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
            title="스케줄"
            showBack={true}
            showAdd={true}
            onBackPress={handleBackToHome}  // 홈으로 이동
            onAddPress={handleAddSchedule}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <ScheduleCalendarWrapper
              currentDate={currentDate}
              selectedDate={selectedDate}
              schedules={storeSchedules}
              onDateSelect={handleDateSelect}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
          />

          <ScheduleCardList
              schedules={selectedDateSchedules}
              selectedDate={selectedDate}
              onEditSchedule={handleEditSchedule}
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
});

export default ScheduleScreen;