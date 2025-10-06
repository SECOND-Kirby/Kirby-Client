// components/shared/ui/PasswordInput.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from './TextInput';
import { Colors } from '@/constants/Colors';

interface PasswordInputProps extends TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    variant?: 'default' | 'styled'; // default: 로그인/회원가입용, styled: 설정화면용
    error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
                                                                value,
                                                                onChangeText,
                                                                placeholder = '비밀번호',
                                                                variant = 'default',
                                                                error,
                                                                ...rest
                                                            }) => {
    const [showPassword, setShowPassword] = useState(false);

    const eyeButtonStyle = variant === 'styled'
        ? styles.eyeButtonStyled
        : styles.eyeButtonDefault;

    const iconSize = variant === 'styled' ? 24 : 20;
    const iconColor = variant === 'styled' ? Colors.icon.secondary : Colors.text.secondary;

    return (
        <View style={styles.container}>
            <TextInput
                variant={variant}
                placeholder={placeholder}
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChangeText}
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.input}
                error={error}
                {...rest}
            />
            <TouchableOpacity
                style={eyeButtonStyle}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
                hitSlop={variant === 'styled' ? { top: 10, bottom: 10, left: 10, right: 10 } : undefined}
            >
                <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={iconSize}
                    color={iconColor}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    input: {
        paddingRight: 50,
    },
    // 로그인/회원가입용 (배경 하얀색)
    eyeButtonDefault: {
        position: 'absolute',
        right: 15,
        top: 10,
        padding: 5,
    },
    // 설정화면용 (배경 회색)
    eyeButtonStyled: {
        position: 'absolute',
        right: 20,
        top: '50%',
        transform: [{ translateY: -16 }],
        padding: 5,
    },
});