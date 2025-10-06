// components/training/EndTrainingModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface EndTrainingModalProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const EndTrainingModal: React.FC<EndTrainingModalProps> = ({
                                                               visible,
                                                               onCancel,
                                                               onConfirm,
                                                           }) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                    <Text style={styles.modalTitle}>훈련을 종료하시겠습니까?</Text>
                    <Text style={styles.modalDesc}>현재까지의 훈련 기록이 저장됩니다.</Text>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalCancel}
                            onPress={onCancel}
                        >
                            <Text style={styles.modalCancelText}>취소</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalConfirm}
                            onPress={onConfirm}
                        >
                            <Text style={styles.modalConfirmText}>종료</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: Colors.background.modalOverlay,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    modalCard: {
        width: '100%',
        maxWidth: 380,
        borderRadius: 16,
        backgroundColor: Colors.background.card,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
        color: Colors.text.dark,
    },
    modalDesc: {
        fontSize: 14,
        color: Colors.text.medium,
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'flex-end',
    },
    modalCancel: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: Colors.button.lightGray,
    },
    modalConfirm: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: Colors.button.darkGray,
    },
    modalCancelText: {
        color: Colors.training.reset,
        fontWeight: '600',
    },
    modalConfirmText: {
        color: Colors.text.white,
        fontWeight: '600',
    },
});

export default EndTrainingModal;