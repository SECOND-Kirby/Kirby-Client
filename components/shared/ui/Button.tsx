import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { BUTTON_HEIGHT, BORDER_RADIUS } from '@/utils/constants';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
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
                return {
                    backgroundColor: Colors.primary,
                    color: Colors.text.main
                };
            case 'secondary':
                return {
                    backgroundColor: Colors.background.button,
                    color: Colors.text.main
                };
            case 'danger':
                return {
                    backgroundColor: '#D1524C',
                    color: 'white'
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    color: '#FF3B30'
                };
            default:
                return {
                    backgroundColor: Colors.primary,
                    color: Colors.text.main
                };
        }
    };

    const buttonColors = getButtonStyle();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                fullWidth && styles.fullWidth,
                { backgroundColor: buttonColors.backgroundColor },
                (disabled || isLoading) && styles.disabled,
                style,
            ]}
            activeOpacity={0.7}
            disabled={disabled || isLoading}
            {...rest}
        >
            {isLoading ? (
                <ActivityIndicator color={buttonColors.color} />
            ) : (
                <Text style={[styles.buttonText, { color: buttonColors.color }]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: BUTTON_HEIGHT,
        borderRadius: BORDER_RADIUS,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullWidth: {
        width: '100%',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.5,
        backgroundColor: Colors.disabled,
    },
});