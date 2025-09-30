import React from 'react';
import { StyleSheet, TextInput as RNTextInput, TextInputProps } from 'react-native';
import { Colors } from '@/constants/Colors';
import { INPUT_HEIGHT, BORDER_RADIUS } from '@/utils/constants';

interface AppTextInputProps extends TextInputProps {
    error?: string;
}

export function TextInput({ style, error, ...rest }: AppTextInputProps) {
    const borderColor = error ? Colors.error : Colors.border;

    return (
        <RNTextInput
            style={[
                styles.inputBase,
                { borderColor },
                style,
            ]}
            placeholderTextColor={Colors.text.secondary}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    inputBase: {
        width: '100%',
        height: INPUT_HEIGHT,
        backgroundColor: Colors.background.main,
        borderRadius: BORDER_RADIUS,
        paddingHorizontal: 20,
        fontSize: 16,
        borderWidth: 1,
        color: Colors.text.main,
    },
});