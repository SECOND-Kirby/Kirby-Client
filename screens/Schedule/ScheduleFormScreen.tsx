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
import UpdateScopeModal from '@/components/schedule/UpdateScopeModal';
import ScreenHeader from '@/components/shared/layout/ScreenHeader';
import { DayOfWeek, DAY_OF_WEEK_OPTIONS, RepeatDay, UpdateScope, DeleteScope } from '@/types/schedule';

const ScheduleFormScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const isEditMode = params.mode === 'edit';
    const isRepeating = params.isRepeating === 'true';

    const { addSchedule, updateSchedule, deleteSchedule } = useScheduleStore();
    const { showAlert, showConfirm } = useAlert();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        isAllDay: false,
        date: new Date(),
        startTime: '09:00',
        endTime: '10:00',
        memo: '',
    });

    const [repeatConfig, setRepeatConfig] = useState({
        selectedDays: [...DAY_OF_WEEK_OPTIONS],
        repeatEndDate: null as Date | null,
    });

    // Modal State
    const [modals, setModals] = useState({
        startTime: false,
        endTime: false,
        date: false,
        repeatEndDate: false,
        updateScope: false,
        deleteScope: false,
    });

    const [pendingSaveData, setPendingSaveData] = useState<any>(null);

    // 초기 데이터 로드
    useEffect(() => {
        if (isEditMode && params.scheduleId) {
            loadEditData();
        } else if (params.presetDate) {
            setFormData(prev => ({
                ...prev,
                date: new Date(params.presetDate as string)
            }));
        }
    }, [isEditMode, params.scheduleId]);

    const loadEditData = () => {
        const updates: any = {};

        if (params.title) updates.title = params.title as string;
        if (params.isAllDay !== undefined) updates.isAllDay = params.isAllDay === 'true';
        if (params.memo) updates.memo = params.memo as string;
        if (params.date) updates.date = new Date(params.date as string);

        if (params.startTime) {
            const timeStr = params.startTime as string;
            updates.startTime = timeStr.substring(0, 5);
        }

        if (params.endTime) {
            const timeStr = params.endTime as string;
            updates.endTime = timeStr.substring(0, 5);
        }

        setFormData(prev => ({ ...prev, ...updates }));

        // 반복 설정 로드
        if (params.repeatDays && params.repeatDays !== '') {
            const repeatDaysArray = (params.repeatDays as string)
                .split(',')
                .filter(d => d.trim()) as RepeatDay[];

            setRepeatConfig(prev => ({
                ...prev,
                selectedDays: prev.selectedDays.map(day => ({
                    ...day,
                    isSelected: repeatDaysArray.includes(day.key)
                }))
            }));
        }

        if (params.repeatEndDate && params.repeatEndDate !== '') {
            setRepeatConfig(prev => ({
                ...prev,
                repeatEndDate: new Date(params.repeatEndDate as string)
            }));
        }
    };

    // Modal 토글 헬퍼
    const toggleModal = (modalName: keyof typeof modals, value?: boolean) => {
        setModals(prev => ({
            ...prev,
            [modalName]: value !== undefined ? value : !prev[modalName]
        }));
    };

    // Form 업데이트 헬퍼
    const updateFormData = <K extends keyof typeof formData>(
        key: K,
        value: typeof formData[K]
    ) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleToggleDay = useCallback((key: RepeatDay) => {
        setRepeatConfig(prev => ({
            ...prev,
            selectedDays: prev.selectedDays.map(day =>
                day.key === key ? { ...day, isSelected: !day.isSelected } : day
            )
        }));
    }, []);

    // Date/Time Formatters
    const formatDate = (d: Date): string => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDateDisplay = (d: Date): string => {
        return d.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
    };

    // Selection Handlers
    const handleDateSelect = useCallback((newDate: Date) => {
        updateFormData('date', newDate);
        toggleModal('date', false);
    }, []);

    const handleRepeatEndDateSelect = useCallback((newDate: Date) => {
        setRepeatConfig(prev => ({ ...prev, repeatEndDate: newDate }));
        toggleModal('repeatEndDate', false);
    }, []);

    const handleStartTimeSelect = useCallback((time: string) => {
        updateFormData('startTime', time);
        toggleModal('startTime', false);
    }, []);

    const handleEndTimeSelect = useCallback((time: string) => {
        updateFormData('endTime', time);
        toggleModal('endTime', false);
    }, []);

    // Validation
    const validateForm = (): string | null => {
        if (!formData.title.trim()) {
            return '제목을 입력해주세요.';
        }

        const repeatDays = repeatConfig.selectedDays.filter(d => d.isSelected);

        if (repeatDays.length > 0 && !repeatConfig.repeatEndDate) {
            return '반복 종료 날짜를 선택해주세요.';
        }

        if (repeatDays.length > 0 && repeatConfig.repeatEndDate) {
            if (repeatConfig.repeatEndDate <= formData.date) {
                return '반복 종료 날짜는 시작 날짜 이후여야 합니다.';
            }
        }

        if (!formData.isAllDay && formData.startTime >= formData.endTime) {
            return '종료 시간은 시작 시간보다 늦어야 합니다.';
        }

        return null;
    };

    // Save Handler
    const handleSave = useCallback(async () => {
        const error = validateForm();
        if (error) {
            showAlert('알림', error);
            return;
        }

        const repeatDays = repeatConfig.selectedDays
            .filter(day => day.isSelected)
            .map(day => day.key);

        const scheduleData = {
            id: isEditMode ? (params.scheduleId as string) : undefined,
            title: formData.title,
            isAllDay: formData.isAllDay,
            date: formatDate(formData.date),
            startTime: formData.startTime + ':00',
            endTime: formData.endTime + ':00',
            memo: formData.memo,
            repeatDays: repeatDays.length > 0 ? repeatDays : undefined,
            repeatEndDate: repeatConfig.repeatEndDate ? formatDate(repeatConfig.repeatEndDate) : undefined,
        };

        if (isEditMode && isRepeating) {
            setPendingSaveData(scheduleData);
            toggleModal('updateScope', true);
        } else {
            await saveSchedule(scheduleData);
        }
    }, [formData, repeatConfig, isEditMode, isRepeating, params.scheduleId]);

    const saveSchedule = async (data: any, updateScope?: UpdateScope) => {
        try {
            if (isEditMode) {
                await updateSchedule(data.id, data, updateScope || 'THIS_ONLY');
                showAlert('알림', '일정이 수정되었습니다.', () => router.back());
            } else {
                await addSchedule(data);
                showAlert('알림', '일정이 저장되었습니다.', () => router.back());
            }
        } catch (e: any) {
            showAlert('오류', e.message || '저장에 실패했습니다.');
        }
    };

    const handleUpdateScopeSelect = async (scope: UpdateScope) => {
        toggleModal('updateScope', false);
        if (pendingSaveData) {
            await saveSchedule(pendingSaveData, scope);
        }
    };

    // Delete Handlers
    const handleDelete = useCallback(() => {
        if (!params.scheduleId) return;

        if (isRepeating) {
            toggleModal('deleteScope', true);
        } else {
            showConfirm(
                '삭제 확인',
                '정말 이 일정을 삭제하시겠습니까?',
                () => performDelete('THIS_ONLY'),
                '삭제',
                '취소',
                true
            );
        }
    }, [params.scheduleId, isRepeating]);

    const handleDeleteScopeSelect = async (scope: DeleteScope) => {
        toggleModal('deleteScope', false);

        const scopeText = {
            'THIS_ONLY': '이 일정을',
            'THIS_AND_FUTURE': '이후 모든 일정을',
            'ALL': '전체 반복 일정을'
        }[scope];

        showConfirm(
            '삭제 확인',
            `정말 ${scopeText} 삭제하시겠습니까?`,
            () => performDelete(scope),
            '삭제',
            '취소',
            true
        );
    };

    const performDelete = async (scope: DeleteScope) => {
        try {
            await deleteSchedule(params.scheduleId as string, scope);
            showAlert('알림', '일정이 삭제되었습니다.', () => router.back());
        } catch (e: any) {
            showAlert('오류', e.message || '삭제에 실패했습니다.');
        }
    };

    const hasSelectedDays = repeatConfig.selectedDays.some(d => d.isSelected);

    return (
        <SafeAreaView style={styles.container}>
            {/* Modals */}
            <DatePickerModal
                visible={modals.date}
                date={formData.date}
                onSelect={handleDateSelect}
                onClose={() => toggleModal('date', false)}
            />

            <DatePickerModal
                visible={modals.repeatEndDate}
                date={repeatConfig.repeatEndDate || formData.date}
                onSelect={handleRepeatEndDateSelect}
                onClose={() => toggleModal('repeatEndDate', false)}
                minDate={formData.date}
            />

            <TimePickerModal
                visible={modals.startTime}
                time={formData.startTime}
                onSelect={handleStartTimeSelect}
                onClose={() => toggleModal('startTime', false)}
            />

            <TimePickerModal
                visible={modals.endTime}
                time={formData.endTime}
                onSelect={handleEndTimeSelect}
                onClose={() => toggleModal('endTime', false)}
            />

            <UpdateScopeModal
                visible={modals.updateScope}
                isDelete={false}
                onSelect={handleUpdateScopeSelect}
                onClose={() => toggleModal('updateScope', false)}
            />

            <UpdateScopeModal
                visible={modals.deleteScope}
                isDelete={true}
                onSelect={handleDeleteScopeSelect}
                onClose={() => toggleModal('deleteScope', false)}
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
                        value={formData.title}
                        onChangeText={(text) => updateFormData('title', text)}
                    />
                </View>

                {/* 날짜 */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>날짜</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => toggleModal('date', true)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="calendar-outline" size={20} color={Colors.text.main} />
                        <Text style={styles.dateButtonText}>
                            {formatDateDisplay(formData.date)}
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
                            onValueChange={(value) => updateFormData('isAllDay', value)}
                            value={formData.isAllDay}
                        />
                    </View>
                </View>

                {/* 시간 */}
                {!formData.isAllDay && (
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>시간</Text>
                        <View style={styles.timeRow}>
                            <View style={styles.timeColumn}>
                                <Text style={styles.timeLabel}>시작</Text>
                                <TouchableOpacity
                                    style={styles.timeButton}
                                    onPress={() => toggleModal('startTime', true)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.timeButtonText}>{formData.startTime}</Text>
                                    <Ionicons name="chevron-down" size={20} color={Colors.text.secondary} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.timeSeparator}>~</Text>
                            <View style={styles.timeColumn}>
                                <Text style={styles.timeLabel}>종료</Text>
                                <TouchableOpacity
                                    style={styles.timeButton}
                                    onPress={() => toggleModal('endTime', true)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.timeButtonText}>{formData.endTime}</Text>
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
                        {repeatConfig.selectedDays.map((item) => (
                            <TouchableOpacity
                                key={item.key}
                                style={[
                                    styles.dayButton,
                                    item.isSelected && styles.dayButtonSelected,
                                ]}
                                onPress={() => handleToggleDay(item.key)}
                                activeOpacity={0.7}
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

                {/* 반복 종료일 */}
                {hasSelectedDays && (
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>
                            반복 종료일 <Text style={styles.requiredMark}>*</Text>
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.dateButton,
                                !repeatConfig.repeatEndDate && styles.dateButtonEmpty
                            ]}
                            onPress={() => toggleModal('repeatEndDate', true)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="calendar-outline"
                                size={20}
                                color={repeatConfig.repeatEndDate ? Colors.text.main : Colors.text.secondary}
                            />
                            <Text style={[
                                styles.dateButtonText,
                                !repeatConfig.repeatEndDate && styles.dateButtonTextEmpty
                            ]}>
                                {repeatConfig.repeatEndDate
                                    ? formatDateDisplay(repeatConfig.repeatEndDate)
                                    : '반복 종료 날짜를 선택하세요'}
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
                        </TouchableOpacity>
                        <Text style={styles.helpText}>
                            선택한 요일에 해당하는 날짜까지 자동으로 일정이 생성됩니다.
                        </Text>
                    </View>
                )}

                {/* 메모 */}
                <View style={styles.section}>
                    <View style={styles.memoHeader}>
                        <Text style={styles.sectionLabel}>메모</Text>
                        <Text style={styles.charCount}>{formData.memo.length}/500</Text>
                    </View>
                    <TextInput
                        style={styles.memoInput}
                        placeholder="메모를 입력하세요 (선택사항)"
                        placeholderTextColor={Colors.text.secondary}
                        multiline
                        value={formData.memo}
                        onChangeText={(text) => updateFormData('memo', text)}
                        maxLength={500}
                    />
                </View>

                {/* 저장 버튼 */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>
                        {isEditMode ? '일정 수정' : '스케줄 생성'}
                    </Text>
                </TouchableOpacity>

                {/* 삭제 버튼 */}
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
    dateButtonEmpty: {
        borderColor: Colors.schedule.delete,
        borderWidth: 1.5,
    },
    dateButtonText: {
        flex: 1,
        fontSize: 15,
        color: Colors.text.main,
        marginLeft: 12,
    },
    dateButtonTextEmpty: {
        color: Colors.text.secondary,
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
    requiredMark: {
        color: Colors.schedule.delete,
        fontSize: 15,
    },
    helpText: {
        fontSize: 13,
        color: Colors.text.secondary,
        marginTop: 8,
        lineHeight: 18,
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