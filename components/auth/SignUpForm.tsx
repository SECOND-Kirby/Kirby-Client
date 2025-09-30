import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/shared/ui/Button';
import { TextInput } from '@/components/shared/ui/TextInput';
import { ThemedText } from '@/components/shared/ui/ThemedText';
import { authService } from '@/services/authService';
import { handleApiError } from '@/utils/errorHandler';
import { Colors } from '@/constants/Colors';
import { SPACING } from '@/utils/constants';

interface FieldErrors {
    name: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
    passwordConfirm: string;
}

const formatPhoneNumber = (text: string): string => {
    const numbers = text.replace(/[^\d]/g, '');

    if (numbers.length > 11) {
        return text.slice(0, -1);
    }

    if (numbers.length <= 3) {
        return numbers;
    } else if (numbers.length <= 7) {
        return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    }
};

export function SignUpForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        username: '',
        password: '',
        passwordConfirm: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [duplicateChecking, setDuplicateChecking] = useState(false);
    const [usernameChecked, setUsernameChecked] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
        name: '',
        email: '',
        phoneNumber: '',
        username: '',
        password: '',
        passwordConfirm: '',
    });

    const updateField = (field: keyof typeof formData, value: string) => {
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
        const errors: FieldErrors = {
            name: '',
            email: '',
            phoneNumber: '',
            username: '',
            password: '',
            passwordConfirm: '',
        };

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
                Alert.alert('아이디 중복확인', '사용 가능한 아이디입니다.', [
                    { text: '확인', style: 'default' }
                ]);
            }
        } catch (error: unknown) {
            setUsernameChecked(false);

            const errorResult = handleApiError(error, '아이디 중복확인');

            if (errorResult.fieldErrors) {
                setFieldErrors(prev => ({ ...prev, ...errorResult.fieldErrors }));
            }

            if (errorResult.shouldShowAlert) {
                Alert.alert('아이디 중복확인', errorResult.message, [
                    { text: '확인', style: 'cancel' }
                ]);
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
            Alert.alert('알림', '아이디 중복 확인을 해주세요.');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.signup(formData);

            Alert.alert(
                '회원가입 완료',
                response.message || '회원가입이 완료되었습니다.',
                [
                    {
                        text: '확인',
                        onPress: () => router.replace('/(auth)'),
                    },
                ]
            );
        } catch (error: unknown) {
            const errorResult = handleApiError(error, '회원가입');

            if (errorResult.fieldErrors) {
                setFieldErrors(prev => ({ ...prev, ...errorResult.fieldErrors }));
            }

            if (errorResult.shouldShowAlert) {
                Alert.alert('회원가입 실패', errorResult.message, [
                    { text: '확인', style: 'default' }
                ]);
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
                <ThemedText style={styles.label}>이름</ThemedText>
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
                <ThemedText style={styles.label}>이메일</ThemedText>
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
                <ThemedText style={styles.label}>전화번호</ThemedText>
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
                <ThemedText style={styles.label}>아이디</ThemedText>
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
                            duplicateChecking && styles.duplicateButtonDisabled,
                            usernameChecked && styles.duplicateButtonChecked
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
                <ThemedText style={styles.label}>비밀번호</ThemedText>
                <View style={styles.passwordWrapper}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="비밀번호를 입력해주세요"
                        value={formData.password}
                        onChangeText={(text) => updateField('password', text)}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        maxLength={20}
                        error={fieldErrors.password}
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={showPassword ? "eye" : "eye-off"}
                            size={20}
                            color={Colors.text.secondary}
                        />
                    </TouchableOpacity>
                </View>
                {fieldErrors.password ? <Text style={styles.errorText}>{fieldErrors.password}</Text> : null}
                <Text style={styles.hint}>
                    8자 이상 20자 이하, 영문자/숫자/특수문자 모두 포함
                </Text>
            </View>

            {/* 비밀번호 확인 */}
            <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>비밀번호 확인</ThemedText>
                <View style={styles.passwordWrapper}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="비밀번호를 다시 입력해주세요"
                        value={formData.passwordConfirm}
                        onChangeText={(text) => updateField('passwordConfirm', text)}
                        secureTextEntry={!showPasswordConfirm}
                        autoCapitalize="none"
                        autoCorrect={false}
                        maxLength={20}
                        error={fieldErrors.passwordConfirm}
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={showPasswordConfirm ? "eye" : "eye-off"}
                            size={20}
                            color={Colors.text.secondary}
                        />
                    </TouchableOpacity>
                </View>
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
        backgroundColor: Colors.background.button,
        paddingHorizontal: SPACING.md,
        justifyContent: 'center',
        borderRadius: 12,
        minWidth: 90,
    },
    duplicateButtonDisabled: {
        opacity: 0.5,
    },
    duplicateButtonChecked: {
        backgroundColor: Colors.primary,
    },
    duplicateButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.main,
        textAlign: 'center',
    },
    passwordWrapper: {
        position: 'relative',
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeButton: {
        position: 'absolute',
        right: 15,
        top: 15,
        padding: 5,
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