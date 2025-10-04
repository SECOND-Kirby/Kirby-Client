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
import { Colors } from '@/constants/Colors';
import { useScheduleStore } from '@/store/scheduleStore';
import FormRow from '@/components/schedule/FormRow';
import TimePickerModal from '@/components/schedule/TimePickerModal';

interface DayOfWeek {
    key: string;
    label: string;
    isSelected: boolean;
}

const ScheduleFormScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const isEditMode = params.mode === 'edit';

    const { addSchedule, updateSchedule, deleteSchedule } = useScheduleStore();

    const [title, setTitle] = useState('');
    const [isAllDay, setIsAllDay] = useState(false);
    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [memo, setMemo] = useState('');

    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([
        { key: 'M', label: '월', isSelected: false },
        { key: 'T', label: '화', isSelected: false },
        { key: 'W', label: '수', isSelected: false },
        { key: 'Th', label: '목', isSelected: false },
        { key: 'F', label: '금', isSelected: false },
        { key: 'Sa', label: '토', isSelected: false },
        { key: 'Su', label: '일', isSelected: false },
    ]);

    useEffect(() => {
        if (isEditMode && params.title) {
            setTitle(params.title as string);
            setIsAllDay(params.isAllDay === 'true');
            setDate(new Date(params.date as string));
            setStartTime(params.startTime as string);
            setEndTime(params.endTime as string);
            setMemo(params.memo as string || '');
        } else if (params.presetDate) {
            setDate(new Date(params.presetDate as string));
        }
    }, [isEditMode, params]);

    const handleToggleDay = useCallback((key: string) => {
        setSelectedDays(prevDays =>
            prevDays.map(day =>
                day.key === key ? { ...day, isSelected: !day.isSelected } : day
            )
        );
    }, []);

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
        <SafeAreaView style={styles.container}>
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

            <View style={styles.header}>
                <TouchableOpacity onPress={router.back} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color={Colors.text.main} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {isEditMode ? '일정 수정' : '새 일정'}
                </Text>
                <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                    <Text style={styles.saveButtonText}>저장</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="일정 제목"
                        placeholderTextColor={Colors.text.secondary}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.card}>
                    <FormRow label="종일" isSwitch>
                        <Switch
                            trackColor={{ false: Colors.border, true: Colors.primary }}
                            thumbColor={Colors.background.card}
                            onValueChange={setIsAllDay}
                            value={isAllDay}
                        />
                    </FormRow>
                    <FormRow label="날짜">
                        <TouchableOpacity>
                            <Text style={{ color: Colors.text.main }}>
                                {date.toLocaleDateString('ko-KR')}
                            </Text>
                        </TouchableOpacity>
                    </FormRow>
                    {!isAllDay && (
                        <>
                            <FormRow label="시작 시간">
                                <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
                                    <Text style={{ color: Colors.text.main }}>{startTime}</Text>
                                </TouchableOpacity>
                            </FormRow>
                            <FormRow label="종료 시간">
                                <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
                                    <Text style={{ color: Colors.text.main }}>{endTime}</Text>
                                </TouchableOpacity>
                            </FormRow>
                        </>
                    )}
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>반복 설정</Text>
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

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>메모</Text>
                    <TextInput
                        style={styles.memoInput}
                        placeholder="메모를 입력하세요..."
                        placeholderTextColor={Colors.text.secondary}
                        multiline
                        value={memo}
                        onChangeText={setMemo}
                    />
                </View>

                {isEditMode && (
                    <View style={styles.deleteContainer}>
                        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                            <Ionicons name="trash-bin-outline" size={20} color={Colors.schedule.delete} />
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
        backgroundColor: Colors.background.main,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.menu.border,
    },
    headerButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.main,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary,
    },
    scrollView: {
        padding: 10,
    },
    card: {
        backgroundColor: Colors.background.card,
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
        color: Colors.text.main,
        marginBottom: 10,
    },
    titleInput: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text.main,
        paddingBottom: 5,
    },
    memoInput: {
        minHeight: 100,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top',
        fontSize: 15,
        color: Colors.text.main,
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
        borderColor: Colors.border,
        marginRight: 8,
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
        backgroundColor: Colors.schedule.deleteBackground,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.schedule.delete,
        minHeight: 50,
        minWidth: 150,
        justifyContent: 'center',
    },
    deleteButtonText: {
        fontSize: 16,
        color: Colors.schedule.delete,
        marginLeft: 8,
        fontWeight: '500',
    },
});

export default ScheduleFormScreen;