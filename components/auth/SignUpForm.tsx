import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Button } from '@/components/shared/ui/Button';
import { TextInput } from '@/components/shared/ui/TextInput';
import { PasswordInput } from '@/components/shared/ui/PasswordInput';
import { ThemedText } from '@/components/shared/ui/ThemedText';
import { authService } from '@/services/authService';
import { handleApiError } from '@/utils/errorHandler';
import { formatPhoneNumber } from '@/utils/formatters';
import { useAlert } from '@/hooks';
import { Colors } from '@/constants/Colors';
import { SPACING } from '@/constants';
import type { SignupFormData, FieldErrors } from '@/types/auth';

export function SignUpForm() {
    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        email: '',
        phoneNumber: '',
        username: '',
        password: '',
        passwordConfirm: '',
    });

    const [loading, setLoading] = useState(false);
    const [duplicateChecking, setDuplicateChecking] = useState(false);
    const [usernameChecked, setUsernameChecked] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    const { showAlert } = useAlert();

    const updateField = (field: keyof SignupFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }));
        }
        if (field === 'username') {
            setUsernameChecked(false);
        }
    };

    const updatePhoneNumber = (text: string) => {
        const formatted = formatPhoneNumber(text);
        updateField('phoneNumber', formatted);
    };

    const validateFields = (): boolean => {
        const errors: FieldErrors = {};
        let hasError = false;

        if (!formData.name.trim()) {
            errors.name = '이름을 입력해주세요.';
            hasError = true;
        }

        if (!formData.email.trim()) {
            errors.email = '이메일을 입력해주세요.';
            hasError = true;
        } else {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(formData.email)) {
                errors.email = '올바른 이메일 형식을 입력해주세요.';
                hasError = true;
            }
        }

        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = '전화번호를 입력해주세요.';
            hasError = true;
        }

        if (!formData.username.trim()) {
            errors.username = '아이디를 입력해주세요.';
            hasError = true;
        }

        if (!formData.password.trim()) {
            errors.password = '비밀번호를 입력해주세요.';
            hasError = true;
        }

        if (!formData.passwordConfirm.trim()) {
            errors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
            hasError = true;
        } else if (formData.password !== formData.passwordConfirm) {
            errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
            hasError = true;
        }

        setFieldErrors(errors);
        return !hasError;
    };

    const handleDuplicateCheck = async (): Promise<void> => {
        if (!formData.username.trim()) {
            setFieldErrors(prev => ({ ...prev, username: '아이디를 입력해주세요.' }));
            return;
        }

        setDuplicateChecking(true);
        setFieldErrors(prev => ({ ...prev, username: '' }));

        try {
            const response = await authService.checkUsername(formData.username);

            if (response.success) {
                setUsernameChecked(true);
                showAlert('아이디 중복확인', '사용 가능한 아이디입니다.');
            }
        } catch (error: unknown) {
            setUsernameChecked(false);

            const errorResult = handleApiError(error, '아이디 중복확인');

            if (errorResult.fieldErrors) {
                setFieldErrors(prev => ({ ...prev, ...errorResult.fieldErrors }));
            }

            if (errorResult.shouldShowAlert) {
                showAlert('아이디 중복확인', errorResult.message);
            }
        } finally {
            setDuplicateChecking(false);
        }
    };

    const handleSignUp = async () => {
        if (!validateFields()) {
            return;
        }

        if (!usernameChecked) {
            showAlert('알림', '아이디 중복 확인을 해주세요.');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.signup(formData);

            if (response.success || response.code === 'S001') {
                showAlert(
                    '회원가입 완료',
                    response.message || '회원가입이 완료되었습니다.',
                    () => router.replace('/(auth)')
                );
            } else {
                showAlert('회원가입', response.message || '회원가입에 실패했습니다.');
            }
        } catch (error: unknown) {
            const errorResult = handleApiError(error, '회원가입');

            if (errorResult.fieldErrors) {
                setFieldErrors(prev => ({ ...prev, ...errorResult.fieldErrors }));
            }

            if (errorResult.shouldShowAlert) {
                showAlert('회원가입 실패', errorResult.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const isSignUpDisabled = loading || !usernameChecked;

    return (
        <View style={styles.container}>
            {/* 이름 */}
            <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>이름 *</ThemedText>
                <TextInput
                    placeholder="이름을 입력해주세요"
                    value={formData.name}
                    onChangeText={(text) => updateField('name', text)}
                    autoCapitalize="words"
                    maxLength={100}
                    error={fieldErrors.name}
                />
                {fieldErrors.name ? <Text style={styles.errorText}>{fieldErrors.name}</Text> : null}
            </View>

            {/* 이메일 */}
            <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>이메일 *</ThemedText>
                <TextInput
                    placeholder="example@email.com"
                    value={formData.email}
                    onChangeText={(text) => updateField('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={50}
                    error={fieldErrors.email}
                />
                {fieldErrors.email ? <Text style={styles.errorText}>{fieldErrors.email}</Text> : null}
            </View>

            {/* 전화번호 */}
            <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>전화번호 *</ThemedText>
                <TextInput
                    placeholder="010-0000-0000"
                    value={formData.phoneNumber}
                    onChangeText={updatePhoneNumber}
                    keyboardType="number-pad"
                    maxLength={13}
                    error={fieldErrors.phoneNumber}
                />
                {fieldErrors.phoneNumber ? <Text style={styles.errorText}>{fieldErrors.phoneNumber}</Text> : null}
            </View>

            {/* 아이디 */}
            <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>아이디 *</ThemedText>
                <View style={styles.usernameRow}>
                    <View style={styles.usernameInputWrapper}>
                        <TextInput
                            placeholder="6자 이상의 영문/숫자 조합"
                            value={formData.username}
                            onChangeText={(text) => updateField('username', text)}
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={20}
                            error={fieldErrors.username}
                        />
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.duplicateButton,
                            usernameChecked && styles.duplicateButtonChecked,
                            duplicateChecking && styles.duplicateButtonDisabled,
                        ]}
                        onPress={handleDuplicateCheck}
                        disabled={duplicateChecking}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.duplicateButtonText}>
                            {duplicateChecking ? '확인중...' : usernameChecked ? '확인완료' : '중복확인'}
                        </Text>
                    </TouchableOpacity>
                </View>
                {fieldErrors.username ? <Text style={styles.errorText}>{fieldErrors.username}</Text> : null}
            </View>

            {/* 비밀번호 */}
            <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>비밀번호 *</ThemedText>
                <PasswordInput
                    value={formData.password}
                    onChangeText={(text) => updateField('password', text)}
                    placeholder="비밀번호를 입력해주세요"
                    maxLength={20}
                />
                {fieldErrors.password ? <Text style={styles.errorText}>{fieldErrors.password}</Text> : null}
                <Text style={styles.hint}>
                    8자 이상 20자 이하, 영문자/숫자/특수문자 모두 포함
                </Text>
            </View>

            {/* 비밀번호 확인 */}
            <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>비밀번호 확인 *</ThemedText>
                <PasswordInput
                    value={formData.passwordConfirm}
                    onChangeText={(text) => updateField('passwordConfirm', text)}
                    placeholder="비밀번호를 다시 입력해주세요"
                    maxLength={20}
                />
                {fieldErrors.passwordConfirm ? <Text style={styles.errorText}>{fieldErrors.passwordConfirm}</Text> : null}
            </View>

            {/* 회원가입 버튼 */}
            <View style={styles.buttonContainer}>
                <Button
                    title={loading ? '회원가입 중...' : '회원가입'}
                    onPress={handleSignUp}
                    isLoading={loading}
                    disabled={isSignUpDisabled}
                />
            </View>

            {!usernameChecked && (
                <ThemedText style={styles.warningText}>
                    아이디 중복 확인을 완료해주세요
                </ThemedText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: SPACING.sm,
        color: Colors.text.main,
    },
    errorText: {
        fontSize: 12,
        color: Colors.error,
        marginTop: 4,
    },
    hint: {
        fontSize: 12,
        color: Colors.text.secondary,
        marginTop: SPACING.sm,
    },
    usernameRow: {
        flexDirection: 'row',
        gap: 10,
    },
    usernameInputWrapper: {
        flex: 1,
    },
    duplicateButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: SPACING.md,
        justifyContent: 'center',
        borderRadius: 7,
        minWidth: 90,
    },
    duplicateButtonChecked: {
        backgroundColor: Colors.background.neon,
    },
    duplicateButtonDisabled: {
        opacity: 0.5,
    },
    duplicateButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text.secondary,
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: SPACING.md,
        marginBottom: SPACING.lg,
    },
    warningText: {
        fontSize: 14,
        color: Colors.error,
        textAlign: 'center',
        fontWeight: '500',
    },
});