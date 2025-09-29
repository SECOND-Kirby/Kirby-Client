// components/schedule/CalendarComponent.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CalendarData } from '@/types/schedule';
import { BRAND_COLORS, DAY_NAMES } from '@/utils/constants';

interface CalendarComponentProps {
  calendarData: CalendarData;
  selectedDate: number | null;
  onDateSelect: (day: number) => void;
  schedules: any[];
  showHeader?: boolean; // 요일 헤더 표시 여부
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
                                                               calendarData,
                                                               selectedDate,
                                                               onDateSelect,
                                                               schedules,
                                                               showHeader = true,
                                                             }) => {
  const hasSchedule = (day: number): boolean => {
    return schedules.some(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.getDate() === day &&
          scheduleDate.getMonth() + 1 === calendarData.month &&
          scheduleDate.getFullYear() === calendarData.year;
    });
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return day === today.getDate() &&
        calendarData.month === today.getMonth() + 1 &&
        calendarData.year === today.getFullYear();
  };

  const isSelected = (day: number): boolean => {
    return selectedDate === day;
  };

  return (
      <View style={styles.container}>
        {/* 요일 헤더 */}
        {showHeader && (
            <View style={styles.dayHeader}>
              {DAY_NAMES.map((day, index) => (
                  <Text key={index} style={styles.dayHeaderText}>
                    {day}
                  </Text>
              ))}
            </View>
        )}

        {/* 달력 그리드 */}
        <View style={styles.calendarGrid}>
          {calendarData.calendar.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {week.map((date, dayIndex) => (
                    <TouchableOpacity
                        key={dayIndex}
                        style={[
                          styles.dateCell,
                          !date.isCurrentMonth && styles.otherMonthCell,
                          isToday(date.day) && styles.todayCell,
                          isSelected(date.day) && styles.selectedCell,
                        ]}
                        onPress={() => date.isCurrentMonth && onDateSelect(date.day)}
                        disabled={!date.isCurrentMonth}
                    >
                      <Text
                          style={[
                            styles.dateText,
                            !date.isCurrentMonth && styles.otherMonthText,
                            isToday(date.day) && styles.todayText,
                            isSelected(date.day) && styles.selectedText,
                          ]}
                      >
                        {date.day}
                      </Text>
                      {hasSchedule(date.day) && date.isCurrentMonth && (
                          <View style={styles.scheduleDot} />
                      )}
                    </TouchableOpacity>
                ))}
              </View>
          ))}
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    gap: 4,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  dateCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    position: 'relative',
  },
  otherMonthCell: {
    opacity: 0.3,
  },
  todayCell: {
    backgroundColor: BRAND_COLORS.green,
  },
  selectedCell: {
    backgroundColor: BRAND_COLORS.yellowHighlight,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  otherMonthText: {
    color: '#999',
  },
  todayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#333',
    fontWeight: 'bold',
  },
  scheduleDot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BRAND_COLORS.green,
  },
});

export default CalendarComponent;