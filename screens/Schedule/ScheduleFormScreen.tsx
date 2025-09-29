// screens/Schedule/ScheduleFormScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
    Alert,
    FlatList,
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
import { useThemeColor } from '@/hooks/useThemeColor';
import { useScheduleStore } from '@/store/scheduleStore';
import FormRow from '@/components/schedule/FormRow';
import TimePickerModal from '@/components/schedule/TimePickerModal';
import { BRAND_COLORS } from '@/utils/constants';

interface DayOfWeek {
    key: string;
    label: string;
    isSelected: boolean;
}

const ScheduleFormScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const isEditMode = params.mode === 'edit';

    // Zustand store
    const { addSchedule, updateSchedule, deleteSchedule } = useScheduleStore();

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

    // 테마 색상
    const backgroundColor = useThemeColor({}, 'background');
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');
    const textColor = useThemeColor({}, 'text');
    const inputBorderColor = useThemeColor({}, 'border');

    // 반복 요일 데이터
    const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([
        { key: 'M', label: '월', isSelected: false },
        { key: 'T', label: '화', isSelected: false },
        { key: 'W', label: '수', isSelected: false },
        { key: 'Th', label: '목', isSelected: false },
        { key: 'F', label: '금', isSelected: false },
        { key: 'Sa', label: '토', isSelected: false },
        { key: 'Su', label: '일', isSelected: false },
    ]);

    // 데이터 로드 (수정 모드 시)
    useEffect(() => {
        if (isEditMode && params.title) {
            setTitle(params.title as string);
            setIsAllDay(params.isAllDay === 'true');
            setDate(new Date(params.date as string));
            setStartTime(params.startTime as string);
            setEndTime(params.endTime as string);
            setMemo(params.memo as string || '');
        } else if (params.presetDate) {
            // 미리 설정된 날짜가 있으면 설정
            setDate(new Date(params.presetDate as string));
        }
    }, [isEditMode, params]);

    // 요일 토글 핸들러
    const handleToggleDay = useCallback((key: string) => {
        setSelectedDays(prevDays =>
            prevDays.map(day =>
                day.key === key ? { ...day, isSelected: !day.isSelected } : day
            )
        );
    }, []);

    // 저장 핸들러
    const handleSave = useCallback(async () => {
        if (!title.trim()) {
            Alert.alert('알림', '제목을 입력해주세요.');
            return;
        }

        const scheduleData = {
            id: isEditMode ? (params.scheduleId as string) : Date.now().toString(),
            title,
            isAllDay,
            date: date.toISOString().split('T')[0],
            startTime,
            endTime,
        };

        try {
            if (isEditMode) {
                updateSchedule(scheduleData.id, scheduleData);
                Alert.alert('알림', '일정이 수정되었습니다.');
            } else {
                addSchedule(scheduleData);
                Alert.alert('알림', '일정이 저장되었습니다.');
            }
            router.back();
        } catch (e) {
            Alert.alert('오류', '저장에 실패했습니다.');
        }
    }, [title, isAllDay, date, startTime, endTime, isEditMode, params, addSchedule, updateSchedule]);

    // 삭제 핸들러
    const handleDelete = useCallback(() => {
        Alert.alert('삭제 확인', '정말 이 일정을 삭제하시겠습니까?', [
            { text: '취소', style: 'cancel' },
            {
                text: '삭제',
                style: 'destructive',
                onPress: () => {
                    if (params.scheduleId) {
                        deleteSchedule(params.scheduleId as string);
                        Alert.alert('알림', '일정이 삭제되었습니다.');
                        router.back();
                    }
                },
            },
        ]);
    }, [params.scheduleId, deleteSchedule]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            {/* Time Picker Modals */}
            <TimePickerModal
                visible={showStartTimePicker}
                time={startTime}
                onSelect={setStartTime}
                onClose={() => setShowStartTimePicker(false)}
            />
            <TimePickerModal
                visible={showEndTimePicker}
                time={endTime}
                onSelect={setEndTime}
                onClose={() => setShowEndTimePicker(false)}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={router.back} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color={textColor} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: textColor }]}>
                    {isEditMode ? '일정 수정' : '새 일정'}
                </Text>
                <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                    <Text style={styles.saveButtonText}>저장</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* 일정 제목 */}
                <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
                    <TextInput
                        style={[styles.titleInput, { color: textColor }]}
                        placeholder="일정 제목"
                        placeholderTextColor={inputBorderColor}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* 시간 설정 */}
                <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
                    <FormRow label="종일" isSwitch>
                        <Switch
                            trackColor={{ false: inputBorderColor, true: BRAND_COLORS.green }}
                            thumbColor="white"
                            onValueChange={setIsAllDay}
                            value={isAllDay}
                        />
                    </FormRow>
                    <FormRow label="날짜">
                        <TouchableOpacity>
                            <Text style={{ color: textColor }}>
                                {date.toLocaleDateString('ko-KR')}
                            </Text>
                        </TouchableOpacity>
                    </FormRow>
                    {!isAllDay && (
                        <>
                            <FormRow label="시작 시간">
                                <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
                                    <Text style={{ color: textColor }}>{startTime}</Text>
                                </TouchableOpacity>
                            </FormRow>
                            <FormRow label="종료 시간">
                                <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
                                    <Text style={{ color: textColor }}>{endTime}</Text>
                                </TouchableOpacity>
                            </FormRow>
                        </>
                    )}
                </View>

                {/* 반복 설정 */}
                <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>반복 설정</Text>
                    <View style={styles.daySelectionContainer}>
                        <FlatList
                            data={selectedDays}
                            renderItem={({ item }) => (
                                <TouchableOpacity
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
                            )}
                            keyExtractor={(item) => item.key}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.daySelectionList}
                        />
                    </View>
                </View>

                {/* 메모 입력 */}
                <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>메모</Text>
                    <TextInput
                        style={[styles.memoInput, { color: textColor, borderColor: inputBorderColor }]}
                        placeholder="메모를 입력하세요..."
                        placeholderTextColor={inputBorderColor}
                        multiline
                        value={memo}
                        onChangeText={setMemo}
                    />
                </View>

                {/* 삭제 버튼 (수정 모드 시에만) */}
                {isEditMode && (
                    <View style={styles.deleteContainer}>
                        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                            <Ionicons name="trash-bin-outline" size={20} color="#FF6B6B" />
                            <Text style={styles.deleteButtonText}>일정 삭제</Text>
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
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: BRAND_COLORS.green,
    },
    scrollView: {
        padding: 10,
    },
    card: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
    },
    titleInput: {
        fontSize: 20,
        fontWeight: '700',
        paddingBottom: 5,
    },
    memoInput: {
        minHeight: 100,
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top',
        fontSize: 15,
    },
    daySelectionContainer: {
        marginTop: 5,
    },
    daySelectionList: {
        justifyContent: 'space-between',
    },
    dayButton: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    dayButtonSelected: {
        backgroundColor: BRAND_COLORS.green,
        borderColor: BRAND_COLORS.green,
    },
    dayText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    dayTextSelected: {
        color: 'white',
    },
    deleteContainer: {
        padding: 10,
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
});

export default ScheduleFormScreen;