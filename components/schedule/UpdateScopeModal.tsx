// components/schedule/UpdateScopeModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { UpdateScope, DeleteScope } from '@/types/schedule';

interface UpdateScopeModalProps {
    visible: boolean;
    isDelete?: boolean;
    onSelect: (scope: UpdateScope | DeleteScope) => void;
    onClose: () => void;
}

const UpdateScopeModal: React.FC<UpdateScopeModalProps> = ({
                                                               visible,
                                                               isDelete = false,
                                                               onSelect,
                                                               onClose,
                                                           }) => {
    const action = isDelete ? '삭제' : '수정';

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{action} 범위 선택</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={Colors.text.secondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.optionList}>
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => onSelect('THIS_ONLY')}
                        >
                            <View style={styles.optionIcon}>
                                <Ionicons name="document-outline" size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.optionText}>
                                <Text style={styles.optionTitle}>이 일정만</Text>
                                <Text style={styles.optionDescription}>
                                    선택한 일정만 {action}합니다
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => onSelect('THIS_AND_FUTURE')}
                        >
                            <View style={styles.optionIcon}>
                                <Ionicons name="documents-outline" size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.optionText}>
                                <Text style={styles.optionTitle}>이후 모든 일정</Text>
                                <Text style={styles.optionDescription}>
                                    이 일정 및 이후 반복 일정을 모두 {action}합니다
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => onSelect('ALL')}
                        >
                            <View style={styles.optionIcon}>
                                <Ionicons name="albums-outline" size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.optionText}>
                                <Text style={styles.optionTitle}>전체 반복 일정</Text>
                                <Text style={styles.optionDescription}>
                                    모든 반복 일정을 {action}합니다
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.background.modalOverlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: Colors.background.card,
        borderRadius: 20,
        width: '85%',
        maxWidth: 400,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.main,
    },
    closeButton: {
        padding: 4,
    },
    optionList: {
        padding: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    optionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.background.scheduleHighlight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionText: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.main,
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 13,
        color: Colors.text.secondary,
        lineHeight: 18,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.background.neon,
        marginHorizontal: 12,
    },
});

export default UpdateScopeModal;