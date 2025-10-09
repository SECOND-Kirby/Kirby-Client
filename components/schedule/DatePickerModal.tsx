// components/schedule/DatePickerModal.tsx
import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native';
import { Colors } from '@/constants/Colors';

interface DatePickerModalProps {
    visible: boolean;
    date: Date;
    onSelect: (date: Date) => void;
    onClose: () => void;
    minDate?: Date;
}

const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

const DatePickerModal: React.FC<DatePickerModalProps> = ({
                                                             visible,
                                                             date,
                                                             onSelect,
                                                             onClose,
                                                             minDate,
                                                         }) => {
    const [selectedYear, setSelectedYear] = useState(date.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
    const [selectedDay, setSelectedDay] = useState(date.getDate());
    const [viewMode, setViewMode] = useState<'year' | 'month' | 'day'>('day');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    useEffect(() => {
        if (visible) {
            setSelectedYear(date.getFullYear());
            setSelectedMonth(date.getMonth());
            setSelectedDay(date.getDate());
            setViewMode('day');
        }
    }, [visible, date]);

    const getDaysInMonth = (year: number, month: number): number => {
        return new Date(year, month + 1, 0).getDate();
    };

    const isDateDisabled = (year: number, month: number, day: number): boolean => {
        if (!minDate) return false;
        const checkDate = new Date(year, month, day);
        const minDateTime = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
        return checkDate < minDateTime;
    };

    const handleYearSelect = (year: number) => {
        setSelectedYear(year);
        setViewMode('month');
    };

    const handleMonthSelect = (month: number) => {
        setSelectedMonth(month);
        setViewMode('day');
    };

    const handleDaySelect = (day: number) => {
        if (!isDateDisabled(selectedYear, selectedMonth, day)) {
            setSelectedDay(day);
        }
    };

    const handleConfirm = () => {
        if (isDateDisabled(selectedYear, selectedMonth, selectedDay)) {
            alert('선택한 날짜는 시작 날짜 이후여야 합니다.');
            return;
        }
        const newDate = new Date(selectedYear, selectedMonth, selectedDay);
        onSelect(newDate);
    };

    const renderYearView = () => {
        return (
            <View style={styles.gridContainer}>
                {years.map((year) => (
                    <TouchableOpacity
                        key={year}
                        style={[
                            styles.gridItem,
                            selectedYear === year && styles.gridItemSelected
                        ]}
                        onPress={() => handleYearSelect(year)}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.gridItemText,
                            selectedYear === year && styles.gridItemTextSelected
                        ]}>
                            {year}년
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderMonthView = () => {
        return (
            <View style={styles.gridContainer}>
                {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                    <TouchableOpacity
                        key={month}
                        style={[
                            styles.gridItem,
                            selectedMonth === month && styles.gridItemSelected
                        ]}
                        onPress={() => handleMonthSelect(month)}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.gridItemText,
                            selectedMonth === month && styles.gridItemTextSelected
                        ]}>
                            {MONTH_NAMES[month]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderDayView = () => {
        const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
        const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        // 빈 칸 추가 (월의 첫 날이 일요일이 아닐 경우)
        const emptyDays = Array.from({ length: firstDay }, (_, i) => null);
        const allDays = [...emptyDays, ...days];

        return (
            <View>
                {/* 요일 헤더 */}
                <View style={styles.dayHeader}>
                    {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                        <View key={index} style={styles.dayHeaderItem}>
                            <Text style={[
                                styles.dayHeaderText,
                                index === 0 && styles.sundayText,
                                index === 6 && styles.saturdayText,
                            ]}>
                                {day}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* 날짜 그리드 */}
                <View style={styles.dayGrid}>
                    {allDays.map((day, index) => {
                        if (day === null) {
                            return <View key={`empty-${index}`} style={styles.dayItem} />;
                        }

                        const isDisabled = isDateDisabled(selectedYear, selectedMonth, day);
                        const isSelected = selectedDay === day;
                        const isToday =
                            new Date().getFullYear() === selectedYear &&
                            new Date().getMonth() === selectedMonth &&
                            new Date().getDate() === day;
                        const dayOfWeek = (index % 7);

                        return (
                            <TouchableOpacity
                                key={day}
                                style={[
                                    styles.dayItem,
                                    isSelected && styles.dayItemSelected,
                                    isToday && !isSelected && styles.dayItemToday,
                                    isDisabled && styles.dayItemDisabled,
                                ]}
                                onPress={() => handleDaySelect(day)}
                                disabled={isDisabled}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.dayItemText,
                                    isSelected && styles.dayItemTextSelected,
                                    isDisabled && styles.dayItemTextDisabled,
                                    !isSelected && !isDisabled && dayOfWeek === 0 && styles.sundayText,
                                    !isSelected && !isDisabled && dayOfWeek === 6 && styles.saturdayText,
                                ]}>
                                    {day}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };

    const getHeaderTitle = () => {
        if (viewMode === 'year') return '연도 선택';
        if (viewMode === 'month') return `${selectedYear}년`;
        return `${selectedYear}년 ${MONTH_NAMES[selectedMonth]}`;
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.modalOverlayTouchable}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <View style={styles.modalContent}>
                    {/* 헤더 */}
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                            <Text style={styles.cancelText}>취소</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                if (viewMode === 'day') setViewMode('month');
                                else if (viewMode === 'month') setViewMode('year');
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.modalTitle}>{getHeaderTitle()}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleConfirm} style={styles.headerButton}>
                            <Text style={styles.confirmText}>완료</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 선택된 날짜 미리보기 */}
                    {viewMode === 'day' && (
                        <View style={styles.previewContainer}>
                            <Text style={[
                                styles.previewText,
                                isDateDisabled(selectedYear, selectedMonth, selectedDay) && styles.invalidPreviewText
                            ]}>
                                {selectedYear}년 {MONTH_NAMES[selectedMonth]} {selectedDay}일
                            </Text>
                            {isDateDisabled(selectedYear, selectedMonth, selectedDay) && (
                                <Text style={styles.warningText}>
                                    시작 날짜 이후를 선택하세요
                                </Text>
                            )}
                        </View>
                    )}

                    {/* 콘텐츠 */}
                    <View style={styles.contentContainer}>
                        {viewMode === 'year' && renderYearView()}
                        {viewMode === 'month' && renderMonthView()}
                        {viewMode === 'day' && renderDayView()}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalOverlayTouchable: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: Colors.background.card,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 20,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerButton: {
        minWidth: 60,
    },
    cancelText: {
        fontSize: 16,
        color: Colors.text.secondary,
        fontWeight: '500',
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.text.main,
    },
    confirmText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary,
        textAlign: 'right',
    },
    previewContainer: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    previewText: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.primary,
        letterSpacing: 0.5,
    },
    invalidPreviewText: {
        color: Colors.schedule.delete,
    },
    warningText: {
        fontSize: 13,
        color: Colors.schedule.delete,
        marginTop: 4,
    },
    contentContainer: {
        padding: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    gridItem: {
        width: '30%',
        aspectRatio: 2,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background.card,
    },
    gridItemSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    gridItemText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.main,
    },
    gridItemTextSelected: {
        color: Colors.text.white,
        fontWeight: '700',
    },
    dayHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    dayHeaderItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    dayHeaderText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.secondary,
    },
    sundayText: {
        color: Colors.days.sunday,
    },
    saturdayText: {
        color: Colors.days.saturday,
    },
    dayGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayItem: {
        width: `${100 / 7}%`,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    dayItemSelected: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
    },
    dayItemToday: {
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 20,
    },
    dayItemDisabled: {
        opacity: 0.3,
    },
    dayItemText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text.main,
    },
    dayItemTextSelected: {
        color: Colors.text.white,
        fontWeight: '700',
    },
    dayItemTextDisabled: {
        color: Colors.text.lightGray,
    },
});

export default DatePickerModal;