// src/components/auth/LoginForm.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput as RNTextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Button } from '@/components/shared/ui/Button';
import { TextInput } from '@/components/shared/ui/TextInput';
import { ThemedText } from '@/components/shared/ui/ThemedText';
import { authService, ERROR_CODES } from '@/services/authService'; // 이 서비스가 있다고 가정

export function LoginForm() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (id.trim() === '' || password.trim() === '') {
            Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.login({
                username: id.trim(),
                password: password.trim(),
            });

            if (response.success) {
                Alert.alert('로그인 성공', response.message, [
                    { text: '확인', onPress: () => router.replace('/(tabs)') },
                ]);
            } else {
                Alert.alert('로그인 실패', response.message);
            }
        } catch (error: any) {
            // 에러 처리 로직...
            Alert.alert('로그인 에러', '서버 연결에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* 1. 아이디 입력 */}
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="아이디 또는 이메일"
                    value={id}
                    onChangeText={setId}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            {/* 2. 비밀번호 입력 */}
            <View style={styles.inputContainer}>
                <View style={styles.passwordWrapper}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="비밀번호"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* 3. 로그인 버튼 */}
            <View style={styles.loginButtonContainer}>
                <Button
                    title="로그인"
                    onPress={handleLogin}
                    isLoading={isLoading}
                    disabled={!id || !password}
                />
            </View>

            {/* 4. 기타 링크 */}
            <View style={styles.linkContainer}>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                    <ThemedText type="link" style={styles.linkText}>
                        회원가입
                    </ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.divider}>|</ThemedText>
                <TouchableOpacity>
                    <ThemedText type="link" style={styles.linkText}>
                        ID/PW 찾기
                    </ThemedText>
                </TouchableOpacity>
            </View>
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
        marginBottom: 15,
    },
    passwordWrapper: {
        position: 'relative',
        width: '100%',
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeButton: {
        position: 'absolute',
        right: 15,
        top: 15, // 50px 높이에 맞게 조정
        padding: 5,
    },
    loginButtonContainer: {
        marginTop: 15,
        marginBottom: 30,
        width: '100%',
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    linkText: {
        fontSize: 14,
        color: '#666',
    },
    divider: {
        fontSize: 14,
        color: '#ccc',
        marginHorizontal: 10,
    },
});