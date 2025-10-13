// components/settings/GoalAdjuster.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { shadowPresets } from '@/utils/styles';

interface GoalAdjusterProps {
    initialValue: number;
    minValue: number;
    maxValue: number;
    unit: string;
    onValueChange: (value: number) => void;
}

export interface GoalAdjusterRef {
    getCurrentValue: () => number;
    getPendingInputValue: () => string;
    isCurrentlyEditing: () => boolean;
}

export const GoalAdjuster = forwardRef<GoalAdjusterRef, GoalAdjusterProps>(({
                                                                                initialValue,
                                                                                minValue,
                                                                                maxValue,
                                                                                unit,
                                                                                onValueChange,
                                                                            }, ref) => {
    const [value, setValue] = useState(initialValue);
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(initialValue.toString());

    useImperativeHandle(ref, () => ({
        getCurrentValue: () => value,
        getPendingInputValue: () => inputValue,
        isCurrentlyEditing: () => isEditing,
    }));

    useEffect(() => {
        setValue(initialValue);
        setInputValue(initialValue.toString());
    }, [initialValue]);

    useEffect(() => {
        onValueChange(value);
    }, [value, onValueChange]);

    const adjustValue = (increment: boolean) => {
        const newValue = increment ? value + 1 : value - 1;
        if (newValue >= minValue && newValue <= maxValue) {
            setValue(newValue);
            setInputValue(newValue.toString());
        }
    };

    const handleInputChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');
        setInputValue(numericText);
    };

    const handleInputSubmit = () => {
        if (inputValue.trim() === '') {
            setInputValue(value.toString());
            setIsEditing(false);
            return;
        }

        const newValue = parseInt(inputValue);

        if (isNaN(newValue) || newValue < minValue || newValue > maxValue) {
            setInputValue(value.toString());
            setIsEditing(false);
            return;
        }

        setValue(newValue);
        setIsEditing(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.controlRow}>
                    <TouchableOpacity
                        style={[styles.button, value <= minValue && styles.buttonDisabled]}
                        onPress={() => adjustValue(false)}
                        disabled={value <= minValue}
                    >
                        <Ionicons
                            name="remove"
                            size={32}
                            color={value <= minValue ? Colors.disabled : Colors.text.main}
                        />
                    </TouchableOpacity>

                    <View style={styles.valueContainer}>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={inputValue}
                                onChangeText={handleInputChange}
                                onSubmitEditing={handleInputSubmit}
                                onBlur={handleInputSubmit}
                                keyboardType="number-pad"
                                autoFocus
                                selectTextOnFocus
                                maxLength={2}
                                underlineColorAndroid="transparent"
                                selectionColor={Colors.primary}
                            />
                        ) : (
                            <TouchableOpacity onPress={() => setIsEditing(true)} activeOpacity={0.7}>
                                <Text style={styles.value}>{value}</Text>
                            </TouchableOpacity>
                        )}
                        <Text style={styles.unit}>{unit}</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, value >= maxValue && styles.buttonDisabled]}
                        onPress={() => adjustValue(true)}
                        disabled={value >= maxValue}
                    >
                        <Ionicons
                            name="add"
                            size={32}
                            color={value >= maxValue ? Colors.disabled : Colors.text.main}
                        />
                    </TouchableOpacity>
                </View>

                <Text style={styles.rangeText}>
                    {minValue}~{maxValue}{unit} 설정 가능
                </Text>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    card: {
        backgroundColor: Colors.background.card,
        borderRadius: 20,
        padding: 28,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        ...shadowPresets.medium,
    },
    controlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.background.neon,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    buttonDisabled: {
        backgroundColor: Colors.background.main,
        borderColor: Colors.disabled,
    },
    valueContainer: {
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 20,
    },
    value: {
        fontSize: 56,
        fontWeight: 'bold',
        color: Colors.text.main,
        textAlign: 'center',
        minWidth: 100,
    },
    input: {
        fontSize: 56,
        fontWeight: 'bold',
        color: Colors.text.main,
        textAlign: 'center',
        minWidth: 100,
        paddingBottom: 0,
        paddingTop: 0,
        margin: 0,
    },
    unit: {
        fontSize: 18,
        color: Colors.text.secondary,
        marginTop: 8,
        fontWeight: '600',
    },
    rangeText: {
        fontSize: 14,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
});