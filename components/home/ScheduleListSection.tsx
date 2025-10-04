// components/home/ScheduleListSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Schedule } from '@/types/schedule';

interface ScheduleListSectionProps {
    selectedDate: number | null;
    schedules: Schedule[];
    onAddSchedule: () => void;
}

const ScheduleListSection: React.FC<ScheduleListSectionProps> = ({
                                                                     selectedDate,
                                                                     schedules,
                                                                     onAddSchedule,
                                                                 }) => {
    if (!selectedDate) {
        return null;
    }

    const hasSchedules = schedules.length > 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{selectedDate}일 일정</Text>
                <TouchableOpacity onPress={onAddSchedule} style={styles.addButton}>
                    <Ionicons name="add-circle" size={32} color="#A4D65E" />
                </TouchableOpacity>
            </View>

            {!hasSchedules ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="calendar-outline" size={64} color="#CCCCCC" />
                    <Text style={styles.emptyText}>선택한 날짜에 일정이 없습니다</Text>
                    <TouchableOpacity style={styles.emptyButton} onPress={onAddSchedule}>
                        <Text style={styles.emptyButtonText}>일정 추가하기</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.scheduleList}>
                    {schedules.map((schedule) => (
                        <View key={schedule.id} style={styles.scheduleItem}>
                            <View style={styles.timeContainer}>
                                <Text style={styles.timeText}>
                                    {schedule.startTime} - {schedule.endTime}
                                </Text>
                            </View>
                            <View style={styles.scheduleContent}>
                                <Text style={styles.scheduleTitle}>{schedule.title}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 16,
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    addButton: {
        padding: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        fontSize: 16,
        color: '#999999',
        marginTop: 16,
        marginBottom: 24,
    },
    emptyButton: {
        backgroundColor: '#A4D65E',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    scheduleList: {
        gap: 12,
    },
    scheduleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    timeContainer: {
        marginRight: 16,
    },
    timeText: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '500',
    },
    scheduleContent: {
        flex: 1,
    },
    scheduleTitle: {
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: '600',
    },
});

export default ScheduleListSection;