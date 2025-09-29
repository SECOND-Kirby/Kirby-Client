// components/schedule/FormRow.tsx
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FormRowProps {
    label: string;
    children: ReactNode;
    isSwitch?: boolean;
}

const FormRow: React.FC<FormRowProps> = ({ label, children, isSwitch = false }) => {
    return (
        <View style={styles.formRow}>
            <Text style={styles.formLabel}>{label}</Text>
            <View style={isSwitch ? styles.formValueSwitch : styles.formValue}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    formRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    formLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    formValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    formValueSwitch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});

export default FormRow;