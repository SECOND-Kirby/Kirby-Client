import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform } from 'react-native';

import { HapticTab } from '@/components/shared/ui/HapticTab';
import TabBarBackground from '@/components/shared/ui/TabBarBackground';

export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#B2C549',
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>

            {/* 1. 기본 탭 화면들 */}
            <Tabs.Screen
                name="index"
                options={{
                    title: '홈',
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('@/assets/images/home-icon.png')}
                            style={{ width: 24, height: 24, tintColor: color }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="training"
                options={{
                    title: '운동',
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('@/assets/images/training-icon.png')}
                            style={{ width: 24, height: 24, tintColor: color }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    title: '분석',
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('@/assets/images/analytics-icon.png')}
                            style={{ width: 24, height: 24, tintColor: color }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: '설정',
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('@/assets/images/settings-icon.png')}
                            style={{ width: 24, height: 24, tintColor: color }}
                        />
                    ),
                }}
            />

            {/* 2. 탭 바에 표시되지 않는 하위 페이지 그룹 */}

            {/* 스케줄 스택 (캘린더 -> 폼) */}
            <Tabs.Screen
                name="schedule"
                options={{
                    // 탭 바에 표시되지 않도록 숨깁니다.
                    href: null,
                }}
            />

            {/* 공 수거 단일 화면 */}
            <Tabs.Screen
                name="ball-collection"
                options={{
                    // 탭 바에 표시되지 않도록 숨깁니다.
                    href: null,
                    headerShown: false, // 단일 화면이므로 헤더를 직접 숨김
                }}
            />

        </Tabs>
    );
}