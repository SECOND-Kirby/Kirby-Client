// src/components/shared/ui/Button.tsx
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
} from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'brand'
    isLoading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
}

export function Button({
                           title,
                           variant = 'primary',
                           isLoading = false,
                           disabled = false,
                           fullWidth = true,
                           style,
                           ...rest
                       }: ButtonProps) {
    const getButtonStyle = () => {
        switch (variant) {
            case 'primary':
                return { backgroundColor: '#007AFF', color: 'white' };
            case 'danger':
                return { backgroundColor: '#D1524C', color: 'white' };
            case 'secondary':
                return { backgroundColor: 'transparent', color: '#007AFF' };
            case 'ghost':
                return { backgroundColor: 'transparent', color: '#FF3B30' };
            case 'brand':
                return { backgroundColor: '#9DE84C', color: '#333740' };
            default:
                return { backgroundColor: '#007AFF', color: 'white' };
        }
    };

    const buttonColors = getButtonStyle();
    const buttonStyle = {
        backgroundColor: buttonColors.backgroundColor,
    };
    const textStyle = {
        color: buttonColors.color,
    };

    return (
        <TouchableOpacity
            style={[
                styles.buttonBase,
                fullWidth && styles.fullWidth,
                buttonStyle,
                (disabled || isLoading) && styles.disabled,
                style,
            ]}
            activeOpacity={0.8}
            disabled={disabled || isLoading}
            {...rest}>
            {isLoading ? (
                <ActivityIndicator color={buttonColors.color} />
            ) : (
                <Text style={[styles.buttonText, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonBase: {
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    fullWidth: {
        width: '100%',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabled: {
        opacity: 0.6,
        backgroundColor: '#f0f0f0',
        shadowOpacity: 0,
        elevation: 0,
    },
});