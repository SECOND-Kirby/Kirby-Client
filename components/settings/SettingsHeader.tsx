// src/components/settings/SettingsHeader.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';

interface SettingsHeaderProps {
    title: string;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ title }) => {
    const handleBack = () => {
        router.back();
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="chevron-back" size={24} color={Colors.text.main} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={styles.placeholder} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.menu.border,
    },
    backButton: {
        padding: 5,
        paddingTop: 7,  // 화살표를 아래로 2px 이동
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.main,
    },
    placeholder: {
        width: 34,
    },
});