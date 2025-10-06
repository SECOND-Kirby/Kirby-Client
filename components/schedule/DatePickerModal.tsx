// components/schedule/DatePickerModal.tsx
import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Colors } from '@/constants/Colors';

interface DatePickerModalProps {
    visible: boolean;
    date: Date;
    onSelect: (date: Date) => void;
    onClose: () => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
                                                             visible,
                                                             date,
                                                             onSelect,
                                                             onClose,
                                                         }) => {
    const [selectedYear, setSelectedYear] = useState(date.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
    const [selectedDay, setSelectedDay] = useState(date.getDate());

    // 모달이 열릴 때마다 props의 date로 state 초기화
    React.useEffect(() => {
        if (visible) {
            setSelectedYear(date.getFullYear());
            setSelectedMonth(date.getMonth());
            setSelectedDay(date.getDate());
        }
    }, [visible, date]);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
    const months = Array.from({ length: 12 }, (_, i) => i);
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'];

    const handleConfirm = () => {
        const newDate = new Date(selectedYear, selectedMonth, selectedDay);
        onSelect(newDate);
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.cancelText}>취소</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>날짜 선택</Text>
                        <TouchableOpacity onPress={handleConfirm}>
                            <Text style={styles.confirmText}>완료</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.pickerContainer}>
                        {/* Year Picker */}
                        <View style={styles.pickerColumn}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {years.map((year) => (
                                    <TouchableOpacity
                                        key={year}
                                        style={styles.pickerItem}
                                        onPress={() => setSelectedYear(year)}
                                    >
                                        <Text
                                            style={[
                                                styles.pickerText,
                                                selectedYear === year && styles.selectedPickerText
                                            ]}
                                        >
                                            {year}년
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Month Picker */}
                        <View style={styles.pickerColumn}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {months.map((month) => (
                                    <TouchableOpacity
                                        key={month}
                                        style={styles.pickerItem}
                                        onPress={() => setSelectedMonth(month)}
                                    >
                                        <Text
                                            style={[
                                                styles.pickerText,
                                                selectedMonth === month && styles.selectedPickerText
                                            ]}
                                        >
                                            {monthNames[month]}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Day Picker */}
                        <View style={styles.pickerColumn}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {days.map((day) => (
                                    <TouchableOpacity
                                        key={day}
                                        style={styles.pickerItem}
                                        onPress={() => setSelectedDay(day)}
                                    >
                                        <Text
                                            style={[
                                                styles.pickerText,
                                                selectedDay === day && styles.selectedPickerText
                                            ]}
                                        >
                                            {day}일
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: Colors.background.modalOverlay,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.background.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '50%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    cancelText: {
        fontSize: 16,
        color: Colors.text.secondary,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.main,
    },
    confirmText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary,
    },
    pickerContainer: {
        flexDirection: 'row',
        height: 250,
        padding: 20,
    },
    pickerColumn: {
        flex: 1,
    },
    pickerItem: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    pickerText: {
        fontSize: 16,
        color: Colors.text.secondary,
    },
    selectedPickerText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 18,
    },
});

export default DatePickerModal;