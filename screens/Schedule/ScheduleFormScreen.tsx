// screens/Schedule/ScheduleFormScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { useScheduleStore } from '@/store/scheduleStore';
import { useAlert } from '@/hooks';
import TimePickerModal from '@/components/schedule/TimePickerModal';
import DatePickerModal from '@/components/schedule/DatePickerModal';
import ScreenHeader from '@/components/shared/layout/ScreenHeader';
import { DayOfWeek, DAY_OF_WEEK_OPTIONS, RepeatDay } from '@/types/schedule';

const ScheduleFormScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const isEditMode = params.mode === 'edit';

    const { addSchedule, updateSchedule, deleteSchedule } = useScheduleStore();
    const { showAlert, showConfirm } = useAlert();

    const [title, setTitle] = useState('');
    const [isAllDay, setIsAllDay] = useState(false);
    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [memo, setMemo] = useState('');

    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(DAY_OF_WEEK_OPTIONS);

    useEffect(() => {
        if (isEditMode && params.title) {
            setTitle(params.title as string);
            setIsAllDay(params.isAllDay === 'true');
            setDate(new Date(params.date as string));
            setStartTime(params.startTime as string);
            setEndTime(params.endTime as string);
            setMemo(params.memo as string || '');

            if (params.repeatDays) {
                const repeatDaysArray = (params.repeatDays as string).split(',') as RepeatDay[];
                setSelectedDays(prev =>
                    prev.map(day => ({
                        ...day,
                        isSelected: repeatDaysArray.includes(day.key)
                    }))
                );
            }
        } else if (params.presetDate) {
            setDate(new Date(params.presetDate as string));
        }
    }, [isEditMode, params]);

    const handleToggleDay = useCallback((key: RepeatDay) => {
        setSelectedDays(prev =>
            prev.map(day =>
                day.key === key ? { ...day, isSelected: !day.isSelected } : day
            )
        );
    }, []);

    const handleSave = useCallback(async () => {
        if (!title.trim()) {
            showAlert('알림', '제목을 입력해주세요.');
            return;
        }

        const repeatDays = selectedDays
            .filter(day => day.isSelected)
            .map(day => day.key);

        // 로컬 타임존 기준으로 날짜 문자열 생성
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        const scheduleData = {
            id: isEditMode ? (params.scheduleId as string) : Date.now().toString(),
            title,
            isAllDay,
            date: dateString,
            startTime,
            endTime,
            memo,
            repeatDays: repeatDays.length > 0 ? repeatDays : undefined,
        };

        try {
            if (isEditMode) {
                updateSchedule(scheduleData.id, scheduleData);
                showAlert('알림', '일정이 수정되었습니다.', () => router.back());
            } else {
                addSchedule(scheduleData);
                showAlert('알림', '일정이 저장되었습니다.', () => router.back());
            }
        } catch (e) {
            showAlert('오류', '저장에 실패했습니다.');
        }
    }, [title, isAllDay, date, startTime, endTime, memo, selectedDays, isEditMode, params, addSchedule, updateSchedule, showAlert]);

    const handleDelete = useCallback(() => {
        showConfirm(
            '삭제 확인',
            '정말 이 일정을 삭제하시겠습니까?',
            () => {
                if (params.scheduleId) {
                    deleteSchedule(params.scheduleId as string);
                    showAlert('알림', '일정이 삭제되었습니다.', () => router.back());
                }
            },
            '삭제',
            '취소',
            true
        );
    }, [params.scheduleId, deleteSchedule, showAlert, showConfirm]);

    const formatDateDisplay = (date: Date): string => {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <DatePickerModal
                visible={showDatePicker}
                date={date}
                onSelect={(newDate) => setDate(newDate)}
                onClose={() => setShowDatePicker(false)}
            />
            <TimePickerModal
                visible={showStartTimePicker}
                time={startTime}
                onSelect={(newTime) => setStartTime(newTime)}
                onClose={() => setShowStartTimePicker(false)}
            />
            <TimePickerModal
                visible={showEndTimePicker}
                time={endTime}
                onSelect={(newTime) => setEndTime(newTime)}
                onClose={() => setShowEndTimePicker(false)}
            />

            <ScreenHeader
                title={isEditMode ? '일정 수정' : '일정 생성'}
                showBack={true}
            />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* 제목 */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>제목</Text>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="일정 제목을 입력하세요"
                        placeholderTextColor={Colors.text.secondary}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* 날짜 */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>날짜</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Ionicons name="calendar-outline" size={20} color={Colors.text.main} />
                        <Text style={styles.dateButtonText}>
                            {formatDateDisplay(date)}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
                    </TouchableOpacity>
                </View>

                {/* 하루종일 */}
                <View style={styles.section}>
                    <View style={styles.switchRow}>
                        <Text style={styles.sectionLabel}>하루종일</Text>
                        <Switch
                            trackColor={{ false: Colors.border, true: Colors.primary }}
                            thumbColor={Colors.background.card}
                            onValueChange={setIsAllDay}
                            value={isAllDay}
                        />
                    </View>
                </View>

                {/* 시간 */}
                {!isAllDay && (
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>시간</Text>
                        <View style={styles.timeRow}>
                            <View style={styles.timeColumn}>
                                <Text style={styles.timeLabel}>시작</Text>
                                <TouchableOpacity
                                    style={styles.timeButton}
                                    onPress={() => setShowStartTimePicker(true)}
                                >
                                    <Text style={styles.timeButtonText}>{startTime}</Text>
                                    <Ionicons name="chevron-down" size={20} color={Colors.text.secondary} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.timeSeparator}>~</Text>
                            <View style={styles.timeColumn}>
                                <Text style={styles.timeLabel}>종료</Text>
                                <TouchableOpacity
                                    style={styles.timeButton}
                                    onPress={() => setShowEndTimePicker(true)}
                                >
                                    <Text style={styles.timeButtonText}>{endTime}</Text>
                                    <Ionicons name="chevron-down" size={20} color={Colors.text.secondary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* 반복 설정 */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>반복 설정</Text>
                    <View style={styles.daySelectionContainer}>
                        {selectedDays.map((item) => (
                            <TouchableOpacity
                                key={item.key}
                                style={[
                                    styles.dayButton,
                                    item.isSelected && styles.dayButtonSelected,
                                ]}
                                onPress={() => handleToggleDay(item.key)}
                            >
                                <Text
                                    style={[
                                        styles.dayText,
                                        item.isSelected && styles.dayTextSelected
                                    ]}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 메모 */}
                <View style={styles.section}>
                    <View style={styles.memoHeader}>
                        <Text style={styles.sectionLabel}>메모</Text>
                        <Text style={styles.charCount}>{memo.length}/500</Text>
                    </View>
                    <TextInput
                        style={styles.memoInput}
                        placeholder="메모를 입력하세요 (선택사항)"
                        placeholderTextColor={Colors.text.secondary}
                        multiline
                        value={memo}
                        onChangeText={setMemo}
                        maxLength={500}
                    />
                </View>

                {/* 저장 버튼 */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>
                        {isEditMode ? '일정 수정' : '스케줄 생성'}
                    </Text>
                </TouchableOpacity>

                {/* 삭제 버튼 (수정 모드일 때만) */}
                {isEditMode && (
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                        <Text style={styles.deleteButtonText}>일정 삭제</Text>
                    </TouchableOpacity>
                )}

                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text.main,
        marginBottom: 10,
    },
    titleInput: {
        height: 52,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        color: Colors.text.main,
        backgroundColor: Colors.background.card,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 52,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        paddingHorizontal: 16,
        backgroundColor: Colors.background.card,
    },
    dateButtonText: {
        flex: 1,
        fontSize: 15,
        color: Colors.text.main,
        marginLeft: 12,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    timeColumn: {
        flex: 1,
    },
    timeLabel: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginBottom: 8,
    },
    timeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 52,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        paddingHorizontal: 16,
        backgroundColor: Colors.background.card,
    },
    timeButtonText: {
        fontSize: 15,
        color: Colors.text.main,
    },
    timeSeparator: {
        fontSize: 16,
        color: Colors.text.secondary,
        marginHorizontal: 12,
        marginTop: 28,
    },
    daySelectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    dayButton: {
        flex: 1,
        height: 44,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background.card,
    },
    dayButtonSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    dayText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text.main,
    },
    dayTextSelected: {
        color: Colors.text.white,
        fontWeight: '600',
    },
    memoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    charCount: {
        fontSize: 13,
        color: Colors.text.secondary,
    },
    memoInput: {
        minHeight: 120,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        padding: 16,
        textAlignVertical: 'top',
        fontSize: 15,
        color: Colors.text.main,
        backgroundColor: Colors.background.card,
    },
    saveButton: {
        marginHorizontal: 20,
        height: 54,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    saveButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.text.white,
    },
    deleteButton: {
        marginHorizontal: 20,
        height: 54,
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: Colors.schedule.delete,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.schedule.delete,
    },
});

export default ScheduleFormScreen;