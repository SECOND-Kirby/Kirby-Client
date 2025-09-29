// screens/Schedule/ScheduleScreen.tsx
import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
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
  const backgroundColor = useThemeColor({}, 'background');

  // Zustand store 사용
  const { schedules: storeSchedules, loadSchedules } = useScheduleStore();

  // 로컬 상태
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // store의 schedules를 로컬 형식으로 변환
  const schedules: Schedule[] = storeSchedules.map(schedule => ({
    ...schedule,
    date: new Date(schedule.date)
  }));

  // 화면이 포커스될 때마다 스케줄 데이터 새로고침
  useFocusEffect(
      useCallback(() => {
        loadSchedules();
      }, [loadSchedules])
  );

  // 일정 추가 핸들러
  const handleAddSchedule = useCallback(() => {
    const targetDate = selectedDate || new Date();
    router.push({
      pathname: '/schedule-form',
      params: {
        presetDate: targetDate.toISOString(),
      }
    });
  }, [selectedDate]);

  // 일정 편집 핸들러
  const handleEditSchedule = useCallback((schedule: Schedule) => {
    router.push({
      pathname: '/schedule-form',
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

  // 날짜 선택 핸들러
  const handleDateSelect = useCallback((day: number) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelectedDate);
  }, [currentDate]);

  // 월 변경 핸들러
  const handlePrevMonth = useCallback(() => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  }, [currentDate]);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  }, [currentDate]);

  // 뒤로가기 핸들러
  const handleBack = useCallback(() => {
    router.push('/(tabs)');
  }, []);

  // 선택된 날짜의 일정들 필터링
  const getSchedulesForDate = useCallback((date: Date): Schedule[] => {
    return schedules.filter(schedule =>
        schedule.date.getDate() === date.getDate() &&
        schedule.date.getMonth() === date.getMonth() &&
        schedule.date.getFullYear() === date.getFullYear()
    );
  }, [schedules]);

  const selectedDateSchedules = selectedDate ? getSchedulesForDate(selectedDate) : [];

  return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        {/* 헤더 */}
        <ScheduleHeader
            onBack={handleBack}
            onAdd={handleAddSchedule}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 캘린더 섹션 - CalendarComponent 재사용 */}
          <ScheduleCalendarWrapper
              currentDate={currentDate}
              selectedDate={selectedDate}
              schedules={schedules}
              onDateSelect={handleDateSelect}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
          />

          {/* 선택된 날짜의 일정 목록 */}
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
  },
});

export default ScheduleScreen;