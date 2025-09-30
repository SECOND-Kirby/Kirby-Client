// src/screens/setting/AccountDeletionScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { Button } from '@/components/shared/ui/Button';

const AccountDeletionScreen: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);

    const handleAccountDeletion = () => {
        if (!currentPassword.trim()) {
            Alert.alert('알림', '현재 비밀번호를 입력해주세요.');
            return;
        }

        if (!isAgreed) {
            Alert.alert('알림', '탈퇴 동의 사항을 확인해주세요.');
            return;
        }

        Alert.alert(
            '회원 탈퇴',
            '정말 회원 탈퇴하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
            [
                {
                    text: '취소',
                    style: 'cancel',
                },
                {
                    text: '탈퇴',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('알림', '회원 탈퇴가 완료되었습니다.', [
                            { text: '확인', onPress: () => router.replace('/') }
                        ]);
                    },
                },
            ]
        );
    };

    const PasswordInput = () => (
        <View style={styles.passwordContainer}>
            <TextInput
                style={styles.passwordInput}
                placeholder="현재 비밀번호"
                secureTextEntry={!showPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
            />
            <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#888"
                />
            </TouchableOpacity>
        </View>
    );

    const AgreementCheckbox = () => (
        <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={() => setIsAgreed(!isAgreed)} style={styles.checkboxWrapper}>
                <View style={[styles.checkbox, isAgreed && styles.checkboxChecked]}>
                    {isAgreed && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
            </TouchableOpacity>
            <Text style={styles.agreementText}>
                위 내용을 모두 확인하였으며, 회원 탈퇴에 동의합니다
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <SettingsHeader title="회원 탈퇴" />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Warning Section */}
                <View style={styles.warningBox}>
                    <Ionicons name="warning" size={24} color="#D1524C" style={styles.warningIcon} />
                    <View style={styles.warningTextContainer}>
                        <Text style={styles.warningTitle}>회원 탈퇴 시 유의사항</Text>
                        <Text style={styles.warningText}>
                            - 회원 탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                        </Text>
                        <Text style={styles.warningText}>
                            - 기록된 일정, 운동, 분석 데이터 등이 모두 삭제됩니다.
                        </Text>
                    </View>
                </View>

                {/* Input Section */}
                <View style={styles.sectionPadding}>
                    <Text style={styles.inputTitle}>현재 비밀번호를 입력해주세요</Text>
                    <PasswordInput />
                </View>

                {/* Agreement Section */}
                <View style={styles.agreementSection}>
                    <AgreementCheckbox />
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
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
    },
    warningBox: {
        flexDirection: 'row',
        backgroundColor: '#FFF5F5',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        alignItems: 'flex-start',
    },
    warningIcon: {
        marginRight: 10,
        marginTop: 2,
    },
    warningTextContainer: {
        flex: 1,
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#D1524C',
        marginBottom: 8,
    },
    warningText: {
        fontSize: 14,
        color: '#D1524C',
        lineHeight: 20,
    },
    sectionPadding: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    inputTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 16,
        paddingRight: 50,
        fontSize: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        backgroundColor: Colors.background.neon,
        color: Colors.text.main,
    },
    eyeButton: {
        position: 'absolute',
        right: 15,
        top: '50%',
        transform: [{ translateY: -15 }],
        padding: 5,
    },
    agreementSection: {
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    checkboxWrapper: {
        paddingRight: 12,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: '#D1524C',
        borderColor: '#D1524C',
    },
    agreementText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
});

export default AccountDeletionScreen;