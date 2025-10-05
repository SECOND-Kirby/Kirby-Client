import { Stack } from 'expo-router';
import React from 'react';

export default function ScheduleStackLayout() {
    return (
        <Stack>
            {/* 1. index.tsx: 스케줄 캘린더 화면 */}
            <Stack.Screen
                name="index"
                options={{
                    // 탭의 메인 화면이므로 헤더를 숨깁니다.
                    headerShown: false,
                }}
            />

            {/* 2. form.tsx: 스케줄 생성/편집 폼 화면 */}
            <Stack.Screen
                name="form"
                options={{
                    // 스크린 헤더를 사용하므로 헤더를 숨깁니다.
                    headerShown: false,
                }}
            />
        </Stack>
    );
}