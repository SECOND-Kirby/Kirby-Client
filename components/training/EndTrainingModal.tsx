// components/training/EndTrainingModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

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
    const resetButtonColor = useThemeColor({}, 'resetButton');

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
                            style={[styles.modalBtn, styles.modalCancel]}
                            onPress={onCancel}
                        >
                            <Text style={[styles.modalBtnText, { color: resetButtonColor }]}>취소</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalBtn, styles.modalConfirm]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.modalBtnText}>종료</Text>
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
        backgroundColor: 'rgba(0,0,0,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    modalCard: {
        width: '100%',
        maxWidth: 380,
        borderRadius: 16,
        backgroundColor: '#fff',
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
        color: '#111',
    },
    modalDesc: {
        fontSize: 14,
        color: '#555',
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'flex-end',
    },
    modalBtn: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    modalCancel: {
        backgroundColor: '#e5e7eb',
    },
    modalConfirm: {
        backgroundColor: '#111827',
    },
    modalBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default EndTrainingModal;