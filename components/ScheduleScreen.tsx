import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Schedule {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  memo?: string;
}

const ScheduleScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // 테마 색상
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const brandGreen = '#9DE84C';

  // 화면이 포커스될 때마다 스케줄 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      loadSchedules();
    }, [])
  );

  // 저장된 스케줄 불러오기
  const loadSchedules = async () => {
    try {
      const schedulesJson = await AsyncStorage.getItem('schedules');
      const storedSchedules = schedulesJson ? JSON.parse(schedulesJson) : [];
      
      // 날짜 문자열을 Date 객체로 변환
      const parsedSchedules = storedSchedules.map((schedule: any) => ({
        ...schedule,
        date: new Date(schedule.date)
      }));
      
      setSchedules(parsedSchedules);
    } catch (error) {
      console.error('스케줄 로드 오류:', error);
      // 기본 데이터
      setSchedules([
        {
          id: '1',
          title: '테니스 동작 반복 훈련 (집중 동작)',
          date: new Date(2025, 9, 14),
          startTime: '18:00',
          endTime: '20:00',
          isAllDay: false,
          memo: '',
        },
      ]);
    }
  };
  
  const handleAddSchedule = () => {
    // 선택된 날짜가 있으면 그 날짜를, 없으면 오늘 날짜를 전달
    const targetDate = selectedDate || new Date();
    
    router.push({
      pathname: '/schedule-form',
      params: {
        presetDate: targetDate.toISOString(), // 미리 설정할 날짜 전달
      }
    });
  };

  const handleEditSchedule = (schedule: Schedule) => {
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
  };

  // 캘린더 생성 함수
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date().getDate();
    const todayMonth = new Date().getMonth();
    const todayYear = new Date().getFullYear();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const calendar = [];
    let weeks = [];
    
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
  };

  const { calendar, today, month, year } = generateCalendar();
  const monthNames = ['', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // 선택된 날짜의 일정들 가져오기
  const getSchedulesForDate = (date: Date) => {
    return schedules.filter(schedule => 
      schedule.date.getDate() === date.getDate() &&
      schedule.date.getMonth() === date.getMonth() &&
      schedule.date.getFullYear() === date.getFullYear()
    );
  };

  // 날짜에 일정이 있는지 확인
  const hasScheduleOnDate = (day: number) => {
    return schedules.some(schedule =>
      schedule.date.getDate() === day &&
      schedule.date.getMonth() === currentDate.getMonth() &&
      schedule.date.getFullYear() === currentDate.getFullYear()
    );
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelectedDate);
  };

  // 월 변경 핸들러
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const selectedDateSchedules = selectedDate ? getSchedulesForDate(selectedDate) : [];

  // 시간을 AM/PM 형식으로 변환하는 함수
  const formatTimeWithAMPM = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes}${ampm}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.push('/(tabs)/home')}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>스케줄</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddSchedule}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 캘린더 섹션 */}
        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity 
              style={styles.monthNavButton} 
              onPress={handlePrevMonth}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.calendarTitle}>
              {year}년 {monthNames[month]}
            </Text>
            <TouchableOpacity 
              style={styles.monthNavButton} 
              onPress={handleNextMonth}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {/* 요일 헤더 */}
          <View style={styles.calendarDaysHeader}>
            {dayNames.map((dayName, index) => (
              <Text 
                key={index} 
                style={[
                  styles.dayHeaderText,
                  index === 0 && styles.sundayText,
                  index === 6 && styles.saturdayText
                ]}
              >
                {dayName}
              </Text>
            ))}
          </View>
          
          {/* 캘린더 날짜들 */}
          {calendar.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.calendarWeek}>
              {week.map((dateObj, dayIndex) => {
                const isToday = dateObj.isCurrentMonth && today && dateObj.day === today;
                const isSelected = dateObj.isCurrentMonth && 
                                   selectedDate &&
                                   dateObj.day === selectedDate.getDate() && 
                                   currentDate.getMonth() === selectedDate.getMonth() &&
                                   currentDate.getFullYear() === selectedDate.getFullYear();
                const hasSchedule = dateObj.isCurrentMonth && hasScheduleOnDate(dateObj.day);
                
                return (
                  <TouchableOpacity 
                    key={`${weekIndex}-${dayIndex}`} 
                    style={styles.calendarDay}
                    onPress={() => handleDateSelect(dateObj.day, dateObj.isCurrentMonth)}
                    disabled={!dateObj.isCurrentMonth}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.dayContainer,
                      isToday && styles.todayContainer,
                      isSelected && !isToday && styles.selectedContainer,
                      hasSchedule && !isToday && !isSelected && styles.scheduleContainer
                    ]}>
                      <Text style={[
                        styles.dayText,
                        !dateObj.isCurrentMonth && styles.otherMonthText,
                        dateObj.isCurrentMonth && dayIndex === 0 && styles.sundayText,
                        dateObj.isCurrentMonth && dayIndex === 6 && styles.saturdayText,
                        (isToday || isSelected) && styles.selectedText,
                        hasSchedule && !isToday && !isSelected && styles.scheduleText
                      ]}>
                        {dateObj.day}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* 선택된 날짜의 일정 목록 */}
        {selectedDateSchedules.length > 0 && (
          <View style={styles.scheduleListSection}>
            {selectedDateSchedules.map((schedule) => (
              <View
                key={schedule.id}
                style={[styles.scheduleCard, { backgroundColor: '#FFFFFF' }]}
              >
                <View style={styles.scheduleCardContent}>
                  <View style={styles.scheduleDate}>
                    <Text style={styles.scheduleDateText}>
                      {schedule.date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </Text>
                    <Text style={styles.scheduleNumber}>
                      {schedule.date.getDate()}
                    </Text>
                  </View>
                  <View style={styles.scheduleInfo}>
                    <View style={styles.scheduleHeader}>
                      <View style={[styles.scheduleBadge, { backgroundColor: brandGreen }]} />
                      <Text style={styles.scheduleTitle}>{schedule.title}</Text>
                      <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => handleEditSchedule(schedule)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="pencil" size={16} color="#666" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.scheduleTime}>
                      {schedule.isAllDay ? '하루종일' : `${formatTimeWithAMPM(schedule.startTime)} - ${formatTimeWithAMPM(schedule.endTime)}`}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 일정이 없을 때 메시지 */}
        {selectedDate && selectedDateSchedules.length === 0 && (
          <View style={styles.noScheduleSection}>
            <Text style={styles.noScheduleText}>
              {selectedDate.toLocaleDateString('ko-KR', { 
                month: 'long', 
                day: 'numeric' 
              })}에는 일정이 없습니다.
            </Text>
            <TouchableOpacity 
              style={[styles.addScheduleButton, { backgroundColor: brandGreen }]}
              onPress={handleAddSchedule}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color="#333" />
              <Text style={styles.addScheduleButtonText}>일정 추가</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    padding: 8,
  },

  // 캘린더 섹션
  calendarSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9DE84C',
  },
  monthNavButton: {
    padding: 8,
    borderRadius: 8,
  },
  calendarDaysHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dayHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sundayText: {
    color: '#FF6B6B',
  },
  saturdayText: {
    color: '#4A90E2',
  },
  calendarWeek: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  dayContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  todayContainer: {
    backgroundColor: '#9DE84C',
  },
  selectedContainer: {
    backgroundColor: '#9DE84C',
  },
  scheduleContainer: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#9DE84C',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  otherMonthText: {
    color: '#CCC',
  },
  selectedText: {
    color: '#333',
    fontWeight: 'bold',
  },
  scheduleText: {
    color: '#9DE84C',
    fontWeight: '600',
  },

  // 일정 목록
  scheduleListSection: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  scheduleCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleDate: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  scheduleDateText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  scheduleNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  scheduleBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  scheduleTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 16,
  },

  // 일정 없을 때
  noScheduleSection: {
    alignItems: 'center',
    paddingVertical: 40,
    marginHorizontal: 16,
  },
  noScheduleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  addScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  addScheduleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
});

export default ScheduleScreen;