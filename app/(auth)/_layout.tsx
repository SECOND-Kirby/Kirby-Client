import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />   {/* 로그인 화면 */}
            <Stack.Screen name="signup" />  {/* 회원가입 화면 */}
        </Stack>
    );
}