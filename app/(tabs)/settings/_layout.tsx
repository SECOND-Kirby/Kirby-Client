import { Stack } from 'expo-router';
import React from 'react';

export default function SettingsStackLayout() {
    return (
        <Stack>
            {/* 1. index.tsx: 설정 탭 메인 화면 (SettingsScreen) */}
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />

            {/* 2. profile-edit.tsx: 프로필 편집 화면 */}
            <Stack.Screen
                name="profile-edit"
                options={{
                    headerTitle: '프로필 편집', // 상단 헤더의 타이틀
                    headerShown: true, // 상세 화면이므로 헤더를 표시
                }}
            />

            {/* 3. password-change.tsx: 비밀번호 변경 화면 */}
            <Stack.Screen
                name="password-change"
                options={{
                    headerTitle: '비밀번호 변경',
                    headerShown: true,
                }}
            />

            {/* 4. account-deletion.tsx: 회원 탈퇴 화면 */}
            <Stack.Screen
                name="account-deletion"
                options={{
                    headerTitle: '회원 탈퇴',
                    headerShown: true,
                }}
            />
        </Stack>
    );
}