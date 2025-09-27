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
                    // 폼 화면은 상단에 제목과 닫기 버튼을 표시하기 위해 헤더를 씁니다.
                    headerTitle: '스케줄 작성',
                    headerShown: true,
                    presentation: 'modal',
                }}
            />
        </Stack>
    );
}