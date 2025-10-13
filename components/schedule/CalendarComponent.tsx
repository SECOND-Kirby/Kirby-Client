// components/schedule/CalendarComponent.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { CalendarData, Schedule } from '@/types/schedule';
import { DAY_NAMES } from '@/constants';
import { shadowPresets } from '@/utils/styles';

interface CalendarComponentProps {
  calendarData: CalendarData;
  selectedDate: Date | null;
  onDateSelect: (day: number) => void;
  schedules: Schedule[];
  showHeader?: boolean;
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
    return calendarData.today === day;
  };

  const isSelected = (day: number): boolean => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day &&
        selectedDate.getMonth() + 1 === calendarData.month &&
        selectedDate.getFullYear() === calendarData.year;
  };

  return (
      <View style={styles.container}>
        {showHeader && (
            <View style={styles.dayHeader}>
              {DAY_NAMES.map((day, index) => (
                  <Text
                      key={index}
                      style={[
                        styles.dayHeaderText,
                        index === 0 && styles.sundayHeaderText,
                        index === 6 && styles.saturdayHeaderText,
                      ]}
                  >
                    {day}
                  </Text>
              ))}
            </View>
        )}

        <View style={styles.calendarGrid}>
          {calendarData.calendar.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {week.map((date, dayIndex) => (
                    <TouchableOpacity
                        key={dayIndex}
                        style={[
                          styles.dateCell,
                          !date.isCurrentMonth && styles.otherMonthCell,
                          isToday(date.day) && date.isCurrentMonth && styles.todayCell,
                          isSelected(date.day) && styles.selectedCell,
                        ]}
                        onPress={() => date.isCurrentMonth && onDateSelect(date.day)}
                        disabled={!date.isCurrentMonth}
                        activeOpacity={0.7}
                    >
                      <Text
                          style={[
                            styles.dateText,
                            !date.isCurrentMonth && styles.otherMonthText,
                            dayIndex === 0 && date.isCurrentMonth && styles.sundayText,
                            dayIndex === 6 && date.isCurrentMonth && styles.saturdayText,
                            isToday(date.day) && date.isCurrentMonth && styles.todayText,
                            isSelected(date.day) && styles.selectedText,
                          ]}
                      >
                        {date.day}
                      </Text>
                      {hasSchedule(date.day) && date.isCurrentMonth && !isToday(date.day) && (
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
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    ...shadowPresets.medium,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.neon,
  },
  dayHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    width: 36,
    textAlign: 'center',
  },
  sundayHeaderText: {
    color: Colors.days.sunday,
  },
  saturdayHeaderText: {
    color: Colors.days.saturday,
  },
  calendarGrid: {
    gap: 2,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dateCell: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    position: 'relative',
  },
  otherMonthCell: {
    opacity: 0,
  },
  todayCell: {
    backgroundColor: Colors.primary,
  },
  selectedCell: {
    backgroundColor: Colors.background.scheduleHighlight,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text.main,
  },
  otherMonthText: {
    color: Colors.text.lightGray,
  },
  sundayText: {
    color: Colors.days.sunday,
  },
  saturdayText: {
    color: Colors.days.saturday,
  },
  todayText: {
    color: Colors.text.white,
    fontWeight: '700',
  },
  selectedText: {
    color: Colors.text.main,
    fontWeight: '700',
  },
  scheduleDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});

export default CalendarComponent;