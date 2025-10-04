import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import {
    Alert,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

import { Button } from '@/components/shared/ui/Button';
import { TextInput } from '@/components/shared/ui/TextInput';
import { ThemedText } from '@/components/shared/ui/ThemedText';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/Colors';
import { SPACING } from '@/constants';

export function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { login, isLoading } = useAuthStore();

    const handleLogin = async () => {
        if (username.trim() === '' || password.trim() === '') {
            if (Platform.OS === 'web') {
                alert('아이디와 비밀번호를 입력해주세요.');
            } else {
                Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
            }
            return;
        }

        const success = await login(username.trim(), password.trim());

        if (success) {
            router.replace('/(tabs)');
        } else {
            if (Platform.OS === 'web') {
                alert('아이디 또는 비밀번호를 확인해주세요.');
            } else {
                Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인해주세요.');
            }
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
                <View style={styles.passwordWrapper}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="비밀번호"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={showPassword ? 'eye' : 'eye-off'}
                            size={20}
                            color={Colors.text.secondary}
                        />
                    </TouchableOpacity>
                </View>
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