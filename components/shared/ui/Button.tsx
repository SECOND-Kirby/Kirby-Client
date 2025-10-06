import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'danger' | 'info';
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
                                                  title,
                                                  onPress,
                                                  isLoading = false,
                                                  disabled = false,
                                                  variant = 'primary',
                                                  style,
                                              }) => {
    const getBackgroundColor = () => {
        if (disabled) return Colors.background.neon;

        switch (variant) {
            case 'danger':
                return Colors.days.sunday; // #F46C6C
            case 'info':
                return Colors.days.saturday; // #5D69F3
            default:
                return Colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return Colors.text.secondary;
        return variant === 'primary' ? Colors.text.main : '#FFF';
    };

    const getBorderRadius = () => {
        return variant === 'primary' ? 15 : 6;
    };

    const buttonStyle = [
        styles.button,
        {
            backgroundColor: getBackgroundColor(),
            borderRadius: getBorderRadius(),
        },
        style,
    ];

    const textStyle = [
        styles.buttonText,
        { color: getTextColor() },
    ];

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'primary' ? Colors.text.secondary : '#FFF'} />
            ) : (
                <Text style={textStyle}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});