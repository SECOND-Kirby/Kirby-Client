import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BallCollectionScreen from './BallCollectionScreen';

const HomeScreen = () => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [nextSchedule, setNextSchedule] = useState(null); // 다가오는 일정 상태

  // 테마 색상 가져오기
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');

  // 브랜드 컬러
  const brandGreen = '#9DE84C';
  const yellowHighlight = '#FFE55C';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 화면이 포커스될 때마다 스케줄 로드
  useFocusEffect(
    useCallback(() => {
      loadNextSchedule();
    }, [])
  );

  // 다가오는 일정 로드
  const loadNextSchedule = async () => {
    try {
      const schedulesJson = await AsyncStorage.getItem('schedules');
      if (!schedulesJson) {
        setNextSchedule(null);
        return;
      }

      const schedules = JSON.parse(schedulesJson);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 오늘 시작 시간

      // 오늘 이후의 일정 필터링
      const upcomingSchedules = schedules
        .map(schedule => ({
          ...schedule,
          date: new Date(schedule.date)
        }))
        .filter(schedule => {
          const scheduleDate = new Date(schedule.date);
          scheduleDate.setHours(0, 0, 0, 0);
          return scheduleDate >= today;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // 날짜순 정렬

      if (upcomingSchedules.length > 0) {
        setNextSchedule(upcomingSchedules[0]);
      } else {
        setNextSchedule(null);
      }
    } catch (error) {
      console.error('스케줄 로드 오류:', error);
      setNextSchedule(null);
    }
  };

  // 날짜 포맷팅 함수
  const formatScheduleDate = (date) => {
    if (!date) return '';
    const scheduleDate = new Date(date);
    const month = scheduleDate.getMonth() + 1;
    const day = scheduleDate.getDate();
    return `${month}월 ${day}일`;
  };

  // 시간 포맷팅 함수
  const formatTime = (time) => {
    return time;
  };

  const handleStartCollection = () => {
    setIsCollecting(true);
  };

  const handleStartTraining = () => {
    // 훈련 화면의 기본 설정값으로 바로 세션 모드로 이동
    router.push({
      pathname: '/(tabs)/training',
      params: {
        sessionMode: 'active',
        duration: '20', // 기본 20분
        mode: 'serve',  // 기본 서브 모드
        intensity: '50', // 기본 강도 50%
        direction: '30', // 기본 방향 30%
        frequency: '40', // 기본 빈도 40%
      }
    });
  };

  const handleStopCollection = () => {
    setIsCollecting(false);
  };

  const handleProfilePress = () => {
    router.push('/(tabs)/settings');
  };

  const handleSchedulePress = () => {
    router.push('/schedule');
  };

  // 이벤트 전파를 막는 함수
  const stopPropagation = (callback) => (event) => {
    event.stopPropagation();
    if (callback) callback();
  };

  // 캘린더 이전달 이동
  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  // 캘린더 다음달 이동
  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  // 캘린더 생성 함수 - calendarDate 사용
  const generateCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
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
    
    // 다음 달의 첫 날짜들 추가 (6주 완성을 위해)
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
    
    // 현재 보고 있는 달이 오늘 날짜가 있는 달인지 확인
    const isCurrentMonthToday = year === todayYear && month === todayMonth;
    
    return { 
      calendar, 
      today: isCurrentMonthToday ? today : null, 
      month: month + 1, 
      year 
    };
  };

  // 공 수거 중이면 BallCollectionScreen 표시
  if (isCollecting) {
    return <BallCollectionScreen onStop={handleStopCollection} />;
  }

  const { calendar, today, month, year } = generateCalendar();
  const monthNames = ['', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} showsVerticalScrollIndicator={false}>
      {/* 상단 헤더 */}
      <View style={[styles.header, { backgroundColor }]}>
        <Text style={styles.headerTitle}>홈</Text>
        <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
          <Ionicons name="person-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* 예정된 일정 카드 - 실제 데이터 연동 */}
      <TouchableOpacity 
        style={[styles.scheduleCard, { backgroundColor: nextSchedule ? brandGreen : '#f0f0f0' }]} 
        onPress={handleSchedulePress}
        activeOpacity={0.9}
      >
        <View style={styles.scheduleHeader}>
          <Ionicons name="calendar-outline" size={20} color="#333" />
          <Text style={styles.scheduleHeaderText}>
            {nextSchedule ? '예정된 일정' : '예정된 일정 없음'}
          </Text>
        </View>
        
        {nextSchedule ? (
          <>
            <Text style={styles.scheduleDateTime}>
              {formatScheduleDate(nextSchedule.date)} {
                nextSchedule.isAllDay 
                  ? '하루종일' 
                  : `${formatTime(nextSchedule.startTime)} ~ ${formatTime(nextSchedule.endTime)}`
              }
            </Text>
            <Text style={styles.scheduleTitle}>
              {nextSchedule.title}
            </Text>
          </>
        ) : (
          <Text style={[styles.scheduleTitle, { color: '#666' }]}>
            새로운 일정을 추가해보세요
          </Text>
        )}
      </TouchableOpacity>

      {/* 랠리 위크 섹션 */}
      <View style={styles.rallyWeekSection}>
        <View style={styles.rallyWeekContent}>
          <View style={styles.rallyWeekText}>
            <Text style={styles.rallyWeekTitle}>랠리 위크</Text>
            <Text style={styles.rallyWeekSubtitle}>
              당신의 개인 테니스 훈련을 위한
            </Text>
            <View style={styles.supportBadge}>
              <Text style={styles.supportBadgeText}>서포트 솔루션</Text>
            </View>
          </View>
          
          {/* 테니스 장비 일러스트레이션 */}
          <View style={styles.equipmentContainer}>
            <Image 
              source={require('@/assets/images/kirby.png')} 
              style={styles.equipmentImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* 액션 버튼들 */}
      <View style={styles.actionButtonsSection}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: brandGreen }]} 
          onPress={handleStartCollection}
          activeOpacity={0.9}
        >
          <Text style={styles.actionButtonText}>공 수거 시작</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: brandGreen }]} 
          onPress={handleStartTraining}
          activeOpacity={0.9}
        >
          <Text style={styles.actionButtonText}>훈련 시작</Text>
        </TouchableOpacity>
      </View>

      {/* 월간 캘린더 - 네비게이션 기능 수정 */}
      <View style={styles.calendarSection}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity 
            style={styles.monthNavButton} 
            onPress={stopPropagation(handlePrevMonth)}
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
            onPress={stopPropagation(handleNextMonth)}
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
                index === 0 && { color: '#ff6b6b' },
                index === 6 && { color: '#4A90E2' }
              ]}
            >
              {dayName}
            </Text>
          ))}
        </View>
        
        {/* 캘린더 날짜들 */}
        {calendar.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.calendarWeek}>
            {week.map((dateObj, dayIndex) => (
              <View key={`${weekIndex}-${dayIndex}`} style={styles.calendarDay}>
                <View style={[
                  styles.dayContainer,
                  dateObj.isCurrentMonth && today && dateObj.day === today && { backgroundColor: brandGreen },
                ]}>
                  <Text style={[
                    styles.dayText,
                    !dateObj.isCurrentMonth && { color: '#ccc' },
                    dateObj.isCurrentMonth && {
                      color: dayIndex === 0 ? '#ff6b6b' :
                             dayIndex === 6 ? '#4A90E2' :
                             '#333'
                    },
                    dateObj.isCurrentMonth && today && dateObj.day === today && { 
                      color: '#333', 
                      fontWeight: 'bold' 
                    }
                  ]}>
                    {dateObj.day}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
        
        {/* 캘린더 전체 터치 영역 */}
        <TouchableOpacity 
          style={styles.calendarTouchArea}
          onPress={handleSchedulePress}
          activeOpacity={0.9}
        >
          <View style={styles.calendarTouchOverlay}>
            <Text style={styles.calendarTouchText}>일정 관리하기</Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileIcon: {
    padding: 8,
  },

  // 예정된 일정 카드
  scheduleCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  scheduleDateTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  // 랠리 위크 섹션
  rallyWeekSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  rallyWeekContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rallyWeekText: {
    flex: 1,
  },
  rallyWeekTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  rallyWeekSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  supportBadge: {
    backgroundColor: '#FFE55C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  supportBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  // 장비 일러스트레이션
  equipmentContainer: {
    width: 200,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  equipmentImage: {
    width: 200,
    height: 120,
  },

  // 액션 버튼들
  actionButtonsSection: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  // 캘린더 섹션
  calendarSection: {
    position: 'relative',
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
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
    marginBottom: 16,
    zIndex: 10,
  },
  monthNavButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    zIndex: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9DE84C',
  },
  calendarDaysHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  calendarWeek: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  dayContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  
  // 캘린더 터치 영역
  calendarTouchArea: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 5,
  },
  calendarTouchOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarTouchText: {
    fontSize: 12,
    color: '#999',
    marginRight: 4,
  },
});

export default HomeScreen;