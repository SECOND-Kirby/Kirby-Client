import { Stack } from 'expo-router';
import React from 'react';

export default function SettingsStackLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // 모든 화면의 기본 헤더 숨김
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="profile-edit" />
            <Stack.Screen name="password-change" />
            <Stack.Screen name="account-deletion" />
            <Stack.Screen name="daily-goal-setting" />
            <Stack.Screen name="serve-goal-setting" />
        </Stack>
    );
}