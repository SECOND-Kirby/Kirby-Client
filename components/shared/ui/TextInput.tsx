// components/shared/ui/TextInput.tsx
import React from 'react';
import { StyleSheet, TextInput as RNTextInput, TextInputProps } from 'react-native';
import { Colors } from '@/constants/Colors';
import { INPUT_HEIGHT, BORDER_RADIUS } from '@/constants';

interface AppTextInputProps extends TextInputProps {
    error?: string;
    variant?: 'default' | 'styled';
}

export function TextInput({ style, error, variant = 'default', ...rest }: AppTextInputProps) {
    const borderColor = error ? Colors.error : (variant === 'styled' ? Colors.border : Colors.border);
    const backgroundColor = variant === 'styled' ? Colors.background.neon : Colors.background.card;

    return (
        <RNTextInput
            style={[
                styles.inputBase,
                { borderColor, backgroundColor },
                style,
            ]}
            placeholderTextColor={Colors.text.secondary}
            underlineColorAndroid="transparent"
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    inputBase: {
        width: '100%',
        height: INPUT_HEIGHT,
        borderRadius: BORDER_RADIUS,
        paddingHorizontal: 20,
        fontSize: 16,
        borderWidth: 1.4,
        color: Colors.text.main,
    },
});