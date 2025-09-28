// src/components/analytics/AnalyticsHeader.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ScreenHeader from '@/components/shared/layout/ScreenHeader';

const AnalyticsHeader: React.FC = () => {
    const handleProfilePress = () => {
        router.push('/settings');
    };

    return (
        <ScreenHeader
            title="분석"
            rightComponent={
                <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
                    <Ionicons name="person-outline" size={24} color="#666" />
                </TouchableOpacity>
            }
        />
    );
};

const styles = StyleSheet.create({
    profileIcon: {
        padding: 4,
    },
});

export default AnalyticsHeader;