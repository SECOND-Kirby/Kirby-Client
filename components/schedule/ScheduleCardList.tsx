// components/schedule/ScheduleCardList.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Schedule } from '@/types/schedule';

interface ScheduleCardListProps {
    schedules: Schedule[];
    selectedDate: Date | null;
    onEditSchedule: (schedule: Schedule) => void;
    onViewSchedule?: (schedule: Schedule) => void;
    onAddSchedule: () => void;
}

const ScheduleCardList: React.FC<ScheduleCardListProps> = ({
                                                               schedules,
                                                               selectedDate,
                                                               onEditSchedule,
                                                               onViewSchedule,
                                                               onAddSchedule,
                                                           }) => {
    const formatTimeWithAMPM = (time: string): string => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes}${ampm}`;
    };

    const getDayOfWeek = (date: Date): string => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    };

    const handleCardPress = (schedule: Schedule) => {
        if (onViewSchedule) {
            onViewSchedule(schedule);
        } else {
            onEditSchedule(schedule);
        }
    };

    const handleEditPress = (e: any, schedule: Schedule) => {
        e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
        onEditSchedule(schedule);
    };

    if (!selectedDate) return null;

    if (schedules.length === 0) {
        return (
            <View style={styles.noScheduleSection}>
                <Ionicons name="calendar-outline" size={48} color={Colors.text.secondary} />
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
                    <Ionicons name="add" size={20} color={Colors.text.white} />
                    <Text style={styles.addScheduleButtonText}>일정 추가</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.scheduleListSection}>
            {schedules.map((schedule) => {
                const scheduleDate = new Date(schedule.date);
                return (
                    <TouchableOpacity
                        key={schedule.id}
                        style={styles.scheduleCard}
                        onPress={() => handleCardPress(schedule)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.scheduleCardContent}>
                            <View style={styles.scheduleDate}>
                                <Text style={styles.scheduleDayText}>
                                    {getDayOfWeek(scheduleDate)}
                                </Text>
                                <Text style={styles.scheduleDateNumber}>
                                    {scheduleDate.getDate()}
                                </Text>
                            </View>
                            <View style={styles.scheduleInfo}>
                                <View style={styles.scheduleHeader}>
                                    <View style={styles.scheduleBadge} />
                                    <Text style={styles.scheduleTitle} numberOfLines={1}>
                                        {schedule.title}
                                    </Text>
                                </View>
                                <Text style={styles.scheduleTime}>
                                    {schedule.isAllDay
                                        ? '하루종일'
                                        : `${formatTimeWithAMPM(schedule.startTime)} - ${formatTimeWithAMPM(schedule.endTime)}`
                                    }
                                </Text>
                                {schedule.repeatDays && schedule.repeatDays.length > 0 && (
                                    <View style={styles.repeatContainer}>
                                        <Ionicons name="repeat" size={14} color={Colors.text.secondary} />
                                        <Text style={styles.repeatText}>
                                            매주 반복
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={(e) => handleEditPress(e, schedule)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="pencil" size={20} color={Colors.text.secondary} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    scheduleListSection: {
        marginHorizontal: 20,
        marginBottom: 32,
    },
    scheduleCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        backgroundColor: Colors.background.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    scheduleCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scheduleDate: {
        alignItems: 'center',
        marginRight: 20,
        minWidth: 50,
    },
    scheduleDayText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginBottom: 4,
    },
    scheduleDateNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text.main,
    },
    scheduleInfo: {
        flex: 1,
        marginRight: 8,
    },
    scheduleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    scheduleBadge: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 10,
        backgroundColor: Colors.primary,
    },
    scheduleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.main,
        flex: 1,
    },
    scheduleTime: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginLeft: 16,
    },
    repeatContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginLeft: 16,
    },
    repeatText: {
        fontSize: 12,
        color: Colors.text.secondary,
        marginLeft: 4,
    },
    editButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: Colors.background.neon,
    },
    noScheduleSection: {
        alignItems: 'center',
        paddingVertical: 60,
        marginHorizontal: 20,
    },
    noScheduleText: {
        fontSize: 15,
        color: Colors.text.secondary,
        marginTop: 16,
        marginBottom: 24,
    },
    addScheduleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary,
    },
    addScheduleButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text.white,
        marginLeft: 6,
    },
});

export default ScheduleCardList;