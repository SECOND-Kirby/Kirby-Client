import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Schedule } from '@/types/schedule';
import { BRAND_COLORS } from '@/utils/constants';

interface ScheduleListProps {
  schedules: Schedule[];
  selectedDate: number | null;
  onSchedulePress: (schedule: Schedule) => void;
  onAddSchedule: () => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  selectedDate,
  onSchedulePress,
  onAddSchedule,
}) => {
  const filteredSchedules = selectedDate 
    ? schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate.getDate() === selectedDate;
      })
    : schedules;

  const formatTime = (time: string): string => {
    return time.substring(0, 5); // HH:MM 형식으로 변환
  };

  const renderScheduleItem = ({ item }: { item: Schedule }) => (
    <TouchableOpacity
      style={styles.scheduleItem}
      onPress={() => onSchedulePress(item)}
    >
      <View style={styles.scheduleContent}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleTitle}>{item.title}</Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </View>
        <View style={styles.scheduleDetails}>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.timeText}>
              {item.startTime} - {item.endTime}
            </Text>
          </View>
          {!item.isAllDay && (
            <View style={styles.durationContainer}>
              <Text style={styles.durationText}>
                {formatTime(item.endTime)} - {formatTime(item.startTime)} = {item.duration || '1시간'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {selectedDate ? `${selectedDate}일 일정` : '전체 일정'}
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddSchedule}>
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {filteredSchedules.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>
            {selectedDate ? '선택한 날짜에 일정이 없습니다' : '등록된 일정이 없습니다'}
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={onAddSchedule}>
            <Text style={styles.emptyButtonText}>일정 추가하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredSchedules}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: BRAND_COLORS.green,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 8,
  },
  scheduleItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: BRAND_COLORS.green,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  scheduleDetails: {
    gap: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  durationContainer: {
    marginLeft: 20,
  },
  durationText: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: BRAND_COLORS.green,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ScheduleList;
