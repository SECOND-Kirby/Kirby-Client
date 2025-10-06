// hooks/useAlert.ts
import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';

export const useAlert = () => {
    const showAlert = useCallback(
        (title: string, message: string, onPress?: () => void) => {
            if (Platform.OS === 'web') {
                alert(message);
                onPress?.();
            } else {
                Alert.alert(title, message, [{ text: '확인', onPress }]);
            }
        },
        []
    );

    const showConfirm = useCallback(
        (
            title: string,
            message: string,
            onConfirm: () => void,
            confirmText: string = '확인',
            cancelText: string = '취소',
            destructive: boolean = false
        ) => {
            if (Platform.OS === 'web') {
                if (confirm(message)) {
                    onConfirm();
                }
            } else {
                Alert.alert(title, message, [
                    { text: cancelText, style: 'cancel' },
                    {
                        text: confirmText,
                        style: destructive ? 'destructive' : 'default',
                        onPress: onConfirm,
                    },
                ]);
            }
        },
        []
    );

    return { showAlert, showConfirm };
};