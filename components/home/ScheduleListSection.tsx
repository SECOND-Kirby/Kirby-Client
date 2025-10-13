// components/home/ScheduleListSection.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Schedule } from '@/types/schedule';
import { useScheduleStore } from '@/store/scheduleStore';
import { useAlert } from '@/hooks';
import { shadowPresets } from '@/utils/styles';

interface ScheduleListSectionProps {
    selectedDate: number | null;
    schedules: Schedule[];
    onAddSchedule: () => void;
    currentMonth?: number;
    currentYear?: number;
}

const ScheduleListSection: React.FC<ScheduleListSectionProps> = ({
                                                                     selectedDate,
                                                                     schedules,
                                                                     onAddSchedule,
                                                                     currentMonth,
                                                                     currentYear,
                                                                 }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const { deleteSchedule } = useScheduleStore();
    const { showConfirm } = useAlert();

    if (!selectedDate) return null;

    const month = currentMonth || new Date().getMonth() + 1;
    const year = currentYear || new Date().getFullYear();

    const formatTime = (time: string): string => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? '오후' : '오전';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${ampm} ${displayHour}:${minutes}`;
    };

    const getDayOfWeek = (dateStr: string): string => {
        const date = new Date(dateStr);
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return days[date.getDay()];
    };

    const handleCardPress = (schedule: Schedule) => {
        router.push('/(tabs)/schedule');
    };

    const handleMenuPress = (e: any, schedule: Schedule) => {
        e.stopPropagation();
        if (selectedSchedule?.id === schedule.id && menuVisible) {
            setMenuVisible(false);
        } else {
            setSelectedSchedule(schedule);
            setMenuVisible(true);
        }
    };

    const handleEdit = () => {
        if (!selectedSchedule) return;
        setMenuVisible(false);
        router.push({
            pathname: '/(tabs)/schedule/form',
            params: {
                mode: 'edit',
                scheduleId: selectedSchedule.id,
                title: selectedSchedule.title,
                date: selectedSchedule.date,
                startTime: selectedSchedule.startTime.substring(0, 5),
                endTime: selectedSchedule.endTime.substring(0, 5),
                isAllDay: selectedSchedule.isAllDay.toString(),
                memo: selectedSchedule.memo || '',
                repeatDays: selectedSchedule.repeatDays?.join(',') || '',
                repeatEndDate: selectedSchedule.repeatEndDate || '',
                isRepeating: selectedSchedule.isRepeating?.toString() || 'false',
            },
        });
    };

    const handleDelete = () => {
        if (!selectedSchedule) return;
        setMenuVisible(false);
        showConfirm(
            '일정 삭제',
            '이 일정을 삭제하시겠습니까?',
            () => {
                deleteSchedule(selectedSchedule.id);
            },
            '삭제',
            '취소',
            true
        );
    };

    return (
        <View style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{month}월 {selectedDate}일</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{schedules.length}</Text>
                </View>
            </View>

            {schedules.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconWrapper}>
                        <Ionicons name="calendar-clear-outline" size={40} color={Colors.primary} />
                    </View>
                    <Text style={styles.emptyText}>등록된 일정이 없습니다.</Text>
                    <Text style={styles.emptySubText}>새로운 일정을 추가해 보세요!</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={onAddSchedule}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={22} color={Colors.text.white} />
                        <Text style={styles.addButtonText}>일정 추가하기</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.scheduleList}>
                    {schedules.map((schedule) => (
                        <TouchableOpacity
                            key={schedule.id}
                            style={styles.card}
                            onPress={() => handleCardPress(schedule)}
                            activeOpacity={0.7}
                        >
                            {/* 좌측 날짜/시간 영역 */}
                            <View style={styles.leftSection}>
                                <Text style={styles.dayOfWeek}>{getDayOfWeek(schedule.date)}</Text>
                                <Text style={styles.dateNumber}>{new Date(schedule.date).getDate()}</Text>
                                {schedule.isAllDay ? (
                                    <Text style={styles.timeText}>하루종일</Text>
                                ) : (
                                    <>
                                        <Text style={styles.timeText}>{formatTime(schedule.startTime)}</Text>
                                        <Text style={styles.timeText}>{formatTime(schedule.endTime)}</Text>
                                    </>
                                )}
                            </View>

                            {/* 우측 컨텐츠 영역 */}
                            <View style={styles.contentArea}>
                                <View style={styles.titleRow}>
                                    <Text style={styles.title} numberOfLines={1}>
                                        {schedule.title}
                                    </Text>
                                    {schedule.repeatDays && schedule.repeatDays.length > 0 && (
                                        <View style={styles.repeatChip}>
                                            <Ionicons name="repeat-outline" size={12} color={Colors.primary} />
                                            <Text style={styles.repeatChipText}>반복</Text>
                                        </View>
                                    )}
                                    <View>
                                        <TouchableOpacity
                                            style={styles.menuButton}
                                            onPress={(e) => handleMenuPress(e, schedule)}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <Ionicons name="ellipsis-horizontal" size={20} color={Colors.text.secondary} />
                                        </TouchableOpacity>

                                        {/* 버튼 바로 아래 드롭다운 메뉴 */}
                                        {menuVisible && selectedSchedule?.id === schedule.id && (
                                            <View style={styles.dropdownMenu}>
                                                <TouchableOpacity
                                                    style={styles.dropdownItem}
                                                    onPress={handleEdit}
                                                >
                                                    <Ionicons name="pencil-outline" size={16} color={Colors.text.main} />
                                                    <Text style={styles.dropdownText}>수정</Text>
                                                </TouchableOpacity>
                                                <View style={styles.dropdownDivider} />
                                                <TouchableOpacity
                                                    style={styles.dropdownItem}
                                                    onPress={handleDelete}
                                                >
                                                    <Ionicons name="trash-outline" size={16} color={Colors.schedule.delete} />
                                                    <Text style={[styles.dropdownText, styles.deleteText]}>삭제</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {schedule.memo && (
                                    <Text style={styles.memo} numberOfLines={2}>
                                        {schedule.memo}
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text.main,
    },
    badge: {
        backgroundColor: Colors.primary,
        minWidth: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: Colors.text.white,
    },
    // 빈 상태
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        backgroundColor: '#F7F8FA',
        borderRadius: 24,
        marginTop: 10,
    },
    emptyIconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        ...shadowPresets.small,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.main,
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginBottom: 28,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        backgroundColor: Colors.primary,
        borderRadius: 30,
        gap: 8,
        ...shadowPresets.large,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text.white,
    },
    // 일정 카드 리스트
    scheduleList: {
        gap: 16,
    },
    card: {
        backgroundColor: Colors.background.card,
        borderRadius: 20,
        padding: 18,
        flexDirection: 'row',
        ...shadowPresets.card,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        minHeight: 100,
    },
    leftSection: {
        width: 85,
        borderRightWidth: 1,
        borderRightColor: '#EEEEEE',
        paddingRight: 16,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    dayOfWeek: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginBottom: 4,
    },
    dateNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text.main,
        marginBottom: 8,
    },
    timeText: {
        fontSize: 13,
        fontWeight: '500',
        color: Colors.text.secondary,
        lineHeight: 18,
    },
    contentArea: {
        flex: 1,
        paddingLeft: 16,
        justifyContent: 'flex-start',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
        position: 'relative',
        zIndex: 1,
    },
    title: {
        flex: 1,
        fontSize: 17,
        fontWeight: 'bold',
        color: Colors.text.main,
        lineHeight: 24,
    },
    repeatChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background.scheduleHighlight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    repeatChipText: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.primary,
    },
    menuButton: {
        padding: 4,
    },
    memo: {
        fontSize: 14,
        color: Colors.text.secondary,
        lineHeight: 20,
    },
    // 드롭다운 메뉴
    dropdownMenu: {
        position: 'absolute',
        top: 30,
        right: -5,
        backgroundColor: Colors.background.card,
        borderRadius: 10,
        width: 110,
        ...shadowPresets.large,
        zIndex: 9999,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        gap: 8,
    },
    dropdownText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.main,
    },
    deleteText: {
        color: Colors.schedule.delete,
    },
    dropdownDivider: {
        height: 1,
        backgroundColor: Colors.background.neon,
    },
});

export default ScheduleListSection;