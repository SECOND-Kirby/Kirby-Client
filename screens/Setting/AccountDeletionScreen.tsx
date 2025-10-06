// src/screens/setting/AccountDeletionScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { Button } from '@/components/shared/ui/Button';
import { PasswordInput } from '@/components/shared/ui/PasswordInput';
import { useAlert } from '@/hooks';

const AccountDeletionScreen: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    const { showAlert, showConfirm } = useAlert();

    const handleAccountDeletion = () => {
        if (!currentPassword.trim()) {
            showAlert('알림', '현재 비밀번호를 입력해주세요.');
            return;
        }

        if (!isAgreed) {
            showAlert('알림', '탈퇴 동의 사항을 확인해주세요.');
            return;
        }

        showConfirm(
            '회원 탈퇴',
            '정말 회원 탈퇴하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
            () => {
                showAlert('알림', '회원 탈퇴가 완료되었습니다.', () => router.replace('/'));
            },
            '탈퇴',
            '취소',
            true
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <SettingsHeader title="회원탈퇴" />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Warning Section */}
                <View style={styles.warningBox}>
                    <Ionicons name="warning" size={24} color={Colors.danger.main} style={styles.warningIcon} />
                    <Text style={styles.warningBoxText}>
                        회원 탈퇴 시 모든 데이터가 삭제되며 복구가 불가능합니다.
                    </Text>
                </View>

                {/* Notice Section */}
                <View style={styles.noticeSection}>
                    <Text style={styles.noticeTitle}>탈퇴 시 주의사항</Text>
                    <Text style={styles.noticeText}> •  계정 정보 및 개인 데이터가 모두 삭제됩니다.</Text>
                    <Text style={styles.noticeText}> •  현재 이용 중인 서비스가 즉시 중단됩니다.</Text>
                </View>

                {/* Input Section */}
                <View style={styles.sectionPadding}>
                    <Text style={styles.inputTitle}>현재 비밀번호를 입력해주세요</Text>
                    <PasswordInput
                        variant="styled"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="현재 비밀번호"
                    />
                </View>

                {/* Agreement Section */}
                <View style={styles.agreementSection}>
                    <View style={styles.checkboxContainer}>
                        <TouchableOpacity onPress={() => setIsAgreed(!isAgreed)}>
                            <View style={[styles.checkbox, isAgreed && styles.checkboxChecked]}>
                                {isAgreed && <Ionicons name="checkmark" size={16} color={Colors.icon.white} />}
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.agreementText}>
                            위 내용을 모두 확인하였으며, 회원 탈퇴에 동의합니다.
                        </Text>
                    </View>
                </View>

                {/* Delete Button */}
                <View style={styles.buttonContainer}>
                    <Button
                        variant="danger"
                        title="회원 탈퇴하기"
                        onPress={handleAccountDeletion}
                        disabled={!(currentPassword.trim() && isAgreed)}
                    />
                </View>

                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.card,
    },
    scrollView: {
        flex: 1,
    },
    warningBox: {
        flexDirection: 'row',
        backgroundColor: Colors.danger.background,
        padding: 16,
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.danger.border,
        alignItems: 'center',
    },
    warningIcon: {
        marginRight: 12,
    },
    warningBoxText: {
        flex: 1,
        fontSize: 14,
        color: Colors.danger.main,
        lineHeight: 20,
    },
    noticeSection: {
        paddingHorizontal: 20,
        marginTop: 30,
        marginBottom: 30,
    },
    noticeTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.main,
        marginBottom: 16,
    },
    noticeText: {
        fontSize: 14,
        color: Colors.text.main,
        lineHeight: 24,
        marginBottom: 4,
    },
    sectionPadding: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    inputTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.main,
        marginBottom: 12,
    },
    agreementSection: {
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: Colors.checkbox.border,
        backgroundColor: Colors.background.card,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    checkboxChecked: {
        backgroundColor: Colors.danger.main,
        borderColor: Colors.danger.main,
    },
    agreementText: {
        flex: 1,
        fontSize: 14,
        color: Colors.text.main,
        lineHeight: 20,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
});

export default AccountDeletionScreen;