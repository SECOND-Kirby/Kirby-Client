// components/schedule/CalendarComponent.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { CalendarData, Schedule } from '@/types/schedule';
import { DAY_NAMES } from '@/constants';

interface CalendarComponentProps {
  calendarData: CalendarData;
  selectedDate: number | null;
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
                            dayIndex === 0 && date.isCurrentMonth && styles.sundayText,
                            dayIndex === 6 && date.isCurrentMonth && styles.saturdayText,
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
    backgroundColor: Colors.background.card,
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
    color: Colors.text.secondary,
    width: 40,
    textAlign: 'center',
  },
  sundayHeaderText: {
    color: Colors.days.sunday,
  },
  saturdayHeaderText: {
    color: Colors.days.saturday,
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
    backgroundColor: Colors.primary,
  },
  selectedCell: {
    backgroundColor: Colors.background.scheduleHighlight,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  dateText: {
    fontSize: 16,
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
    fontWeight: 'bold',
  },
  selectedText: {
    color: Colors.text.main,
    fontWeight: 'bold',
  },
  scheduleDot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
});

export default CalendarComponent;