import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
                                                  title,
                                                  onPress,
                                                  isLoading = false,
                                                  disabled = false,
                                                  style,
                                              }) => {
    const buttonStyle = [
        styles.button,
        disabled && styles.buttonDisabled,
        style,
    ];

    const textStyle = [
        styles.buttonText,
        disabled && styles.buttonTextDisabled,
    ];

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator color={Colors.text.secondary} />
            ) : (
                <Text style={textStyle}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    buttonDisabled: {
        backgroundColor: Colors.background.neon,
    },
    buttonText: {
        color: Colors.text.main,
        fontSize: 16,
        fontWeight: '600',
    },
    buttonTextDisabled: {
        color: Colors.text.secondary,
    },
});