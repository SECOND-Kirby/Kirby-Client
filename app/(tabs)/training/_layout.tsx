import { Stack } from 'expo-router';
import React from 'react';

export default function TrainingStackLayout() {
    return (
        <Stack>
            {/* 1. index.tsx: 훈련 탭 메인 화면 (TrainingScreen) */}
            <Stack.Screen
                name="index"
                options={{
                    // 탭의 메인 화면이므로 헤더를 숨깁니다.
                    headerShown: false,
                }}
            />

            {/* 2. session.tsx: 훈련 세션 진행 화면 (TrainingSessionScreen) */}
            <Stack.Screen
                name="session"
                options={{
                    // 타이머가 작동하는 화면이므로, 보통 상단 헤더도 숨깁니다.
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            />

        </Stack>
    );
}