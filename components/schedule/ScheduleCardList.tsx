// components/schedule/ScheduleCardList.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface Schedule {
    id: string;
    title: string;
    date: Date;
    startTime: string;
    endTime: string;
    isAllDay: boolean;
    memo?: string;
}

interface ScheduleCardListProps {
    schedules: Schedule[];
    selectedDate: Date | null;
    onEditSchedule: (schedule: Schedule) => void;
    onAddSchedule: () => void;
}

const ScheduleCardList: React.FC<ScheduleCardListProps> = ({
                                                               schedules,
                                                               selectedDate,
                                                               onEditSchedule,
                                                               onAddSchedule,
                                                           }) => {
    const formatTimeWithAMPM = (time: string): string => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes}${ampm}`;
    };

    if (!selectedDate) return null;

    if (schedules.length === 0) {
        return (
            <View style={styles.noScheduleSection}>
                <Text style={styles.noScheduleText}>
                    {selectedDate.toLocaleDateString('ko-KR', {
                        month: 'long',
                        day: 'numeric'
                    })}에는 일정이 없습니다.
                </Text>
                <TouchableOpacity
                    style={styles.addScheduleButton}
                    onPress={onAddSchedule}
                    activeOpacity={0.7}
                >
                    <Ionicons name="add" size={20} color={Colors.text.main} />
                    <Text style={styles.addScheduleButtonText}>일정 추가</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.scheduleListSection}>
            {schedules.map((schedule) => (
                <View key={schedule.id} style={styles.scheduleCard}>
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
                                <View style={styles.scheduleBadge} />
                                <Text style={styles.scheduleTitle}>{schedule.title}</Text>
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => onEditSchedule(schedule)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="pencil" size={16} color={Colors.text.secondary} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.scheduleTime}>
                                {schedule.isAllDay
                                    ? '하루종일'
                                    : `${formatTimeWithAMPM(schedule.startTime)} - ${formatTimeWithAMPM(schedule.endTime)}`
                                }
                            </Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    scheduleListSection: {
        marginHorizontal: 16,
        marginBottom: 32,
    },
    scheduleCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        backgroundColor: Colors.background.card,
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
        color: Colors.text.secondary,
        marginBottom: 4,
    },
    scheduleNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text.main,
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
        backgroundColor: Colors.primary,
    },
    scheduleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.main,
        flex: 1,
    },
    editButton: {
        padding: 4,
    },
    scheduleTime: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginLeft: 16,
    },
    noScheduleSection: {
        alignItems: 'center',
        paddingVertical: 40,
        marginHorizontal: 16,
    },
    noScheduleText: {
        fontSize: 16,
        color: Colors.text.secondary,
        marginBottom: 20,
    },
    addScheduleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        backgroundColor: Colors.primary,
    },
    addScheduleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.main,
        marginLeft: 8,
    },
});

export default ScheduleCardList;