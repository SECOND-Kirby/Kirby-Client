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
                            <Text style={styles.modalCancelText}>취소</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>시간 선택</Text>
                        <TouchableOpacity onPress={() => { onSelect(time); onClose(); }}>
                            <Text style={styles.modalDoneText}>완료</Text>
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
        borderBottomColor: Colors.menu.border,
    },
    modalCancelText: {
        fontSize: 16,
        color: Colors.text.secondary,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.main,
    },
    modalDoneText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary,
    },
    timeItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.background.neon,
        alignItems: 'center',
    },
    timeText: {
        fontSize: 18,
        color: Colors.text.main,
    },
    selectedTimeText: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
});

export default TimePickerModal;