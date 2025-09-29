// src/components/shared/ui/TextInput.tsx
import React from 'react';
import { StyleSheet, TextInput as RNTextInput, TextInputProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

interface AppTextInputProps extends TextInputProps {
    error?: string;
}

export function TextInput({ style, error, ...rest }: AppTextInputProps) {
    const primaryColor = useThemeColor({}, 'primary');
    const errorColor = '#FF6B6B';
    const borderColor = error ? errorColor : '#e0e0e0';

    return (
        <RNTextInput
            style={[
                styles.inputBase,
                { borderColor: borderColor },
                style,
            ]}
            placeholderTextColor="#999"
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    inputBase: {
        width: '100%',
        height: 50,
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        paddingHorizontal: 20,
        fontSize: 16,
        borderWidth: 1,
        // borderColor: '#e0e0e0', // 동적 설정
    },
});