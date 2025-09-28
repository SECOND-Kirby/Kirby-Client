// src/components/auth/SignUpForm.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/shared/ui/Button';
import { TextInput } from '@/components/shared/ui/TextInput';
import { ThemedText } from '@/components/shared/ui/ThemedText';
import { authService } from '@/services/authService';
import { handleApiError } from '@/utils/errorHandler';

interface FieldErrors {
    name: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
    passwordConfirm: string;
}

// 전화번호 포맷팅 함수
const formatPhoneNumber = (text: string): string => {
    const numbers = text.replace(/[^\d]/g, '');

    if (numbers.length > 11) {
        return text.slice(0, -1); // 이전 값 유지
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

    // 공통 필드 업데이트 함수
    const updateField = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }));
        }
        // 아이디가 변경되면 중복확인 초기화
        if (field === 'username') {
            setUsernameChecked(false);
        }
    };

    // 전화번호 업데이트 (포맷팅 포함)
    const updatePhoneNumber = (text: string) => {
        const formatted = formatPhoneNumber(text);
        updateField('phoneNumber', formatted);
    };

    // 폼 검증
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

    // 아이디 중복 확인
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

    // 회원가입 처리
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
                        onPress: () => router.replace('/'),
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
                <View style={styles.usernameContainer}>
                    <TextInput
                        style={styles.usernameInput}
                        placeholder="6자 이상, 영문/숫자만"
                        value={formData.username}
                        onChangeText={(text) => updateField('username', text)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        maxLength={20}
                        error={fieldErrors.username}
                    />
                    <TouchableOpacity
                        style={[
                            styles.duplicateButton,
                            duplicateChecking && styles.duplicateButtonDisabled,
                            usernameChecked && styles.duplicateButtonChecked
                        ]}
                        onPress={handleDuplicateCheck}
                        disabled={duplicateChecking}
                    >
                        <Text style={[
                            styles.duplicateButtonText,
                            usernameChecked && styles.duplicateButtonTextChecked
                        ]}>
                            {duplicateChecking ? '확인중...' : usernameChecked ? '확인완료' : '중복확인'}
                        </Text>
                    </TouchableOpacity>
                </View>
                {fieldErrors.username ? <Text style={styles.errorText}>{fieldErrors.username}</Text> : null}
            </View>

            {/* 비밀번호 */}
            <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>비밀번호 *</ThemedText>
                <View style={styles.passwordContainer}>
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
                    >
                        <Ionicons
                            name={showPassword ? "eye" : "eye-off"}
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>
                </View>
                {fieldErrors.password ? <Text style={styles.errorText}>{fieldErrors.password}</Text> : null}
                <Text style={styles.passwordHint}>
                    8자 이상 20자 이하, 영문자/숫자/특수문자 모두 포함
                </Text>
            </View>

            {/* 비밀번호 확인 */}
            <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>비밀번호 확인 *</ThemedText>
                <View style={styles.passwordContainer}>
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
                    >
                        <Ionicons
                            name={showPasswordConfirm ? "eye" : "eye-off"}
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>
                </View>
                {fieldErrors.passwordConfirm ? <Text style={styles.errorText}>{fieldErrors.passwordConfirm}</Text> : null}
            </View>

            {/* 회원가입 버튼 */}
            <View style={styles.signUpButtonContainer}>
                <Button
                    title={loading ? '회원가입 중...' : '회원가입'}
                    onPress={handleSignUp}
                    isLoading={loading}
                    disabled={isSignUpDisabled}
                />
            </View>

            {/* 경고 메시지 */}
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
        alignItems: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    errorText: {
        fontSize: 12,
        color: '#ff4444',
        marginTop: 4,
        marginLeft: 4,
    },
    passwordHint: {
        fontSize: 12,
        color: '#999',
        marginTop: 8,
        lineHeight: 16,
    },
    usernameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    usernameInput: {
        flex: 1,
        marginRight: 10,
    },
    duplicateButton: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 16,
        paddingVertical: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    duplicateButtonDisabled: {
        backgroundColor: '#e0e0e0',
        opacity: 0.6,
    },
    duplicateButtonChecked: {
        backgroundColor: '#E7FF65',
        borderColor: '#d0e055',
    },
    duplicateButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    duplicateButtonTextChecked: {
        color: '#333',
        fontWeight: 'bold',
    },
    passwordContainer: {
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
    signUpButtonContainer: {
        marginTop: 15,
        marginBottom: 20,
        width: '100%',
    },
    warningText: {
        fontSize: 14,
        color: '#ff6b6b',
        textAlign: 'center',
        fontWeight: '500',
    },
});