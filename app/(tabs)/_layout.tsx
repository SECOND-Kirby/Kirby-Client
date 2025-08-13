import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#B2C549',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="home"
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
    </Tabs>
  );
}