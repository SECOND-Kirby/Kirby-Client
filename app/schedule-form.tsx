import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const ScheduleFormScreen = () => {
  const params = useLocalSearchParams();
  const isEditMode = params.mode === 'edit';
  
  // 폼 상태
  const [title, setTitle] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [memo, setMemo] = useState('');

  // 모달 상태
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 테마 색상
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const brandGreen = '#9DE84C';

  useEffect(() => {
    // 편집 모드일 때 기존 데이터 로드
    if (isEditMode && params.title) {
      setTitle(params.title as string);
      setStartTime((params.startTime as string) || '09:00');
      setEndTime((params.endTime as string) || '10:00');
      setIsAllDay(params.isAllDay === 'true');
      setMemo((params.memo as string) || '');
      
      if (params.date) {
        setDate(new Date(params.date as string));
      }
    } 
    // 새 일정 생성 시 미리 설정된 날짜가 있으면 사용
    else if (!isEditMode && params.presetDate) {
      setDate(new Date(params.presetDate as string));
    }
  }, []); // 의존성 배열을 빈 배열로 변경

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return;
    }

    if (!isAllDay) {
      const startMinutes = timeToMinutes(startTime);
      const endMinutes = timeToMinutes(endTime);
      
      if (endMinutes <= startMinutes) {
        Alert.alert('알림', '종료 시간은 시작 시간보다 늦어야 합니다.');
        return;
      }
    }

    const scheduleData = {
      id: isEditMode ? params.scheduleId : Date.now().toString(),
      title: title.trim(),
      date,
      startTime,
      endTime,
      isAllDay,
      memo: memo.trim(),
    };

    try {
      const existingSchedulesJson = await AsyncStorage.getItem('schedules');
      const existingSchedules = existingSchedulesJson ? JSON.parse(existingSchedulesJson) : [];
      
      let updatedSchedules;
      if (isEditMode) {
        updatedSchedules = existingSchedules.map((s: any) => 
          s.id === scheduleData.id ? scheduleData : s
        );
      } else {
        updatedSchedules = [...existingSchedules, scheduleData];
      }
      
      await AsyncStorage.setItem('schedules', JSON.stringify(updatedSchedules));
      
      router.replace('/schedule');
    } catch (error) {
      console.error('저장 오류:', error);
      Alert.alert('오류', '일정 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = () => {
    console.log('handleDelete 함수 진입');
    
    if (!isEditMode) {
      console.log('편집 모드가 아니어서 종료');
      return;
    }

    // 더 간단한 Alert 구조로 변경
    Alert.alert(
      '일정 삭제', 
      '정말 이 일정을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: performDelete
        }
      ],
      { cancelable: true }
    );
  };

  const performDelete = async () => {
    console.log('삭제 실행 중...');
    
    try {
      const schedulesJson = await AsyncStorage.getItem('schedules');
      const existingSchedules = schedulesJson ? JSON.parse(schedulesJson) : [];
      
      const filteredSchedules = existingSchedules.filter(
        (schedule) => schedule.id !== params.scheduleId
      );
      
      await AsyncStorage.setItem('schedules', JSON.stringify(filteredSchedules));
      console.log('일정 삭제 완료');
      
      router.replace('/schedule');
      
    } catch (error) {
      console.error('삭제 중 오류:', error);
      Alert.alert('오류', '일정 삭제 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  };

  // 시간을 분으로 변환하는 함수
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // 분을 시간으로 변환하는 함수
  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // 시간 옵션 생성 (30분 간격)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(time);
      }
    }
    return options;
  };

  // 날짜 옵션 생성 최적화 (60일)
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 60; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      options.push(currentDate);
    }
    return options;
  };

  const timeOptions = generateTimeOptions();
  const dateOptions = generateDateOptions();

  const handleStartTimeSelect = (time: string) => {
    setStartTime(time);
    
    const startMinutes = timeToMinutes(time);
    const endMinutes = timeToMinutes(endTime);
    
    if (endMinutes <= startMinutes) {
      const newEndMinutes = startMinutes + 30;
      if (newEndMinutes < 24 * 60) {
        setEndTime(minutesToTime(newEndMinutes));
      } else {
        setEndTime('23:59');
      }
    }
    
    setShowStartTimePicker(false);
  };

  const handleEndTimeSelect = (time: string) => {
    setEndTime(time);
    setShowEndTimePicker(false);
  };

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    setShowDatePicker(false);
  };

  // 시간 렌더 함수 (FlatList 최적화)
  const renderTimeItem = ({ item: time }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.option,
        (time === startTime || time === endTime) && { backgroundColor: brandGreen + '20' }
      ]}
      onPress={() => {
        if (showStartTimePicker) {
          handleStartTimeSelect(time);
        } else if (showEndTimePicker) {
          handleEndTimeSelect(time);
        }
      }}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.optionText,
        (time === startTime || time === endTime) && { color: brandGreen, fontWeight: 'bold' }
      ]}>
        {time}
      </Text>
    </TouchableOpacity>
  );

  // 날짜 렌더 함수 (FlatList 최적화)
  const renderDateItem = ({ item: dateOption, index }: { item: Date; index: number }) => {
    const isSelected = dateOption.toDateString() === date.toDateString();
    const isToday = dateOption.toDateString() === new Date().toDateString();
    
    return (
      <TouchableOpacity
        style={[
          styles.option,
          isSelected && { backgroundColor: brandGreen + '20' }
        ]}
        onPress={() => handleDateSelect(dateOption)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.optionText,
          isSelected && { color: brandGreen, fontWeight: 'bold' },
          isToday && !isSelected && { color: brandGreen }
        ]}>
          {formatDate(dateOption)}
          {isToday && ' (오늘)'}
        </Text>
      </TouchableOpacity>
    );
  };

  // 시간 선택 모달 컴포넌트 개선
  const TimePickerModal = ({ 
    visible, 
    onClose, 
    title
  }: {
    visible: boolean;
    onClose: () => void;
    title: string;
  }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelText}>취소</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{title}</Text>
            <View style={styles.modalSpacer} />
          </View>
          
          <FlatList
            data={timeOptions}
            keyExtractor={(item) => item}
            renderItem={renderTimeItem}
            style={styles.optionsContainer}
            showsVerticalScrollIndicator={false}
            maxToRenderPerBatch={15}
            windowSize={10}
            initialNumToRender={20}
            getItemLayout={(data, index) => (
              {length: 56, offset: 56 * index, index}
            )}
            removeClippedSubviews={true}
          />
        </View>
      </View>
    </Modal>
  );

  // 날짜 선택 모달 컴포넌트 개선
  const DatePickerModal = ({ 
    visible, 
    onClose
  }: {
    visible: boolean;
    onClose: () => void;
  }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelText}>취소</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>날짜 선택</Text>
            <View style={styles.modalSpacer} />
          </View>
          
          <FlatList
            data={dateOptions}
            keyExtractor={(item, index) => `date-${index}`}
            renderItem={renderDateItem}
            style={styles.optionsContainer}
            showsVerticalScrollIndicator={false}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={15}
            getItemLayout={(data, index) => (
              {length: 56, offset: 56 * index, index}
            )}
            removeClippedSubviews={true}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? '일정 편집' : '새 일정'}
        </Text>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={[styles.saveButtonText, { color: brandGreen }]}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 제목 입력 */}
        <View style={[styles.section, { backgroundColor: cardBackgroundColor }]}>
          <Text style={styles.sectionTitle}>제목</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="일정 제목을 입력하세요"
            placeholderTextColor="#999"
            maxLength={100}
          />
        </View>

        {/* 날짜 선택 */}
        <View style={[styles.section, { backgroundColor: cardBackgroundColor }]}>
          <Text style={styles.sectionTitle}>날짜</Text>
          <TouchableOpacity 
            style={styles.dateSelector}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={20} color={brandGreen} />
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* 하루종일 토글 */}
        <View style={[styles.section, { backgroundColor: cardBackgroundColor }]}>
          <View style={styles.toggleContainer}>
            <Text style={styles.sectionTitle}>하루종일</Text>
            <Switch
              value={isAllDay}
              onValueChange={setIsAllDay}
              trackColor={{ false: '#E0E0E0', true: brandGreen }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E0E0E0"
            />
          </View>
        </View>

        {/* 시간 선택 */}
        {!isAllDay && (
          <View style={[styles.section, { backgroundColor: cardBackgroundColor }]}>
            <Text style={styles.sectionTitle}>시간</Text>
            
            <View style={styles.timeContainer}>
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>시작</Text>
                <TouchableOpacity 
                  style={styles.timeSelector}
                  onPress={() => setShowStartTimePicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeText}>{startTime}</Text>
                  <Ionicons name="chevron-down" size={16} color="#999" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.timeDivider}>
                <Text style={styles.timeDividerText}>~</Text>
              </View>
              
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>종료</Text>
                <TouchableOpacity 
                  style={styles.timeSelector}
                  onPress={() => setShowEndTimePicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeText}>{endTime}</Text>
                  <Ionicons name="chevron-down" size={16} color="#999" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* 메모 입력 */}
        <View style={[styles.section, { backgroundColor: cardBackgroundColor }]}>
          <Text style={styles.sectionTitle}>메모</Text>
          <TextInput
            style={styles.memoInput}
            value={memo}
            onChangeText={setMemo}
            placeholder="메모를 입력하세요 (선택사항)"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>{memo.length}/500</Text>
        </View>

        {/* 삭제 버튼 (편집 모드에서만) */}
        {isEditMode && (
          <View style={styles.deleteSection}>
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={performDelete}  // Alert 없이 바로 performDelete 호출
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
              <Text style={styles.deleteButtonText}>일정 삭제</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* 모달들 */}
      <TimePickerModal
        visible={showStartTimePicker}
        onClose={() => setShowStartTimePicker(false)}
        title="시작 시간"
      />
      
      <TimePickerModal
        visible={showEndTimePicker}
        onClose={() => setShowEndTimePicker(false)}
        title="종료 시간"
      />

      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
      />
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
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },

  // 섹션 스타일
  section: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },

  // 제목 입력
  titleInput: {
    fontSize: 16,
    color: '#333',
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },

  // 날짜 선택
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },

  // 하루종일 토글
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // 시간 선택
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeItem: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  timeDivider: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  timeDividerText: {
    fontSize: 16,
    color: '#666',
  },

  // 메모 입력
  memoInput: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },

  // 삭제 버튼
  deleteSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: '#FFF5F5',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    minHeight: 50,
    minWidth: 150,
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginLeft: 8,
    fontWeight: '500',
  },

  // 모달 공통 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSpacer: {
    width: 50,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    maxHeight: 400,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
    minHeight: 52,
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default ScheduleFormScreen;