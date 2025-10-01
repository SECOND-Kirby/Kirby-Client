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
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
                                                                value,
                                                                onChangeText,
                                                                placeholder = '비밀번호',
                                                                ...rest
                                                            }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={styles.container}>
            <TextInput
                variant="styled"
                placeholder={placeholder}
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChangeText}
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.input}
                {...rest}
            />
            <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    color={Colors.icon.secondary}
                    size={24}
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
    eyeButton: {
        position: 'absolute',
        right: 20,
        top: '50%',
        transform: [{ translateY: -16 }],
        padding: 5,
    },
});