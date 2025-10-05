// components/schedule/TimePickerModal.tsx
import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from 'react-native';
import { Colors } from '@/constants/Colors';

interface TimePickerModalProps {
    visible: boolean;
    time: string;
    onSelect: (time: string) => void;
    onClose: () => void;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({
                                                             visible,
                                                             time,
                                                             onSelect,
                                                             onClose,
                                                         }) => {
    const generateTimeList = (): string[] => {
        const times: string[] = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const hourStr = hour.toString().padStart(2, '0');
                const minuteStr = minute.toString().padStart(2, '0');
                times.push(`${hourStr}:${minuteStr}`);
            }
        }
        return times;
    };

    const timeList = generateTimeList();

    const handleConfirm = () => {
        onSelect(time);
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
                        <Text style={styles.modalTitle}>시간 선택</Text>
                        <TouchableOpacity onPress={handleConfirm}>
                            <Text style={styles.confirmText}>완료</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={timeList}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.timeItem}
                                onPress={() => onSelect(item)}
                            >
                                <Text
                                    style={[
                                        styles.timeText,
                                        item === time && styles.selectedTimeText
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={true}
                        initialScrollIndex={timeList.indexOf(time)}
                        getItemLayout={(data, index) => ({
                            length: 50,
                            offset: 50 * index,
                            index,
                        })}
                    />
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
        maxHeight: '60%',
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
    timeItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.background.neon,
        alignItems: 'center',
    },
    timeText: {
        fontSize: 17,
        color: Colors.text.main,
    },
    selectedTimeText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 19,
    },
});

export default TimePickerModal;