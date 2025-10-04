// screens/Schedule/ScheduleScreen.tsx
import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useScheduleStore } from '@/store/scheduleStore';
import ScheduleHeader from '@/components/schedule/ScheduleHeader';
import ScheduleCalendarWrapper from '@/components/schedule/ScheduleCalendarWrapper';
import ScheduleCardList from '@/components/schedule/ScheduleCardList';

interface Schedule {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  memo?: string;
}

const ScheduleScreen: React.FC = () => {
  const { schedules: storeSchedules, loadSchedules } = useScheduleStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const schedules: Schedule[] = storeSchedules.map(schedule => ({
    ...schedule,
    date: new Date(schedule.date)
  }));

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
        date: schedule.date.toISOString(),
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        isAllDay: schedule.isAllDay.toString(),
        memo: schedule.memo || '',
      },
    });
  }, []);

  const handleDateSelect = useCallback((day: number) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelectedDate);
  }, [currentDate]);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  }, [currentDate]);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  }, [currentDate]);

  const handleBack = useCallback(() => {
    router.push('/(tabs)');
  }, []);

  const getSchedulesForDate = useCallback((date: Date): Schedule[] => {
    return schedules.filter(schedule =>
        schedule.date.getDate() === date.getDate() &&
        schedule.date.getMonth() === date.getMonth() &&
        schedule.date.getFullYear() === date.getFullYear()
    );
  }, [schedules]);

  const selectedDateSchedules = selectedDate ? getSchedulesForDate(selectedDate) : [];

  return (
      <SafeAreaView style={styles.container}>
        <ScheduleHeader
            onBack={handleBack}
            onAdd={handleAddSchedule}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <ScheduleCalendarWrapper
              currentDate={currentDate}
              selectedDate={selectedDate}
              schedules={schedules}
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