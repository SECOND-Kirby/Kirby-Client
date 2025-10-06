import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Button } from '@/components/shared/ui/Button';
import { TextInput } from '@/components/shared/ui/TextInput';
import { PasswordInput } from '@/components/shared/ui/PasswordInput';
import { ThemedText } from '@/components/shared/ui/ThemedText';
import { useAuthStore } from '@/store/authStore';
import { useAlert } from '@/hooks';
import { Colors } from '@/constants/Colors';
import { SPACING } from '@/constants';

export function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { login, isLoading } = useAuthStore();
    const { showAlert } = useAlert();

    const handleLogin = async () => {
        if (username.trim() === '' || password.trim() === '') {
            showAlert('알림', '아이디와 비밀번호를 입력해주세요.');
            return;
        }

        const success = await login(username.trim(), password.trim());

        if (success) {
            router.replace('/(tabs)');
        } else {
            showAlert('로그인 실패', '아이디 또는 비밀번호를 확인해주세요.');
        }
    };

    return (
        <View style={styles.container}>
            {/* 아이디 입력 */}
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="아이디"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            {/* 비밀번호 입력 */}
            <View style={styles.inputContainer}>
                <PasswordInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="비밀번호"
                />
            </View>

            {/* 로그인 버튼 */}
            <View style={styles.buttonContainer}>
                <Button
                    title="로그인"
                    onPress={handleLogin}
                    isLoading={isLoading}
                    disabled={!username || !password}
                />
            </View>

            {/* 링크 */}
            <View style={styles.linkContainer}>
                <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                    <ThemedText style={styles.linkText}>
                        아직 RallyWalk 회원이 아닌가요?  <ThemedText style={styles.linkTextBold}>가입하기</ThemedText>
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: SPACING.md,
    },
    buttonContainer: {
        marginTop: SPACING.lg,
        marginBottom: SPACING.xl,
    },
    linkContainer: {
        alignItems: 'flex-end',
    },
    linkText: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    linkTextBold: {
        fontSize: 14,
        color: Colors.register,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});